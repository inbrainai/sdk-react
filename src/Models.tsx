/**
 * Native Surveys interface
 */
export type InBrainNativeSurvey = {
    id: string;
    searchId: string;
    rank: number;
    time: number;
    value: number;
    currencySale: boolean;
    multiplier: number;
    namedCategories?: Category[];
    isProfilerSurvey: boolean;
    /**
     * All the possible cases are listed at `ConversionLevel` declaration
     */
    conversionLevel: ConversionLevel;
}

/**
 * Native Survey's Category interface
 */
export type Category = {
    id: number;
    name: string
}

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
 * ConversionLevel interface
 *
 *  Possible cases are:
 *  0 = New Survey;
 *  1 = Very Poor Conversion;
 *  2 = Poor Conversion;
 *  3 = Fair Conversion
 *  4 = Good Conversion;
 *  5 = Very Good Conversion;
 *  6 = Excellent Conversion
 *
 */
export type ConversionLevel = {
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
 * Data returned with OnSurveysClose event
 */
export type OnCloseSurveysData = {
    byWebView: boolean,
    /**
     * At the moment only first Native Survey reward is delivered.
     * That means if the user complete a Native Survey, proceed to Survey Wall and complete one more survey -
     * only first reward will be delivered. In case of Survey Wall usage only - no rewards will be delivered.
     */
    rewards?: InBrainSurveyReward[],
};

/**
 * Survey Outcome Type
 *
 *  Possible cases are:
 *  0 = Completed;
 *  1 = Terminated;
 *
 */
export type SurveyOutcomeType = {
    id: number;
    name: string
}

/**
 * Survey reward interface
 */
export type InBrainSurveyReward = {
    surveyId: string,
    userReward: number,
    outcomeType: SurveyOutcomeType,
    placementId?: string,
    categories?: Category[],
}

/**
 * Survey Currency Sale interface
 */
export type InBrainCurrencySale = {
    title: string,
    multiplier: number,
    startOn: Date,
    endOn: Date,
}

/**
 * @unsupported Please, use InBrainNativeSurvey instead
 */
export type InBrainNativeSurveys = {}

/**
 * @unsupported The type is not supported anymore
 */
export type ProfileMatch = {};

/**
 * @unsupported The type is not supported anymore
 */
export const ProfileMatchNames = {};