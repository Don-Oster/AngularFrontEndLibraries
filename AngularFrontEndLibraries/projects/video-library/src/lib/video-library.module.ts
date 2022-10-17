import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { VideoLibraryComponent } from './video-library.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

// Project modules
import { SettingsHeaderModule } from './modules/settings-header/settings-header.module';
import { VideoContentModule } from './modules/video-content/video-content.module';

// Global Stores
import { VideoLibraryStore } from './video-library.store';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    CoreModule,
    SharedModule,
    SettingsHeaderModule,
    VideoContentModule
  ],
  declarations: [
    VideoLibraryComponent
  ],
  providers: [
    VideoLibraryStore
  ],
  exports: [
    VideoLibraryComponent
  ]
})
export class VideoLibraryModule {
}
