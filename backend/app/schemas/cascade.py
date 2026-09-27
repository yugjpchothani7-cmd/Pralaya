from pydantic import BaseModel
from typing import List, Optional

class FailureNode(BaseModel):
    """A node representing an infrastructure asset or hazard trigger in the cascade graph."""
    id: str
    name: str
    type: str  # e.g., 'asset', 'hazard', 'environment'
    status: Optional[str] = None  # observed|modeled|simulated
    severity: Optional[float] = None  # 0-1 normalized
    confidence: Optional[float] = None  # 0-1
    evidence: Optional[str] = None

class FailureEdge(BaseModel):
    """Directed edge indicating dependency from source node to target node."""
    source: str
    target: str
    dependency_type: Optional[str] = None  # e.g., 'requires', 'affects'
    description: Optional[str] = None

class CascadeImpact(BaseModel):
    """Impact details for a particular cascade path."""
    trigger: str
    affected_asset: str
    consequence: str
    severity: float
    confidence: float
    evidence: Optional[str] = None

class CascadeScenario(BaseModel):
    """Container for a full cascade scenario."""
    region_id: str
    nodes: List[FailureNode]
    edges: List[FailureEdge]
    impacts: List[CascadeImpact]
