import { Component, Input } from '@angular/core';
import { Required } from "../../../../shared/decorators/required.decorator";
import { VideoModel } from '../../../../shared/models/video.model';

@Component({
  selector: 'vl-video-highlighted-section',
  styleUrls: ['video-highlighted-section.component.scss'],
  templateUrl: 'video-highlighted-section.component.html'
})
export class VideoHighlightedSectionComponent {

  @Input() title: string | undefined;
  @Input() useSlider: boolean = false;
  @Input() @Required videos: VideoModel[] = [];
}
