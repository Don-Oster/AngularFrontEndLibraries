import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VideoCardComponent } from './components/video-card/video-card.component';
import { VideoGridComponent } from './components/video-grid/video-grid.component';
import { VideoGridStore } from './components/video-grid/video-grid.store';

import { DomChangeDirective } from './directives/dom-change.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    VideoGridStore
  ],
  declarations: [
    VideoCardComponent,
    VideoGridComponent,
    DomChangeDirective
  ],
  exports: [
    VideoCardComponent,
    VideoGridComponent,
    DomChangeDirective
  ]
})
export class SharedModule {
}
