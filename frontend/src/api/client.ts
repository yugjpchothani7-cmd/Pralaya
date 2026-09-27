/**
 * PRALAYA API Client
 * Connects React frontend to FastAPI backend endpoints.
 */

import type {
  HealthResponse,
  SituationSummaryResponse,
  ShelterListResponse,
  RoutingPlanResponse,
  BackendEvent,
  BackendRegion,
  BackendHazardResponse,
  BackendExposureResponse,
  BackendInfrastructureResponse,
  BackendSheltersResponse,
  BackendRoutesResponse,
  BackendRiskResponse,
  BackendActionsResponse,
  GeospatialLayerMetadata,
  TemporalComparisonResult,
  GeospatialStatusResponse,
  GeospatialHazardSurface,
  RegionalExposureAssessment,
  GeographicZoneExposure,
  TriggerConfig,
  TriggerResult,
} from '../types';
import type { SimulationParams, SimulationResult } from '../types/simulation';

const API_BASE = '/api/v1';

export class ApiError extends Error {
  status: number;
  title: string;
  detail: string;
  errorCode?: string;

  constructor(status: number, title: string, detail: string, errorCode?: string) {
    super(detail || title);
    this.name = 'ApiError';
    this.status = status;
    this.title = title;
    this.detail = detail;
    this.errorCode = errorCode;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    // Implement abort timeout and simple retry logic (max 2 retries)
    const maxRetries = 2;
    let attempt = 0;
    let response: Response | null = null;
    while (attempt <= maxRetries) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
      try {
        response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });
        clearTimeout(timeoutId);
        break; // success
      } catch (err) {
        clearTimeout(timeoutId);
        if (attempt === maxRetries) {
          throw new ApiError(
            0,
            'Connection Failure',
            err instanceof Error ? err.message : 'Network request failed'
          );
        }
        attempt++;
      }
    }

    if (!response || !response.ok) {
      let problem: any = {};
      try {
        problem = response ? await response.json() : {};
      } catch {
        problem = { title: 'Network Request Failed', detail: response ? response.statusText : 'No response' };
      }
      throw new ApiError(
        response ? response.status : 0,
        problem?.title || 'API Error',
        problem?.detail || `Request failed with status ${response ? response.status : 'Unknown'}`,
        problem?.error_code
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      0,
      'Connection Failure',
      error instanceof Error ? error.message : 'Unable to connect to PRALAYA backend'
    );
  }
}

