##[2.12.0] 2023-12-25

### Added
- `getCurrencySale` new method to get Currency Sale information.


##[2.13.0] 2023-11-06

### Changed
- Updated React Native version to 0.72.4

##[2.12.0] 2023-10-12

### Added
- `isProfilerSurvey` property to `InBrainNativeSurvey`.

### Changed
- Updated android sdk version to 2.2.0;
- Updated ios sdk version to 2.3.0;

##[2.11.6] 2023-09-26

### Changed
- Updated android sdk version to 2.1.18;
- Updated peerDependencies for support more early versions of React Native. 

##[2.11.5] 2023-08-16

### Fixed
- `surveysClosedByWebView` - added check on ios side to see if it was EventListener added on js side.

##[2.11.4] 2023-07-24

### Changed
- `setOnSurveysCloseLister` - now return NativeEventEmitter.

##[2.11.3] 2023-06-27

### Fixed
- Android dependencies.

##[2.11.2] 2023-06-05

### Fixed
- `onClose` event not fired.

### Changed
- Updated project npm dependency config.

##[2.11.1] 2023-05-25

### Fixed
- `checkSurveysAvailable` crash.

##[2.11.0] 2023-05-22

### Changed
- Migrate from jcenter to Maven Repository;
- Removed `checkSurveysAvailable` country check from SDK, now all the logic handled by back-end. 

##[2.10.0] 2023-02-23

### Changed
- Updated React Native version to 0.71.3 

##[2.9.0] 2023-02-08

### Added
- `setInBrain` the method for initial inBrain SDK configuration;
- `setUserID` the method to set userID separetely from initialization of the sdk; 
- `setStatusBarConfig` the method to customize Status Bar;
- `setNavigationBarConfig` the method to customize Navigation Bar;
- `StatusBarConfig` type, represents Status Bar configuration;
- `NavigationBarConfig` type, represents Navigation Bar configuration.

### Changed
- `init` method deprecated;
- `setSessionParameters` method deprecated;
- `ConfigOptions` type deprecated;
- `NavitagionBarOptions` type deprecated;
- `StatusBarOptions` type deprecated;
- `StylingOptionType` type deprecated.

##[2.8.0] 2023-01-02

### Added
- `OnSurveysClose` listener;
- `InBrainSurveyReward` type, which represents information about completed survey and earned reward;
- `OnCloseSurveysData` type, which contains close type and reward information.

### Changed
- `onClose` listener deprecated;
- `onCloseFromPage` listener deprecated.
---

## [2.7.0] 2022-12-29

### Added
-  `conversionLevel` property to `InBrainNativeSurvey`.

### Changed
- `profileMatch` property of `InBrainNativeSurvey` deprecated.  
---


## [2.6.0] 2022-12-28

### Changed
- `isS2S`, `language` and `dataPoints` properties of `InitOptions`;
- `setSessionParameters(sessionUid:, dataPoints:)` deprecated in favour of `setSessionID(_:)` and `setDataOptions(_:)`.
---

## [2.5.0] 2022-12-20
### Added
- `profileMatch` property to `InBrainNativeSurvey`;  
- `ProfileMatch` and `Category` types.  

### Changed
- `InBrainNativeSurveys` renamed into `InBrainNativeSurvey`;  
- `InBrainNativeSurvey`'s `categories` property became deprecated in favor of `namedCategories`;  
- The package will use latest minor iOS and Android InBrainSurveys SDKs instead of exact version (means 02.00.xx instead of 02.00.00) - that will help to deliver the "underhood" fixes and improvements ASAP.

### Removed
- Bitcode support for iOS. 
---  
  
## [2.4.3] 2022-11-18  
### Added  
- `categories` property to `InBrainNativeSurveys`.  
---

## [2.4.2] 2022-11-14
### Added  
- `searchId` property to `InBrainNativeSurveys`.

### Changed  
- Show Native Survey with `searchId` instead of `placementId`.  
---  

## [2.4.0] 2022-11-12  
### Added  
- `InBrainSurveyCategory` - represents all the supported categories;  
- `InBrainSurveyFilter` - filter for fetching Native Surveys;  
- Ability to fetch Native Surveys, filtered by categories.  

### Changed
- Fetching Native Surveys with `filter` instead of `placementId`;
- Updated android sdk version to 2.0.0;
- Updated ios sdk version to 2.0.0.
---

## [2.3.5] 2022-11-01
### Changed
- Updated Android inBrainSurveys SDK to version `1.0.28`;
- Survey interruption flow updated.
---

## [2.3.4] 2022-10-25
### Changed
- Updated Android inBrainSurveys SDK to version `1.0.27`.
---

## [2.3.3] 2022-10-14
### Changed
- Updated RN version from `0.63` to `0.70.2`;
- Updated iOS inBrainSurveys SDK to version `1.8.7`.
---

### Fixed
- Fixed library compatibility with the latest version of react native.
---

