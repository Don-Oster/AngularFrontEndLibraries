import { VideoLibrarySettingsModel } from './video-library-settings.model';
import { VideoLibraryOptionsModel } from './video-library-options.model';
import { VideoLibraryDataModel } from './video-library-data.model';

import { OrderBy } from './order.enum';

export interface VideoLibraryStateModel {
  initialized: boolean;
  errorMessage?: string;
  settings: VideoLibrarySettingsModel;
  options: VideoLibraryOptionsModel;
  data: VideoLibraryDataModel;
}

export const initialVideoLibraryStateModel = {
  initialized: false,
  settings: {
    showSupportInfo: false
  },
  options: {
    sortOrder: OrderBy.Date,
    savedSearchDefinition: '',
    searchPhrase: '',
    numberOfRecentVideos: 4,
    pageSize: 24
  },
  data: {
    hasErrors: false,
    featured: {
      videos: []
    },
    grouped: {
      videos: []
    },
    recent: {
      videos: []
    },
    paged: {
      skipped: 0,
      videos: []
    }
  }
};
