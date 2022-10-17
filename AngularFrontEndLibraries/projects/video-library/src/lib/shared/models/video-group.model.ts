import { VideoModel } from './video.model';
import { VideoDataModel } from './video-data.model';

export interface VideoGroupModel extends VideoDataModel<VideoModel> {
  name: string;
}
