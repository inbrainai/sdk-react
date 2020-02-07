package com.inbrain;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.inbrain.sdk.InBrain;
import com.inbrain.sdk.callback.StartSurveysCallback;
import com.inbrain.sdk.callback.GetRewardsCallback;
import com.inbrain.sdk.model.Reward;
import com.facebook.react.bridge.Promise;

import java.util.ArrayList;
import java.util.List;

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

   /* private <T> void notEmpty(String name, List<T> toCheck) {
        notNull(toCheck);

        if(toCheck.isEmpty()) {
            throw new IllegalArgumentException(name + " must not be empty");
        }
    }*/

    @ReactMethod
    public void init(String clientId, String clientSecret, Promise promise) {
        try {
            // Validate parameters
            notNull("clientId", clientId);
            notNull("clientSecret", clientSecret);
            
            // Call Braintree sdk
            // FIXME: is there any possible failure here or callback ?
            InBrain.getInstance().init(getCurrentActivity(), clientId, clientSecret);

            // Everything went well, resolve the promise
            promise.resolve(null);
        } catch(IllegalArgumentException e){
            promise.reject("E_ERROR_INIT_PARAM", e);
        } catch(Exception e){
            promise.reject("E_ERROR_INIT", e);
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
                        map.putInt("transactionId", (int) reward.transactionId); // FIXME possible loss conversion
                        map.putDouble("amount", reward.amount);
                        map.putString("currency", reward.currency);
                        map.putInt("transactionType", reward.transactionType);
                        array.pushMap(map);
                    }

                    // Resolve promise with the list of rewards
                    promise.resolve(true);

                    return false; // FIXME false for manual confirm / true for automatic ?
                }  
            
                @Override  
                public void onFailToLoadRewards(int errorCode) {  
                    promise.reject("E_ERROR_GET", "" +errorCode); // FIXME handle error code  
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
                Float amount =  (float) rewardMap.getDouble("amount"); // FIXME ugly conversion
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
}
