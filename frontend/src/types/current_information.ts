/**
 * Current Information Intelligence Types
 */
export type InformationSource =
  | 'official_alert'
  | 'news_report'
  | 'model_inference'
  | 'user_provided';

export interface CurrentInfoItem {
  source: InformationSource;
  title: string;
  description?: string;
  publication_time?: string; // ISO-8601
  location?: string;
  event_date?: string; // ISO-8601
  confidence?: number; // 0-1
  raw_data?: Record<string, any>;
}

export interface CurrentInformationRequest {
  query: string;
}

export interface CurrentInformationResponse {
  items: CurrentInfoItem[];
  generated_at: string;
  disclaimer: string;
}
