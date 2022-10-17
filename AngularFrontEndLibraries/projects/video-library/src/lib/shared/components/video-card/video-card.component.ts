import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Required } from '../../decorators/required.decorator';
import { VideoModel } from '../../models/video.model';

@Component({
  selector: 'vl-video-card',
  template: 'video-card.component.html',
  styles: ['video-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VideoCardComponent {

  private defaultVideoImage = require('../assets/video_thumbnail_template.jpg');

  @Input() @Required video!: VideoModel;
  @Input() showLeftButton: boolean = false;
  @Input() showRightButton: boolean = false;
  @Output() leftButtonClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() rightButtonClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor(private readonly sanitizer: DomSanitizer) { }

  onVideoButtonClicked(config: VideoModel) {
  }

  onLeftButtonClicked() {
    this.leftButtonClicked.emit();
  }

  onRightButtonClicked() {
    this.rightButtonClicked.emit();
  }

  getVideoBackground() {
    if (this.video.imageUrl) {
      return this.sanitizer.bypassSecurityTrustStyle(`url(${this.video.imageUrl}), url(${this.defaultVideoImage})`);
    }
    return this.sanitizer.bypassSecurityTrustStyle(`url(${this.defaultVideoImage})`);
  }

  buildUrlToDocument() {
    return `/${this.video.source}/${this.video.sourceId}`;
  }
}
