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
2) Select the **InBrainSurveys_SDK_Swift.xcframework** in your project 'nodes_modules/inbrain-surveys/ios/Frameworks' folder
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
* clientId: The client ID obtained from your account manager (NOT USED ON iOS, use info.plist instead)
* clientSecret: The client secret obtained from your account manager.

```javascript
inbrain.setAppUserId(userId: string)
```
* Set the app user identifier
* clientId The user identifier (usually an email)

```javascript
inbrain.showSurveys()
```
* Show the surveys webview

```javascript
inbrain.getRewards() (Useful for server less app)
```
* Get the rewards
```javascript
inbrain.inbrainconfirmRewards(rewards: InBrainReward[]) (Useful for server less app)
```
* Manual confirm a list of rewards
* rewards: List of rewards to confirm

```javascript
inbrain.setOnCloseListener(callback: () => void) 
```
* Listener called when the webview is dismissed
* callback: callback to perform when it happens



### Only supported on iOS
```javascript
inbrain.setTitle(title: string)
```
* Set the webview title
* title: The title to display

```javascript
inbrain.setNavbarColor(color: string)
```
* Set the webview navbar color
* color: hexadecimal string color (e.g #ff0000)

```javascript
inbrain.setButtonColor(color: string)
```
* Set the webview button color
* color: hexadecimal string color (e.g #ff0000)
