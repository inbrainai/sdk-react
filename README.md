# InBrain Surveys
Survey library to monetize your mobile app, provided by inBrain.ai

## Installation

`$ npm install inbrain-surveys --save`

### If you are using react <0.60.0

The module has to be manually linked using:
`$ react-native link inbrain-surveys`

### Extra steps iOS
Run `$ pod install` in the ios/ folder

Visit your app’s ***Target*** in the Project Settings and Choose the ***General*** tab.
Scroll down until you hit the ***Frameworks, Libraries, Embedded Contents*** section… 
1) Press ‘+’, Add Other and Add files...
2) Select the **InBrainSurveys_SDK_Swift.xcframework** in your project nodes_modules/inbrain-surveys/ios/Frameworks folder
3) Confirm

Configure your info.plist as specified [here](https://github.com/inBrainSurveys/InBrainSurveys_SDK_Swift/blob/master/README.md#configuration)


## Usage
```javascript
import inbrain from 'inbrain-surveys';
```
Available functions:
```javascript
inbrain.init(clientId: string, secretId: string)
```
* Initialise the SDK
* clientId: The client ID obtained from your account manager (NOT USED ON iOS)
* clientSecret: The client secret obtained from your account manager.

**setAppUserId() **
* Set the app user identifier
* clientId The user identifier (usually an email)

**showSurveys() **
* Show the surveys webview

**getRewards() (Useful for server less app)**
* Get the rewards

**confirmRewards = (rewards: Reward[]) (Useful for server less app)**
* Manual confirm a list of rewards
* rewards: List of rewards to confirm
