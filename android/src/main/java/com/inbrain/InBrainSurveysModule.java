package com.inbrain;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.inbrain.sdk.InBrain;
import com.inbrain.sdk.callback.StartSurveysCallback;

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

    @ReactMethod
    public void init(String clientId, String clientSecret, Callback callback) {
       System.out.println("TEST SAMPLE");
        try {
            InBrain.getInstance().init(this.reactContext.getCurrentActivity(), clientId, clientSecret);
            callback.invoke("CALL SUCCESS init =>  clientId: " + clientId + " clientSecret: " + clientSecret);
        }catch(Exception e){
            callback.invoke("CALL ERROR init: " + e.getMessage());
        }
    }

    @ReactMethod
    public void showSurveys(final Callback callback) {
       System.out.println("TEST SAMPLE");
        try {

            StartSurveysCallback inBrainCallBack = new StartSurveysCallback(){
                public void onSuccess() {
                    callback.invoke("CALL SUCCESS showSurveys");
                };

                public void onFail(String message) {
                    callback.invoke("CALL FAILED showSurveys: " + message);
                };
            };

            InBrain.getInstance().showSurveys(this.reactContext.getCurrentActivity(), inBrainCallBack);
        }catch(Exception e){
            callback.invoke("CALL ERROR showSurveys: " + e.getMessage());
        }
    }
}
