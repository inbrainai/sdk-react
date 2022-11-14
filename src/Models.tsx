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
 */
export type InBrainNativeSurveys = {
    id: string;
    searchId: string;
    rank: number;
    time: number;
    value: number;
    currencySale: boolean;
    multiplier: number;
}

/**
 * Reward filter interface
 */
 export type InBrainSurveyFilter = {

    placementId?:string,
    categoryIds?: number[],
    excludedCategoryIds?: number[],

}

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
