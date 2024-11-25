#import "InBrainSurveys.h"
#import <InBrainSurveys/InBrainSurveys.h>
#import <React/RCTConvert.h>

@implementation InBrainSurveys {
    InBrain* _inbrain;
    bool hasListeners;
}
// ***********************************
// ***** UTILS methods *****
// ***********************************
- (instancetype)init
{
    self = [super init];
    _inbrain = [InBrain shared];
    [_inbrain setInBrainDelegate: self];
    return self;
}

// *********************************
// ***** RN BRIDGE methods  ********
// *********************************
RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return NO; 
}

// ***********************
// ***** SET INBRAIN *****
// ***********************
RCT_EXPORT_METHOD(setInBrain:(NSString *)apiClientId apiSecret:(nonnull NSString *)apiSecret) {
    [_inbrain setInBrainWithApiClientID:apiClientId apiSecret:apiSecret isS2S:true];
}

// ***********************
// ***** SET USER ID *****
// ***********************
RCT_EXPORT_METHOD(setUserID:(NSString *)userId) {
   [_inbrain setWithUserID: userId];
}

// **********************************
// ***** SET INBRAIN SESSION ID *****
// **********************************
RCT_EXPORT_METHOD(setSessionID:(NSString *)sessionId) {
    [_inbrain setSessionID:sessionId];
}

// **********************************
// ***** SET INBRAIN DATA POINTS *****
// **********************************
RCT_EXPORT_METHOD(setDataOptions:(NSDictionary *)data) {
    // Convert map to array of single entry maps
    // e.g {age: 25, gender: male} will become [{age: 25}, {gender: male}]
    NSArray* keys=[data allKeys];
    NSMutableArray *mapped = [NSMutableArray arrayWithCapacity:[keys count]];

    [keys enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
        [mapped addObject:@{ obj : [data objectForKey:obj]}];
    }];

    [_inbrain setDataOptions: mapped];
}

// ************************
// ***** SHOW SURVEYS *****
// ************************
RCT_EXPORT_METHOD(showSurveys:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    // This requires the main thread
    dispatch_async(dispatch_get_main_queue(), ^{
        [[InBrain shared] showSurveysFrom:NULL];
        resolve(nil);
    });
}

// ************************
// ***** GET REWARDS ******
// ************************
RCT_EXPORT_METHOD(getRewards:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [_inbrain getRewardsWithSuccess:^(NSArray<InBrainReward *> * rewards){
        NSMutableArray *rewardList = [NSMutableArray array];
        for(int i = 0; i < rewards.count; i++) {
            InBrainReward *reward = rewards[i];
            NSObject* o = @{ @"transactionId": [NSNumber numberWithLong:  reward.transactionId],
                                @"currency": reward.currency, @"amount": [NSNumber numberWithDouble: reward.amount],
                                @"transactionType": [NSNumber numberWithFloat: reward.transactionType]};

            [rewardList addObject:o];
        }
        resolve(rewardList);
    } failed:^(NSError * error){
        reject(@"ERR_GET_REWARDS", error.localizedDescription, error);
    }];
}

// ***********************************
// ***** CHECK SURVEYS AVAILABLE *****
// ***********************************
RCT_EXPORT_METHOD(checkSurveysAvailable:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [_inbrain checkForAvailableSurveysWithCompletion:^(BOOL available, NSError * error) {
        if(error) reject(@"ERR_CHECK_SURVEYS_AVAILABLE", error.localizedDescription, nil);
        else resolve(@(available));
    }];
}

// *******************************
// ***** GET NATIVE SURVEYS ******
// *******************************
RCT_EXPORT_METHOD(getNativeSurveys:(NSString * _Nullable)placementId categoryIDs:(NSArray* __nullable) categoryIDs
                  excludedCategoryIDs:(NSArray* __nullable) excludedCategoryIDs
                  resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    InBrainSurveyFilter *filterObj = [[InBrainSurveyFilter alloc] initWithPlacementId:placementId categoryIDs:categoryIDs excludedCategoryIDs:excludedCategoryIDs];

    [_inbrain getNativeSurveysWithFilter:filterObj success:^  (NSArray<InBrainNativeSurvey *> * surveys) {
        NSMutableArray *surveyList = [NSMutableArray array];

        // The mapping is necessary. Resolving the promise directly with 'surveys' array doesn't work
        // The result on the RN side is an array with null elements...
        for(int i = 0; i < surveys.count; i++) {
            InBrainNativeSurvey *survey = surveys[i];
            int conversionLevel = survey.conversionLevel;
            NSObject* o = @{ @"id": survey.id, @"searchId": survey.searchId,
                                @"rank": [NSNumber numberWithInt: survey.rank],
                                @"time": [NSNumber numberWithInt: survey.time],
                                @"value": [NSNumber numberWithDouble: survey.value],
                                @"currencySale": [NSNumber numberWithBool: survey.currencySale],
                                @"isProfilerSurvey": [NSNumber numberWithBool: survey.isProfilerSurvey],
                                @"multiplier": [NSNumber numberWithDouble: survey.multiplier],
                                @"conversionLevel": [NSNumber numberWithInt: conversionLevel],
                                @"categories": survey.categoryIds == nil ? [NSNull null] : survey.categoryIds };
            
            [surveyList addObject:o];
        }

        resolve(surveyList);
    } failed:^(NSError * failed){
        reject(@"ERR_GET_NATIVE_SURVEYS", failed.localizedDescription, failed);
    }];
}