## [2.3.0] 2022-03-07
### Changed
- Updated RN version from `0.62` to `0.63`;
- Updated iOS inBrainSurveys SDK to version `1.8.4`.
--- 

## [2.2.4] 2020-11-29
### Added
- Added `currencySale` and `multiplier` properties to InBrainNativeSurvey object;

### Changed
- Updated Android inBrainSurveys SDK to version `1.0.21`;
- Updated iOS inBrainSurveys SDK to version `1.8.2`.
---

## [2.2.3] 2020-11-29
### Fixed
- Fixed 2.2.2 crash related to NativeSurveysDelegate on iOS.
---

## [2.2.2] 2020-11-27
### Changed
- Updated Android inBrainSurveys SDK to version `1.0.20`;
- Updated iOS inBrainSurveys SDK to version `1.8.1`.
---

## [2.2.1] SKIPPED - was unpublished from npmjs (published by mistake)
---

## [2.2.0] 2020-10-09
### Added
- Added `placementId` optional parameters to methods `getNativeSurveys` and `showNativeSurvey`
- Added method `setSessionParameters` to update parameters without having to call `init`

### Changed
- Updated Android inBrainSurveys SDK to version `1.0.19`;
- Updated iOS inBrainSurveys SDK to version `1.8.0`.
---

## [2.1.4] 2020-01-27
### Changed
- Updated Android inBrainSurveys SDK to version `1.0.16`.
---

## [2.1.3] 2020-01-23
### Changed
- Merged v1.1.4 and v1.1.5 into 2.1.x;
- `showSurveys` and `showNativeSurveys` are now executed from the UI Thread in Android.
---

## [2.1.2] 2020-01-20
### Changed
- Updated iOS inBrainSurveys SDK to version`1.5.2`.
---

## [2.1.1] 2020-01-16
### Changed
- Updated iOS inBrainSurveys SDK to version `1.5.1`.

### Fixed
- Fixed error messages on iOS.
---

## [2.1.0] 2020-01-14
### Changed
- Updated Android inBrainSurveys SDK to version `1.0.15`;
- Updated iOS inBrainSurveys SDK to version `1.5.0`.
---

## [2.0.2] 2020-12-31
### Changed
- Added some Javascript side validation;
- Merged 1.1.4 into 2.0.0: Improve handling of null Activity.
---

## [2.0.1] 2020-12-21
### Changed
- Merged 1.1.3 into 2.0.0: Internals of Android bridge. Prevent app from crashing if problem during init call.
---

## [2.0.0] 2020-12-12
### Added
- Added two different kind of options `navigationBar` and `statusBar` to have more fine-grained control over navigation and status bars styling.

### Changed
- Updated Android inBrainSurveys SDK to version `1.0.14`;
- Updated iOS inBrainSurveys SDK to version `1.4.12`;
- Moved options `titleColor` and `navbarColor`.
---

## [1.1.5] 2021-01-22
### Changed
- `showSurveys` and `showNativeSurveys` are now executed from the UI Thread in Android
---

## [1.1.5] 2021-01-23
### Changed
- `showSurveys` and `showNativeSurveys` are now executed from the UI Thread in Android

## [1.1.4] 2020-12-31
### Changed
- Improve handling of null Activity (bridge method is being re-called at most 10 times before throwing, with 50ms intervals) in Android.
---

## [1.1.3] 2020-12-18
### Changed
- Internals of Android bridge. Prevent app from crashing if problem during init call.
---

## [1.1.2] 2020-11-20
### Added
- `titleColor` option which allows to modify the webview title color.
---

## [1.1.1] 2020-11-19
### Fixed
- Fix `onClose` listener not triggered when closing the webview displaying a native survey.

### Changed
- Simplified ObjC code and removed unnecessary view controller. 
---

## [1.1.0] 2020-11-13
### Added
- CHANGELOG.md;
- `checkSurveysAvailable`, `getNativeSurveys`, and `showNativeSurvey` methods.

### Changed
- Updated Android inBrainSurveys SDK to version `1.0.9`;
- Updated iOS inBrainSurveys SDK to version `1.4.6`.
---

## [1.0.8] - 2020-09-02
### Changed
- Updated iOS inBrainSurveys SDK.
---

## [1.0.7] - 2020-07-28
### Added
- `isS2S` attribute in `InitOptions` with default value `false`.

### Changed
- Updated Android inBrainSurveys SDK to version `1.0.3`;
- Updated iOS inBrainSurveys SDK;
- Changed bridge internal method names and prototypes;
- Set default value for `userId` attribute in `InitOptions` to `''`.

### Removed
- Removed attribute `production` in `InitOptions`.
---

## [1.0.6] - 2020-06-17
### Changed
- Updated Android inBrainSurveys SDK to version `0.1.25`.
---

## [1.0.5] - 2020-06-01

## [1.0.4] - 2020-05-31

## [1.0.3] - 2020-05-21

## [1.0.2] - 2020-05-14

## [1.0.1] - 2020-04-21

## [1.0.0] - 2020-02-13
### Added
- Initial SDK version.
