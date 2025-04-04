import {createContext, useContext} from 'react';
import {EmitterSubscription} from 'react-native';
import {
  InBrainReward,
  InBrainSurveyFilter,
  DataPoints,
  StatusBarConfig,
  NavigationBarConfig,
  OnCloseSurveysData,
  InBrainNativeSurvey,
  InBrainWallOption,
} from 'inbrain-surveys';

type InbrainContextType = {
  setInBrain: (
    apiClientId: string,
    apiSecret: string,
    userId?: string | undefined,
  ) => void;
  setUserID: (userID: string | undefined) => any;
  setSessionID: (sessionId: string) => any;
  setDataOptions: (dataPoints: DataPoints) => any;
  setStatusBarConfig: (config: StatusBarConfig) => void;
  setNavigationBarConfig: (config: NavigationBarConfig) => void;
  setOnSurveysCloseLister: (
    callback: (eventData: OnCloseSurveysData) => void,
  ) => EmitterSubscription;
  checkSurveysAvailable: () => Promise<boolean>;
  getNativeSurveys: (
    filter?: InBrainSurveyFilter | undefined,
  ) => Promise<InBrainNativeSurvey[]>;
  showNativeSurvey: (
    id: string,
    searchId: string,
    offersEnabled?: boolean,
  ) => Promise<void>;
  getRewards: () => Promise<InBrainReward[]>;
  confirmRewards: (rewards: InBrainReward[]) => Promise<void>;
  setSessionParameters: (sessionUid: string, dataPoints: DataPoints) => void;
  setOnCloseListener: (callback: () => void) => void;
  setOnCloseListenerFromPage: (callback: () => void) => void;
  openWall: (option?: InBrainWallOption) => Promise<void>;
};

export const InbrainContext = createContext<InbrainContextType | null>(null);

export const useInbrain = () => {
  const inbrainContext = useContext(InbrainContext);
  if (inbrainContext === undefined) {
    throw new Error('useInbrain must be used within a InbrainContext.Provider');
  }
  return inbrainContext;
};
