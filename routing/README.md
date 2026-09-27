# PRALAYA: Disaster-Aware Evacuation Routing

This module implements dynamic cost graph routing across OpenStreetMap road networks, penalizing submerged links and severed bridges.

## Key Formulations
- **Non-Linear Flood Penalty**: $\Phi(D_{\text{flood}}) = 1.0 + \alpha \cdot \exp(\beta \cdot D_{\text{flood}})$
- **Vehicle Stall Cutoff**: If $D_{\text{flood}} > 0.30\text{ m}$, edge weight becomes $+\infty$ (sever edge)
- **Bidirectional $A^*$ Solver**: Fast sub-200ms path discovery favoring elevated ridge corridors
