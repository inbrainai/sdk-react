import { NativeModules, Platform, NativeEventEmitter } from 'react-native';

const { InBrainSurveys } = NativeModules;

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
 */
const init = (clientId: string, clientSecret: string): Promise<void> =>   {
    return InBrainSurveys.init(clientId, clientSecret);
}

/**
 * Set the app user identifier
 * @param userId The unique identifier of the current user.
 */
const setAppUserId = (userId: string): Promise<void> =>   {
    return InBrainSurveys.setAppUserId(userId);
}

/**
 * Show the surveys webview
 */
const showSurveys = (): Promise<void> =>   {
    return InBrainSurveys.showSurveys();
}

/**
 * Get the rewards
 */
const getRewards = (): Promise<InBrainReward[]> =>   {
    return InBrainSurveys.getRewards();
}

/**
 * Manual confirm a list of rewards
 * @param rewards The rewards to confirm
 */
const confirmRewards = (rewards: InBrainReward[]): Promise<void> =>  {
    return InBrainSurveys.confirmRewards(rewards);
}

/**
 * Set the webview title
 * @param title the title to display
 */
const setTitle = (title: string): Promise<void> =>  {
    onlyIOS();
    return InBrainSurveys.setTitle(title);
}

/**
 * Set the webview navbar color
 * @param color hexadecimal string color (e.g #ff0000)
 */
const setNavbarColor = (color: string): Promise<void> =>  {
    onlyIOS();
    return InBrainSurveys.setNavbarColor(color);
}

/**
 * Set the webview button color
 * @param color hexadecimal string color (e.g #ff0000)
 */
const setButtonColor = (color: string): Promise<void> =>  {
    onlyIOS();
    return InBrainSurveys.setButtonColor(color);
}

const onlyIOS = () => {
    if(Platform.OS !== 'ios'){
        throw new Error("Not implemented for Android.");
    }
}

var onClose : () => void = () => {};
const subscription = inbrainEmitter.addListener(
  'OnClose',
  () => onClose && onClose()
);

/**
 * Set the listener when the webview is dismissed
 * @param callback callback to execute
 */
const setOnCloseListener = (callback: () => void) => {
    onClose = callback;
}


export default { init, setAppUserId,  showSurveys, getRewards, confirmRewards, setTitle, setNavbarColor, setButtonColor, setOnCloseListener };