#import "InBrainSurveys.h"
#import "InBrainSurveysViewController.h"
#import <InBrainSurveys_SDK_Swift-Swift.h>

@implementation InBrainSurveys

// ********************************
// ***** EVENTEMITTER methods *****
// ********************************
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"OnClose"];
}

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

- (void)inBrainWebViewDismissed {
    [self sendEventWithName:@"OnClose" body:@{}];
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
        self.clientId = clientId;
        self.clientSecret = clientSecret;
        [[InBrain shared] setAppSecretWithSecret:clientSecret];

        resolve(nil);
}

// **************************
// ***** SET APP USER ID*****
// **************************
RCT_EXPORT_METHOD(setAppUserId:(NSString *)userId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    self.appUid = userId;
    [[InBrain shared] setAppUserIdWithAppUID:userId];
    resolve(nil);
}

// ************************
// ***** SHOW SURVEYS *****
// ************************
RCT_EXPORT_METHOD(showSurveys:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    
    // This requires the main thread
    dispatch_async(dispatch_get_main_queue(), ^{
    
        // Display it using the main view controller
        UIViewController* rootViewController = [[UIApplication sharedApplication] delegate].window.rootViewController;
        InBrainSurveysViewController* viewController = [[InBrainSurveysViewController alloc] init];
        viewController.clientSecret = self.clientSecret;
        viewController.appUid = self.appUid;
        viewController.clientId = self.clientId;
        viewController.listener = self;
        [rootViewController presentViewController:viewController animated:false completion:^{
            
            // When the view controller is displayed, we resolve the promise
            resolve(@true);
        }];
    });
    
}

// ************************
// ***** GET REWARDS ******
// ************************
RCT_EXPORT_METHOD(getRewards:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [[InBrain shared] getRewardsWithRewardsReceived:^(NSArray<InBrainReward *> * rewards){        
        NSMutableArray *rewardList = [NSMutableArray array];
        for(int i = 0; i < rewards.count; i++) {
            
            // ENHANCE
            // The mapping seems to be necessary. Resolving the promise directly with 'rewards' array doesn't work
            // The result on the RN side is an array with null elements...
             NSObject* o = @{@"transactionId": [NSNumber numberWithLong:rewards[i].transactionId], @"currency": rewards[i].currency, @"amount": [NSNumber numberWithDouble:rewards[i].amount], @"transactionType": [NSNumber numberWithLong:rewards[i].amount]};
           [rewardList addObject:o];
        }
        
       
        
        resolve(rewardList);
    } failedToGetRewards:^{
        reject(nil, nil, nil);
    }];

}

// ***************************
// ***** CONFIRM REWARDS *****
// ***************************
RCT_EXPORT_METHOD(confirmRewards:(NSArray *)rewards resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    // Mapping to list of ids and forwarding to SDK
    NSArray* ids = [rewards valueForKey:@"transactionId"];
    [[InBrain shared] confirmRewardsWithTxIdArray:ids];

    // Resolve the promise
    resolve(@true);
}

// **************************
// ***** SET VIEW TITLE *****
// **************************
RCT_EXPORT_METHOD(setTitle:(NSString *)title resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    // Forwarding to SDK
    [[InBrain shared] setInBrainWebViewTitleToString:title];

    // Resolve the promise
    resolve(@true);
}

// ********************************
// ***** SET VIEW NAVBAR COLOR ****
// ********************************
RCT_EXPORT_METHOD(setNavbarColor:(NSString *)colorHex resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    // Forwarding to SDK
    UIColor* color = [self colorWithHexString:colorHex];
    [[InBrain shared] setInBrainWebViewNavBarColorToColor:color];

    // Resolve the promise
    resolve(@true);
}

// ********************************
// ***** SET VIEW NAVBAR COLOR ****
// ********************************
RCT_EXPORT_METHOD(setButtonColor:(NSString *)colorHex resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    // Forwarding to SDK
    UIColor* color = [self colorWithHexString:colorHex];
    [[InBrain shared] setInBrainWebViewNavButtonColorToColor:color];

    // Resolve the promise
    resolve(@true);
}

/**
 * Utility method to convert from a hexadecimal color string to UIColor
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

@end

