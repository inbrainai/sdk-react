#import <React/RCTBridgeModule.h>
#import <InBrainSurveys_SDK_Legacy/InBrainSurveys_SDK_Legacy-Swift.h>
#import <React/RCTComponent.h>
#import <React/RCTEventEmitter.h>

@interface InBrainSurveysViewController : UIViewController < InBrainDelegate >
@property(nonatomic) InBrain* inbrain; // InBrain instance
@property (weak, nonatomic) id <InBrainDelegate> listener; // Delegate listener
@property(nonatomic) BOOL hasPresented; // Flag to know if we've presented InBrain webview

@property(nonatomic) NSString* clientId; // InBrain client id
@property(nonatomic) NSString* clientSecret; // InBrain client secret
@property(nonatomic) BOOL* isS2S; // Is Server to Server
@property(nonatomic) NSString* userId; // InBrain user identifier

@property(nonatomic) NSString* sessionUid; // InBrain session uid
@property(nonatomic) NSString* appUid; // Application unique identifier
@property(nonatomic) NSArray<NSDictionary<NSString *, id> *>* dataPoints; // Data points

@end
