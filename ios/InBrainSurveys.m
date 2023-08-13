#import "InBrainSurveys.h"
#import <InBrainSurveys/InBrainSurveys.h>
#import <React/RCTConvert.h>
@implementation InBrainSurveys {
    bool hasListeners;
}
// ***********************************
// ***** UTILS methods *****
// ***********************************
- (instancetype)init
{
    self = [super init];
    self.inbrain = [InBrain shared];
    [self.inbrain setInBrainDelegate:self];
    return self;
}

- (NSString *)surveyConversionTitle:(SurveyConversionLevel) SurveyConversion {
    switch (SurveyConversion) {
        case SurveyConversionLevelNewSurvey:
            return @"New Survey";
        case SurveyConversionLevelVeryPoorConversion:
            return @"Very Poor Conversion";
        case SurveyConversionLevelPoorConversion:
            return @"Poor Conversion";
        case SurveyConversionLevelFairConversion:
            return @"Fair Conversion";
        case SurveyConversionLevelGoodConversion:
            return @"Good Conversion";
        case SurveyConversionLevelVeryGoodConversion:
            return @"Very Good Conversion";
        case SurveyConversionLevelExcellentConversion:
            return @"Excellent Conversion";
    }
    return @"Unknown";
}


- (NSString *)categoryTitle:(InBrainSurveyCategory) category {
    switch (category) {
        case InBrainSurveyCategoryAutomotive:
            return @"Automotive";
        case InBrainSurveyCategoryBeveragesAlcoholic:
            return @"Beverages Alcoholic";
        case InBrainSurveyCategoryBeveragesNonAlcoholic:
            return @"Beverages Non Alcoholic";
        case InBrainSurveyCategoryBusiness:
            return @"Business";
        case InBrainSurveyCategoryChildrenAndParenting:
            return @"Children & Parenting";
        case InBrainSurveyCategoryCoalitionLoyaltyPrograms:
            return @"Coalition Loyalty Programs";
        case InBrainSurveyCategoryDestinationsAndTourism:
            return @"Destinations & Tourism";
        case InBrainSurveyCategoryEducation:
            return @"Education";
        case InBrainSurveyCategoryElectronicsComputerSoftware:
            return @"Electronics, Computer Software";
        case InBrainSurveyCategoryEntertainmentAndLeisure:
            return @"Entertainment And Leisure";
        case InBrainSurveyCategoryFinanceBankingInvestingAndInsurance:
            return @"Finance, Banking, Investing & Insurance";
        case InBrainSurveyCategoryFood:
            return @"Food";
        case InBrainSurveyCategoryGamblingLottery:
            return @"Gambling, Lottery";
        case InBrainSurveyCategoryGovernmentAndPolitics:
            return @"Government & Politics";
        case InBrainSurveyCategoryHealthCare:
            return @"HealthCare";
        case InBrainSurveyCategoryHome:
            return @"Home";
        case InBrainSurveyCategoryMediaAndPublishing:
            return @"Media & Publishing";
        case InBrainSurveyCategoryPersonalCare:
            return @"Personal Care";
        case InBrainSurveyCategoryRestaurants:
            return @"Restaurants";
        case InBrainSurveyCategorySensitiveExplicitContent:
            return @"Sensitive & Explicit Content";
        case InBrainSurveyCategorySmokingTobacco:
            return @"Smoking & Tobacco";
        case InBrainSurveyCategorySocialResearch:
            return @"Social Research";
        case InBrainSurveyCategorySportsRecreationFitness:
            return @"Sports Recreation Fitness";
        case InBrainSurveyCategoryTelecommunications:
            return @"Telecommunications";
        case InBrainSurveyCategoryTransportation:
            return @"Transportation";
        case InBrainSurveyCategoryTravelAirlines:
            return @"Travel - Airlines";
        case InBrainSurveyCategoryTravelHotels:
            return @"Travel - Hotels";
        case InBrainSurveyCategoryTravelServicesAgencyBooking:
            return @"Travel - Services, Agency, Booking";
        case InBrainSurveyCategoryCreditCards:
            return @"Credit Cards";
        case InBrainSurveyCategoryVideoGames:
            return @"Video Games";
        case InBrainSurveyCategoryFashionAndClothingOther:
            return @"Fashion & Clothing - Other";
        case InBrainSurveyCategoryFashionAndClothingDepartmentStore:
            return @"Fashion & Clothing - Department Store";
    }
    return @"Unknown";
}

