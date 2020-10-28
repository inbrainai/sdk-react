#import "InBrainSurveys.h"
#import "InBrainSurveysViewController.h"
#import <InBrainSurveys_SDK_Swift/InBrainSurveys_SDK_Swift-Swift.h>

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
        [self.inbrain showSurveys];
    }
}

// ***********************************
// ***** InBrainDelegate methods *****
// ***********************************

- (void)didReceiveInBrainRewardsWithRewardsArray:(NSArray<InBrainReward *> * _Nonnull)rewardsArray {
   [self.listener didReceiveInBrainRewardsWithRewardsArray: rewardsArray];
}

- (void)didFailToReceiveRewardsWithError:(NSError * _Nonnull)error {
}

- (void)surveysClosed {
    [self dismiss];
    [self.listener surveysClosed];
}

- (void)surveysClosedFromPage {
    [self dismiss];
    [self.listener surveysClosedFromPage];
}

- (void)dismiss {
    self.hasPresented = false;
    [self dismissViewControllerAnimated:true completion:^{}];
}

@end

