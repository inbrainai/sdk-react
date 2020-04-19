#import <React/RCTBridgeModule.h>
#import <InBrainSurveys_SDK_Legacy-Swift.h>
#import <React/RCTComponent.h>
#import <React/RCTEventEmitter.h>

@interface InBrainSurveys : RCTEventEmitter <RCTBridgeModule, InBrainDelegate>
@property(nonatomic) InBrain* inbrain; // InBrain instance

// -- Mandatory parameters
@property(nonatomic) NSString* clientId; // InBrain client id
@property(nonatomic) NSString* clientSecret; // InBrain client secret

// -- Optional parameters
@property(nonatomic) NSString* sessionUid; // InBrain session uid
@property(nonatomic) NSString* appUid; // Application unique identifier
@property(nonatomic) NSArray<NSDictionary<NSString *, id> *>* dataPoints; // Data points
 
@end
