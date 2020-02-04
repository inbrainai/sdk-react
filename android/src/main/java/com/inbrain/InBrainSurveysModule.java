package com.inbrain;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.inbrain.sdk.InBrain;
import com.inbrain.sdk.callback.StartSurveysCallback;
import com.facebook.react.bridge.Promise;

public class InBrainSurveysModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public InBrainSurveysModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "InBrainSurveys";
    }

    private void notNull(String name, Object toCheck) {
        if(toCheck == null) {
            throw new IllegalArgumentException(name + " must not be null");
        }
    }

    @ReactMethod
    public void init(String clientId, String clientSecret, Promise promise) {
       System.out.println("TEST SAMPLE");
        try {
            if(clientId == null){
                throw new RuntimeException("Client ID Must be set");
            }
            InBrain.getInstance().init(this.reactContext.getCurrentActivity(), clientId, clientSecret);
            promise.resolve("CALL SUCCESS init =>  clientId: " + clientId + " clientSecret: " + clientSecret);
        } catch(IllegalArgumentException e){
            promise.reject("E_ERROR_INIT_PARAM", e);
        } catch(Exception e){
            promise.reject("E_ERROR_INIT", e);
        }
    }

    @ReactMethod
    public void showSurveys(final Promise promise) {
        try {

            StartSurveysCallback callback = new StartSurveysCallback(){
                public void onSuccess() {
                    promise.resolve("CALL SUCCESS showSurveys");  
                };

                public void onFail(String message) {
                    promise.resolve("CALL FAILED showSurveys: " + message);  
                };
            };

            InBrain.getInstance().showSurveys(this.reactContext.getCurrentActivity(), callback);
        } catch(Exception e){
            promise.reject("E_ERROR_SHOW", e);
        }
    }
}
