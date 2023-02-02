/**
 * SDK OPTIONS
 */

export type NavigationBarConfig = {
    title?: String,

    backgroundColor?: String,
    buttonsColor?: String,
    titleColor?: String,
    hasShadow?: boolean
};

export type StatusBarConfig = {
    lightStatusBar?: boolean,
    
    /**
     * Android only option. Have no effect at iOS.
     */
    statusBarColor?: string,
};

/**
 * Option: Data points
 */
export type DataPoints = { [key: string]: string };

// ----------------------- Deprecated -------------------------------

export type ConfigOptionName = "isS2S" | "userId" | "sessionUid" | "dataPoints";
export type StylingOptionName = "title" | "language" | "navigationBar" | "statusBar";
export type NavigationBarOptionName = "backgroundColor" | "buttonsColor" | "titleColor" | "hasShadow";
export type StatusBarOptionName = "lightStatusBar";

/**
 * @deprecated Please, use `setSessionID` and `setUserID` functions instead
 */
export type ConfigOptionTypes = {
    isS2S: boolean,
    sessionUid: string,
    userId: string,
    dataPoints: DataPoints,
}

/**
 * @deprecated Please, use `NavigationBarConfig` and `setNavigationBarConfig` function instead.
 */
export type NavigationBarOptionType = {
    backgroundColor?: string,
    buttonsColor?: string,
    titleColor?: string,
    hasShadow?: boolean
};

/**
 * @deprecated Please, use `StatusBarConfig` and `setStatusBarConfig` function instead.
 */
export type StatusBarOptionType = {
    lightStatusBar?: boolean,
    //statusBarColor?: string,
};

/**
 * @deprecated Please use `StatusBarConfig` with `setStatusBarConfig` and `NavigationBarConfig` with `setNavigationBarConfig` function instead
 */
export type StylingOptionType = {
    language?: String
    title?: String
    navigationBar?: NavigationBarOptionType
    statusBar?: StatusBarOptions
};

export type InitOptions = ConfigOptions & StylingOptions;

export type ConfigOptions = { [opt in ConfigOptionName]?: ConfigOptionTypes[opt] }
export type NavitagionBarOptions = { [opt in NavigationBarOptionName]?: NavigationBarOptionType[opt] }
export type StatusBarOptions = { [opt in StatusBarOptionName]?: StatusBarOptionType[opt] }
export type StylingOptions = { [opt in StylingOptionName]?: StylingOptionType[opt] }