import { NativeModules, NativeEventEmitter } from 'react-native';
import { assertIsColor } from './Utils';
import { enhanceError } from './Errors';
import { InitOptions, InitOptionName } from './Options';

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

/*
 * Init the SDK.
 * @param clientId The client ID obtained from your account manager
 * @param clientSecret The client secret obtained from your account manager.
 * @param sessionId [Optional] The session id obtained from your account manager.
 */
const init = async (clientId: string, clientSecret: string, options: InitOptions): Promise<void> => {

    // Null safe options
    options = options || {};

    // set defaults
    options.title = options.title || 'inBrain Surveys'
    if(options.production == null || options.production == undefined){
        options.production = true
    }
 
    // Call all options bridge methodes
    await callOptionSetters(options)

    // return promise for init
    return wrapPromise(InBrainSurveys.init(clientId, clientSecret));
}

const callOptionSetters = (options: InitOptions) => {
    options = options || {};

    const optionPromises =  Object.keys(options)
        // From the options, extract the appropriate methodhandler, and the parameterof this method
        .map( (opt: InitOptionName) => ({ method: optionsActions[opt], param: options[opt] }) )
        // Then just call the method against the parameter
        .map(pair => pair.method(pair.param));
        
    // Return all promises
    return wrapPromise(Promise.all(optionPromises));
}

/**
 * Show the surveys webview
 */
const showSurveys = () => wrapPromise<void>(InBrainSurveys.showSurveys())

/**
 * Get the rewards
 */
const getRewards = () => wrapPromise<InBrainReward[]>(InBrainSurveys.getRewards())

/**
 * Manual confirm a list of rewards
 * @param rewards The rewards to confirm
 */
const confirmRewards = (rewards: InBrainReward[]) => wrapPromise<void>(InBrainSurveys.confirmRewards(rewards))

/**
 * Set the webview navbar color
 * @param color hexadecimal string color (e.g #ff0000)
 */
const setNavbarColor = async (color: string): Promise<void> => {
    assertIsColor(color);
    return InBrainSurveys.setNavbarColor(color);
}

/**
 * Set the webview button color
 * @param color hexadecimal string color (e.g #ff0000)
 */
//const setButtonColor = (color: string): Promise<void> => {
//    return InBrainSurveys.setButtonColor(color);
//}

var onClose : () => void = () => {};
inbrainEmitter.addListener('OnClose',() => onClose && onClose());

var onCloseFromPage : () => void = () => {};
inbrainEmitter.addListener('OnCloseFromPage',() => onCloseFromPage && onCloseFromPage());

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

/**
 * Wrap a promise call to add common functionnalities
 * @param promise promise to call
 */
const wrapPromise = async <T extends {} | void>(promise: Promise<T>) => {
    try {
        return await promise
    } catch(err) {
        throw enhanceError(err)
    }
}

const optionsActions : { [key in InitOptionName] : (params: any) => Promise<any>} = {
    "production" : InBrainSurveys.setProduction,
    "userId" : InBrainSurveys.setAppUserId,
    "sessionUid" : InBrainSurveys.setSessionUid,
    "dataPoints" : InBrainSurveys.setDataPoints,
    "title" : InBrainSurveys.setTitle,
    "navbarColor" : setNavbarColor,
}

export default { 
    init, 
    showSurveys, 
    getRewards, 
    confirmRewards, 
    /* setButtonColor, */ 
    setOnCloseListener,
    setOnCloseListenerFromPage
};