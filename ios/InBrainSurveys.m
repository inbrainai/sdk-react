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
    NSLog(@"REWARDS CALLBACK");
    NSLog(@"%@",rewardsArray);
    self.resolve(rewardsArray);
    self.resolve = nil;
    self.reject = nil;
}

- (void)inBrainWebViewDismissed {
    self.hasPresented = false;
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
        [rootViewController presentViewController:self animated:false completion:^{
            
            // When the view controller is displayed, we resolve the promise
            resolve(nil);
        }];
    });
    
}

// ************************
// ***** GET REWARDS ******
// ************************
RCT_EXPORT_METHOD(getRewards:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    NSLog(@"GET REWARDS");
    [[InBrain shared] getRewards];
    self.resolve = resolve;
    self.reject = reject;

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
@end