- (NSString *)outcomeTypeTitle:(SurveyOutcomeType) OutcomeType {
    switch (OutcomeType) {
        case SurveyOutcomeTypeCompleted:
            return @"Completed";
        case SurveyOutcomeTypeTerminated:
            return @"Terminated";
    }
    return @"Unknown";
}

// *********************************
// ***** RN BRIDGE methods  ********
// *********************************

RCT_EXPORT_MODULE()
+ (BOOL)requiresMainQueueSetup
{
    return NO;  // only do this if your module initialization relies on calling UIKit!
}

// ***********************
// ***** SET INBRAIN *****
// ***********************
RCT_EXPORT_METHOD(setInBrain:(NSString *)apiClientId apiSecret:(nonnull NSString *)apiSecret)
{
    [self.inbrain setInBrainWithApiClientID:apiClientId apiSecret:apiSecret isS2S:true];
}

// ***********************
// ***** SET USER ID *****
// ***********************
RCT_EXPORT_METHOD(setUserID:(NSString *)userId)
{
   [self.inbrain setWithUserID: userId];
}

// **********************************
// ***** SET INBRAIN SESSION ID *****
// **********************************
RCT_EXPORT_METHOD(setSessionID:(NSString *)sessionId)
{
    [self.inbrain setSessionID:sessionId];
}

// **********************************
// ***** SET INBRAIN DATA POINTS *****
// **********************************
RCT_EXPORT_METHOD(setDataOptions:(NSDictionary *)data)
{
    // Convert map to array of single entry maps
    // e.g {age: 25, gender: male} will become [{age: 25}, {gender: male}]
    NSArray* keys=[data allKeys];
    NSMutableArray *mapped = [NSMutableArray arrayWithCapacity:[keys count]];

    [keys enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
        [mapped addObject:@{ obj : [data objectForKey:obj]}];
    }];

    [self.inbrain setDataOptions: mapped];
}

// ************************
// ***** SHOW SURVEYS *****
// ************************
RCT_EXPORT_METHOD(showSurveys:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{

    // This requires the main thread
    dispatch_async(dispatch_get_main_queue(), ^{

        @try {
            [self.inbrain showSurveysFrom:NULL];
            resolve(nil);
        }
        @catch (NSException *error) {
            reject(@"ERR_SHOW_SURVEYS", error.description, nil);
        }
    });

}

// ************************
// ***** GET REWARDS ******
// ************************
RCT_EXPORT_METHOD(getRewards:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        [[InBrain shared] getRewardsWithSuccess:^(NSArray<InBrainReward *> * rewards){
            NSMutableArray *rewardList = [NSMutableArray array];
            // The mapping is necessary. Resolving the promise directly with 'rewards' array doesn't work
            // The result on the RN side is an array with null elements...
            for(int i = 0; i < rewards.count; i++) {
                NSObject* o = @{ @"transactionId": [NSNumber numberWithLong:rewards[i].transactionId],
                                 @"currency": rewards[i].currency, @"amount": [NSNumber numberWithDouble:rewards[i].amount],
                                 @"transactionType": [NSNumber numberWithFloat:rewards[i].transactionType]};

                [rewardList addObject:o];
            }
            resolve(rewardList);
        } failed:^(NSError * error){
            reject(@"ERR_GET_REWARDS", error.localizedDescription, error);
        }];
    }
    @catch (NSException *error) {
        reject(@"ERR_GET_REWARDS", error.description, nil);
    }

}

