export module Consts {
  export module Urls {
    export class Video {
      static GetSettings = 'api/v1/videos/get-settings';
      static GetFilteredVideos = 'api/v1/videos/get-filtered';
      static GetGroupedVideos = 'api/v1/videos/get-grouped';
    }
  }
  export class Messages {
    static ShowingResults = (resultsCount: number, totalCount: number) => `Showing 1 - ${resultsCount} of ${totalCount}`;
    static FetchVideosFailed = (operation: string) => `Error while trying to fetch ${operation}, please try again later.`;
    static FetchSettingsFailed = 'Error while trying to fetch settings, the default settings are used.';
    static NoVideos = 'There is no videos for current search options.';
    static FetchNextVideosPageFailed = 'Error while trying to fetch the next videos page.';
  }
}
