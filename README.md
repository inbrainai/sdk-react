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


## Usage
```javascript
import inbrain from 'inbrain-surveys';

// TODO: What to do with the module?
inbrain.init
inbrain.setAppUserId
inbrain.showSurveys
inbrain.getRewards
```


DEV TO DO:
-- Push the example somewhere else
-- Unlin library (react-native unlink)
-- Write READMEs
-- Check the license with InBrain
-- Determine name of npm package. Currently 'inbrain-surveys'