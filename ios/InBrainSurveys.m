#import "InBrainSurveys.h"
#import <InBrainSurveys_SDK_Swift-Swift.h>

@implementation InBrainSurveys

// ***********************************
// ***** UIVIEWCONTROLER methods *****
// ***********************************
- (instancetype)init
{
    self = [super init];
    self.inbrain = [InBrain shared];
    [self.inbrain setInBrainDelegate:self];
    return self;
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    
    // Not sure about that. Seems like a little hack. But we need to dismiss the ViewController as soon as inBrainWebViewDismissed is called.
    if(!self.hasPresented){
        self.hasPresented = true;
        [self.inbrain presentInBrainWebViewWithSecret:self.clientSecret withAppUID:self.appUid];
    }
}

- (void)inBrainRewardsReceivedWithRewardsArray:(NSArray<InBrainReward *> * _Nonnull)rewardsArray {
    
}

- (void)inBrainWebViewDismissed {
    [self dismissViewControllerAnimated:true completion:^{}];
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
// FIXME clientId isn't used for IOS as it's in the info.plist
RCT_EXPORT_METHOD(init:(NSString *)clientId clientSecret:(nonnull NSString *)clientSecret resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
        self.clientId = clientId;
        self.clientSecret = clientSecret;
        [[InBrain shared] setAppSecretWithSecret:clientSecret];

        resolve(@[[NSString stringWithFormat: @"Resolve promise clientId: %@ clientSecret: %@", clientId, clientSecret]]);
}



// **************************
// ***** SET APP USER ID*****
// **************************
RCT_EXPORT_METHOD(setAppUserId:(NSString *)userId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    self.appUid = userId;
    [[InBrain shared] setAppUserIdWithAppUID:userId];
    resolve(@[[NSString stringWithFormat: @"Resolve setAppUserId userId: %@", userId]]);
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
        [rootViewController presentViewController:self animated:false completion:^{
            
            // When the view controller is displayed, we resolve the promise
            resolve(@[[NSString stringWithFormat: @"Resolve showSurveys"]]);
        }];
    });
    
}

// ************************
// ***** GET REWARDS ******
// ************************
RCT_EXPORT_METHOD(getRewards:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    // FIXME: Implement some actually useful functionality
    [[InBrain shared] getRewards];

    resolve(@[@"reward1",@"reward2"]);
}

// ***************************
// ***** CONFIRM REWARDS *****
// ***************************
// TODO implements

@end
