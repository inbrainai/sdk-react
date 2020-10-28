#import <React/RCTBridgeModule.h>
#import <InBrainSurveys_SDK_Swift/InBrainSurveys_SDK_Swift-Swift.h>
#import <React/RCTComponent.h>
#import <React/RCTEventEmitter.h>

@interface InBrainSurveys : RCTEventEmitter <RCTBridgeModule, InBrainDelegate, NativeSurveyDelegate>
@property(nonatomic) InBrain* inbrain; // InBrain instance

// -- Temporary resolver/rejecter
@property(nonatomic) RCTPromiseResolveBlock getNativeSurveysResolve; // Resolver for getNativeSurveys
@property(nonatomic) RCTPromiseRejectBlock getNativeSurveysReject; // Rejecter for getNativeSurveys

// -- Mandatory parameters
@property(nonatomic) NSString* apiClientId; // InBrain client id
@property(nonatomic) NSString* apiSecret; // InBrain client secret
@property(nonatomic) BOOL* isS2S; // Is Server to Server
@property(nonatomic) NSString* userId; // InBrain user identifier

// -- Optional parameters
@property(nonatomic) NSString* sessionUid; // InBrain session uid
@property(nonatomic) NSArray<NSDictionary<NSString *, id> *>* dataPoints; // Data points
 
@end
