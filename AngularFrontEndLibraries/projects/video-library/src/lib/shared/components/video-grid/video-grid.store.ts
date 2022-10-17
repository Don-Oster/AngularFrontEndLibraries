import { Injectable } from '@angular/core';

import { BaseStore } from '../../../core/state-management/base.store';
import { VideoGridStateModel } from '../../models/video-grid-state.model';

@Injectable()
export class VideoGridStore extends BaseStore<VideoGridStateModel> {
  constructor() {
    super({ showCount: 0 });
  };
  setShowCount(showCount: number) {
    this.setState({ ...this.state, showCount: showCount });
  }
}
