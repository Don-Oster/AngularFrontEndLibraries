import { Component, Input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';

import { VideoGridStore } from './video-grid.store';
import { Required } from '../../decorators/required.decorator';
import { ScreenSizeDetector } from '../../utils/screen-size-detecter';
import { VideoModel } from '../../models/video.model';

@Component({
  selector: 'vl-video-grid',
  template: 'video-grid.component.html',
  styles: ['video-grid.component.scss'],
  animations: [
    trigger('carouselAnimation', [
      transition(':increment', [style({ transform: 'translate3d({{rowSize}}, 0px, 0px)' }), animate(200)]),
      transition(':decrement', [style({ transform: 'translate3d(-{{rowSize}}, 0px, 0px)' }), animate(200)])
    ])
  ],
  host: {
    '(window:resize)': 'onWindowResized()'
  }
})
export class VideoGridComponent {

  private innerRowSize: number = 0;

  carousel: { startValue: number; endValue: number;} = { startValue: 0, endValue: 0 };
  videoImageElementHeight: number = 0;

  @Input() @Required videos: VideoModel[] = [];
  @Input() singleRow = false;
  @Input() useSlider = false;
  @Input() size: 'default' | 'small' | 'small-with-default-on-xtra-large' = 'default';

  constructor(private readonly store: VideoGridStore, public readonly sanitizer: DomSanitizer) {
    this.carousel = { startValue: 0, endValue: 0 };
    this.videoImageElementHeight = 0;
  }

  get rowSize() {
    return this.innerRowSize;
  }

  set rowSize(value) {
    if (this.useSlider) {
      if (this.carousel.startValue + value > this.carousel.endValue) {
        this.carousel.endValue = this.videos.length;
      }
      this.carousel.startValue = this.carousel.endValue - value;
    }
    this.innerRowSize = value;
  }

  ngOnInit() {
    this.setRowSize();
    this.setInitialCarouselOptions();
  }

  onWindowResized() {
    this.setRowSize();
  }

  showNextVideo() {
    if (this.carousel.endValue < this.videos.length + 1) {
      this.carousel.startValue = this.carousel.startValue + 1;
      this.carousel.endValue = this.carousel.endValue + 1;
    }
  }

  showPrevVideo() {
    if (this.carousel.startValue > 0) {
      this.carousel.startValue = this.carousel.startValue - 1;
      this.carousel.endValue = this.carousel.endValue - 1;
    }
  }

  private setRowSize() {
    if (ScreenSizeDetector.screenIsSmall()) {
      this.rowSize = 1;
    }
    if (ScreenSizeDetector.screenIsMedium()) {
      this.rowSize = this.size === 'default' ? 2 : 3;
    }
    if (ScreenSizeDetector.screenIsLarge()) {
      this.rowSize = 'default' ? 3 : 4;
    }
    if (ScreenSizeDetector.screenIsXtraLarge()) {
      this.rowSize = this.size === 'small' ? 6 : 4;
    }
    if (this.singleRow) {
      this.store.setShowCount(this.rowSize > this.videos.length ? this.videos.length : this.rowSize);
    }
    else {
      this.store.setShowCount(this.videos.length);
    }
  }

  private setInitialCarouselOptions() {
    this.carousel.startValue = 0;
    if (this.useSlider) {
      this.carousel.endValue = this.rowSize;
    }
    else {
      this.carousel.endValue = this.videos.length;
    }
  }
}
