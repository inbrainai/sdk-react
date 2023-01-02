/**
 * InBrainReward interface
 */
export type InBrainReward = {
    transactionId: number;
    amount: number;
    currency: string;
    transactionType: number;
}

/**
 * Native Surveys interface
 * @deprecated use InBrainNativeSurvey instead
 */
export type InBrainNativeSurveys = {
    id: string;
    searchId: string;
    rank: number;
    time: number;
    value: number;
    currencySale: boolean;
    multiplier: number;
    /**
     * All the possible cases are listed at `ConversionLevel` declaration
     */
    conversionLevel: ConversionLevel;

    /**
     * @deprecated not supported anymore. Use conversionLevel instead
     */
    profileMatch: ProfileMatch;

    /**
     * @deprecated use namedCategories instead
     */
    categories: number[],
}

/**
 * Native Surveys interface
 */
export type InBrainNativeSurvey = InBrainNativeSurveys

/**
 * ConversionLevel interface
 *
 *  Possible cases are:
 *  0 = New Survey;
 *  1 = Very Poor Conversion;
 *  2 = Poor Conversion;
 *  3 = Fair Conversion
 *  4 = Good Profile Match;
 *  5 = Very Good Conversion;
 *  6 = Excellent Conversion
 *
 */
export type ConversionLevel = {
    id: number;
    name: string
}

/**
 * Native Survey's Category interface
 */
export type Category = {
    id: number;
    name: string
}

/**
 * InBrainSurveyFilter
 */
 export type InBrainSurveyFilter = {
    placementId?:string,
    categoryIds?: number[],
    excludedCategoryIds?: number[],
}

/**
* InBrainSurveyCategory
*/
export const InBrainSurveyCategory = {
   Automotive:1,
   BeveragesAlcoholic:2,
   BeveragesNonAlcoholic:3,
   Business:4,
   ChildrenAndParenting:5,
   CoalitionLoyaltyPrograms:6,
   DestinationsAndTourism:7,
   Education:8,
   ElectronicsComputerSoftware:9,
   EntertainmentAndLeisure:10,
   FinanceBankingInvestingAndInsurance:11,
   Food:12,
   GamblingLottery:13,
   GovernmentAndPolitics:14,
   HealthCare:15,
   Home:16,
   MediaAndPublishing:17,
   PersonalCare:18,
   Restaurants:19,
   SensitiveExplicitContent:20,
   SmokingTobacco:21,
   SocialResearch:22,
   SportsRecreationFitness:23,
   Telecommunications:24,
   Transportation:25,
   TravelAirlines:26,
   TravelHotels:27,
   TravelServicesAgencyBooking:28,
   CreditCards:29,
   VideoGames:30,
   FashionAndClothingOther:31,
   FashionAndClothingDepartmentStore:32,
};

/**
 * @deprecated The type is not supported anymore
 */
export type ProfileMatch = {
    id: number;
    name: string
};

/**
 * @deprecated The type is not supported anymore
 */
export const ProfileMatchNames = {
    NewSurvey:0,
    PoorProfileMatch:1,
    FairProfileMatch:2,
    GoodProfileMatch:3,
    GreatProfileMatch:4,
    ExcellentProfileMatch:5,
};

/**
 * data returned with onClose event
 */
export type onCloseSurveysData = {
    byWebView: boolean,
    reward: InBrainSurveyReward[],
};

/**
 * outcome type
 */
export const SurveyOutcomeType = {
    completed:0,
    terminated:1,
};

/**
 * Survey reward interface
 */
export type InBrainSurveyReward = {
    surveyId: string,
    placementId?: string,
    categories?: number[],
    userReward: number,
    outcomeType: number,
}
