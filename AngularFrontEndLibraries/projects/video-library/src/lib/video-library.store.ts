import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subject, empty, merge, of, concat, throwError } from 'rxjs';
import { catchError, tap, takeUntil, skip, shareReplay } from 'rxjs/operators';

import { VideoStore } from './core/state-management/video.strore';
import { VideoApiService } from './core/services/video-api.service';

import { initialVideoLibraryStateModel } from './shared/models/video-library-state.model';
import { VideoLibrarySettingsModel } from './shared/models/video-library-settings.model';
import { VideoLibraryOptionsModel } from './shared/models/video-library-options.model';
import { OrderBy } from './shared/models/order.enum';
import { VideoModel } from './shared/models/video.model';
import { Consts } from './shared/consts';

@Injectable()
export class VideoLibraryStore extends VideoStore implements OnDestroy {

  private destroyed$: Subject<void> = new Subject();

  constructor(videoApiService: VideoApiService) {
    super(videoApiService);

    this.select(state => state.options.sortOrder)
      .pipe(takeUntil(this.destroyed$), skip(1))
      .subscribe(() => {
        this.fetchVideos({ withHighlightedVideoSection: false })
          .pipe(takeUntil(this.destroyed$)).subscribe();
      });
    this.select(state => state.options.searchPhrase)
      .pipe(takeUntil(this.destroyed$), skip(1))
      .subscribe(() => {
        this.fetchVideos({ withHighlightedVideoSection: true })
          .pipe(takeUntil(this.destroyed$)).subscribe();
      });
  }

  fetchVideos(options: { withHighlightedVideoSection: boolean } = { withHighlightedVideoSection: true }) {
    this.clearErrors();

    this.patchState(false, 'data', 'hasErrors');
    this.patchState([], 'data', 'paged', 'videos');
    this.patchState([], 'data', 'grouped', 'videos');

    return this.internalFetchVideos(options)
      .pipe(catchError((errorMessage) => {
        this.setState({
          ...this.state,
          errorMessage: errorMessage,
          data: { ...this.state.data, hasErrors: true }
        });
        return throwError(errorMessage);
      }));
  }

  fetchNextAllVideosPage(): Observable<VideoModel[]> {
    return this.state.data.paged && this.state.data.paged.isNextPageLoading ? empty() : this.getNextVideosPage();
  }

  fetchSettings(): Observable<VideoLibrarySettingsModel> {
    this.clearErrors();

    return this.videoApiService.getSettings()
      .pipe(shareReplay(1), tap((settings: VideoLibrarySettingsModel) => {
        this.setState({
          ...this.state,
          settings: settings,
          initialized: true
        });
      }), catchError(() => {
        this.setState({
          ...this.state,
          errorMessage: Consts.Messages.FetchSettingsFailed,
          initialized: true
        });
        return of(initialVideoLibraryStateModel.settings);
      }));
  }

  setVideoSearchOptions(options: VideoLibraryOptionsModel) {
    this.setState({
      ...this.state,
      options: { ...this.state.options, ...options }
    });
  }

  searchVideos(searchTerm: string = '') {
    this.setState({
      ...this.state,
      options: { ...this.state.options, searchPhrase: searchTerm }
    });
  }

  sortVideos(orderBy: OrderBy) {
    this.setState({
      ...this.state,
      options: { ...this.state.options, sortOrder: orderBy }
    });
  }

  clearErrors() {
    this.setState({ ...this.state, errorMessage: undefined });
  }

  destroy() {
    this.setState({ ...this.state, initialized: false });
  }

  private internalFetchVideos(options: { withHighlightedVideoSection: boolean }) {
    let featured$ = of(this.state.data.featured.videos);
    let recent$ = of(this.state.data.recent.videos);
    let grouped$ = of(this.state.data.grouped.videos);
    let paged$ = of(this.state.data.paged.videos);

    if (options.withHighlightedVideoSection) {
      if (this.state.options.withFeaturedVideos) {
        featured$ = this.getFeaturedVideos();
      }
      if (this.state.options.withRecentVideos) {
        recent$ = this.getRecentVideos();
      }
    }
    if (this.state.options.sortOrder === OrderBy.Group) {
      grouped$ = this.getGroupedVideos();
    }
    if (this.state.options.sortOrder === OrderBy.Date) {
      paged$ = this.getFirstVideosPage();
    }

    const recentVideosRequested = options.withHighlightedVideoSection && this.state.options.withRecentVideos;
    const allVideosRequested = this.state.options.sortOrder === OrderBy.Date;

    return recentVideosRequested && allVideosRequested
      ? merge(featured$, concat(recent$, paged$), grouped$)
      : merge(featured$, recent$, paged$, grouped$);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
