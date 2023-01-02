import { NativeModules, NativeEventEmitter } from 'react-native';


import { assertIsColor, assertNotNullNorEmpty, PromiseSupplier, wrapPromise } from './Utils';
import { InitOptions, InitOptionName, StylingOptionName, DataPoints } from './Options';
import { InBrainReward, InBrainNativeSurvey, InBrainSurveyFilter, onCloseSurveysData } from './Models';

const { InBrainSurveys } = NativeModules;

const inbrainEmitter = new NativeEventEmitter(InBrainSurveys);

/**
 * Init the SDK.
 * @param apiClientId Provided in inBrain.ai dashboard
 * @param apiSecret Provided in inBrain.ai dashboard
 * @param opts Additional optional options
 */
const init = async (apiClientId: string, apiSecret: string, opts?: InitOptions): Promise<void> => {

    // Default and null-safe options
    var options = setDefaultOptions(opts);

    // Validate
    validateOptions(apiClientId, apiSecret, options);

    // Call all options bridge methods
    InBrainSurveys.setSessionID(options.sessionUid);
    InBrainSurveys.setDataOptions(options.dataPoints);

    // -- call all the other properties one by one (styling options)
    await callOptionSetters(options)

    // return promise for init
    return wrapPromise(() => InBrainSurveys.setInBrain(apiClientId, apiSecret, options.userId));
}

const setDefaultOptions = (options?: InitOptions) => {
    let internalOptions: any = options || {};

    // Defaults
    internalOptions.title = internalOptions.title || 'inBrain.ai Surveys'
    internalOptions.userId = internalOptions.userId || ''
    internalOptions.isS2S = internalOptions.isS2S || false

    // Ugly, but we have to populate the title in navigationBar as this is what Android uses (and not iOS)
    internalOptions.navigationBar = { ...internalOptions.navigationBar, title: internalOptions.title }
    // And we have to populate this, as it's not possible to only set the status bar color on iOS
    internalOptions.statusBar = { ...internalOptions.statusBar, statusBarColor: internalOptions.navigationBar?.backgroundColor }

    return internalOptions
}

const callOptionSetters = (options: InitOptions) => {

    // Generate the promise supplier
    let provider: PromiseSupplier<any> = () => {
        const optionPromises = Object.keys(options)
            // From the options, extract the appropriate methodhandler, and the parameterof this method
            .map((opt: InitOptionName) => ({ method: optionsActions[opt], param: options[opt] }))
            // Then just call the method against the parameter
            .map(pair => pair.method && pair.method(pair.param));

        return Promise.all(optionPromises);
    }

    // Return and call the promise
    return wrapPromise(provider);
}

/**
 * Show the surveys webview
 */
const showSurveys = () => wrapPromise<void>(() => InBrainSurveys.showSurveys())

/**
 * Set parameters related to session. Can be called each time before 'showSurveys' or 'showNativeSurvey' with new values
 * @param sessionUid the session identifiers
 * @param dataPoints datapoints
 * @deprecated Please, use setSessionID and setDataOptions instead
 */
const setSessionParameters = (sessionUid: string, dataPoints: DataPoints) => {
    InBrainSurveys.setSessionID(sessionUid);
    InBrainSurveys.setDataOptions(dataPoints);
}

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


var serveyClose: (eventData: onCloseSurveysData) => void = () => { };
inbrainEmitter.addListener('OnCloseServey', (eventData: onCloseSurveysData) => serveyClose && serveyClose(eventData));

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
const setSurveysCloseListener = (callback: (eventData: onCloseSurveysData) => void) => {
    serveyClose = callback;
};

/**
 * Set the listener when the webview is dismissed
 * @param callback callback to execute
 * @deprecated
 */
const setOnCloseListener = (callback: () => void) => {
    onClose = callback;
}

/**
 * Set the listener when the webview is dismissed from within the webview
 * @param callback callback to execute
 * @deprecated
 */
const setOnCloseListenerFromPage = (callback: () => void) => {
    onCloseFromPage = callback;
}

/**
 * Validation for options.
 * TODO: find any validation library
 */
const validateOptions = (apiClientId: string, apiSecret: string, options: InitOptions) => {

    assertNotNullNorEmpty("apiClientId", apiClientId)
    assertNotNullNorEmpty("apiSecret", apiSecret)

    options.navigationBar?.backgroundColor && assertIsColor(options.navigationBar?.backgroundColor)
    options.navigationBar?.buttonsColor && assertIsColor(options.navigationBar?.buttonsColor)
    options.navigationBar?.titleColor && assertIsColor(options.navigationBar?.titleColor)
}

/**
 * Map between <option name> and <corresponding SDK bridge method>
 */
const optionsActions: { [key in StylingOptionName]: ((params: any) => Promise<any>) | null } = {
    "title": InBrainSurveys.setTitle,
    "language": InBrainSurveys.setLanguage,
    "statusBar": InBrainSurveys.setStatusBarConfig,
    "navigationBar": InBrainSurveys.setNavigationBarConfig,
}

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
    setSurveysCloseListener,
};
