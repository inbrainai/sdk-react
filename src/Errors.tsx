/**
 * Known error codes
 */
export type ErrorCode =
    "ERR_SET_INBRAIN" |
    "ERR_SET_INBRAIN_VALUES" |
    "ERR_GET_REWARDS" |
    "ERR_CONFIRM_REWARDS" |
    "ERR_CHECK_SURVEYS_AVAILABLE" |
    "ERR_GET_NATIVE_SURVEYS" |
    "ERR_SHOW_NATIVE_SURVEY" |
    "ERR_SHOW_SURVEYS" |
    "ERR_SET_LANGUAGE" |
    "ERR_SET_TITLE" |
    "ERR_SET_TITLE_COLOR" |
    "ERR_SET_NAVBAR_COLOR" |
    "ERR_SET_BUTTON_COLOR";
  
 type IErrorMessages = {[key in ErrorCode] : string}

 const errorMessages: IErrorMessages = {
    ERR_SET_INBRAIN: "Error while initialising sdk",
    ERR_SET_INBRAIN_VALUES: "Error while initialising sdk",
    ERR_GET_REWARDS: "Error while getting rewards",
    ERR_CONFIRM_REWARDS: "Error while confirming rewards",
    ERR_CHECK_SURVEYS_AVAILABLE: "Error while checking surveys availability",
    ERR_GET_NATIVE_SURVEYS: "Error while getting native surveys",
    ERR_SHOW_NATIVE_SURVEY: "Error while showing native survey",
    ERR_SHOW_SURVEYS: "Error while showing surveys",
    ERR_SET_TITLE: "Error while setting title",
    ERR_SET_LANGUAGE: "Error while setting language",
    ERR_SET_TITLE_COLOR: "Error while setting title color",
    ERR_SET_NAVBAR_COLOR: "Error while setting navbar color",
    ERR_SET_BUTTON_COLOR: "Error while setting button color",
 }

/**
 * Error happening during the SDK calls
 */
export type InBrainError = {
    code: ErrorCode;
    message: string;
    stack: string;
    userInfo: any;
} 

/**
 * Common error formatting
 * @param err original error
 */
export const enhanceError = ( err: InBrainError ) : InBrainError => {
    let prefix = (err && err.code) ? errorMessages[err.code] : "An unexpected error occured";

    return {...err, message: prefix + ". Reason: " + err.message }
}


