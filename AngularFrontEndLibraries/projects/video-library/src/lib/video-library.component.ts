import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderBy } from './shared/models/order.enum';
import { Required } from './shared/decorators/required.decorator';
import { VideoLibraryStore } from './video-library.store';

@Component({
  selector: 'vl-app',
  templateUrl: './video-library.component.html'
})
export class VideoLibraryComponent {

  private readonly destroyed$ = new Subject<void>();

  initialized$: Observable<boolean>;
  errorMessage$: Observable<string | undefined>;

  @Input() sortOrder = this.route.snapshot.data['sortOrder'] || OrderBy.Date;
  @Input() title = this.route.snapshot.data['title'];
  @Input() breadcrumbs = this.route.snapshot.data['breadcrumbs'];
  @Input() groupByField = this.route.snapshot.data['groupByField'];
  @Input() highlightedVideoSection = this.route.snapshot.data['highlightedVideoSection'];
  @Input() @Required savedSearchDefinition = this.route.snapshot.data['savedSearchDefinition'];

  constructor(private readonly store: VideoLibraryStore, private readonly route: ActivatedRoute) {
    this.initialized$ = this.store.select((state => state.initialized))
      .pipe(takeUntil(this.destroyed$));
    this.errorMessage$ = this.store.select((state => state.errorMessage))
      .pipe(takeUntil(this.destroyed$));
}

  ngOnInit() {
    this.readInputConfigFromRouteData();

    this.store.fetchSettings()
      .pipe(takeUntil(this.destroyed$))
      .subscribe();
  }

  closeErrorAlert() {
    this.store.clearErrors();
  }

  readInputConfigFromRouteData() {
    if (this.route.snapshot.data['config']) {
      this.title = this.route.snapshot.data['config'].title || this.title;
      this.sortOrder = this.route.snapshot.data['config'].sortOrder || this.sortOrder;
      this.breadcrumbs = this.route.snapshot.data['config'].breadcrumbs || this.breadcrumbs || [];
      this.groupByField = this.route.snapshot.data['config'].groupByField || this.groupByField;
      this.highlightedVideoSection = this.route.snapshot.data['config'].highlightedVideoSection || this.highlightedVideoSection;
      this.savedSearchDefinition = this.route.snapshot.data['config'].savedSearchDefinition || this.savedSearchDefinition;
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.store.destroy();
  }
}
