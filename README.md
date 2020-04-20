# InBrain Surveys
Survey library to monetize your mobile app, provided by inBrain.ai

## Requirements
This SDK is targeted to the following tools:
- XCode 11.4
- Swift 5
- React Native >=0.60.0

If you are using newer versions of these tools, please refer to the 'inbrain-surveys' npm package.

## Installation

Install and link the module:

`$ npm install inbrain-surveys --save`

### Extra steps iOS

Visit your app’s ***Target*** in the Project Settings and Choose the ***General*** tab.
Scroll down until you hit the ***Embedded Binaries*** section… 
1) Press ‘+’, Add Other...
2) Select the **InBrainSurveys_SDK_Legacy.framework** in your project `nodes_modules/inbrain-surveys/ios/Frameworks` folder and select 'Embed and Sign' 
4) Search for `Framework Search Paths` in your Target and add a recursive entry `$(SRCROOT)/../node_modules/inbrain-surveys`
3) Confirm

Configure your info.plist as specified [here](https://github.com/inBrainSurveys/InBrainSurveys_SDK_Swift/blob/master/README.md#configuration)

### Extra steps Android

Add jitpack repository you your gradle configuration `android/build.gradle > allprojects > repositories
    `maven { 
        // Inbrain
        url 'https://jitpack.io' 
    }`

## Usage
```javascript
import inbrain from 'inbrain-surveys';
```
Available functions:
### Initialise the SDK
```javascript
inbrain.init(clientId: string, secretId: string, options?: InitOptions)
```
* clientId: The client ID obtained from your account manager (NOT USED ON iOS, use info.plist instead)
* clientSecret: The client secret obtained from your account manager.
* options: [Optional] Options. Possible optional options:
    * production: true for production environment, false for staging. Default 'true'. [ONLY FOR ANDROID / IGNORED ON IOS, use Info.plist instead]
    * title: The surveys view title. Default 'inBrain Surveys'
    * navbarColor: The surveys view navigation barcolor (hexadecimal string color, e.g #ff0000)
    * sessionUid: The session uid obtained from your account manager.
    * userId: The user identifier (usually an email)
    * dataPoints: Dictionnary containing data points. e.g: { gender: "male", age: "25"}

### Show the surveys webview
```javascript
inbrain.showSurveys()
```

### Get the rewards
```javascript
inbrain.getRewards() (Useful for server less app)
```

### Confirm a list of rewards
```javascript
inbrain.confirmRewards(rewards: InBrainReward[]) (Useful for server less app)
```
* rewards: List of rewards to confirm

### On webview dismissed
```javascript
inbrain.setOnCloseListener(callback: () => void) 
```
* callback: callback to perform when it happens

### On webview dismissed from page
```javascript
inbrain.setOnCloseListenerFromPage(callback: () => void) 
```
* callback: callback to perform when it happens

## Development
To install and build locally, pull the repository.
Run 
```
npm install 
npm run build 
npm run start 
```

You can alternatively run 'npm run watch' instead of 'npm run build' if you want live reload.

## Troubleshoots
### [BUILD TIME] 'InBrainSurveys_SDK_Legacy/InBrainSurveys_SDK_Legacy-Swift.h' file not found
This problem usually happens if the framework is not set in the Embedded Binaries. See above for set up.
Clean and build the project after changes.

### [BUILD TIME] framework not found InBrainSurveys_SDK_Legacy
This problem usually happens if the 'Framework Search Path' is not set correctly or the framework is not Embedded with the app. See above for set up.
Clean and build the project after changes.

### [RUNTIME] Library not loaded: @rpath/libswiftCore.dylib
This problem can happen if your project doesn't have the Swift standard libraries included. Set the 'Always Embed Swift Standard Libraries' to yes in your target to fix it.
Clean and build the project after changes.
This problem also consistently appears when usinx XCode10

### [RUNTIME] Application crashing without obvious reasons
This problem can happen if you didn't configure the info.plist correctly. See above for set up.
Clean and build the project after changes.

## Code improvements / TODO
- vendored_framework in podspec


