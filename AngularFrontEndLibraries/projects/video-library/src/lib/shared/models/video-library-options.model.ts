import { OrderBy } from './order.enum';

export interface VideoLibraryOptionsModel {
  savedSearchDefinition?: string;
  sortOrder?: OrderBy;
  searchPhrase?: string;
  groupByField?: string;
  withFeaturedVideos?: boolean;
  withRecentVideos?: boolean;
  numberOfRecentVideos?: number;
  pageSize?: number;
}
