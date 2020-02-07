import { NativeModules } from 'react-native';

const { InBrainSurveys } = NativeModules;

/**
 * Reward interface
 */
export type Reward = {
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
const getRewards = (): Promise<Reward[]> =>   {
    return InBrainSurveys.getRewards();
}

/**
 * Manually confirm a list of rewards
 * @param rewards The rewards to confirm
 */
const confirmRewards = (rewards: Reward[]): Promise<void> =>  {
    return InBrainSurveys.confirmRewards(rewards);
}

export default { init, setAppUserId,  showSurveys, getRewards, confirmRewards };