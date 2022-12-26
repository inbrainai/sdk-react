package com.inbrain;

import android.app.Activity;
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
import com.inbrain.sdk.config.StatusBarConfig;
import com.inbrain.sdk.config.ToolBarConfig;
import com.inbrain.sdk.model.Reward;
import com.inbrain.sdk.model.Survey;
import com.inbrain.sdk.model.SurveyCategory;
import com.inbrain.sdk.model.SurveyFilter;
import android.util.Log;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Nullable;

public class InBrainSurveysModule extends ReactContextBaseJavaModule implements InBrainCallback {

    private final ReactApplicationContext reactContext;
    private HashMap sessionData;
    private String sessionID;

    public InBrainSurveysModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        //TMP
        this.sessionID = null;
        this.sessionData = null;
    }

    @Override
    public String getName() {
        return "InBrainSurveys";
    }

    // ***********************
    // ***** SET INBRAIN *****
    // ***********************
    @ReactMethod
    public void setInBrain(final String apiClientId, final String clientSecret, final String userId, final Promise promise) {
        try {
            // Validate parameters
            notNull("apiClientId", apiClientId);
            notNull("clientSecret", clientSecret);
            notNull("userId", userId);

            //hardcoded isS2S (always True)
            Boolean isS2S = true;

            // Set the listener
            InBrain.getInstance().removeCallback(this);
            InBrain.getInstance().addCallback(this);

            // Needs to be in main thread
            new Handler(Looper.getMainLooper()).post(new Runnable() {
                @Override
                public void run() {
                    try {
                        // Call Braintree sdk
                        InBrain.getInstance().setInBrain(getReactApplicationContext(), apiClientId, clientSecret, isS2S, userId);
                        // Everything went well, resolve the promise
                        promise.resolve(null);
                    } catch (Exception e) {
                        promise.reject("ERR_SET_INBRAIN", e.getMessage(), e);
                    }
                }
            });

        } catch (Exception e) {
            promise.reject("ERR_SET_INBRAIN", e.getMessage(), e);
        }
    }

    // **********************************
    // ***** SET INBRAIN VALUES FOR *****
    // **********************************
    @ReactMethod
    public void setInBrainValuesFor(final String sessionId, final ReadableMap data, Promise promise) {

        new InBrainSDKParamSetter<HashMap<String, String>>() {
            @Override
            public void setParam(HashMap<String, String> param) {
                InBrain.getInstance().setInBrainValuesFor(sessionId, toHashMap(data));
            }
        }.apply(promise, "values", toHashMap(data), "ERR_SET_INBRAIN_VALUES");

    }

    // **********************************
    // ***** SET INBRAIN SESSION ID *****
    // **********************************
    @ReactMethod
    public void setSessionID(final String sessionId) {
        //tmp data until android sdk new version
        this.sessionID = sessionId;
        HashMap<String, String> data = this.sessionData;
        InBrain.getInstance().setInBrainValuesFor(sessionId, data);
    }

    // **********************************
    // ***** SET INBRAIN DATA POINTS *****
    // **********************************
    @ReactMethod
    public void setDataOptions(final ReadableMap data) {
        //tmp data until android sdk new version
        this.sessionData = toHashMap(data);
        String sessionId = this.sessionID;
        InBrain.getInstance().setInBrainValuesFor(sessionId, toHashMap(data));
    }

    // ************************
    // ***** SHOW SURVEYS *****
    // ************************
    @ReactMethod
    public void showSurveys(final Promise promise) {
        try {

            // Build the callback
            final StartSurveysCallback callback = new StartSurveysCallback() {
                public void onSuccess() {
                    promise.resolve(null);
                }

                public void onFail(String message) {
                    promise.reject("ERR_SHOW_SURVEYS", message);
                }

            };

            // Call braintree SDK
            // Needs to be on the UI Thread. Errors were reported when not:
            // java.lang.IllegalStateException: Calling View methods on another thread than the UI thread.
            UiThreadUtil.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        InBrain.getInstance().showSurveys(getCurrentActivityOrThrow(), callback);
                    } catch (NullCurrentActivityException e) {
                        promise.reject("ERR_NULL_CURRENT_ACTIVITY", e.getMessage(), e);
                    } catch (Exception e) {
                        promise.reject("ERR_SHOW_SURVEYS", e.getMessage(), e);
                    }
                }
            });

        } catch (Exception e) {
            promise.reject("ERR_SHOW_SURVEYS", e.getMessage(), e);
        }
    }


    // ************************x
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

    // ***********************************
    // ***** CHECK SURVEYS AVAILABLE *****
    // ***********************************
    @ReactMethod
    public void checkSurveysAvailable(final Promise promise) {
        try {

            InBrain.getInstance().areSurveysAvailable(getReactApplicationContext(), new SurveysAvailableCallback() {
                @Override
                public void onSurveysAvailable(boolean available) {
                    promise.resolve(available);
                }
            });

        } catch (Exception e) {
            promise.reject("ERR_CHECK_SURVEYS_AVAILABLE", e.getMessage(), e);
        }
    }

    // *******************************
    // ***** GET NATIVE SURVEYS ******
    // *******************************
    @ReactMethod
    public void getNativeSurveys(final String placementId, ReadableArray categoryIds, ReadableArray excludedCategoryIds, final Promise promise) {
        try {
            SurveyFilter filter = new SurveyFilter();
            filter.placementId = placementId;
            if (categoryIds != null && categoryIds.size() > 0) {
                filter.includeCategories = new ArrayList<>();
                for (int i = 0; i < categoryIds.size(); i++) {
                    filter.includeCategories.add(SurveyCategory.fromId(categoryIds.getInt(i)));
                }
            }

            if (excludedCategoryIds != null && excludedCategoryIds.size() > 0) {
                filter.excludeCategories = new ArrayList<>();
                for (int i = 0; i < excludedCategoryIds.size(); i++) {
                    filter.excludeCategories.add(SurveyCategory.fromId(excludedCategoryIds.getInt(i)));
                }
            }

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
                        map.putDouble("multiplier", survey.multiplier);

                        WritableArray categories = Arguments.createArray();
                        WritableArray namedCategories = Arguments.createArray();
                        for (SurveyCategory category:survey.categories) {
                            WritableMap categoryNamed = Arguments.createMap();
                            categoryNamed.putInt("id", category.getId());
                            categoryNamed.putString("name", categoriesMap(category.name()));
                            namedCategories.pushMap(categoryNamed);
                            categories.pushInt(category.getId());
                        }

                        map.putArray("categories", categories);
                        map.putArray("namedCategories", namedCategories);

                        WritableMap conversionLevel = Arguments.createMap();
                        conversionLevel.putInt("id", survey.conversionThreshold);
                        conversionLevel.putString("name", conversionMap(survey.conversionThreshold));
                        map.putMap("conversionLevel", conversionLevel);

                        array.pushMap(map);
                    }

                    // Resolve promise with the list of surveys
                    promise.resolve(array);

                }
            });

        } catch (Exception e) {
            promise.reject("ERR_GET_NATIVE_SURVEYS", e.getMessage(), e);
        }
    }

    // *******************************
    // ***** SHOW NATIVE SURVEY ******
    // *******************************
    @ReactMethod
    public void showNativeSurvey(final String id, final String searchId, final Promise promise) {
        try {

            // Call braintree SDK
            // Needs to be on the UI Thread. Errors were reported when not:
            // java.lang.IllegalStateException: Calling View methods on another thread than the UI thread.
            UiThreadUtil.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        InBrain.getInstance().showNativeSurveyWith(getCurrentActivityOrThrow(), id, searchId, new StartSurveysCallback() {
                            @Override
                            public void onSuccess() {
                                promise.resolve(true);
                            }

                            @Override
                            public void onFail(String message) {
                                promise.reject("ERR_SHOW_NATIVE_SURVEY", message);
                            }
                        });
                    } catch (NullCurrentActivityException e) {
                        promise.reject("ERR_NULL_CURRENT_ACTIVITY", e.getMessage(), e);
                    } catch (Exception e) {
                        promise.reject("ERR_SHOW_NATIVE_SURVEY", e.getMessage(), e);
                    }
                }
            });

        } catch (Exception e) {
            promise.reject("ERR_SHOW_NATIVE_SURVEY", e.getMessage(), e);
        }
    }

    // **************************
    // ***** SET VIEW TITLE *****
    // **************************
    @ReactMethod
    public void setTitle(final String title, Promise promise) {

        new InBrainSDKParamSetter<String>() {
            @Override
            public void setParam(String param) {
                // This method doesn't exist in the Android SDK as setting the title is part of setNavigationBarConfig
                // This is just here so we don't have to add any condition in the RN code.
            }
        }.apply(promise, "title", title, "ERR_SET_TITLE");

    }

    // *************************************
    // ***** SET NAVIGATION BAR CONFIG *****
    // *************************************
    @ReactMethod
    public void setNavigationBarConfig(final ReadableMap configMap, Promise promise) {
        final ToolBarConfig config = new ToolBarConfig();


        // Forwarding to SDK
        new InBrainSDKParamSetter<ToolBarConfig>() {
            @Override
            public void setParam(ToolBarConfig param) {

                // Extract parameters
                new ColorMapParamExtractor(configMap, "backgroundColor") {

                    @Override
                    public void setParam(Integer color) {
                        config.setToolbarColor(color);
                    }
                };
                new ColorMapParamExtractor(configMap, "buttonsColor") {

                    @Override
                    public void setParam(Integer color) {
                        config.setBackButtonColor(color);
                    }
                };
                new ColorMapParamExtractor(configMap, "titleColor") {

                    @Override
                    public void setParam(Integer color) {
                        config.setTitleColor(color);
                    }
                };
                new BooleanMapParamExtractor(configMap, "hasShadow") {

                    @Override
                    public void setParam(Boolean elevationEnabled) {
                        config.setElevationEnabled(elevationEnabled);
                    }
                };
                new StringMapParamExtractor(configMap, "title") {

                    @Override
                    public void setParam(String title) {
                        config.setTitle(title);
                    }
                };

                // Finally call InBrain
                InBrain.getInstance().setToolbarConfig(param);
            }
        }.apply(promise, "navigationBarConfig", config, "ERR_SET_NAVIGATION_BAR_CONFIG");

    }


    // *********************************
    // ***** SET STATUS BAR CONFIG *****
    // *********************************
    @ReactMethod
    public void setStatusBarConfig(final ReadableMap configMap, Promise promise) {
        final StatusBarConfig config = new StatusBarConfig();


        // Forwarding to SDK
        new InBrainSDKParamSetter<StatusBarConfig>() {
            @Override
            public void setParam(StatusBarConfig param) {

                // Extract parameters
                new BooleanMapParamExtractor(configMap, "lightStatusBar") {

                    @Override
                    public void setParam(Boolean lightStatusBar) {
                        config.setStatusBarIconsLight(lightStatusBar);
                    }
                };
                new ColorMapParamExtractor(configMap, "statusBarColor") {

                    @Override
                    public void setParam(Integer color) {
                        config.setStatusBarColor(color);
                    }
                };

                // Finally call InBrain
                InBrain.getInstance().setStatusBarConfig(param);
            }
        }.apply(promise, "statusBarConfig", config, "ERR_SET_STATUS_BAR_CONFIG");

    }


    @ReactMethod
    public void addListener(String eventName) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    // ***********************
    // ***** SET LANGUAGE ****
    // ***********************
    @ReactMethod
    public void setLanguage(final String language, Promise promise) {

        new InBrainSDKParamSetter<String>() {
            @Override
            public void setParam(String param) {
                InBrain.getInstance().setLanguage(language);
            }
        }.apply(promise, "language", language, "ERR_SET_LANGUAGE");

    }

    // ********************
    // ***** LISTENERS ****
    // ********************
    @Override
    public void surveysClosed() {
        sendEvent("OnClose", null);
    }

    @Override
    public void surveysClosedFromPage() {
        sendEvent("OnCloseFromPage", null);
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

    private String categoriesMap(String categoryName) {
        switch (categoryName) {
            case "Automotive" :
                return "Automotive";
            case "BeveragesAlcoholic" :
                return "Beverages Alcoholic";
            case "BeveragesNonAlcoholic" :
                return "Beverages Non Alcoholic";
            case "Business" :
                return "Business";
            case "ChildrenAndParenting" :
                return "Children & Parenting";
            case "CoalitionLoyaltyPrograms" :
                return "Coalition Loyalty Programs";
            case "DestinationsAndTourism" :
                return "Destinations & Tourism";
            case "Education" :
                return "Education";
            case "ElectronicsComputerSoftware" :
                return "Electronics, Computer Software";
            case "EntertainmentAndLeisure" :
                return "Entertainment And Leisure";
            case "FinanceBankingInvestingAndInsurance" :
                return "Finance, Banking, Investing & Insurance";
            case "Food" :
                return "Food";
            case "GamblingLottery" :
                return "Gambling, Lottery";
            case "GovernmentAndPolitics" :
                return "Government & Politics";
            case "HealthCare" :
                return "HealthCare";
            case "Home" :
                return "Home";
            case "MediaAndPublishing" :
                return "Media & Publishing";
            case "PersonalCare" :
                return "Personal Care";
            case "Restaurants" :
                return "Restaurants";
            case "SensitiveExplicitContent" :
                return "Sensitive & Explicit Content";
            case "SmokingTobacco" :
                return "Smoking & Tobacco";
            case "SocialResearch" :
                return "Social Research";
            case "SportsRecreationFitness" :
                return "Sports Recreation Fitness";
            case "Telecommunications" :
                return "Telecommunications";
            case "Transportation" :
                return "Transportation";
            case "TravelAirlines" :
                return "Travel - Airlines";
            case "TravelHotels" :
                return "Travel - Hotels";
            case "TravelServicesAgencyBooking" :
                return "Travel - Services, Agency, Booking";
            case "CreditCards" :
                return "Credit Cards";
            case "VideoGames" :
                return "Video Games";
            case "FashionAndClothingOther" :
                return "Fashion & Clothing - Other";
            case "FashionAndClothingDepartmentStore" :
                return "Fashion & Clothing - Department Store";
            default:
                return "Unknown";
        }
    }


    private String conversionMap(Integer conversionId) {
        switch (conversionId) {
            case 0 :
                return "New Survey";
            case 1 :
                return "Very Poor Conversion";
            case 2 :
                return "Poor Conversion";
            case 3 :
                return "Fair Conversion";
            case 4 :
                return "Good Conversion";
            case 5 :
                return "Very Good Conversion";
            case 6 :
                return "Excellent Conversion";
            default:
                return "Unknown";
        }
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

    protected abstract class InBrainSDKParamSetter<T> {

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