export const api = {
  // Phase 1 endpoints
  getHealth: () => request<HealthResponse>('/health'),
  getSituationSummary: () => request<SituationSummaryResponse>('/situation/summary'),
  getShelters: (originLat = 19.35, originLon = 85.02) =>
    request<ShelterListResponse>(`/shelters?origin_lat=${originLat}&origin_lon=${originLon}`),
  getRoutingPlan: () => request<RoutingPlanResponse>('/routing/plan'),

  // Phase 3 endpoints
  getEvents: () => request<BackendEvent[]>('/events'),
  getEventById: (id: string) => request<BackendEvent>(`/events/${id}`),
  getRegion: (id = 'REG_GANJAM_COAST') => request<BackendRegion>(`/regions/${id}`),
  getHazards: (regionId = 'REG_GANJAM_COAST') => request<BackendHazardResponse>(`/hazards/${regionId}`),
  getExposure: (regionId = 'REG_GANJAM_COAST') => request<BackendExposureResponse>(`/exposure/${regionId}`),
  getInfrastructure: (regionId = 'REG_GANJAM_COAST') =>
    request<BackendInfrastructureResponse>(`/infrastructure/${regionId}`),
  getRegionalShelters: (regionId = 'REG_GANJAM_COAST') =>
    request<BackendSheltersResponse>(`/shelters/${regionId}`),
  getRoutes: (regionId = 'REG_GANJAM_COAST') => request<BackendRoutesResponse>(`/routes/${regionId}`),
  getRisk: (regionId = 'REG_GANJAM_COAST') => request<BackendRiskResponse>(`/risk/${regionId}`),
  getActions: (regionId = 'REG_GANJAM_COAST') => request<BackendActionsResponse>(`/actions/${regionId}`),
  computeSimulation: (params: SimulationParams) =>
    request<SimulationResult>('/simulation', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  // Phase 4 Geospatial & Earth Engine endpoints
  getGeospatialStatus: () => request<GeospatialStatusResponse>('/geospatial/status'),
  getGeospatialCatalog: (regionId = 'gopalpur-coastal-odisha') =>
    request<GeospatialLayerMetadata[]>(`/geospatial/catalog?region_id=${regionId}`),
  getElevationLayer: (regionId = 'gopalpur-coastal-odisha') =>
    request<GeospatialLayerMetadata>(`/geospatial/elevation?region_id=${regionId}`),
  getSarLayer: (regionId = 'gopalpur-coastal-odisha') =>
    request<GeospatialLayerMetadata>(`/geospatial/sar?region_id=${regionId}`),
  getRainfallLayer: (regionId = 'gopalpur-coastal-odisha') =>
    request<GeospatialLayerMetadata>(`/geospatial/rainfall?region_id=${regionId}`),
  getSurfaceWaterLayer: (regionId = 'gopalpur-coastal-odisha') =>
    request<GeospatialLayerMetadata>(`/geospatial/surface-water?region_id=${regionId}`),
  getLandCoverLayer: (regionId = 'gopalpur-coastal-odisha') =>
    request<GeospatialLayerMetadata>(`/geospatial/land-cover?region_id=${regionId}`),
  getTemporalComparison: (regionId = 'gopalpur-coastal-odisha') =>
    request<TemporalComparisonResult>(`/geospatial/comparison?region_id=${regionId}`),

  // Phase 5 Deterministic Hazard Engine endpoints
  getHazardSurface: (
    regionId = 'gopalpur-coastal-odisha',
    surgeShock = 0,
    rainShock = 0,
    highTide = false
  ) =>
    request<GeospatialHazardSurface>(
      `/hazards/surface?region_id=${regionId}&surge_shock=${surgeShock}&rain_shock=${rainShock}&high_tide=${highTide}`
    ),
  evaluateHazardCell: (cellInput: Record<string, unknown>) =>
    request<{
      cell_id: string;
      latitude: number;
      longitude: number;
      components: Record<string, unknown>;
      explanation: Record<string, unknown>;
    }>('/hazards/evaluate-cell', {
      method: 'POST',
      body: JSON.stringify(cellInput),
    }),

  // Phase 6 Exposure Engine endpoints
  getExposureAssessment: (
    regionId = 'gopalpur-coastal-odisha',
    surgeShock = 0,
    rainShock = 0,
    highTide = false
  ) =>
    request<RegionalExposureAssessment>(
      `/exposure/assessment?region_id=${regionId}&surge_shock=${surgeShock}&rain_shock=${rainShock}&high_tide=${highTide}`
    ),
  getZoneExposure: (
    zoneId: string,
    surgeShock = 0,
    rainShock = 0,
    highTide = false
  ) =>
    request<GeographicZoneExposure>(
      `/exposure/zone/${zoneId}?surge_shock=${surgeShock}&rain_shock=${rainShock}&high_tide=${highTide}`
    ),
  evaluateInsuranceTrigger: (config: TriggerConfig) =>
    request<TriggerResult>('/insurance_trigger/evaluate', {
      method: 'POST',
      body: JSON.stringify(config),
    }),
};

export async function computeStateChange(previous: unknown, current: unknown) {
  return request<any>('/state-change', {
    method: 'POST',
    body: JSON.stringify({ previous, current }),
  });
}

export async function getMultilingualAdvisory(payload: unknown) {
  return request<any>('/multilingual-advisory', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function downloadJson(data: unknown, filename = 'export.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

