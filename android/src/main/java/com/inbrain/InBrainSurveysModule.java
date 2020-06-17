package com.inbrain;

import android.graphics.Color;
import android.os.Handler;
import android.os.Looper;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.inbrain.sdk.InBrain;
import com.inbrain.sdk.callback.GetRewardsCallback;
import com.inbrain.sdk.callback.InBrainCallback;
import com.inbrain.sdk.callback.NewRewardsCallback;
import com.inbrain.sdk.callback.StartSurveysCallback;
import com.inbrain.sdk.model.Reward;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Nullable;

public class InBrainSurveysModule extends ReactContextBaseJavaModule implements NewRewardsCallback, InBrainCallback {

    private final ReactApplicationContext reactContext;

    public InBrainSurveysModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "InBrainSurveys";
    }

    // ****************
    // ***** INIT *****
    // ****************
    @ReactMethod
    public void init(final String clientId, final String clientSecret, Promise promise) {
        try {
            // Validate parameters
            notNull("clientId", clientId);
            notNull("clientSecret", clientSecret);

            // Call Braintree sdk
            new Handler(Looper.getMainLooper()).post(new Runnable() {
                @Override
                public void run() {
                    InBrain.getInstance().init(getCurrentActivity(), clientId, clientSecret);
                }
            });

            // Set the listener
            InBrain.getInstance().addCallback(this);
            InBrain.getInstance().addNewRewardsCallback(this);

            // Everything went well, resolve the promise
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("ERR_INIT", e.getMessage(), e);
        }
    }

    // **************************
    // ***** SET PRODUCTION *****
    // **************************
    @ReactMethod
    public void setProduction(final Boolean production, Promise promise) {

        new ParamSeter<Boolean>() {
            @Override
            public void setParam(Boolean param) {
                InBrain.getInstance().setStagingMode(!production);
            }
        }.apply(promise, "production", production, "ERR_SET_PRODUCTION");

    }

    // ***************************
    // ***** SET DATA POINTS *****
    // ***************************
    @ReactMethod
    public void setDataPoints(ReadableMap data, Promise promise) {

        new ParamSeter<HashMap<String, String>>() {
            @Override
            public void setParam(HashMap<String, String> param) {
                InBrain.getInstance().setDataPoints(param);
            }
        }.apply(promise, "dataPoints", toHashMap(data), "ERR_SET_DATA_POINTS");

    }

    // ***************************
    // ***** SET APP USER ID *****
    // ***************************
    @ReactMethod
    public void setAppUserId(String userId, Promise promise) {

        new ParamSeter<String>() {
            @Override
            public void setParam(String param) {
                InBrain.getInstance().setAppUserId(param);
            }
        }.apply(promise, "userId", userId, "ERR_SET_USER_ID");

    }

    // ***************************
    // ***** SET SESSION UID *****
    // ***************************
    @ReactMethod
    public void setSessionUid(String sessionUid, Promise promise) {

        new ParamSeter<String>() {
            @Override
            public void setParam(String param) {
                InBrain.getInstance().setSessionUid(param);
            }
        }.apply(promise, "sessionUid", sessionUid, "ERR_SET_SESSION_ID");

    }

    // ************************
    // ***** SHOW SURVEYS *****
    // ************************
    @ReactMethod
    public void showSurveys(final Promise promise) {
        try {

            // Build the callback
            StartSurveysCallback callback = new StartSurveysCallback() {
                public void onSuccess() {
                    promise.resolve(null);
                };

                public void onFail(String message) {
                    promise.reject("ERR_SHOW_SURVEYS", message);
                };
            };

            // Call braintree SDK
            InBrain.getInstance().showSurveys(getCurrentActivity(), callback);
        } catch (Exception e) {
            promise.reject("ERR_SHOW_SURVEYS", e.getMessage(), e);
        }
    }

    // ************************
    // ***** GET REWARDS ******
    // ************************
    @ReactMethod
    public void getRewards(final Promise promise) {
        try {

            InBrain.getInstance().getRewards(new GetRewardsCallback() {
                @Override
                public boolean handleRewards(List<Reward> rewards) {

                    WritableArray array = Arguments.createArray();
                    for (Reward reward : rewards) {
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
                public void onFailToLoadRewards(Throwable error) {
                    promise.reject("ERR_GET_REWARDS", error.getMessage(), error);
                }
            });

        } catch (Exception e) {
            promise.reject("ERR_GET_REWARDS", e.getMessage(), e);
        }
    }

    // ***************************
    // ***** CONFIRM REWARDS *****
    // ***************************
    @ReactMethod
    public void confirmRewards(ReadableArray rewardsArray, final Promise promise) {
        try {

            List<Reward> rewards = new ArrayList<>();
            for (int i = 0; i < rewardsArray.size(); i++) {
                ReadableMap rewardMap = rewardsArray.getMap(i);

                Long transactionId = (long) rewardMap.getInt("transactionId");
                Float amount = (float) rewardMap.getDouble("amount"); // ENHANCE another way to do conversion ?
                String currency = rewardMap.getString("currency");
                int transactionType = rewardMap.getInt("transactionType");

                Reward reward = new Reward(transactionId, amount, currency, transactionType);
                rewards.add(reward);
            }

            InBrain.getInstance().confirmRewards(rewards);
            promise.resolve(true);

        } catch (Exception e) {
            promise.reject("ERR_CONFIRM_REWARDS", e.getMessage(), e);
        }
    }

    // **************************
    // ***** SET VIEW TITLE *****
    // **************************
    @ReactMethod
    public void setTitle(final String title, Promise promise) {

        new ParamSeter<String>() {
            @Override
            public void setParam(String param) {
                InBrain.getInstance().setToolbarTitle(title);
            }
        }.apply(promise, "title", title, "ERR_SET_TITLE");

    }

    // ********************************
    // ***** SET VIEW NAVBAR COLOR ****
    // ********************************
    @ReactMethod
    public void setNavbarColor(final String colorHex, Promise promise) {

        new ParamSeter<String>() {
            @Override
            public void setParam(String param) {
                InBrain.getInstance().setToolbarColor(Color.parseColor(colorHex));
            }
        }.apply(promise, "toolbarColor", colorHex, "ERR_SET_NAVBAR_COLOR");

    }

    // ********************************
    // ***** SET BUTTON COLOR ****
    // ********************************
    @ReactMethod
    public void setButtonColor(final String colorHex, Promise promise) {

        new ParamSeter<String>() {
            @Override
            public void setParam(String param) {
                InBrain.getInstance().setTitleTextColor(Color.parseColor(colorHex));
            }
        }.apply(promise, "buttonColor", colorHex, "ERR_SET_BUTTON_COLOR");

    }

    // ********************
    // ***** LISTENERS ****
    // ********************
    @Override
    public void onClosed() {
        sendEvent("OnClose", null);
    }

    @Override
    public void onClosedFromPage() {
        sendEvent( "OnCloseFromPage", null);
    }

    @Override
    public boolean handleRewards(List<Reward> rewards) {
        return false;
    }


    /**
     * Send an event back to the JS code
     *
     * @param eventName name of the event (has to be listened on the JS side)
     * @param params    optional parameters
     */
    private void sendEvent(String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }



    // ***************************
    // ***** UTILITY METHODS *****
    // ***************************
    private HashMap<String, String> toHashMap(ReadableMap data) {
        HashMap<String, String> datMap = new HashMap<>();

        if (data != null) {
            for (ReadableMapKeySetIterator it = data.keySetIterator(); it.hasNextKey(); ) {
                String key = it.nextKey();

                // Assert all keys are strings
                if (!data.getType(key).equals(ReadableType.String)) {
                    throw new IllegalArgumentException("'data' key and values must be string. Found non string value for key " + key + ": " + data.getType(key));
                }

                // Safely add to map
                datMap.put(key, data.getString(key));
            }
        }

        return datMap;
    }

    protected abstract class ParamSeter<T> {

        public abstract void setParam(T param);

        public void apply(Promise promise, String name, T param, String errorCode) {
            try {
                // Validate parameters
                notNull(name, param);

                // Call Braintree sdk
                setParam(param);

                // Everything went well, resolve the promise
                promise.resolve(null);
            } catch (Exception e) {
                promise.reject(errorCode, e.getMessage(), e);
            }
        }
    }

    private void notNull(String name, Object toCheck) {
        if (toCheck == null) {
            throw new IllegalArgumentException(name + " must not be null");
        }
    }
}
