import React, {useEffect, useState} from 'react';
import Navigator from './components/navigation/Navigator';
import {InbrainContext} from './components/context/InbrainContext';
import {RewardContext} from './components/context/RewardContext';
import inbrain, {StatusBarConfig, NavigationBarConfig} from 'inbrain-surveys';
import config from './inbrain-config';

const App = () => {
  const [reward, setReward] = useState(0);

  useEffect(() => {
    //You need set up your CLIENT_ID, CLIENT_SECRET and USER_ID first
    //For this make a copy of example-inbrain-config.js with name inbrain-config.js and add your CLIENT_ID, CLIENT_SECRET and USER_ID

    // Init the sdk (required)
    inbrain.setInBrain(config.CLIENT_ID, config.CLIENT_SECRET);
    /***** Optional methods *****/

    // Set or change userID (can be set in setInBrain, or using this method)
    inbrain.setUserID(config.USER_ID);
    //Set user session ID
    inbrain.setSessionID('newSessionId');

    /***** UI customization *****/

    // Customize statusBar.
    const statusBarConfig: StatusBarConfig = {
      lightStatusBar: true,
      statusBarColor: '#EAAAAA', // Android only option, have no effect at iOS.
    };
    inbrain.setStatusBarConfig(statusBarConfig);

    // Customize navigationBar
    const navigationBarConfig: NavigationBarConfig = {
      title: 'inBrain.ai Surveys',
      backgroundColor: '#EAAAAA',
      titleColor: '#222AAA',
      buttonsColor: '#ABCDEF',
      hasShadow: false,
    };

    inbrain.setNavigationBarConfig(navigationBarConfig);
  }, []);

  return (
    <InbrainContext.Provider value={inbrain}>
      <RewardContext.Provider value={{reward, setReward}}>
        <Navigator />
      </RewardContext.Provider>
    </InbrainContext.Provider>
  );
};

export default App;
