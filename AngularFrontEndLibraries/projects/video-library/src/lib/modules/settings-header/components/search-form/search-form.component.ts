import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VideoLibraryStore } from '../../../../video-library.store';

@Component({
  selector: 'vl-search-form',
  styleUrls: ['search-form.component.scss'],
  templateUrl: 'search-form.component.html'
})
export class SearchFormSelectComponent implements OnInit, OnDestroy {

  private readonly destroyed$ = new Subject<void>();

  searchPhrase: string | undefined;
  lastSearchPhrase: string | undefined;

  constructor(private readonly store: VideoLibraryStore) { }

  ngOnInit() {
    this.store.select((store => store.options.searchPhrase))
      .pipe(takeUntil(this.destroyed$))
      .subscribe(((searchPhrase: string | undefined) => {
          this.searchPhrase = searchPhrase;
          this.lastSearchPhrase = searchPhrase;
        }));
  }

  onSearch(searchPhrase: string) {
    if (searchPhrase !== this.lastSearchPhrase) {
      this.store.searchVideos(searchPhrase);
    }
  }

  onSearchCleared() {
    this.store.searchVideos('');
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
