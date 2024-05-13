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
    /**
     * Android only option. Have no effect at iOS.
     */
    statusBarColor?: string, 
};


export type DataPoints = { [key: string]: string };
