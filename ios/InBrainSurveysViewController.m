#import "InBrainSurveys.h"
#import "InBrainSurveysViewController.h"
#import <InBrainSurveys_SDK_Legacy-Swift.h>

@implementation InBrainSurveysViewController

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
        [self.inbrain presentInBrainWebViewWithSecret:self.clientSecret withAppUID:self.appUid withSessionUID:self.sessionUid withDataPoints:self.dataPoints];
    }
}

- (void)inBrainRewardsReceivedWithRewardsArray:(NSArray<InBrainReward *> * _Nonnull)rewardsArray {
    [self.listener inBrainRewardsReceivedWithRewardsArray: rewardsArray];
}

- (void)inBrainWebViewDismissed {
    [self dismiss];
    [self.listener inBrainWebViewDismissed];
}

- (void)inBrainWebViewDismissedFromPage {
    [self dismiss];
    [self.listener inBrainWebViewDismissedFromPage];
}

- (void)dismiss {
    self.hasPresented = false;
    [self dismissViewControllerAnimated:true completion:^{}];
}

@end

