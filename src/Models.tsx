/**
 * Reward interface
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
     * Possible cases are:
     * 0 = New Survey;
     * 1 = Poor Profile Match;
     * 2 = Fair Profile Match;
     * 3 = Good Profile Match;
     * 4 = Great Profile Match;
     * 5 = Excellent Profile Match
     */
    profileMatch: ProfileMatch;
    namedCategories: Category[];

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
 * Native Surveys Category interface
 */
export type Category = {
    id: number;
    name: string
}

/**
 * Native profile match interface
 */
export type ProfileMatch = {
    id: number;
    name: string
}

/**
 * Reward filter interface
 */
 export type InBrainSurveyFilter = {
    placementId?:string,
    categoryIds?: number[],
    excludedCategoryIds?: number[],
}

/**
 * ProfileMatchNames
 * Possible cases are:
 * 0 = New Survey;
 * 1 = Poor Profile Match;
 * 2 = Fair Profile Match;
 * 3 = Good Profile Match;
 * 4 = Great Profile Match;
 * 5 = Excellent Profile Match
 */
export const ProfileMatchNames = {
    NewSurvey:0,
    PoorProfileMatch:1,
    FairProfileMatch:2,
    GoodProfileMatch:3,
    GreatProfileMatch:4,
    ExcellentProfileMatch:5,
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
}
