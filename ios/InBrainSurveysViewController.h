#import <React/RCTBridgeModule.h>
#import <InBrainSurveys_SDK_Swift-Swift.h>
#import <React/RCTComponent.h>
#import <React/RCTEventEmitter.h>

@interface InBrainSurveysViewController : UIViewController < InBrainDelegate >
@property(nonatomic) InBrain* inbrain; // InBrain instance
@property(nonatomic) BOOL hasPresented; // Flag to know if we've presented InBrain webview

@property(nonatomic) NSString* clientId; // InBrain client id
@property(nonatomic) NSString* clientSecret; // InBrain client secret
@property(nonatomic) NSString* appUid; // Application unique identifier

@end
