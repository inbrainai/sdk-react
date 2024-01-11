import { Platform, NativeModules, NativeEventEmitter, EmitterSubscription } from 'react-native';

import { assertIsColor, assertNotNullNorEmpty, wrapPromise, createNativeSurveys, createNativeReward } from './Utils';
import {
    InitOptions,
    DataPoints,
    StylingOptions,
    StatusBarConfig,
    NavigationBarConfig,
} from './Options';
import { InBrainReward, InBrainNativeSurvey, InBrainSurveyFilter, OnCloseSurveysData, InBrainCurrencySale } from './Models';

const { InBrainSurveys } = NativeModules;

const inbrainEmitter = new NativeEventEmitter(InBrainSurveys);
// ----------------------- Setup InBrain -------------------------------

/**
* Initial inBrain SDK configuration.
* @param apiClientId The client ID provided in inBrain.ai dashboard
* @param apiSecret The client secret provided in inBrain.ai dashboard
* @param userId: The string value that uniquely identifies each user within your application. Can be provided later, using `setUserID` method
*/
const setInBrain = (apiClientId: string, apiSecret: string, userId?: string) => {
   validateClientData(apiClientId, apiSecret);
   InBrainSurveys.setInBrain(apiClientId, apiSecret);
   InBrainSurveys.setUserID(userId);
};

/**
 *  Set uniq identifier of user within your application. If value not set (or empty) - `deviceId` will be used
 *  @param userID The string value that uniquely identifies each user within your application
 */
const setUserID = (userID: string | undefined) => InBrainSurveys.setUserID(userID);

/**
 * Set the value to track user session. This value is provided via S2S Callbacks as SessionId.
 * @param sessionId Session identifier
 */
const setSessionID = (sessionId: string) => InBrainSurveys.setSessionID(sessionId);

/**
 * Provide information about the user
 * @param dataPoints User information
 */
const setDataOptions = (dataPoints: DataPoints) => InBrainSurveys.setDataOptions(dataPoints);

/**
 * Customize Status Bar to match your application style
 * @param config Status Bar configuration
 */
const setStatusBarConfig = (config: StatusBarConfig) => {
    if (Platform.OS == 'ios') {
        InBrainSurveys.setStatusBarLight(config.lightStatusBar ?? true);
    } else {
        config.statusBarColor && assertIsColor(config.statusBarColor);
        InBrainSurveys.setStatusBarConfig(config.lightStatusBar ?? false, config.statusBarColor);
    }
};

/**
 * Customize Navigation Bar to match your application style
 * @param config Navigation Bar configuration
 */
const setNavigationBarConfig = (config: NavigationBarConfig) => {
    config.backgroundColor && assertIsColor(config.backgroundColor);
    config.buttonsColor && assertIsColor(config.buttonsColor);
    config.titleColor && assertIsColor(config.titleColor);

    InBrainSurveys.setNavigationBarConfig(config.backgroundColor, config.buttonsColor,
                                          config.titleColor, config.title,
                                          config.hasShadow ?? false);
};

/**
 * Set the listener when the webview is dismissed or webview is dismissed from within the webview
 * @param callback Callback to execute
 */
const setOnSurveysCloseLister = (callback: (result: OnCloseSurveysData) => void ): EmitterSubscription => {

    const preCallback = (data: any) => {
        let inbrainOnCloseData: OnCloseSurveysData = {...data};
        if(data?.rewards) {
            inbrainOnCloseData.rewards = createNativeReward(data?.rewards);
        }
        callback(inbrainOnCloseData);
    }
    
    return inbrainEmitter.addListener('OnSurveysClose', preCallback);
}

/**
 * Check if surveys are available to show
 */
const checkSurveysAvailable = () => wrapPromise<boolean>(() => InBrainSurveys.checkSurveysAvailable())

/**
 * Show the Survey Wall. All the configs should be done `BEFORE` calling `showSurveys()`.
 */
const showSurveys = () => wrapPromise<void>(() => InBrainSurveys.showSurveys());

/**
 * Get Native Surveys
 * @param filter an optional parameter
 */
const getNativeSurveys = (filter?: InBrainSurveyFilter) => wrapPromise<InBrainNativeSurvey[]>( async () => { 
    let nativeSurveys = await InBrainSurveys.getNativeSurveys(filter?.placementId, filter?.categoryIds, filter?.excludedCategoryIds).then((nativeSurveys: InBrainNativeSurvey[]) => nativeSurveys);
    return createNativeSurveys(nativeSurveys);
});

