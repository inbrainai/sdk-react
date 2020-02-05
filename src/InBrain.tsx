import { NativeModules } from 'react-native';

const { InBrainSurveys } = NativeModules;

type Reward = {
    transactionId: string;
}

/*!
 * Init the SDK. 
 * @param clientId 
 * @param clientSecret 
 */
const init = (clientIdd: string, clientSecret: string): Promise<String> =>   {
    return InBrainSurveys.init(clientIdd, clientSecret);
}

/**
 * Set the app user identifier
 * @param userId 
 */
const setAppUserId = (userId: string): Promise<String> =>   {
    return InBrainSurveys.setAppUserId(userId);
}

/**
 * Show the surcveys
 */
const showSurveys = (): Promise<String> =>   {
    return InBrainSurveys.showSurveys();
}

/**
 * Get the rewards
 */
const getRewards = (): Promise<Reward[]> =>   {
    return InBrainSurveys.getRewards();
}

export default { init, setAppUserId,  showSurveys, getRewards };