import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Subject, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { Required } from '../../shared/decorators/required.decorator';
import { OrderBy } from '../../shared/models/order.enum';
import { VideoModel } from '../../shared/models/video.model';
import { VideoGroupModel } from '../../shared/models/video-group.model';
import { VideoLibraryStore } from '../../video-library.store';
import { VideoPageModel } from '../../shared/models/video-page.model';
import { VideoDataModel } from '../../shared/models/video-data.model';
import { anyTrue, allFalse } from '../../shared/utils/observable.utils';
import { Consts } from '../../shared/consts';

@Component({
  selector: 'vl-video-content',
  templateUrl: './video-content.component.html',
  styleUrls: ['./video-content.component.scss']
})
export class VideoContentComponent implements OnInit, OnDestroy {

  private readonly destroyed$ = new Subject<void>();

  noVideosMessage: string = Consts.Messages.NoVideos;

  sortOrder$: Observable<OrderBy | undefined>;
  recent$: Observable<VideoDataModel<VideoModel>>;
  featured$: Observable<VideoDataModel<VideoModel>>;
  grouped$: Observable<VideoDataModel<VideoGroupModel>>;
  paged$: Observable<VideoPageModel>;
  hasVideosInHighlightedSection$: Observable<boolean>;
  hasVideosInMainSection$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  fetchedWithErrors$: Observable<boolean>;
  shouldShowNoVideosWarning$: Observable<boolean>;

  @Input() sortOrder: OrderBy = OrderBy.Date;
  @Input() groupByField: string | undefined;
  @Input() highlightedVideoSection: 'latest' | 'featured' = 'latest';
  @Input() @Required savedSearchDefinition: string = '';

  constructor(private store: VideoLibraryStore) {
    this.sortOrder$ = this.store.select(state => state.options.sortOrder)
      .pipe(takeUntil(this.destroyed$));
    this.recent$ = this.store.select(state => state.data.recent)
      .pipe(takeUntil(this.destroyed$));
    this.featured$ = this.store.select(state => state.data.featured)
      .pipe(takeUntil(this.destroyed$));
    this.grouped$ = this.store.select(state => state.data.grouped)
      .pipe(takeUntil(this.destroyed$));
    this.paged$ = this.store.select(state => state.data.paged)
      .pipe(takeUntil(this.destroyed$));
    this.fetchedWithErrors$ = this.store.select(state => state.data.hasErrors)
      .pipe(takeUntil(this.destroyed$));

    this.hasVideosInHighlightedSection$ = anyTrue(
      this.store.select(state => state.data.featured.videos).pipe(map(videos => videos.length > 0)),
      this.store.select(state => state.data.recent.videos).pipe(map(videos => videos.length > 0))
    ).pipe(takeUntil(this.destroyed$));

    this.hasVideosInMainSection$ = anyTrue(
      this.store.select(state => state.data.grouped.videos).pipe(map(videos => videos.length > 0)),
      this.store.select(state => state.data.paged.videos).pipe(map(videos => videos.length > 0))
    ).pipe(takeUntil(this.destroyed$));

    this.isLoading$ = anyTrue(
      this.store.select(state => state.data.featured.isLoading || false),
      this.store.select(state => state.data.recent.isLoading || false),
      this.store.select(state => state.data.grouped.isLoading || false),
      this.store.select(state => state.data.paged.isLoading || false)
    ).pipe(takeUntil(this.destroyed$));

    this.shouldShowNoVideosWarning$ = allFalse(
      this.fetchedWithErrors$,
      this.isLoading$,
      this.hasVideosInHighlightedSection$,
      this.hasVideosInMainSection$
    ).pipe(takeUntil(this.destroyed$));
  }

  ngOnInit() {
    this.store.setVideoSearchOptions({
      sortOrder: this.sortOrder,
      savedSearchDefinition: this.savedSearchDefinition,
      groupByField: this.groupByField,
      withFeaturedVideos: this.highlightedVideoSection === 'featured',
      withRecentVideos: this.highlightedVideoSection === 'latest'
    });

    this.store.fetchVideos()
      .pipe(takeUntil(this.destroyed$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
