import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AboutPageIconComponent } from './components/about-page/about-page-icon.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { SearchFormSelectComponent } from './components/search-form/search-form.component';
import { SortBySelectComponent } from './components/sort-by-select/sort-by-select.component';
import { SettingsHeaderComponent } from './settings-header.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  declarations: [
    AboutPageIconComponent,
    PageHeaderComponent,
    SearchFormSelectComponent,
    SortBySelectComponent,
    SettingsHeaderComponent
  ],
  exports: [
    AboutPageIconComponent,
    PageHeaderComponent,
    SearchFormSelectComponent,
    SortBySelectComponent,
    SettingsHeaderComponent
  ]
})
export class SettingsHeaderModule {
}
