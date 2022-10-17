# Video Library

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Development](#development)
- [Help](#help)

## About

This package contains an Angular component which provides Video Library functionality.

### Highlighted section

The Video Library component/page can be configured to have a highlighted video section at the top. 
The configuration setting will define if the highlighted video section is one of 2 types: 
- Latest
- Featured

#### 1. With highlighted Featured section

For Featured configuration, the highlighted videos are those who are tagged with Category = Featured Video from among the videos belonging to the full saved search for the page. In this configuration the other group is all videos (including Featured videos).

#### 2. With highlighted Recent section

For Latest configuration, the highlighted videos shows 4 most recently published videos among the videos belonging to the full saved search for the page. In this configuration the other group is all videos not shown in the highlighted section.

### Sort by option

The Video Library component/page can be configured to allow the videos to be grouped by a category or sort by date.

## Installation

### 1. Install the package

To install @angular-front-end-libraries/video-library, run the following command after configuring npm:

```
npm install --save @angular-front-end-libraries/video-library@latest
```

Then include in your apps module:

```typescript
import { Component, NgModule } from '@angular/core';
import { VideoLibraryModule } from '@angular-front-end-libraries/video-library';

@NgModule({
  imports: [
    VideoLibraryModule
  ]
})
export class MyModule {}
```

### 2. Configure Video Library component in one of three ways:

#### Using Angular dynamic route data resolver

```typescript
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                resolve: {
                    config: MyVideoLibraryConfigResolverService
                },
                component: VideoLibraryComponent
            }
        ])
    ],
    providers: [MyVideoLibraryConfigResolverService],
    exports: [RouterModule]
})
export class MyRoutingModule { }
```

```typescript
import { VideoLibraryConfigModel, HighlightedVideoSection } from '@angular-front-end-libraries/video-library';

export class MyVideoLibraryConfigResolverService implements Resolve<VideoLibraryConfigModel> {
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<VideoLibraryConfigModel> {
        return of({
                    title: 'Video Library',
                    highlightedVideoSection: HighlightedVideoSection.Latest,
                    groupByField: 'ContentType',
                    savedSearchDefinition: 'MySavedSearchDefinition' // <---- required
                });
    }
}
```

#### Using Angular static route data

```typescript
import { HighlightedVideoSection } from '@angular-front-end-libraries/video-library';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                data: {
                    title: 'Video Library',
                    highlightedVideoSection: HighlightedVideoSection.Latest,
                    groupByField: 'ContentType',
                    savedSearchDefinition: 'MySavedSearchDefinition' // <---- required
                },
                component: VideoLibraryComponent
            }
        ])
    ],
    providers: [MyVideoLibraryConfigResolverService],
    exports: [RouterModule]
})
export class MyRoutingModule { }
```


#### Using Angular component

In template of Angular component add the following HTML markup:

```html
<cvl-app
    [title]="'Video Library'"
    [savedSearchDefinition]="'MySavedSearchDefinition'"
    [highlightedVideoSection]="'featured'"
    [groupByField]="'ContentType'">
</cvl-app>
```

## Development

### Building

 - Run `npm run video-library:build:prod` to build the `@angular-front-end-libraries/video-library` library.

### Running unit tests

This project uses [Karma](https://karma-runner.github.io) as unit tests runner.

 - Run `npm run video-library:test` to execute unit tests for the `@angular-front-end-libraries/video-library` library.
