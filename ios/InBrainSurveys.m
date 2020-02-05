#import "InBrainSurveys.h"

@implementation InBrainSurveys

RCT_EXPORT_MODULE()

// ****************
// ***** INIT *****
// ****************
RCT_EXPORT_METHOD(init:(NSString *)clientId clientSecret:(nonnull NSString *)clientSecret resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    // TODO: Implement some actually useful functionality
    resolve(@[[NSString stringWithFormat: @"REsolve promise clientId: %@ clientSecret: %@", clientId, clientSecret]]);
}



// **************************
// ***** SET APP USER ID*****
// **************************
RCT_EXPORT_METHOD(setAppUserId:(NSString *)userId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    // TODO: Implement some actually useful functionality
    resolve(@[[NSString stringWithFormat: @"Resolve setAppUserId userId: %@", userId]]);
}

// ************************
// ***** SHOW SURVEYS *****
// ************************
RCT_EXPORT_METHOD(showSurveys:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    // TODO: Implement some actually useful functionality
    resolve(@[[NSString stringWithFormat: @"Resolve showSurveys"]]);
}

// ************************
// ***** SHOW SURVEYS *****
// ************************
RCT_EXPORT_METHOD(getRewards:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    // TODO: Implement some actually useful functionality
    resolve(@[@"reward1",@"reward2"]);
}

@end
