# PRALAYA: Risk Engine & Vulnerability Analytics

This module implements deterministic physical risk calculations, combining hazard footprints, demographic exposure, and multidimensional vulnerability indices.

## Core Models
1. **Holland Radial Wind Profile**: Radial parameterization of surface cyclonic winds
2. **Surge Setup Hydrodynamic Surrogate**: Inverse barometer effect + wind stress shallow-water equilibrium
3. **Multidimensional Vulnerability (SoVI)**: Structural building fragility $F_{\text{struct}}$ combined with socioeconomic deprivation census indicators
4. **Quantitative Risk Equation**: $\text{Risk}_k = \text{Hazard}_k \times \text{Exposure}_k \times \text{Vulnerability}_k$
