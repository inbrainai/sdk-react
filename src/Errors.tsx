/**
 * Known error codes
 */
export type ErrorCode =
    "ERR_INIT" |
    "ERR_GET_REWARDS" |
    "ERR_CONFIRM_REWARDS" |
    "ERR_SHOW_SURVEYS" |
    "ERR_SET_DATA_POINTS" |
    "ERR_SET_USER_ID" |
    "ERR_SET_SESSION_ID" |
    "ERR_SET_TITLE" |
    "ERR_SET_NAVBAR_COLOR" |
    "ERR_SET_BUTTON_COLOR";
  
 type IErrorMessages = {[key in ErrorCode] : string}

 const errorMessages: IErrorMessages = {
    ERR_INIT: "Error while initialising sdk",
    ERR_SET_DATA_POINTS: "Error while setting data points",
    ERR_SET_TITLE: "Error while setting title",
    ERR_SET_USER_ID: "Error while setting app user id",
    ERR_SET_SESSION_ID: "Error while setting session id",
    ERR_SHOW_SURVEYS: "Error while showing surveys",
    ERR_GET_REWARDS: "Error while getting rewards",
    ERR_CONFIRM_REWARDS: "Error while confirming rewards",
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


