import { InBrainNativeSurvey, InBrainSurveyReward, Category } from './Models';

// Map Native Surveys //
export const mapSurveys = (nativeSurveys: Array<[string: any]>): InBrainNativeSurvey[] => {
    return nativeSurveys.map( (survey: any) => {
         if(survey.categories) {
            survey.namedCategories = mapCategories(survey.categories);
         } else {
            // Avoid crashes, as the property stated as mandatory
            survey.categories = [];
         }

         let conversionId = survey.conversionLevel;
         survey.conversionLevel = { id: conversionId, name: getConversionName(conversionId) };

         // The field is deprecated, however keeping it for the backward compatibility
         if (conversionId > 1) { conversionId -= 1 }
         survey.profileMatch = { id: conversionId, name: getProfileMatchName(conversionId) }
         return survey;
    });
};

// Map rewards from the onClose callback
export const mapRewards = (nativeRewards: any): InBrainSurveyReward[] => {
    return nativeRewards.map( (reward: any) => {
        if(reward.categories) {
            reward.categories = mapCategories(reward.categories);
        }

        const outcomeTypeId = reward.outcomeType;
        reward.outcomeType = { id: outcomeTypeId, name: getOutcomeTypeName(outcomeTypeId)};
        return reward;
    });
};

// Map categories for Native Surveys and for the rewards from onClose callback 
export const mapCategories = (categories: number[]): Category[] => {
    return categories.map( (categoryId) => {
        return { id: categoryId, name: getCategoryName(categoryId) };
    });
};

// Get survey's conversion name by it's id.
const getConversionName = (conversionId: number): string => {
        switch (conversionId) {
            case 0 :
                return "New Survey";
            case 1 :
                return "Very Poor Conversion";
            case 2 :
                return "Poor Conversion";
            case 3 :
                return "Fair Conversion";
            case 4 :
                return "Good Conversion";
            case 5 :
                return "Very Good Conversion";
            case 6 :
                return "Excellent Conversion";
            default:
                return "Unknown";
        }
};

// Get outcome type name by it's id
const getOutcomeTypeName = (outcomeTypeId: number): string => {
    switch (outcomeTypeId) {
        case 0 :
            return "Completed";
        case 1 :
            return "Terminated";
        default:
            return "Unknown";
    }
};

 // Get category name by it's id.
const getCategoryName = (categoryId: number): string => {
    switch (categoryId) {
        case 1 :
            return "Automotive";
        case 2 :
            return "Beverages Alcoholic";
        case 3 :
            return "Beverages Non Alcoholic";
        case 4 :
            return "Business";
        case 5 :
            return "Children & Parenting";
        case 6 :
            return "Coalition Loyalty Programs";
        case 7 :
            return "Destinations & Tourism";
        case 8 :
            return "Education";
        case 9 :
            return "Electronics, Computer Software";
        case 10 :
            return "Entertainment And Leisure";
        case 11 :
            return "Finance, Banking, Investing & Insurance";
        case 12 :
            return "Food";
        case 13 :
            return "Gambling, Lottery";
        case 14 :
            return "Government & Politics";
        case 15 :
            return "HealthCare";
        case 16 :
            return "Home";
        case 17 :
            return "Media & Publishing";
        case 18 :
            return "Personal Care";
        case 19 :
            return "Restaurants";
        case 20 :
            return "Sensitive & Explicit Content";
        case 21 :
            return "Smoking & Tobacco";
        case 22 :
            return "Social Research";
        case 23 :
            return "Sports Recreation Fitness";
        case 24 :
            return "Telecommunications";
        case 25 :
            return "Transportation";
        case 26 :
            return "Travel - Airlines";
        case 27 :
            return "Travel - Hotels";
        case 28 :
            return "Travel - Services, Agency, Booking";
        case 29 :
            return "Credit Cards";
        case 30 :
            return "Video Games";
        case 31 :
            return "Fashion & Clothing - Other";
        case 32 :
            return "Fashion & Clothing - Department Store";
        default:
            return "Unknown";
    
    }
};

// Get profile match name by it's id (deprecated and will be removed later).
const getProfileMatchName = (matchId: number): string => {
       switch (matchId) {
           case 0 :
               return "New Survey";
           case 1 :
               return "Poor Profile Match";
           case 2 :
               return "Fair Profile Match";
           case 3 :
               return "Good Profile Match";
           case 4 :
               return "Great Profile Match";
           case 5 :
               return "Excellent Profile Match";
           default:
               return "Unknown";
       }
};