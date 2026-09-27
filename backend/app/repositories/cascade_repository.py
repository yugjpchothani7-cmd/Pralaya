from typing import List
from ..models.cascade import FailureNode, FailureEdge, CascadeImpact, CascadeScenario

class CascadeRepository:
    """Repository handling failure cascade data. Currently returns synthetic data for demonstration.
    In a real deployment, this would query a graph DB or relational tables.
    """

    async def get_cascade_scenario(self, region_id: str) -> CascadeScenario:
        # Synthetic example: Heavy Rain -> Drainage Stress -> Flooding -> Road Failure
        nodes: List[FailureNode] = [
            FailureNode(id="hn1", name="Heavy Rain", type="hazard", status="modeled", severity=0.9, confidence=0.85),
            FailureNode(id="dn1", name="Drainage System", type="asset", status="observed", severity=0.6, confidence=0.9),
            FailureNode(id="fn1", name="Flooding", type="hazard", status="simulated", severity=0.8, confidence=0.8),
            FailureNode(id="rn1", name="Road Segment A", type="asset", status="observed", severity=0.7, confidence=0.88),
        ]
        edges: List[FailureEdge] = [
            FailureEdge(source="hn1", target="dn1", dependency_type="triggers", description="Rain overloads drainage"),
            FailureEdge(source="dn1", target="fn1", dependency_type="leads_to", description="Reduced drainage capacity causes flooding"),
            FailureEdge(source="fn1", target="rn1", dependency_type="causes", description="Flood water damages road"),
        ]
        impacts: List[CascadeImpact] = [
            CascadeImpact(trigger="Heavy Rain", affected_asset="Drainage System", consequence="Overcapacity", severity=0.6, confidence=0.9),
            CascadeImpact(trigger="Drainage Stress", affected_asset="Flooding", consequence="Urban inundation", severity=0.8, confidence=0.8),
            CascadeImpact(trigger="Flooding", affected_asset="Road Segment A", consequence="Road blockage", severity=0.7, confidence=0.88),
        ]
        return CascadeScenario(region_id=region_id, nodes=nodes, edges=edges, impacts=impacts)
