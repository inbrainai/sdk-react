# InBrain Surveys
Survey library to monetize your mobile app, provided by inBrain.ai

## Requirements
This SDK is targeted to the following tools:
- XCode 11.4+
- CocoaPods 1.10+
- Swift 5
- React Native >=0.60.0

## Installation

Install and link the module:

`$ npm install inbrain-surveys --save`

### Extra steps iOS

Do not forget to use Cocoapods 1.9 in your project. Handling of xcframeworks isn't well supported in the previous versions. 

Set the framework 'Target Membership' to `inbrain-surveys` as below:

![Framework Target Membership](https://i.ibb.co/N2ntq0P/target-membership.png)

### Extra steps Android
Add jitpack repository you your gradle configuration `android/build.gradle > allprojects > repositories`

```
maven { 
    url 'https://jitpack.io' 
}
```

## Usage
```javascript
import inbrain from 'inbrain-surveys';
```

For a fully functional example, please refer to this [demo app](https://github.com/inbrainai/react-native) using the SDK.

Available functions:
### Initialise the SDK
```javascript
inbrain.init(apiClientId: string, apiSecret: string, options?: InitOptions) : Promise<void>
```
* `apiClientId`: The client ID obtained from your account manager
* `apiSecret`: The client secret obtained from your account manager.
* `options`: [Optional] Options. Possible options:
    * `language`: By default, device's locale's language will be used. Accepted languages: `de-de`, `en-au`, `en-ca`, `en-gb`, `en-in`, `en-us`, `es-es`, `es-mx`, `es-us`, `fr-ca`, `fr-fr`, `fr-br` (case sensitive)
    * `sessionUid`: Value to track each session of inBrain use from a specific userID
    * `isS2S`: If the SDK runs in Server To Server mode. Default `false`
    * `userId`: The unique string value that differentiates each user within their app when initializing inBrain (Example: an email, a username). Default `''`
    * `title`: The surveys view title. Default 'inBrain.ai Surveys'
    * `navigationBar`: The navbar configuration
        * `backgroundColor`: The surveys view background color (hexadecimal string color, e.g #FF0000)
        * `buttonsColor`: The surveys view buttons color (hexadecimal string color, e.g #E7F722)
        * `titleColor`: The surveys view title color (hexadecimal string color, e.g #FF0404)
        * `hasShadow`: TODO
    * `statusBar`: The status bar configuration
        * `lightStatusBar`: TODO
    * `dataPoints`: A dictionary of keys and values to provide inBrain profiler data for custom profiler user experience (Example: `{ age : “23”, gender : “female” }`)

Note: This method need to be called prior calling all the other methods. 

### Show the surveys webview
```javascript
inbrain.showSurveys() : Promise<void>
```

### Get the rewards (Useful for server less app)
```javascript
inbrain.getRewards() : Promise<InBrainReward[]>
```

### Confirm a list of rewards (Useful for server less app)
```javascript
inbrain.confirmRewards(rewards: InBrainReward[]) : Promise<void>
```
* rewards: List of rewards to confirm

### Check if Native Surveys are available
```javascript
inbrain.checkSurveysAvailable() : Promise<boolean>
```

### Get the Native Surveys available
```javascript
inbrain.getNativeSurveys() : Promise<InBrainNativeSurveys[]>
```

### Show a Native Survey
```javascript
inbrain.showNativeSurvey(id: string) : Promise<void>
```

### On webview dismissed
```javascript
inbrain.setOnCloseListener(callback: () => void) 
```
* callback: callback to perform when it happens

Note: Calling this method multiple times will override the previous listener.

### On webview dismissed from page
```javascript
inbrain.setOnCloseListenerFromPage(callback: () => void) 
```
* callback: callback to perform when it happens

Note: Calling this method multiple times will override the previous listener.

## Troubleshoots
### [BUILD TIME] 'InBrainSurveys_SDK_Legacy/InBrainSurveys_SDK_Legacy-Swift.h' file not found
This problem usually happens if the framework is not set in the Embedded Binaries, or if the framework doesn't have the target set to `inbrain-surveys` See above for set up.
Clean and build the project after changes.

### [RUNTIME] Library not loaded: @rpath/libswiftCore.dylib
This problem can happen if your project doesn't have the Swift standard libraries included. Set the 'Always Embed Swift Standard Libraries' to yes in your target to fix it.
Clean and build the project after changes.
This problem also consistently appears when usinx XCode10

### [RUNTIME - Release scheme] dependent dylib '@rpath/InBrainSurveys_SDK_Swift.framework/InBrainSurveys_SDK_Swift' not found 
This problem happen with previous version of Cocoapods and XCode. Try updating to Cocoapods 1.10.x, and if it still doesn't work, also upgrade to XCode12
