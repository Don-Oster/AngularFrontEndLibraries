import { VideoModel } from './video.model';
import { VideoDataModel } from './video-data.model';

export interface VideoPageModel extends VideoDataModel<VideoModel> {
  isNextPageLoading?: boolean;
  skipped: number;
}
