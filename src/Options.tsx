/**
 * SDK OPTIONS
 */
export type ConfigOptionName = "production" | "sessionUid" | "userId" | "dataPoints";
export type StylingOptionName = "title" | "navbarColor";
export type InitOptionName = ConfigOptionName | StylingOptionName;

// *** CONFIG OPTION TYPES
export type ConfigOptionTypes = {
    production: boolean, 
    sessionUid: string, 
    userId: string, 
    dataPoints: DataPoints
}
export type ConfigOptions = {[opt in ConfigOptionName]?: ConfigOptionTypes[opt] }

// *** STYLING OPTION TYPES
export type StylingOptionType = {
    title: string, 
    navbarColor: string
};
export type StylingOptions = {[opt in StylingOptionName]?: StylingOptionType[opt] }

// *** GLOBAL OPTIONS
export type InitOptions = ConfigOptions & StylingOptions;

/**
 * Option: Data points
 */
export type DataPoints = {[key: string] : string};
