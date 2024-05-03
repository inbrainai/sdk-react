/**
 * SDK OPTIONS
 */
export type NavigationBarConfig = {
    title?: string,
    backgroundColor?: string,
    buttonsColor?: string,
    titleColor?: string,
    hasShadow?: boolean
};

export type StatusBarConfig = {
    lightStatusBar?: boolean,
    statusBarColor?: string, // Android only option. Have no effect at iOS. 
};

/**
 * Option: Data points
 */
export type DataPoints = { [key: string]: string };
