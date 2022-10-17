import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VideoGridStore } from '../../../../shared/components/video-grid/video-grid.store';
import { Required } from '../../../../shared/decorators/required.decorator';
import { VideoModel } from '../../../../shared/models/video.model';
import { Consts } from '../../../../shared/consts';

@Component({
  selector: 'vl-video-group-section',
  styleUrls: ['video-group-section.component.scss'],
  templateUrl: 'video-group-section.component.html',
  providers: [VideoGridStore]
})
export class VideoGroupSectionComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<void>();

  private showCount: number = 0;
  private totalCount: number = 0;

  showOnlyFirstRow: boolean = true;
  showingText: string | undefined;

  @Input() title: string | undefined;
  @Input() @Required videos: VideoModel[] = [];

  constructor(private readonly store: VideoGridStore) { }
  ngOnInit() {
    this.totalCount = this.videos.length;
    this.store.select((state => state.showCount))
      .pipe(takeUntil(this.destroyed$))
      .subscribe(((showCount) => {
          this.showCount = showCount;
          this.showingText = Consts.Messages.ShowingResults(this.showCount, this.totalCount);
        }));
  }

  isAllItemsShownInSingleRow(): boolean {
    return this.showOnlyFirstRow && this.showCount === this.totalCount;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
