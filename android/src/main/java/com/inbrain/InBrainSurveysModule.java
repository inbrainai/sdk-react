package com.inbrain;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.inbrain.sdk.InBrain;

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
    public void sampleMethod(String stringArgument, int numberArgument, Callback callback) {
       System.out.println("ABCD");
        try {
            InBrain.getInstance().init(this.reactContext, "CLIENT_ID", "CLIENT_SECRET");
            callback.invoke("CALL SUCCESS numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
        }catch(Exception e){
            callback.invoke("CALL ERROR: " + e.getMessage());
        }
    }
}
