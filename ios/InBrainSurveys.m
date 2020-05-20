#import "InBrainSurveys.h"
#import "InBrainSurveysViewController.h"
#import <InBrainSurveys_SDK_Legacy/InBrainSurveys_SDK_Legacy-Swift.h>

@implementation InBrainSurveys

// ***********************************
// ***** UIVIEWCONTROLER methods *****
// ***********************************
- (instancetype)init
{
    self = [super init];
    self.inbrain = [InBrain shared];
    return self;
}

- (void)inBrainRewardsReceivedWithRewardsArray:(NSArray<InBrainReward *> * _Nonnull)rewardsArray {
}

// *********************************
// ***** RN BRIDGE methods  ********
// *********************************

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
  return YES;  // only do this if your module initialization relies on calling UIKit!
}

// ****************
// ***** INIT *****
// ****************
RCT_EXPORT_METHOD(init:(NSString *)clientId clientSecret:(nonnull NSString *)clientSecret resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        
        [self notNull:@"clientId" toCheck:clientId];
        [self notNull:@"clientSecret" toCheck:clientSecret];

        NSDictionary* dict = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"InBrain"];
        [self notNull:@"Info.plist InBrain" toCheck:dict];
        [self notNull:@"Info.plist InBrain.prodEnv" toCheck:dict[@"prodEnv"]];
        [self notNull:@"Info.plist InBrain.client" toCheck:dict[@"client"]];
        [self notNull:@"Info.plist InBrain.server" toCheck:dict[@"server"]];

        self.clientId = clientId;
        self.clientSecret = clientSecret;
        [[InBrain shared] setAppSecretWithSecret:clientSecret];

        // Resolve
        resolve(nil);
    }
    @catch (NSException *error) {
        reject(@"ERR_INIT", error.description, nil);
    }
}

// **************************
// ***** SET PRODUCTION *****
// **************************
RCT_EXPORT_METHOD(setProduction:(BOOL)production resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        // Dummy method as this is not supported on iOS (use pList instead)
        resolve(nil);
    }
    @catch (NSException *error) {
        reject(@"ERR_SET_PRODUCTION", error.description, nil);
    }
}

// ***************************
// ***** SET DATA POINTS *****
// ***************************
RCT_EXPORT_METHOD(setDataPoints:(NSDictionary *)data resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {

        // Convert map to array of single entry maps
        // e.g {age: 25, gender: male} will become [{age: 25}, {gender: male}]
        NSArray* keys=[data allKeys];
        NSMutableArray *mapped = [NSMutableArray arrayWithCapacity:[keys count]];

        [keys enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
            [mapped addObject:@{ obj : [data objectForKey:obj]}];
        }];
        
        self.dataPoints = mapped;

        // Resolve
        resolve(nil);
    }
    @catch (NSException *error) {
        reject(@"ERR_SET_DATA_POINTS", error.description, nil);
    }
}

// **************************
// ***** SET APP USER ID*****
// **************************
RCT_EXPORT_METHOD(setAppUserId:(NSString *)userId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        self.appUid = userId;
        [[InBrain shared] setAppUserIdWithAppUID:userId];
        resolve(nil);
    }
    @catch (NSException *error) {
        reject(@"ERR_SET_USER_ID", error.description, nil);
    }
}

// ***************************
// ***** SET SESSION UID *****
// ***************************
RCT_EXPORT_METHOD(setSessionUid:(NSString *)sessionUid resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        self.sessionUid = sessionUid;
        resolve(nil);
    }
    @catch (NSException *error) {
        reject(@"ERR_SET_SESSION_ID", error.description, nil);
    }
}

// ************************
// ***** SHOW SURVEYS *****
// ************************
RCT_EXPORT_METHOD(showSurveys:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    
    // This requires the main thread
    dispatch_async(dispatch_get_main_queue(), ^{
    
        @try {

            // Display it using the main view controller
            UIViewController* rootViewController = [[UIApplication sharedApplication] delegate].window.rootViewController;
            InBrainSurveysViewController* viewController = [[InBrainSurveysViewController alloc] init];
            viewController.clientSecret = self.clientSecret;
            viewController.appUid = self.appUid;
            viewController.clientId = self.clientId;
            viewController.sessionUid = self.sessionUid;
            viewController.dataPoints = self.dataPoints;
            viewController.listener = self;
            [rootViewController presentViewController:viewController animated:false completion:^{
                
                // When the view controller is displayed, we resolve the promise
                resolve(@true);
            }];
        
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
        [[InBrain shared] getRewardsWithRewardsReceived:^(NSArray<InBrainReward *> * rewards){
            NSMutableArray *rewardList = [NSMutableArray array];
            for(int i = 0; i < rewards.count; i++) {
                
                // ENHANCE
                // The mapping seems to be necessary. Resolving the promise directly with 'rewards' array doesn't work
                // The result on the RN side is an array with null elements...
                 NSObject* o = @{@"transactionId": [NSNumber numberWithLong:rewards[i].transactionId], @"currency": rewards[i].currency, @"amount": [NSNumber numberWithDouble:rewards[i].amount], @"transactionType": [NSNumber numberWithFloat:rewards[i].transactionType]};
                
               [rewardList addObject:o];
            }
            

            resolve(rewardList);
        } failedToGetRewards:^{
            reject(@"ERR_GET_REWARDS", @"Failed to get rewards", nil);
        }];
    }
    @catch (NSException *error) {
        reject(@"ERR_GET", error.description, nil);
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
        [[InBrain shared] setInBrainWebViewTitleToString:title];

        // Resolve the promise
        resolve(@true);
    }
    @catch (NSException *error) {
        reject(@"ERR_SET_TITLE", error.description, nil);
    }
}

// ********************************
// ***** SET VIEW NAVBAR COLOR ****
// ********************************
RCT_EXPORT_METHOD(setNavbarColor:(NSString *)colorHex resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try{
        
        // Forwarding to SDK
        UIColor* color = [self colorWithHexString:colorHex];
        [[InBrain shared] setInBrainWebViewNavBarColorToColor:color];

        // Resolve the promise
        resolve(@true);
    
    }
    @catch (NSException *error) {
        reject(@"ERR_SET_NAVBAR_COLOR", error.description, nil);
    }
}

// ***************************
// ***** SET BUTTON COLOR ****
// ***************************
RCT_EXPORT_METHOD(setButtonColor:(NSString *)colorHex resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try{

        // Forwarding to SDK
        UIColor* color = [self colorWithHexString:colorHex];
        [[InBrain shared] setInBrainWebViewNavButtonColorToColor:color];

        // Resolve the promise
        resolve(@true);
    
    }
    @catch (NSException *error) {
        reject(@"ERR_BUTTON_COLOR", error.description, nil);
    }
}

// ********************
// ***** LISTENERS ****
// ********************

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"OnClose", @"OnCloseFromPage"];
}

- (void)inBrainWebViewDismissed {
    [self sendEventWithName:@"OnClose" body:@{}];
}

- (void)inBrainWebViewDismissedFromPage {
    [self sendEventWithName:@"OnCloseFromPage" body:@{}];
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

@end

