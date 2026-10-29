from typing import Optional, Any
from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    app: str
    simulation_mode: bool
    notice: str
    active_rule_version: Optional[str] = None
    database_connected: bool


class SystemInfoResponse(BaseModel):
    project_name: str
    environment: str
    simulation_banner: str
    roles: list[str]
    active_aph_handbook: str
