import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap, map, tap, finalize } from 'rxjs/operators';

import { BaseStore } from './base.store';
import { VideoLibraryStateModel, initialVideoLibraryStateModel } from '../../shared/models/video-library-state.model';
import { VideoApiService } from '../services/video-api.service';
import { VideoModel } from '../../shared/models/video.model';
import { VideoGroupModel } from '../../shared/models/video-group.model';
import { VideoDataModel } from '../../shared/models/video-data.model';
import { VideoSearchModel } from '../../shared/models/video-search.model';
import { Consts } from '../../shared/consts';

export class VideoStore extends BaseStore<VideoLibraryStateModel> {

  constructor(protected videoApiService: VideoApiService) {
    super(initialVideoLibraryStateModel);
  }

  protected getFeaturedVideos(): Observable<VideoModel[]> {
    this.patchState(true, 'data', 'featured', 'isLoading');
    return this.videoApiService.getFeaturedVideos(this.getVideoSearchOptions())
      .pipe(
        tap((videos: VideoModel[]) => this.patchState(videos, 'data', 'featured', 'videos')),
        catchError(() => this.catchVideosError<VideoModel>('featured videos')),
        finalize(() => this.patchState(false, 'data', 'featured', 'isLoading'))
      );
  }

  protected getRecentVideos(): Observable<VideoModel[]> {
    this.patchState(true, 'data', 'recent', 'isLoading');
    return this.videoApiService.getRecentVideos(this.getVideoSearchOptions(), {
      count: this.state.options.numberOfRecentVideos || initialVideoLibraryStateModel.options.numberOfRecentVideos
    })
      .pipe(
        tap((videos: VideoModel[]) => this.patchState(videos, 'data', 'recent', 'videos')),
        catchError(() => this.catchVideosError<VideoModel>('paged videos')),
        finalize(() => this.patchState(false, 'data', 'recent', 'isLoading'))
      );
  }

  protected getGroupedVideos(): Observable<VideoGroupModel[]> {
    this.patchState(true, 'data', 'grouped', 'isLoading');
    return this.videoApiService.getGroupedVideos(this.getVideoSearchOptions())
      .pipe(
        tap((videos: VideoGroupModel[]) => this.patchState(videos, 'data', 'grouped', 'videos')),
        catchError(() => this.catchVideosError<VideoGroupModel>('grouped videos')),
        finalize(() => this.patchState(false, 'data', 'grouped', 'isLoading'))
      );
  }

  protected getFirstVideosPage(): Observable<VideoModel[]> {
    this.patchState(true, 'data', 'paged', 'isLoading');
    return this.selectOnce(state => state.data.recent)
      .pipe(mergeMap((recent: VideoDataModel<VideoModel>) => {
        return this.getPagedVideos({ skipCount: recent.videos.length })
          .pipe(
            tap((videos: VideoModel[]) => this.patchState(videos, 'data', 'paged', 'videos')),
            finalize(() => this.patchState(false, 'data', 'paged', 'isLoading'))
          );
      }));
  }

  protected getNextVideosPage(): Observable<VideoModel[]> {
    this.patchState(true, 'data', 'paged', 'isNextPageLoading')
    return this.getPagedVideos({ skipCount: this.state.data.paged.skipped })
      .pipe(
        map((videos: VideoModel[]) => {
          return this.state.data.paged.videos.concat(videos);
        }),
        tap((videos: VideoModel[]) => this.patchState(videos, 'data', 'paged', 'videos')),
        finalize(() => this.patchState(false, 'data', 'paged', 'isNextPageLoading'))
      );
  }

  protected getPagedVideos(options: { skipCount: number } = { skipCount: 0 }): Observable<VideoModel[]> {
    return this.videoApiService.getPagedVideos(this.getVideoSearchOptions(),
      {
        skipCount: options.skipCount,
        pageSize: this.state.options.pageSize || initialVideoLibraryStateModel.options.pageSize
      })
      .pipe(
        tap((videos: VideoModel[]) => this.patchState(videos.length + options.skipCount, 'data', 'paged', 'skipped')),
        catchError(() => this.catchVideosError<VideoModel>('paged videos'))
      );
  }

  private getVideoSearchOptions(): VideoSearchModel {
    return {
      savedSearchDefinition: this.state.options.savedSearchDefinition || initialVideoLibraryStateModel.options.savedSearchDefinition,
      groupByField: this.state.options.groupByField,
      searchPhrase: this.state.options.searchPhrase
    }
  }

  private catchVideosError<T>(operation: string): Observable<T[]> {
    return throwError(Consts.Messages.FetchVideosFailed(operation));
  }
}
