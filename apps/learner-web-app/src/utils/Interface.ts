export interface RecommendedContentItem {
  identifier: string;
  name: string;
  program?: string;
  domain?: string;
  subDomain?: string;
  subject?: string;
  language?: string;
  format?: string;
  posterImage?: string;
  similarityScore?: number;
  explanation?: string;
  courseIds?: string[];
  courseNames?: string[];
}

export interface RecommendedCurrentContent {
  identifier: string;
  name?: string;
  program?: string;
  domain?: string;
  subDomain?: string;
  subject?: string;
  language?: string;
  format?: string;
  posterImage?: string;
  courseIds?: string[];
  courseNames?: string[];
}

export interface RecommendationsRequestPayload {
  currentContentId: string;
  excludeContentIds: string[];
  count: number;
}

export interface RecommendationsApiResponse {
  currentContent?: RecommendedCurrentContent;
  count?: number;
  content?: RecommendedContentItem[];
}
