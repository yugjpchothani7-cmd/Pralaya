# PRALAYA: Geospatial Intelligence & Earth Observation

This module handles planetary-scale raster ingestion, Sentinel-1 SAR flood extent delineation, FABDEM bare-earth elevation extraction, and PostGIS vectorization.

## Core Pipelines
1. **Sentinel-1 SAR Flood Inundation Processor**:
   - Ingests Level-1 GRD IW Dual-Pol imagery via Google Earth Engine API
   - Evaluates Otsu bimodal thresholding on backscatter difference rasters ($\Delta \sigma^0$)
2. **Terrain Plinth Clearance**:
   - Projects water depth over FABDEM 30m bare-earth elevation grids
   - Computes $M_{\text{clearance}} = Z_{\text{FABDEM}} - H_{\text{surge}}$