// ***********************************
// ***** CHECK SURVEYS AVAILABLE *****
// ***********************************
RCT_EXPORT_METHOD(checkSurveysAvailable:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{

    @try{
        [[InBrain shared] checkForAvailableSurveysWithCompletion:^(BOOL available, NSError * error) {
            if(error) reject(@"ERR_CHECK_SURVEYS_AVAILABLE", error.localizedDescription, nil);
            else resolve(@(available));
        }];
    }
    @catch (NSException *error) {
        reject(@"ERR_CHECK_SURVEYS_AVAILABLE", error.description, nil);
    }
}

// *******************************
// ***** GET NATIVE SURVEYS ******
// *******************************
RCT_EXPORT_METHOD(getNativeSurveys:(NSString * _Nullable)placementId categoryIDs:(NSArray* __nullable) categoryIDs
                  excludedCategoryIDs:(NSArray* __nullable) excludedCategoryIDs
                  resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        InBrainSurveyFilter *filterObj = [[InBrainSurveyFilter alloc] initWithPlacementId:placementId categoryIDs:categoryIDs excludedCategoryIDs:excludedCategoryIDs];

        [[InBrain shared] getNativeSurveysWithFilter:filterObj success:^  (NSArray<InBrainNativeSurvey *> * surveys) {
            NSMutableArray *surveyList = [NSMutableArray array];

            // The mapping is necessary. Resolving the promise directly with 'surveys' array doesn't work
            // The result on the RN side is an array with null elements...
            for(int i = 0; i < surveys.count; i++) {
                InBrainNativeSurvey *survey = surveys[i];
                NSArray *categories = [self mapCategories: survey.categoryIds];
                NSString *conversionTitle = [self surveyConversionTitle: survey.conversionLevel];
                NSObject *conversionLevel = @{ @"id": [NSNumber numberWithLong: survey.conversionLevel],
                                               @"name": conversionTitle};

                NSObject* o = @{ @"id": survey.id, @"searchId": survey.searchId,
                                 @"rank": [NSNumber numberWithLong:survey.rank],
                                 @"time": [NSNumber numberWithLong:survey.time],
                                 @"value": [NSNumber numberWithDouble:survey.value],
                                 @"currencySale": [NSNumber numberWithBool:survey.currencySale],
                                 @"multiplier": [NSNumber numberWithDouble:survey.multiplier],
                                 @"categories": survey.categoryIds == nil ? [NSNull null] : survey.categoryIds,
                                 @"conversionLevel": conversionLevel,
                                 @"namedCategories": categories == nil ? [NSNull null] : categories
                };
                [surveyList addObject:o];
            }

            resolve(surveyList);
        } failed:^(NSError * failed){
            reject(@"ERR_GET_NATIVE_SURVEYS", failed.localizedDescription, failed);
        }];

    }
    @catch (NSException *error) {
        reject(@"ERR_GET_NATIVE_SURVEYS", error.description, nil);
    }
}

// *******************************
// ***** SHOW NATIVE SURVEY ******
// *******************************
RCT_EXPORT_METHOD(showNativeSurvey:(NSString*)id  searchId:(NSString*)searchId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        // This requires the main thread
        dispatch_async(dispatch_get_main_queue(), ^{
            [[InBrain shared] showNativeSurveyWithId:id searchId:searchId from:NULL];
            resolve(@true);
        });
    }
    @catch (NSException *error) {
        reject(@"ERR_SHOW_NATIVE_SURVEY", error.description, nil);
    }
}

// ***************************
// ***** CONFIRM REWARDS *****
// ***************************
RCT_EXPORT_METHOD(confirmRewards:(NSArray *)rewards resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{

    @try{
        // Mapping to list of ids and forwarding to SDK
        NSArray* ids = [rewards valueForKey:@"transactionId"];
        [[InBrain shared] confirmRewardsWithTxIdArray:ids];

        // Resolve the promise
        resolve(@true);
    }
    @catch (NSException *error) {
        reject(@"ERR_CONFIRM_REWARDS", error.description, nil);
    }
}

// **************************
// ***** SET VIEW TITLE *****
// **************************
RCT_EXPORT_METHOD(setTitle:(NSString *)title resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try{
        // Forwarding to SDK
        [[InBrain shared] setNavigationBarTitle:title];

        // Resolve the promise
        resolve(@true);
    }
    @catch (NSException *error) {
        reject(@"ERR_SET_TITLE", error.description, nil);
    }
}

// *************************************
// ***** SET NAVIGATION BAR CONFIG *****
// *************************************
RCT_EXPORT_METHOD(setNavigationBarConfig:(NSString * _Nullable)backgroundHex
                  buttonsHex:(NSString * _Nullable)buttonsHex
                  titleHex:(NSString * _Nullable)titleHex
                  title:(NSString * _Nullable)title
                  hasShadow:(BOOL)hasShadow) {
   [[InBrain shared] setNavigationBarTitle: title];

    UIColor* backgroundColor = [self colorWithHexString:backgroundHex];
    UIColor* buttonsColor = [self colorWithHexString:buttonsHex];
    UIColor* titleColor = [self colorWithHexString:titleHex];

    InBrainNavBarConfig* config = [[InBrainNavBarConfig alloc]
                                   initWithBackgroundColor: backgroundColor
                                   buttonsColor:buttonsColor titleColor:titleColor
                                   isTranslucent:false hasShadow: hasShadow];

    [[InBrain shared] setNavigationBarConfig:config];
}

// *********************************
// ***** SET STATUS BAR CONFIG *****
// *********************************
RCT_EXPORT_METHOD(setStatusBarLight:(BOOL)lightStatusBar) {

        UIStatusBarStyle style = 1;
        if(!lightStatusBar) {
            if(@available(iOS 13, *))
                style = 3; // UIStatusBarStyleDarkContent
            else
                style = 0; // UIStatusBarStyleDefault
        }

        InBrainStatusBarConfig* config = [[InBrainStatusBarConfig alloc]
                                          initWithStatusBarStyle:style hideStatusBar: false];
        [[InBrain shared] setStatusBarConfig:config];
}

// ***********************
// ***** SET LANGUAGE ****

// ***********************
RCT_EXPORT_METHOD(setLanguage:(NSString *)language resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try{

        // Forwarding to SDK
        NSError *error = nil;
        [[InBrain shared] setLanguage:language error:&error];
        if (error != nil) {
            reject(@"ERR_SET_LANGUAGE", error.description, nil);
        }

        // Resolve the promise
        resolve(@true);

    }
    @catch (NSException *error) {
        reject(@"ERR_SET_LANGUAGE", error.description, nil);
    }
}


// ********************
// ***** LISTENERS ****
// ********************

- (void)startObserving {
  hasListeners = YES;
}

- (void)stopObserving {
  hasListeners = NO;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"OnClose", @"OnCloseFromPage", @"OnSurveysClose"];
}

