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

// ****************
// ***** INIT *****
// ****************
RCT_EXPORT_METHOD(showSurveys:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    // TODO: Implement some actually useful functionality
    resolve(@[[NSString stringWithFormat: @"Resolve show clientId"]]);
}

// ****************
// ***** INIT *****
// ****************

@end
