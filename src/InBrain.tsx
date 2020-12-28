import { NativeModules, NativeEventEmitter } from 'react-native';
import { assertIsColor, wrapPromise } from './Utils';
import { InitOptions, InitOptionName, StylingOptionName } from './Options';

const { InBrainSurveys  } = NativeModules;

const inbrainEmitter = new NativeEventEmitter(InBrainSurveys);

/**
 * Reward interface
 */
export type InBrainReward = {
    transactionId: number;
    amount: number;
    currency: string;
    transactionType: number;
}

/**
 * Native Surveys interface
 */
export type InBrainNativeSurveys = {
    id: string;
    rank: number;
    time: number;
    value: number;
}

/*
 * Init the SDK.
 * @param apiClientId Provided in inBrain.ai dashboard
 * @param apiSecret Provided in inBrain.ai dashboard
 * @param options Additional optional options
 */
const init = async (apiClientId: string, apiSecret: string, options?: InitOptions): Promise<void> => {

    // Null safe options
    var safeOptions = options || {};

    // set defaults
    safeOptions.title = safeOptions.title || 'inBrain Surveys'
    safeOptions.userId = safeOptions.userId || ''
    safeOptions.isS2S = safeOptions.isS2S || false

    // Call all options bridge methodes

    // -- this method is apart as these two properties can't be set individually
    await wrapPromise(() => InBrainSurveys.setInBrainValuesFor(safeOptions.sessionUid, safeOptions.dataPoints));

    // -- call all the other properties one by one (styling options)
    await callOptionSetters(safeOptions)

    // return promise for init
    return wrapPromise(() => InBrainSurveys.setInBrain(apiClientId, apiSecret, safeOptions.isS2S, safeOptions.userId));
}

const callOptionSetters = (options: InitOptions) => {
    options = options || {};

    return wrapPromise(() => {

        const optionPromises =  Object.keys(options)
        // From the options, extract the appropriate methodhandler, and the parameterof this method
        .map( (opt: InitOptionName) => ({ method: optionsActions[opt], param: options[opt] }) )
        // Then just call the method against the parameter
        .map(pair => pair.method && pair.method(pair.param));
     
        return Promise.all(optionPromises)
    });
}

/**
 * Show the surveys webview
 */
const showSurveys = () => wrapPromise<void>(() => InBrainSurveys.showSurveys())

/**
 * Get the rewards
 */
const getRewards = () => wrapPromise<InBrainReward[]>(() => InBrainSurveys.getRewards())

/**
 * Manually confirm a list of rewards
 * @param rewards The rewards to confirm
 */
const confirmRewards = (rewards: InBrainReward[]) => wrapPromise<void>(() => InBrainSurveys.confirmRewards(rewards))

/**
 * Check if surveys are available to show
 */
const checkSurveysAvailable = () => wrapPromise<boolean>(() => InBrainSurveys.checkSurveysAvailable())

/**
 * Get Native Surveys
 */
const getNativeSurveys = () => wrapPromise<InBrainNativeSurveys[]>(() => InBrainSurveys.getNativeSurveys())

/**
 * Show a specific native survey
 * @param id the survey's identifier
 */
const showNativeSurvey = (id: string) => wrapPromise<void>(() => InBrainSurveys.showNativeSurvey(id))

/**
 * Set the webview navbar color
 * @param color hexadecimal string color (e.g #ff0000)
 */
const setNavbarColor = (color: string): Promise<void> => {
    assertIsColor(color);
    return InBrainSurveys.setNavbarColor(color);
}

var onClose : () => void = () => {};
inbrainEmitter.addListener('OnClose', () => onClose && onClose());

var onCloseFromPage : () => void = () => {};
inbrainEmitter.addListener('OnCloseFromPage', () => onCloseFromPage && onCloseFromPage());

/**
 * Set the listener when the webview is dismissed
 * @param callback callback to execute
 */
const setOnCloseListener = (callback: () => void) => {
    onClose = callback;
}

/**
 * Set the listener when the webview is dismissed from within the webview
 * @param callback callback to execute
 */
const setOnCloseListenerFromPage = (callback: () => void) => {
    onCloseFromPage = callback;
}

const optionsActions : { [key in StylingOptionName] : ((params: any) => Promise<any>) | null} = {
    "title" : InBrainSurveys.setTitle,
    "titleColor" : InBrainSurveys.setTitleColor,
    "language" : InBrainSurveys.setLanguage,
    "navbarColor" : setNavbarColor,
}

export default { 
    init, 
    showSurveys, 
    getRewards, 
    confirmRewards, 
    checkSurveysAvailable,
    getNativeSurveys,
    showNativeSurvey,
    setOnCloseListener,
    setOnCloseListenerFromPage
};