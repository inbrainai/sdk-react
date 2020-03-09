package com.inbrain;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.inbrain.sdk.InBrain;
import com.inbrain.sdk.callback.InBrainCallback;
import com.inbrain.sdk.callback.StartSurveysCallback;
import com.inbrain.sdk.callback.GetRewardsCallback;
import com.inbrain.sdk.model.Reward;
import com.facebook.react.bridge.Promise;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Nullable;

public class InBrainSurveysModule extends ReactContextBaseJavaModule implements InBrainCallback {

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
    public void init(String clientId, String clientSecret, String sessionUID, Promise promise) {
        try {
            // Validate parameters
            notNull("clientId", clientId);
            notNull("clientSecret", clientSecret);
            
            // Call Braintree sdk
            InBrain.getInstance().init(getCurrentActivity(), clientId, clientSecret, sessionUID);

            // Set the listener
            InBrain.getInstance().addCallback(this);

            // Everything went well, resolve the promise
            promise.resolve(null);
        } catch(IllegalArgumentException e){
            promise.reject("E_ERROR_INIT_PARAM", e);
        } catch(Exception e){
            promise.reject("E_ERROR_INIT","Error while initialising sdk.",  e);
        }
    }

    @ReactMethod
    public void setAppUserId(String userId, Promise promise) {
        try {
            // Validate parameters
            notNull("userId", userId);
            
            // Call Braintree sdk
            InBrain.getInstance().setAppUserId(userId);

            // Everything went well, resolve the promise
            promise.resolve(null);
        } catch(IllegalArgumentException e){
            promise.reject("E_ERROR_USER_PARAM", e);
        } catch(Exception e){
            promise.reject("E_ERROR_USER", e);
        }
    }

    @ReactMethod
    public void showSurveys(final Promise promise) {
        try {

            // Build the callback
            StartSurveysCallback callback = new StartSurveysCallback(){
                public void onSuccess() {
                    promise.resolve(null);
                };

                public void onFail(String message) {
                    promise.reject("E_ERROR_SHOW", message);  
                };
            };

            // Call braintree SDK
            InBrain.getInstance().showSurveys(getCurrentActivity(), callback);
        } catch(Exception e){
            promise.reject("E_ERROR_SHOW", e);
        }
    }

    @ReactMethod
    public void getRewards(final Promise promise) {
        try {

            InBrain.getInstance().getRewards(new GetRewardsCallback() {  
                @Override  
                public boolean handleRewards(List<Reward> rewards) {  

                    WritableArray array = Arguments.createArray();
                    for(Reward reward: rewards){
                        WritableMap map = Arguments.createMap();
                        map.putInt("transactionId", (int) reward.transactionId); // ENHANCE possible loss conversion
                        map.putDouble("amount", reward.amount);
                        map.putString("currency", reward.currency);
                        map.putInt("transactionType", reward.transactionType);
                        array.pushMap(map);
                    }

                    // Resolve promise with the list of rewards
                    promise.resolve(array);

                    return false;
                }  
            
                @Override  
                public void onFailToLoadRewards(int errorCode) {  
                    promise.reject("E_ERROR_GET", "Failed with errorCode: " +errorCode);
                }  
            });

        } catch(Exception e){
            promise.reject("E_ERROR_GET", e);
        }
    }

    @ReactMethod
    public void confirmRewards(ReadableArray rewardsArray, final Promise promise) {
        try {

            List<Reward> rewards = new ArrayList<>();
            for(int i = 0; i<rewardsArray.size(); i++){
                ReadableMap rewardMap = rewardsArray.getMap(i);

                Long transactionId =  (long) rewardMap.getInt("transactionId");
                Float amount =  (float) rewardMap.getDouble("amount"); // ENHANCE another way to do conversion ?
                String currency =  rewardMap.getString("currency");
                int transactionType =  rewardMap.getInt("transactionType");

                Reward reward = new Reward(transactionId, amount, currency, transactionType);
                rewards.add(reward);
            }

            InBrain.getInstance().confirmRewards(rewards);
            promise.resolve(true);

        } catch(Exception e){
            promise.reject("E_ERROR_CONFIRM", e);
        }
    }

    @Override
    public void onClosed() {
        sendEvent( "OnClose", null);
    }

    @Override
    public boolean handleRewards(List<Reward> list) {
        return false;
    }

    /**
     * Send an event back to the JS code
     * @param eventName name of the event (has to be listened on the JS side)
     * @param params optional parameters
     */
    private void sendEvent(String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
