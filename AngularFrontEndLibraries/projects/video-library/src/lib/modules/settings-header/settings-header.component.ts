import { Component, Input } from '@angular/core';

@Component({
    selector: 'vl-settings-header',
    styleUrls: ['settings-header.component.scss'],
    templateUrl: './settings-header.component.html'
})
export class SettingsHeaderComponent {

    @Input() title: string = '';
}
