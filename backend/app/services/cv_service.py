"""
SAMIKSHA OpenCV Document Image Preprocessing & Visual Inspection Service
Grounded in AICTE Regulatory Document Verification Guidelines
"""

import os
import math
from typing import Dict, Any, List, Optional, Tuple
import cv2
import numpy as np


class OpenCVDocumentService:
    """
    OpenCV-based document image processing and visual inspection service.
    Adheres strictly to:
    - Primary statuses: 'Verified', 'Mismatch Detected', 'Document Tampered', 'Source Unavailable', 'Manual Review Needed'.
    - An OpenCV edge, contour, blur, or compression flag ALONE must NEVER establish 'Document Tampered'.
    - Standard printed table rectangles or form borders are classified as 'Manual Review Needed' layout notices.
    - Preserves original uploaded files; all processed artifacts are kept strictly separate.
    """

    def __init__(self, processed_dir: str = "uploads/processed"):
        self.processed_dir = processed_dir
        os.makedirs(self.processed_dir, exist_ok=True)

    def load_image(self, file_path: str) -> Optional[np.ndarray]:
        """Safely loads an original image file using OpenCV."""
        if not os.path.exists(file_path):
            return None
        try:
            img_array = np.fromfile(file_path, dtype=np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
            return img
        except Exception as e:
            print(f"[OpenCV] Error loading image {file_path}: {e}")
            return None

    def preprocess_document_image(
        self, img: np.ndarray, doc_id: str, page_num: int = 1
    ) -> Dict[str, Any]:
        """
        Preprocesses document image from original source:
        - Grayscale conversion
        - Bilateral denoising
        - Deskew angle calculation & correction
        - Adaptive binarization (Otsu threshold)
        """
        h, w = img.shape[:2]
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        denoised = cv2.bilateralFilter(gray, d=9, sigmaColor=75, sigmaSpace=75)

        angle = self._detect_skew_angle(denoised)
        if abs(angle) > 0.5 and abs(angle) < 45.0:
            center = (w // 2, h // 2)
            rot_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
            deskewed = cv2.warpAffine(
                denoised, rot_matrix, (w, h),
                flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE
            )
        else:
            deskewed = denoised
            angle = 0.0

        _, binarized = cv2.threshold(deskewed, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        processed_filename = f"proc_{doc_id}_p{page_num}.png"
        processed_path = os.path.join(self.processed_dir, processed_filename)
        cv2.imwrite(processed_path, binarized)

        return {
            "processed_file_path": processed_path,
            "original_dimensions": {"width": w, "height": h},
            "detected_skew_angle_deg": round(float(angle), 2),
            "denoised": True,
            "binarized": True
        }

    def _detect_skew_angle(self, gray: np.ndarray) -> float:
        """Calculates skew angle using contour minAreaRect."""
        try:
            thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
            coords = np.column_stack(np.where(thresh > 0))
            if len(coords) < 100:
                return 0.0
            angle = cv2.minAreaRect(coords)[-1]
            if angle < -45:
                angle = -(90 + angle)
            else:
                angle = -angle
            return float(angle)
        except Exception:
            return 0.0

    def analyze_visual_anomalies(
        self, img: np.ndarray, doc_title: str, page_num: int = 1
    ) -> Dict[str, Any]:
        """
        Runs 4 standardized visual inspections on the original document image:
        1. Resolution and DPI check
        2. Blur / Sharpness level (Laplacian variance)
        3. Colored hallmark / rubber seal presence in HSV color space
        4. High-contrast edge discontinuity (e.g., table cells, schedule boxes)
        
        Returns separated metrics:
        - checks_completed: Total image checks run (integer)
        - anomalies_detected: Count of items flagged for manual review
        - findings: List of findings mapped to primary statuses ('Verified', 'Manual Review Needed')
        """
        findings: List[Dict[str, Any]] = []
        checks_completed = 4
        h, w = img.shape[:2]
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        total_pixels = h * w

        # 1. Resolution Check
        aspect_ratio = round(h / float(w) if w > 0 else 0.0, 2)
        if w < 600 or h < 800:
            findings.append({
                "check_type": "RESOLUTION_DPI",
                "page": page_num,
                "status": "Manual Review Needed",
                "title": "Low Scan Resolution Detected",
                "description": f"Page resolution is {w}x{h} px (below recommended 300 DPI for A4: 2480x3508 px). Fine text or decimal points may require manual verification.",
                "coordinates": {"x": 0, "y": 0, "w": w, "h": h},
                "evidence": f"Dimensions: {w}x{h} px (Aspect ratio: {aspect_ratio})",
                "method": "OpenCV dimensional header analysis",
                "limitations": "Low resolution reflects scanning settings, not fraudulent tampering."
            })

        # 2. Blur / Sharpness check
        lap_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        if lap_var < 50.0:
            findings.append({
                "check_type": "BLUR_SHARPNESS",
                "page": page_num,
                "status": "Manual Review Needed",
                "title": "Document Blur / Defocused Scan",
                "description": f"Laplacian sharpness variance score is {lap_var:.1f} (threshold: 50.0). Text edges appear blurred.",
                "coordinates": {"x": 0, "y": 0, "w": w, "h": h},
                "evidence": f"Laplacian variance: {lap_var:.1f}",
                "method": "OpenCV Laplacian gradient variance",
                "limitations": "Optical defocus from handheld scanning; manual review of figures advised."
            })

        # 3. Official Colored Seal / Stamp Presence Check
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        blue_mask = cv2.inRange(hsv, np.array([100, 50, 50]), np.array([140, 255, 255]))
        red_mask1 = cv2.inRange(hsv, np.array([0, 70, 50]), np.array([10, 255, 255]))
        red_mask2 = cv2.inRange(hsv, np.array([170, 70, 50]), np.array([180, 255, 255]))
        seal_mask = blue_mask | red_mask1 | red_mask2
        seal_pixels = cv2.countNonZero(seal_mask)
        seal_ratio = (seal_pixels / float(total_pixels)) * 100.0

        if any(keyword in doc_title.upper() for keyword in ["NOC", "CERTIFICATE", "DEED"]):
            if seal_pixels < 200:
                findings.append({
                    "check_type": "COLORED_SEAL_PRESENCE",
                    "page": page_num,
                    "status": "Manual Review Needed",
                    "title": "Absence of Colored Official Seal / Stamp",
                    "description": f"Statutory regulatory certificates generally carry a colored physical ink seal or Digital Signature Certificate. Color analysis detected {seal_pixels} colored ink pixels ({seal_ratio:.3f}% of page).",
                    "coordinates": {"x": 0, "y": int(h * 0.7), "w": w, "h": int(h * 0.3)},
                    "evidence": f"Colored seal coverage: {seal_ratio:.3f}% (Expected > 0.05% for sealed certificates)",
                    "method": "OpenCV HSV Color-space ink mask segmentation",
                    "limitations": "Monochrome or black-and-white photocopies naturally lack colored ink. Officer must verify whether a valid digital signature or certified true copy exists."
                })

        # 4. High-Contrast Rectangular Contour Boundary Check
        edges = cv2.Canny(gray, 100, 200)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        suspicious_boxes = []
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if 3000 < area < (total_pixels * 0.15):
                perimeter = cv2.arcLength(cnt, True)
                approx = cv2.approxPolyDP(cnt, 0.02 * perimeter, True)
                if len(approx) == 4:
                    x, y, bw, bh = cv2.boundingRect(approx)
                    aspect = bh / float(bw) if bw > 0 else 0
                    if 0.1 < aspect < 0.6:
                        suspicious_boxes.append((x, y, bw, bh))

        if len(suspicious_boxes) > 0:
            first_box = suspicious_boxes[0]
            findings.append({
                "check_type": "RECTANGULAR_CONTOUR_BOUNDARY",
                "page": page_num,
                "status": "Manual Review Needed",
                "title": "High-Contrast Rectangular Contour Detected",
                "description": f"High-contrast rectangular edge detected at coordinates (x={first_box[0]}, y={first_box[1]}, w={first_box[2]}, h={first_box[3]}). This is consistent with a standard printed form table, schedule box, or bordered clause.",
                "coordinates": {"x": first_box[0], "y": first_box[1], "w": first_box[2], "h": first_box[3]},
                "evidence": f"Rectangular contour bounding box: x={first_box[0]}, y={first_box[1]}, w={first_box[2]}, h={first_box[3]}",
                "method": "OpenCV Canny Edge + Douglas-Peucker polygonal approximation",
                "limitations": "Normal printed tables, certificate borders, and schedules form high-contrast rectangles. This flag indicates an area for manual inspection and MUST NOT be classified as document tampering."
            })

        anomalies_detected = len(findings)
        return {
            "checks_completed": checks_completed,
            "anomalies_detected": anomalies_detected,
            "findings": findings
        }
