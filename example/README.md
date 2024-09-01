
# inBrain Surveys Example
This is an example of usage [inbrain-surveys](https://www.npmjs.com/package/inbrain-surveys) sdk.

All the logic is done in `App.jsx` with the differents SDK method calls. 

## Requirements
This SDK is targeted to the following tools:
- XCode 15+
- iOS 15 +
- CocoaPods >= 1.13, but < 1.151.10
- Swift 5
- React Native 0.74

## Installation
Simply run at the `example` folder: 
`$ npm install`

## Setup the credentials
Find the `inbrain-config.js` file at `example` folder, copy it file with name `inbrain-config.js` and provide the credentials at the new file.


## Run the app:

### iOS
Go to the `ios/` folder and run `pod install`. After that there are two options to launch the app:
1) Go back to the `example` folder and run the application from the command line using `npx react-native run-ios --simulator="iPhone 15"` or any other simulator you would like.
* Due to the issue with the cli - `npx react-native run-ios` without specifiyng the simulator may not work.

2) Open the `example/ios/InbrainReactNativeExample.xcworkspace` file in XCode, select the run destination and run the application by pressing `Command (⌘) R`


### Android
Simply run `npm run android` within `example` folder.

## Generate builds:

### Android
Follow the installation instructions. Go to the `android/` folder and run `./gradlew clean && gradlew assembleRelease`
The apk will be generated at `android/app/build/outputs/apk/release/app-release.apk` and is signed using a self-signed certificate.
