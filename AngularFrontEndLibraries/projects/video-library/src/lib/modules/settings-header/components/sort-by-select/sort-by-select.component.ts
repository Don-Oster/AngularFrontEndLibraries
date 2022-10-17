import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { VideoLibraryStore } from '../../../../video-library.store';
import { OrderBy } from '../../../../shared/models/order.enum';

@Component({
  selector: 'vl-sort-by-select',
  styleUrls: ['sort-by-select.component.scss'],
  templateUrl: 'sort-by-select.component.html'
})
export class SortBySelectComponent implements OnInit, OnDestroy {

  private readonly destroyed$ = new Subject<void>();

  items: string[] = Object.keys(OrderBy);
  selectedItem: keyof typeof OrderBy;

  constructor(private readonly store: VideoLibraryStore) {
    this.selectedItem = this.items[0] as keyof typeof OrderBy;
  }

  ngOnInit() {
    this.items.sort();

    this.store.select((state => state.options.groupByField))
      .pipe(takeUntil(this.destroyed$), filter(value => !!value))
      .subscribe((() => {
        this.items = this.items.filter((obj => obj !== OrderBy.Group));
        if (this.selectedItem === OrderBy.Group) {
          this.selectedItem = this.items[0] as keyof typeof OrderBy;
        }
      }));

    this.store.selectOnce((state => state.options.sortOrder))
      .pipe(takeUntil(this.destroyed$))
      .subscribe(((sortOrder) => {
        const itemToSelect = this.items.find(((item) => item === sortOrder));
        if (itemToSelect) {
          this.selectedItem = itemToSelect as keyof typeof OrderBy;
        }
      }));
  }

  onSortingSelected(item: string) {
    this.selectedItem = item as keyof typeof OrderBy;
    this.store.sortVideos(OrderBy[this.selectedItem]);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
