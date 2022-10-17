export interface VideoLibraryConfigModel {
  title?: string;
  applicationTitle?: string;
  savedSearchDefinition: string;
  groupByField?: string;
  highlightedVideoSection?: HighlightedVideoSection;
}

export enum HighlightedVideoSection {
  Latest = 'latest',
  Featured = 'featured'
}
