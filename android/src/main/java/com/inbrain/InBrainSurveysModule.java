package com.inbrain.rn;

import android.app.Activity;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.inbrain.sdk.InBrain;

import com.inbrain.sdk.callback.GetNativeSurveysCallback;
import com.inbrain.sdk.callback.GetRewardsCallback;
import com.inbrain.sdk.callback.InBrainCallback;
import com.inbrain.sdk.callback.StartSurveysCallback;
import com.inbrain.sdk.callback.SurveysAvailableCallback;
import com.inbrain.sdk.callback.GetCurrencySaleCallback;

import com.inbrain.sdk.config.StatusBarConfig;
import com.inbrain.sdk.config.ToolBarConfig;

import com.inbrain.sdk.model.Reward;
import com.inbrain.sdk.model.Survey;
import com.inbrain.sdk.model.SurveyCategory;
import com.inbrain.sdk.model.SurveyFilter;
import com.inbrain.sdk.model.InBrainSurveyReward;
import com.inbrain.sdk.model.CurrencySale;
import com.inbrain.sdk.model.WallOption;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Nullable;

import static android.graphics.Color.parseColor;

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

    // ***********************
    // ***** SET INBRAIN *****
    // ***********************
    @ReactMethod
    public void setInBrain(final String apiClientId, final String clientSecret) {
        // Set the listener
        InBrain.getInstance().removeCallback(this);
        InBrain.getInstance().addCallback(this);
        InBrain.getInstance().setInBrain(getReactApplicationContext(), apiClientId, clientSecret, true);
    }

    // **********************************
    // ***** SET USER ID *****
    // **********************************
    @ReactMethod
    public void setUserID( final String userId) {
        InBrain.getInstance().setUserID(getReactApplicationContext(), userId);
    }

    // **********************************
    // ***** SET INBRAIN SESSION ID *****
    // **********************************
    @ReactMethod
    public void setSessionID(final String sessionId) {
        InBrain.getInstance().setSessionId(sessionId);
    }

    // **********************************
    // ***** SET INBRAIN DATA POINTS *****
    // **********************************
    @ReactMethod
    public void setDataOptions(final ReadableMap data) {
        InBrain.getInstance().setDataOptions(toHashMap(data));
    }