/**
 * Show a specific Native Survey. All the configs should be done `BEFORE` calling `showNativeSurvey()`.
 * @param id the survey's identifier
 * @param searchId a mandatory identifier
 */
const showNativeSurvey = (id: string, searchId: string) => wrapPromise<void>(() => InBrainSurveys.showNativeSurvey(id, searchId));

/**
 * Get the rewards
 */
const getRewards = () => wrapPromise<InBrainReward[]>(() => InBrainSurveys.getRewards());

/**
 * Manually confirm a list of rewards
 * @param rewards The rewards to confirm
 */
const confirmRewards = (rewards: InBrainReward[]) => wrapPromise<void>(() => InBrainSurveys.confirmRewards(rewards));


/**
 * Get Currency Sale
 */
const getCurrencySale = () => wrapPromise<InBrainCurrencySale>(() => InBrainSurveys.getCurrencySale());


// ----------------------- Deprecated -------------------------------

/**
 * Initial inBrain SDK configuration.
 * @param apiClientId The client ID provided in inBrain.ai dashboard
 * @param apiSecret The client secret provided in inBrain.ai dashboard
 * @param opts Additional optional options
 * @deprecated Please, use setInBrain fucntion instead
 */
const init = async (apiClientId: string, apiSecret: string, opts?: InitOptions): Promise<void> => {
    setInBrain(apiClientId, apiSecret, opts?.userId);
    InBrainSurveys.setSessionID(opts?.sessionUid);
    InBrainSurveys.setDataOptions(opts?.dataPoints);

    setTopBarsOptions(opts);

    return Promise.resolve();
};

/**
 * Set parameters related to session. Can be called each time before 'showSurveys' or 'showNativeSurvey' with new values
 * @param sessionUid the session identifiers
 * @param dataPoints datapoints
 * @deprecated Please, use setSessionID and setDataOptions instead
 */
const setSessionParameters = (sessionUid: string, dataPoints: DataPoints) => {
    InBrainSurveys.setSessionID(sessionUid);
    InBrainSurveys.setDataOptions(dataPoints);
};

// ------ Callbacks -----

/**
 * Set the listener when the webview is dismissed
 * @param callback callback to execute
 * @deprecated Please, use setOnSurveysCloseLister instead
 */
const setOnCloseListener = (
    callback: () => void
  ): EmitterSubscription => {
    return inbrainEmitter.addListener('OnClose', callback);
}

/**
 * Set the listener when the webview is dismissed from within the webview
 * @param callback callback to execute
 * @deprecated
 */
const setOnCloseListenerFromPage = (
    callback: () => void
  ): EmitterSubscription => {
    return inbrainEmitter.addListener('OnCloseFromPage', callback);
}
// ----------------------- Private -------------------------------

/**
 * Validation for apiClientId and apiSecret.
 */
const validateClientData = (apiClientId: string, apiSecret: string) => {
    assertNotNullNorEmpty("apiClientId", apiClientId);
    assertNotNullNorEmpty("apiSecret", apiSecret);
};

/**
 * Set setOptions. call be call to set styling options
 * @param options The styling options
 */
const setTopBarsOptions = (options?: StylingOptions) => {
    if (!options) { return }

   if (options.navigationBar || options.title) {
     let config: NavigationBarConfig = { title: options.title, backgroundColor: options.navigationBar?.backgroundColor,
                                         buttonsColor: options.navigationBar?.buttonsColor, titleColor: options.navigationBar?.titleColor,
                                         hasShadow: options.navigationBar?.hasShadow };
     setNavigationBarConfig(config);
   }

   let config: StatusBarConfig  = { lightStatusBar:options.statusBar?.lightStatusBar,
                                    statusBarColor: options.navigationBar?.backgroundColor };
   setStatusBarConfig(config);
};


export default {
    setInBrain,
    setUserID,
    setSessionID,
    setDataOptions,
    setStatusBarConfig,
    setNavigationBarConfig,
    setOnSurveysCloseLister,

    checkSurveysAvailable,
    showSurveys,
    getNativeSurveys,
    showNativeSurvey,
    getCurrencySale,

    getRewards,
    confirmRewards,

    init,
    setSessionParameters,
    setOnCloseListener,
    setOnCloseListenerFromPage,
};
