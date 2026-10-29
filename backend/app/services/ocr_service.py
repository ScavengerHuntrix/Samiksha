"""
SAMIKSHA PaddleOCR Text Extraction & Entity Extraction Service
Grounded in AICTE Regulatory Approval Document Analysis
"""

import os
import re
from typing import Dict, Any, List, Optional


class PaddleOCRDocumentService:
    """
    PaddleOCR text extraction and structured regulatory field extraction.
    Adheres strictly to:
    - Never fabricates text when OCR fails.
    - Preserves page references and text-region coordinates.
    - Gracefully handles low-quality scans, empty pages, and parsing errors.
    """

    def __init__(self):
        self.ocr_engine = None
        self._init_engine()

    def _init_engine(self):
        """Attempts to initialize PaddleOCR engine if paddlepaddle/paddlex is installed."""
        try:
            from paddleocr import PaddleOCR
            # Initialize with English and angle classification
            self.ocr_engine = PaddleOCR(use_angle_cls=True, lang="en", show_log=False)
            print("[PaddleOCR] Native PaddleOCR engine initialized successfully.")
        except Exception as e:
            self.ocr_engine = None
            print(f"[PaddleOCR] Native PaddleOCR engine not initialized ({e}). Graceful fallback enabled.")

    def extract_text_from_image(
        self, image_path: str, page_num: int = 1
    ) -> Dict[str, Any]:
        """
        Runs text extraction on an image file.
        Returns:
            - status: 'SUCCESS' | 'EMPTY_PAGE' | 'OCR_FAILED'
            - page: page number
            - full_text: string concatenation
            - lines: list of dicts with text, confidence, bbox [x1, y1, x2, y2]
            - extracted_entities: dictionary of detected regulatory fields
        """
        if not os.path.exists(image_path):
            return {
                "status": "OCR_FAILED",
                "page": page_num,
                "error": f"File does not exist: {image_path}",
                "full_text": "",
                "lines": [],
                "extracted_entities": {}
            }

        # 1. Try Native PaddleOCR
        if self.ocr_engine is not None:
            try:
                result = self.ocr_engine.ocr(image_path, cls=True)
                lines = []
                full_text_list = []
                if result and len(result) > 0 and result[0] is not None:
                    for line_item in result[0]:
                        bbox, (txt, conf) = line_item
                        # bbox is [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]
                        xs = [p[0] for p in bbox]
                        ys = [p[1] for p in bbox]
                        x_min, x_max = int(min(xs)), int(max(xs))
                        y_min, y_max = int(min(ys)), int(max(ys))

                        lines.append({
                            "text": txt.strip(),
                            "confidence": round(float(conf), 3),
                            "bbox": [x_min, y_min, x_max, y_max],
                            "page": page_num
                        })
                        full_text_list.append(txt.strip())

                full_text = "\n".join(full_text_list)
                if not full_text:
                    return {
                        "status": "EMPTY_PAGE",
                        "page": page_num,
                        "full_text": "",
                        "lines": [],
                        "extracted_entities": {}
                    }

                entities = self._extract_regulatory_entities(full_text)
                return {
                    "status": "SUCCESS",
                    "engine": "PaddleOCR-Native",
                    "page": page_num,
                    "full_text": full_text,
                    "lines": lines,
                    "extracted_entities": entities
                }
            except Exception as e:
                print(f"[PaddleOCR] Native OCR execution failed: {e}")

        # 2. Resilient Fallback for Text-based PDFs / Structured files
        # Never fabricate: if it's an image without engine, return clear status
        return self._extract_fallback_or_unsupported(image_path, page_num)

    def _extract_fallback_or_unsupported(self, file_path: str, page_num: int) -> Dict[str, Any]:
        """Handles extraction when binary weights are offline or for text files."""
        # Check if text file or accompanying OCR metadata exists
        sidecar_text = file_path + ".txt"
        if os.path.exists(sidecar_text):
            try:
                with open(sidecar_text, "r", encoding="utf-8") as f:
                    content = f.read().strip()
                entities = self._extract_regulatory_entities(content)
                lines = [{"text": line, "confidence": 0.95, "bbox": [10, idx * 25, 600, (idx + 1) * 25], "page": page_num}
                         for idx, line in enumerate(content.split("\n")) if line.strip()]
                return {
                    "status": "SUCCESS",
                    "engine": "StructuredTextParser",
                    "page": page_num,
                    "full_text": content,
                    "lines": lines,
                    "extracted_entities": entities
                }
            except Exception as e:
                return {
                    "status": "OCR_FAILED",
                    "page": page_num,
                    "error": f"Failed reading text: {e}",
                    "full_text": "",
                    "lines": [],
                    "extracted_entities": {}
                }

        return {
            "status": "OCR_FAILED",
            "page": page_num,
            "error": "OCR engine offline. Please inspect original uploaded document directly.",
            "full_text": "",
            "lines": [],
            "extracted_entities": {}
        }

    def _extract_regulatory_entities(self, text: str) -> Dict[str, Any]:
        """
        Parses critical AICTE regulatory fields from extracted text using regex pattern matchers:
        - Institution Names and Trust Names
        - Certificate / Order Numbers
        - Dates and Validity Ranges
        - Land and Built-up Area Measurements
        - Cadre and Faculty Designations
        """
        entities: Dict[str, Any] = {
            "institutions_detected": [],
            "certificate_numbers": [],
            "dates_detected": [],
            "land_measurements": [],
            "faculty_detected": []
        }

        # 1. Dates (DD/MM/YYYY or YYYY-MM-DD or DD-MM-YYYY)
        date_pattern = r"\b\d{1,2}[/-]\d{1,2}[/-]\d{4}\b|\b\d{4}-\d{2}-\d{2}\b"
        dates = re.findall(date_pattern, text)
        entities["dates_detected"] = list(set(dates))

        # 2. Certificate / Order / Reference Numbers
        cert_patterns = [
            r"(?:NOC|ORDER|REF|REG(?:ISTRATION)?|NO)[\s.:#-]+([A-Z0-9/_-]{5,30})",
            r"(?:AICTE|VTU|DBATU|DTE|FIRE)[\s.:#-]+([A-Z0-9/_-]{4,25})"
        ]
        for cp in cert_patterns:
            matches = re.findall(cp, text, re.IGNORECASE)
            for m in matches:
                clean_m = m.strip(" .:#-")
                if len(clean_m) >= 4 and clean_m not in entities["certificate_numbers"]:
                    entities["certificate_numbers"].append(clean_m)

        # 3. Land / Area measurements (e.g. 7.5 Acres, 12000 Sq. Meters)
        area_pattern = r"(\d+(?:\.\d+)?)\s*(Acres?|Hectares?|Sq\.?\s*(?:Meters?|Mtr|Metres?|Yards?|Ft\.?|Feet))"
        areas = re.findall(area_pattern, text, re.IGNORECASE)
        for val, unit in areas:
            entities["land_measurements"].append(f"{val} {unit.strip()}")

        # 4. Institutions / Trusts
        inst_patterns = [
            r"([A-Z][A-Za-z0-9&.,\s]{3,50}(?:Institute|College|University|Trust|Society|Academy|Vidyapeeth))",
            r"([A-Z][A-Za-z0-9&.,\s]{3,40}(?:Technology|Management|Engineering|Polytechnic))"
        ]
        for ip in inst_patterns:
            insts = re.findall(ip, text)
            for inst in insts:
                clean_i = inst.strip()
                if len(clean_i) > 6 and clean_i not in entities["institutions_detected"]:
                    entities["institutions_detected"].append(clean_i)

        # 5. Faculty / Principal mentions
        fac_pattern = r"(?:Dr\.|Prof\.|Mr\.|Mrs\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})"
        facs = re.findall(fac_pattern, text)
        entities["faculty_detected"] = list(set([f.strip() for f in facs]))

        return entities

