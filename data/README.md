# PRALAYA: Data Assets & Offline Pre-Seeded Scenarios

This directory contains static geospatial boundaries, population rasters, and offline fallback fixtures enabling full functionality during air-gapped emergency deployments.

## Directory Structure

- `seed/`: Verified reference disaster scenario packages
  - `cyclone_karuna.json`: 72-hour realistic IMD bulletin track sequence for Odisha/Andhra coast
  - `shelters_odisha.json`: 240 geocoded cyclone shelters with verified plinth heights & capacities
  - `infrastructure_odisha.json`: Critical assets with dependency links for failure cascade simulation
- `basemaps/`: Administrative boundaries, coastline contours, and elevation profiles
