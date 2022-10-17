import { Component, Input, OnDestroy } from '@angular/core';

import { of, Observable, Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';

import { VideoLibraryStore } from "../../../../video-library.store";

@Component({
  selector: 'vl-page-header',
  styleUrls: ['page-header.component.scss'],
  templateUrl: 'page-header.component.html'
})
export class PageHeaderComponent implements OnDestroy {

  private readonly destroyed$ = new Subject<void>();

  @Input() title: string = '';

  constructor(private readonly store: VideoLibraryStore) { }

  getSupportInfo(): Observable<string | undefined> {
    return this.store.select((state => state.settings.showSupportInfo))
      .pipe(
        takeUntil(this.destroyed$),
        mergeMap(((showSupportInfo) => {
          if (showSupportInfo) {
            return this.store.selectOnce((state => state.options.savedSearchDefinition));
          }
          else {
            return of('');
          }
        }))
      );
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