- (void)surveysClosedByWebView:(BOOL)byWebView completedSurvey:(BOOL)completedSurvey rewards:(NSArray<InBrainSurveyReward *> * _Nullable)rewards {
    
    if (!hasListeners) { 
        return;
    }
    
    NSMutableArray *rewardList = [NSMutableArray array];

    if([rewards count] == 0) {
        [self sendEventWithName:@"OnSurveysClose" body:@{@"byWebView": [NSNumber numberWithBool:byWebView]}];
        return;
    }

    for(int i = 0; i < rewards.count; i++) {
        InBrainSurveyReward *reward = rewards[i];
        NSArray *categories = [self mapCategories: reward.categoryIds];
        NSString *outcomeTitle = [self outcomeTypeTitle:reward.outcomeType];
        NSObject *outcomeType = @{ @"id": [NSNumber numberWithLong: reward.outcomeType],
                                   @"name": outcomeTitle};

        NSObject* rewardObject = @{ @"surveyId": reward.surveyId,
                                    @"placementId": reward.placementId == nil ? [NSNull null] : reward.placementId,
                                    @"outcomeType": outcomeType,
                                    @"categories": categories == nil ? [NSNull null] : categories,
                                    @"userReward": [NSNumber numberWithFloat:reward.userReward] };

        [rewardList addObject:rewardObject];
    }

    [self sendEventWithName:@"OnSurveysClose" body:@{@"byWebView": [NSNumber numberWithBool:byWebView], @"rewards": rewardList}];
}

// ***************************
// ***** UTILITY METHODS *****
// ***************************

/**
 * Convert from a hexadecimal color string to UIColor
 */
- (UIColor *)colorWithHexString:(NSString *)stringToConvert
{
    NSString *noHashString = [stringToConvert stringByReplacingOccurrencesOfString:@"#" withString:@""]; // remove the #
    NSScanner *scanner = [NSScanner scannerWithString:noHashString];
    [scanner setCharactersToBeSkipped:[NSCharacterSet symbolCharacterSet]]; // remove + and $

    unsigned hex;
    if (![scanner scanHexInt:&hex]) return nil;
    int r = (hex >> 16) & 0xFF;
    int g = (hex >> 8) & 0xFF;
    int b = (hex) & 0xFF;

    return [UIColor colorWithRed:r / 255.0f green:g / 255.0f blue:b / 255.0f alpha:1.0f];
}

- (void) notNull:(NSString* )name toCheck:(id)toCheck {
    if( !toCheck ){
        [NSException raise:@"Invalid parameter value" format:@"%@ must not be null", name];
    }
}

- (NSArray * _Nullable)mapCategories:(NSArray *) categories {
    if ([categories count] == 0) { return nil; }

    NSMutableArray *mapedCategories = [NSMutableArray array];
    for(int y = 0; y < categories.count; y++) {
        int categoryId = [categories[y] intValue];
        NSString *title = [self categoryTitle: categoryId];
        NSObject* o = @{@"id": categories[y], @"name": title};
        [mapedCategories addObject:o];
    }
    return mapedCategories;
}

@end
