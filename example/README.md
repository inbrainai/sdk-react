
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
Go to the `ios/` folder and run `pod install`.
Go back to the `example` folder and run the application from the command line using `npm run ios`.

### Android
Simply run `npm run android` within `example` folder.

## Generate builds:

### Android
Follow the installation instructions. Go to the `android/` folder and run `./gradlew clean && gradlew assembleRelease`
The apk will be generated at `android/app/build/outputs/apk/release/app-release.apk` and is signed using a self-signed certificate.
