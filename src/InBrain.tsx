import { NativeModules, NativeEventEmitter } from 'react-native';


import { assertIsColor, assertNotNullNorEmpty, wrapPromise } from './Utils';
import { InitOptions, InitOptionName, StylingOptionName, DataPoints, StylingOptions } from './Options';
import { InBrainReward, InBrainNativeSurvey, InBrainSurveyFilter, OnCloseSurveysData } from './Models';

const { InBrainSurveys } = NativeModules;

const inbrainEmitter = new NativeEventEmitter(InBrainSurveys);

/**
 * Init the SDK.
 * @param apiClientId Provided in inBrain.ai dashboard
 * @param apiSecret Provided in inBrain.ai dashboard
 * @param opts Additional optional options
 */
const init = async (apiClientId: string, apiSecret: string, opts?: InitOptions): Promise<void> => {
    validateClientData(apiClientId, apiSecret);

    InBrainSurveys.setSessionID(opts?.sessionUid);
    InBrainSurveys.setDataOptions(opts?.dataPoints);
    InBrainSurveys.setUserID(opts?.userId);

    if(opts) {
        setOptions(opts);
    }
    // return promise for init
    return wrapPromise(() => InBrainSurveys.setInBrain(apiClientId, apiSecret));
};

/**
 * call setters for styling options
 *  @param options a list of styling options
 */
const callOptionSetters = (options: InitOptions) => {
    Object.keys(options).map((opt: InitOptionName)=> {
        if(optionsActions[opt]) {
            optionsActions[opt](options[opt]);
        }
    });
};

/**
 * set userID
 *  @param userID the session identifiers
 */
const setUserID = (userID: string) => InBrainSurveys.setUserID(userID);

/**
 * Show the surveys webview
 */
const showSurveys = () => wrapPromise<void>(() => InBrainSurveys.showSurveys());

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

/**
 * Set setOptions. call be call to set styling options
 * @param options The styling options
 */
const setOptions = (options: StylingOptions) => {
    // Validate
    validateOptions(options);
    // -- call all the other properties one by one (styling options)
    callOptionSetters(options);
};

/**
 * Set setSessionID. Can be called each time before 'showSurveys' or 'showNativeSurvey' with new values
 * @param sessionId the session identifiers
 */
const setSessionID = (sessionId: string) => InBrainSurveys.setSessionID(sessionId);

/**
 * Set setDataOptions. Can be called each time before 'showSurveys' or 'showNativeSurvey' with new values
 * @param dataPoints The datapoints to be used
 */
const setDataOptions = (dataPoints: DataPoints) => InBrainSurveys.setDataOptions(dataPoints);

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
 * @param filter an optional parameter
 */
 const getNativeSurveys = (filter?: InBrainSurveyFilter) => wrapPromise<InBrainNativeSurvey[]>(() => InBrainSurveys.getNativeSurveys(filter?.placementId, filter?.categoryIds, filter?.excludedCategoryIds))


/**
 * Show a specific native survey
 * @param id the survey's identifier
 * @param searchId a mandatory identifier
 */
const showNativeSurvey = (id: string, searchId: string) => wrapPromise<void>(() => InBrainSurveys.showNativeSurvey(id, searchId))


var onSurveysClose: (eventData: OnCloseSurveysData) => void = () => { };
inbrainEmitter.addListener('OnSurveysClose', (eventData: OnCloseSurveysData) => onSurveysClose && onSurveysClose(eventData));

/**
 * @deprecated
 */
var onClose: () => void = () => { };
inbrainEmitter.addListener('OnClose', () => onClose && onClose());

/**
 * @deprecated
 */
var onCloseFromPage: () => void = () => { };
inbrainEmitter.addListener('OnCloseFromPage', () => onCloseFromPage && onCloseFromPage());


/**
 * Set the listener when the webview is dismissed or webview is dismissed from within the webview
 * @param callback callback to execute
 */
const setOnSurveysCloseLister = (callback: (eventData: OnCloseSurveysData) => void) => {
    onSurveysClose = callback;
};

/**
 * Set the listener when the webview is dismissed
 * @param callback callback to execute
 * @deprecated
 */
const setOnCloseListener = (callback: () => void) => {
    onClose = callback;
};

/**
 * Set the listener when the webview is dismissed from within the webview
 * @param callback callback to execute
 * @deprecated
 */
const setOnCloseListenerFromPage = (callback: () => void) => {
    onCloseFromPage = callback;
};

/**
 * Validation for apiClientId and apiSecret.
 */
const validateClientData = (apiClientId: string, apiSecret: string) => {
    assertNotNullNorEmpty("apiClientId", apiClientId);
    assertNotNullNorEmpty("apiSecret", apiSecret);
};

/**
 * Validation for options.
 */
const validateOptions = (options: StylingOptions) => {
    options.navigationBar?.backgroundColor && assertIsColor(options.navigationBar?.backgroundColor)
    options.navigationBar?.buttonsColor && assertIsColor(options.navigationBar?.buttonsColor)
    options.navigationBar?.titleColor && assertIsColor(options.navigationBar?.titleColor)
};

/**
 * Map between <option name> and <corresponding SDK bridge method>
 */
const optionsActions: { [key in StylingOptionName]: ((params: any) => Promise<any>) | null } = {
    "title": InBrainSurveys.setTitle,
    "language": InBrainSurveys.setLanguage,
    "statusBar": InBrainSurveys.setStatusBarConfig,
    "navigationBar": InBrainSurveys.setNavigationBarConfig,
};

export default {
    init,
    showSurveys,
    setSessionID,
    setDataOptions,
    setSessionParameters,
    getRewards,
    confirmRewards,
    checkSurveysAvailable,
    getNativeSurveys,
    showNativeSurvey,
    setOnCloseListener,
    setOnCloseListenerFromPage,
    setOnSurveysCloseLister,
    setUserID,
    setOptions,
};
