import { VideoModel } from './video.model';
import { VideoGroupModel } from './video-group.model';
import { VideoPageModel } from './video-page.model';
import { VideoDataModel } from './video-data.model';

export interface VideoLibraryDataModel {
  recent: VideoDataModel<VideoModel>;
  featured: VideoDataModel<VideoModel>;
  grouped: VideoDataModel<VideoGroupModel>;
  paged: VideoPageModel;
  hasErrors: boolean;
}