// *******************************
// ***** OPEN WALL ******
// *******************************
RCT_EXPORT_METHOD(openWall:(NSInteger)option resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [_inbrain openWallWith:(InBrainWallOption)option from:nil];
        resolve(@true);
    });
}

// *******************************
// ***** SHOW NATIVE SURVEY ******
// *******************************
RCT_EXPORT_METHOD(showNativeSurvey:(NSString*)id searchId:(NSString*)searchId offersEnabled:(BOOL)offersEnabled resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [_inbrain showNativeSurveyWithId:id searchId:searchId offersEnabled:offersEnabled from:nil];
        resolve(@true);
    });
}

// ***************************
// ***** CONFIRM REWARDS *****
// ***************************
RCT_EXPORT_METHOD(confirmRewards:(NSArray *)rewards resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    NSArray* ids = [rewards valueForKey:@"transactionId"];
    [_inbrain confirmRewardsWithTxIdArray:ids];
    resolve(@true);
}

// **************************
// ***** SET VIEW TITLE *****
// **************************
RCT_EXPORT_METHOD(setTitle:(NSString *)title resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [_inbrain setNavigationBarTitle:title];
    resolve(@true);
}

// *************************************
// ***** SET NAVIGATION BAR CONFIG *****
// *************************************
RCT_EXPORT_METHOD(setNavigationBarConfig:(NSString * _Nullable)backgroundHex
                  buttonsHex:(NSString * _Nullable)buttonsHex
                  titleHex:(NSString * _Nullable)titleHex
                  title:(NSString * _Nullable)title
                  hasShadow:(BOOL)hasShadow) {
   [_inbrain setNavigationBarTitle: title];

    UIColor* backgroundColor = [self colorWithHexString:backgroundHex];
    UIColor* buttonsColor = [self colorWithHexString:buttonsHex];
    UIColor* titleColor = [self colorWithHexString:titleHex];

    InBrainNavBarConfig* config = [[InBrainNavBarConfig alloc]
                                   initWithBackgroundColor: backgroundColor
                                   buttonsColor:buttonsColor titleColor:titleColor
                                   isTranslucent:false hasShadow: hasShadow];

    [_inbrain setNavigationBarConfig:config];
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
        [_inbrain setStatusBarConfig:config];
}

// ****************************
// ***** GET CURRENCY SALE ****
// ****************************
RCT_EXPORT_METHOD(getCurrencySale: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [_inbrain getCurrencySaleWithSuccess:^(InBrainCurrencySale * currencySale) {
        if(!currencySale) {
            resolve(nil);
            return;
        }
        
        NSDateFormatter *dateFormat=[[NSDateFormatter alloc]init];
        [dateFormat setTimeZone:[NSTimeZone timeZoneWithAbbreviation:@"UTC"]];
        [dateFormat setDateFormat: @"yyyy-MM-dd'T'HH:mm:ss"];
       
        NSObject* currencySaleForRN = @{ @"title": currencySale.title,
                         @"multiplier": [NSNumber numberWithDouble:currencySale.multiplier],
                         @"startOn": [dateFormat stringFromDate:currencySale.startOn],
                         @"endOn": [dateFormat stringFromDate:currencySale.endOn],
        };
        resolve(currencySaleForRN);

    } failed:^(NSError * failed){
        reject(@"ERR_GET_CURRENY_SALE", failed.localizedDescription, failed);
    }];
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

- (NSArray<NSString *> *)supportedEvents {
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

        NSObject* rewardObject = @{ @"surveyId": reward.surveyId,
                                    @"placementId": reward.placementId == nil ? [NSNull null] : reward.placementId,
                                    @"outcomeType": [NSNumber numberWithInt:  reward.outcomeType],
                                    @"categories": reward.categoryIds == nil ? [NSNull null] : reward.categoryIds,
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
- (UIColor *)colorWithHexString:(NSString *)stringToConvert {
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

@end
