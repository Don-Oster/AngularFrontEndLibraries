import { Component, Input, OnDestroy } from '@angular/core';

import { Observable, Subject, combineLatest, throwError } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { VideoModel } from '../../../../shared/models/video.model';
import { VideoLibraryStore } from '../../../../video-library.store';
import { Consts } from '../../../../shared/consts';

@Component({
  selector: 'vl-video-infinite-scroll-section',
  styleUrls: ['video-infinite-scroll-section.component.scss'],
  templateUrl: 'video-infinite-scroll-section.component.html',
})
export class VideoInfiniteScrollComponent implements OnDestroy {

  private readonly destroyed$ = new Subject<void>();

  errorMessage: string = Consts.Messages.FetchNextVideosPageFailed;
  showError: boolean = false;
  isLoading$: Observable<boolean | undefined>;

  @Input() title: string | undefined;
  @Input() videos: VideoModel[] = [];

  constructor(private readonly store: VideoLibraryStore) {
    this.isLoading$ = this.store.select((state => state.data.paged.isNextPageLoading))
      .pipe(takeUntil(this.destroyed$));
  }

  onContentScrolled() {
    this.store.fetchNextAllVideosPage()
      .pipe(
        takeUntil(this.destroyed$),
        catchError(((error) => {
          this.showError = true;
          return throwError(error);
        })))
      .subscribe();
  }

  getVideoGridSize(): Observable<string> {
    return combineLatest(
      this.store.select((state => state.options.withFeaturedVideos)),
      this.store.select((state => state.options.withRecentVideos))
    ).pipe(
      takeUntil(this.destroyed$),
      map((([withFeaturedVideos, withRecentVideos]) => {
        if (withFeaturedVideos || withRecentVideos) {
          return 'small';
        }
        else {
          return this.videos.length > 16 ? 'small' : 'default';
        }
      }))
    );
  }

  closeErrorAlert() {
    this.showError = false;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
