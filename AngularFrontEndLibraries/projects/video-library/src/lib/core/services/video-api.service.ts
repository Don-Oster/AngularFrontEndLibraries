import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { CallService } from '../http/call.service';
import { VideoLibrarySettingsModel } from '../../shared/models/video-library-settings.model';
import { VideoSearchModel } from '../../shared/models/video-search.model';
import { VideoGroupModel } from '../../shared/models/video-group.model';
import { VideoModel } from '../../shared/models/video.model';
import { Consts } from '../../shared/consts';

@Injectable()
export class VideoApiService {

  constructor(private readonly callService: CallService) { }

  getSettings(): Observable<VideoLibrarySettingsModel> {
    return this.callService.get(Consts.Urls.Video.GetSettings);
  }

  getFeaturedVideos(searchModel: VideoSearchModel): Observable<VideoModel[]> {
    return this.callService.get(Consts.Urls.Video.GetFilteredVideos, { ...searchModel, isOnlyFeatured: true });
  }

  getRecentVideos(searchModel: VideoSearchModel, options: {
    count: number;
  }): Observable<VideoModel[]> {
    return this.callService.get(Consts.Urls.Video.GetFilteredVideos, { ...searchModel, pageSize: options.count });
  }

  getGroupedVideos(searchModel: VideoSearchModel): Observable<VideoGroupModel[]> {
    return this.callService.get(Consts.Urls.Video.GetGroupedVideos, searchModel);
  }

  getPagedVideos(searchModel: VideoSearchModel, options: {
    skipCount: number;
    pageSize: number;
  }): Observable<VideoModel[]> {
    return this.callService.get(Consts.Urls.Video.GetFilteredVideos, { ...searchModel, offset: options.skipCount, pageSize: options.pageSize });
  }
}
