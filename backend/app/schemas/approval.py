from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class ApprovalResponse(BaseModel):
    id: int
    name: str
    code: str
    ministry: str
    category: str
    state: Optional[str] = None
    description: Optional[str] = None
    requirements_summary: Optional[str] = None
    fee: int
    sla_days: int
    created_at: datetime

    class Config:
        from_attributes = True
