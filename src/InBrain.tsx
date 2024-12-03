import {
  Platform,
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';

import { assertIsColor, assertNotNullNorEmpty, wrapPromise } from './Utils';
import { mapRewards, mapSurveys } from './MappingUtils';
import { DataPoints, StatusBarConfig, NavigationBarConfig } from './Options';
import {
  InBrainReward,
  InBrainNativeSurvey,
  InBrainSurveyFilter,
  OnCloseSurveysData,
  InBrainCurrencySale,
  InBrainWallOption,
} from './Models';

const { InBrainSurveys } = NativeModules;

const inbrainEmitter = new NativeEventEmitter(InBrainSurveys);
// ----------------------- Setup InBrain -------------------------------

/**
 * Initial inBrain SDK configuration.
 * @param apiClientId The client ID provided in inBrain.ai dashboard
 * @param apiSecret The client secret provided in inBrain.ai dashboard
 * @param userId: The string value that uniquely identifies each user within your application. Can be provided later, using `setUserID` method
 */
const setInBrain = (
  apiClientId: string,
  apiSecret: string,
  userId?: string
) => {
  validateClientData(apiClientId, apiSecret);
  InBrainSurveys.setInBrain(apiClientId, apiSecret);
  InBrainSurveys.setUserID(userId);
};

/**
 *  Set uniq identifier of user within your application. If value not set (or empty) - `deviceId` will be used
 *  @param userID The string value that uniquely identifies each user within your application
 */
const setUserID = (userID: string | undefined) =>
  InBrainSurveys.setUserID(userID);

/**
 * Set the value to track user session. This value is provided via S2S Callbacks as SessionId.
 * @param sessionId Session identifier
 */
const setSessionID = (sessionId: string) =>
  InBrainSurveys.setSessionID(sessionId);

/**
 * Provide information about the user
 * @param dataPoints User information
 */
const setDataOptions = (dataPoints: DataPoints) =>
  InBrainSurveys.setDataOptions(dataPoints);

/**
 * Customize Status Bar to match your application style
 * @param config Status Bar configuration
 */
const setStatusBarConfig = (config: StatusBarConfig) => {
  if (Platform.OS == 'ios') {
    InBrainSurveys.setStatusBarLight(config.lightStatusBar ?? true);
  } else {
    config.statusBarColor && assertIsColor(config.statusBarColor);
    InBrainSurveys.setStatusBarConfig(
      config.lightStatusBar ?? false,
      config.statusBarColor
    );
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

  InBrainSurveys.setNavigationBarConfig(
    config.backgroundColor,
    config.buttonsColor,
    config.titleColor,
    config.title,
    config.hasShadow ?? false
  );
};

/**
 * Set the listener when the webview is dismissed or webview is dismissed from within the webview
 * @param callback Callback to execute
 */
const setOnSurveysCloseLister = (
  callback: (result: OnCloseSurveysData) => void
): EmitterSubscription => {
  return inbrainEmitter.addListener('OnSurveysClose', (data: any) => {
    if (data?.rewards) {
      data.rewards = mapRewards(data?.rewards);
    }
    callback(data);
  });
};

/**
 * Check if surveys are available to show
 */
const checkSurveysAvailable = () =>
  wrapPromise<boolean>(() => InBrainSurveys.checkSurveysAvailable());

/**
 * Opens the InBrain survey wall
 * @param option Indicates which feature is available at the dashboard: Surveys, Offers, or both
 */
const openWall = (option: InBrainWallOption = InBrainWallOption.all) =>
  wrapPromise<void>(() => InBrainSurveys.openWall(option));

/**
 * Get Native Surveys
 * @param filter an optional parameter
 */
const getNativeSurveys = (filter?: InBrainSurveyFilter) =>
  wrapPromise<InBrainNativeSurvey[]>(() => {
    return InBrainSurveys.getNativeSurveys(
      filter?.placementId,
      filter?.categoryIds,
      filter?.excludedCategoryIds
    ).then((surveys: Array<[string: any]>) => {
      return mapSurveys(surveys);
    });
  });

/**
 * Show a specific Native Survey. All the configs should be done `BEFORE` calling `showNativeSurvey()`.
 * @param id the survey's identifier
 * @param searchId a mandatory identifier
 * @param offersEnabled Specifies whether to enable Offers feature at the dashboard or not
 */
const showNativeSurvey = (
  id: string,
  searchId: string,
  offersEnabled: boolean = true
) =>
  wrapPromise<void>(() =>
    InBrainSurveys.showNativeSurvey(id, searchId, offersEnabled)
  );

/**
 * Get the rewards
 */
const getRewards = () =>
  wrapPromise<InBrainReward[]>(() => InBrainSurveys.getRewards());

/**
 * Manually confirm a list of rewards
 * @param rewards The rewards to confirm
 */
const confirmRewards = (rewards: InBrainReward[]) =>
  wrapPromise<void>(() => InBrainSurveys.confirmRewards(rewards));

/**
 * Get Currency Sale
 */
const getCurrencySale = () =>
  wrapPromise<InBrainCurrencySale>(() => InBrainSurveys.getCurrencySale());

// ----------------------- Deprecated -------------------------------
/**
 * @deprecated Use openWall() instead
 */
const showSurveys = () =>
  wrapPromise<void>(() => openWall(InBrainWallOption.all));

// ----------------------- Unsupported -------------------------------

/**
 * @unsupported Please, use setInBrain fucntion instead
 */
const init = () => {};

/**
 * @unsupported Please, use setSessionID and setDataOptions instead
 */
const setSessionParameters = () => {};

// ------ Callbacks -----

/**
 * @unsupported Please, use setOnSurveysCloseLister instead
 */
const setOnCloseListener = () => {};

/**
 * @unsupported Please, use setOnSurveysCloseLister instead
 */
const setOnCloseListenerFromPage = () => {};

// ----------------------- Private -------------------------------

/**
 * Validation for apiClientId and apiSecret.
 */
const validateClientData = (apiClientId: string, apiSecret: string) => {
  assertNotNullNorEmpty("apiClientId", apiClientId);
  assertNotNullNorEmpty("apiSecret", apiSecret);
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
  openWall,
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