// ************************
// ***** OPEN WALL ******
// ************************
    @ReactMethod
    public void openWall(final int option, final Promise promise) {
        final WallOption optionFromRaw = WallOption.Companion.fromRaw(option);
        final WallOption wallOption = (optionFromRaw != null) ? optionFromRaw : WallOption.ALL;

        final StartSurveysCallback callback = new StartSurveysCallback() {
            public void onSuccess() {
                promise.resolve(null); 
            }

            public void onFail(String message) {
                promise.reject("ERR_SHOW_SURVEYS", message);
            }
        };

        UiThreadUtil.runOnUiThread(() -> {
            try {
                InBrain.getInstance().openWall(getCurrentActivityOrThrow(), wallOption, callback);
            } catch (NullCurrentActivityException e) {
                promise.reject("ERR_NULL_CURRENT_ACTIVITY", e.getMessage(), e);
            }
        });
    }

    // ************************x
    // ***** GET REWARDS ******
    // ************************
    @ReactMethod
    public void getRewards(final Promise promise) {
        InBrain.getInstance().getRewards(new GetRewardsCallback() {
            @Override
            public boolean handleRewards(List<Reward> rewards) {

                WritableArray array = Arguments.createArray();
                for (Reward reward : rewards) {
                    WritableMap map = Arguments.createMap();
                    map.putInt("transactionId", (int) reward.transactionId);
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
    }

    // ***************************
    // ***** CONFIRM REWARDS *****
    // ***************************
    @ReactMethod
    public void confirmRewards(ReadableArray rewardsArray, final Promise promise) {
        long[] rewards = new long[rewardsArray.size()];

        for (int i = 0; i < rewardsArray.size(); i++) {
            ReadableMap rewardMap = rewardsArray.getMap(i);
            long transactionId = (long) rewardMap.getInt("transactionId");
            rewards[i] = transactionId;
        }

        InBrain.getInstance().confirmRewards(rewards);
        promise.resolve(true);
    }

    // ***********************************
    // ***** CHECK SURVEYS AVAILABLE *****
    // ***********************************
    @ReactMethod
    public void checkSurveysAvailable(final Promise promise) {
        InBrain.getInstance().areSurveysAvailable(getReactApplicationContext(), new SurveysAvailableCallback() {
            @Override
            public void onSurveysAvailable(boolean available) {
                promise.resolve(available);
            }
        });
    }

    // *******************************
    // ***** GET NATIVE SURVEYS ******
    // *******************************
    @ReactMethod
    public void getNativeSurveys(final String placementId, ReadableArray includedCategoryIds, ReadableArray excludedCategoryIds, final Promise promise) {
        SurveyFilter filter = createSurveyFilter(placementId, includedCategoryIds, excludedCategoryIds);
        
        InBrain.getInstance().getNativeSurveys(filter, new GetNativeSurveysCallback() {
            @Override
            public void nativeSurveysReceived(List<Survey> surveys) {

                WritableArray array = Arguments.createArray();
                for (Survey survey : surveys) {
                    WritableMap map = Arguments.createMap();

                    map.putString("id", survey.id);
                    map.putString("searchId", survey.searchId);
                    map.putInt("rank", (int) survey.rank);
                    map.putInt("time", (int) survey.time);
                    map.putDouble("value", survey.value);
                    map.putBoolean("currencySale", survey.currencySale);
                    map.putBoolean("isProfilerSurvey", survey.isProfilerSurvey);
                    map.putDouble("multiplier", survey.multiplier);

                    map.putInt("conversionLevel", survey.conversionLevel.getLevel());

                    // Android SDK returns an empty array if no categories;
                    // However there is no reason to create an empty array for RN.
                    if (survey.categories != null && !survey.categories.isEmpty() ) {
                        WritableArray categories = Arguments.createArray();
                        for (SurveyCategory category:survey.categories) {
                            categories.pushInt(category.getId());
                        }

                        map.putArray("categories", categories);
                    }

                    array.pushMap(map);
                }

                // Resolve promise with the list of surveys
                promise.resolve(array);
            }
        });
    }

    // *******************************
    // ***** SHOW NATIVE SURVEY ******
    // *******************************
    @ReactMethod
    public void showNativeSurvey(final String id, final String searchId, final boolean offersEnabled, final Promise promise) {
        final StartSurveysCallback callback = new StartSurveysCallback() {
            public void onSuccess() {
                promise.resolve(null);
            }
            public void onFail(String message) {
                promise.reject("ERR_SHOW_SURVEYS", message);
            }
        };
        UiThreadUtil.runOnUiThread(() -> {
            try {
                InBrain.getInstance().showNativeSurveyWith(getCurrentActivityOrThrow(), id, searchId, offersEnabled, callback);
            } catch (NullCurrentActivityException e) {
                promise.reject("ERR_NULL_CURRENT_ACTIVITY", e.getMessage(), e);
            }
        });
    }

    // ************************************
    // ***** SET NAVIGATION BAR CONFIG *****
    // *************************************
    @ReactMethod
    public void setNavigationBarConfig(@Nullable String backgroundHex, @Nullable String buttonsHex,
                                       @Nullable String titleHex, @Nullable String title,
                                       @Nullable boolean hasShadow)  {
        ToolBarConfig config = new ToolBarConfig();
        
        if (backgroundHex != null) {
            int backgroundColor = parseColor(backgroundHex);
            config.setToolbarColor(backgroundColor);
        }

        if (buttonsHex != null) {
            int buttonsColor = parseColor(buttonsHex);
            config.setBackButtonColor(buttonsColor);
        }
        
        if (titleHex != null) {
            int titleColor = parseColor(titleHex);
            config.setTitleColor(titleColor);
        }
            
        config.setTitle(title);
        config.setElevationEnabled(hasShadow);

        InBrain.getInstance().setToolbarConfig(config);
    }

    // *********************************
    // ***** SET STATUS BAR CONFIG *****
    // *********************************
    @ReactMethod
    public void setStatusBarConfig(final boolean lightStatusBar, @Nullable String backgroundHex) {
        StatusBarConfig config = new StatusBarConfig();
        config.setStatusBarIconsLight(lightStatusBar);
        if (backgroundHex != null) {
            int backgroundColor = parseColor(backgroundHex);
            config.setStatusBarColor(backgroundColor);
        }
        
        InBrain.getInstance().setStatusBarConfig(config);
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    // ****************************
    // ***** GET CURRENCY SALE **** 
    // ****************************
    @ReactMethod
    public void getCurrencySale(final Promise promise) {
        InBrain.getInstance().getCurrencySale(new GetCurrencySaleCallback() {
            @Override
            public void currencySaleReceived(CurrencySale currencySale) {

                if(currencySale == null) {
                    promise.resolve(null);
                    return;
                }

                WritableMap currencySaleForJS = Arguments.createMap();
                currencySaleForJS.putString("title", currencySale.description);
                currencySaleForJS.putDouble("multiplier", currencySale.multiplier);
                currencySaleForJS.putString("startOn", currencySale.startOn);
                currencySaleForJS.putString("endOn", currencySale.endOn);
                promise.resolve(currencySaleForJS);
            }
        });
    }

    // ********************
    // ***** LISTENERS ****
    // ********************
    @Override
    public void surveysClosed(boolean byWebView, List<InBrainSurveyReward> rewards) {
        String isByWebView = byWebView ? "OnClose" : "OnCloseFromPage";
        sendEvent(isByWebView, null);

        WritableArray rewardMappingArray = null;
        if(rewards != null && rewards.size() > 0) {
            rewardMappingArray = Arguments.createArray();

            for(InBrainSurveyReward reward : rewards) {
                WritableMap map = Arguments.createMap();
                map.putString("surveyId", reward.getSurveyId());
                map.putString("placementId", reward.getPlacementId());
                map.putInt("outcomeType", reward.getOutcomeType().getType());
                map.putDouble("userReward", reward.getUserReward());
    
                var categories = reward.getCategories();
                if (categories != null && !categories.isEmpty() ) {
                    WritableArray ids = Arguments.createArray();
                    for (SurveyCategory category:categories) {
                        ids.pushInt(category.getId());
                    }
                    map.putArray("categories", ids);
                }
                
                rewardMappingArray.pushMap(map);
            }
        }

        WritableMap response = Arguments.createMap();
        response.putBoolean("byWebView", byWebView);
        response.putArray("rewards", rewardMappingArray);

        sendEvent("OnSurveysClose", response);
    }

    @Override
    public boolean didReceiveInBrainRewards(List<Reward> rewards) {
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
    private Activity getCurrentActivityOrThrow() throws NullCurrentActivityException {
        Activity activity = getCurrentActivity();

        // For some reasons (?), the activity returned here can be null. We need to handle this scenario
        if (activity == null) {
            throw new NullCurrentActivityException();
        }

        return activity;
    }

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

    private SurveyFilter createSurveyFilter(final String placementId, ReadableArray includedCategoryIds, ReadableArray excludedCategoryIds) {
        SurveyFilter filter = new SurveyFilter(placementId);

        if (includedCategoryIds != null && includedCategoryIds.size() > 0) {
            filter.includeCategories = getSurveyCategories(includedCategoryIds);
        }

        if (excludedCategoryIds != null && excludedCategoryIds.size() > 0) {
            filter.excludeCategories = getSurveyCategories(excludedCategoryIds);
        }

        return filter;
    }

    private ArrayList<SurveyCategory> getSurveyCategories(ReadableArray categoryIds) {
        ArrayList<SurveyCategory> mapCategories = new ArrayList<>();
        for (int i = 0; i < categoryIds.size(); i++) {
            mapCategories.add(SurveyCategory.fromId(categoryIds.getInt(i)));
        }

        return mapCategories;
    }
}
