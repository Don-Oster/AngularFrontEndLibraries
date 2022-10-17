import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { CallService } from './http/call.service';
import { VideoApiService } from './services/video-api.service';

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        CallService,
        VideoApiService
    ]
})
export class CoreModule { }
