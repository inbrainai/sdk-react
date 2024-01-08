
import { enhanceError } from './Errors';


/**
 * Assert the color is an hex color (e.g #ffffff)
 * @param color
 */
const REGEX_COLOR = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
export const assertIsColor = (color: string) => {
    if (!color.match(REGEX_COLOR)) {
        throw Error("Color me be an hexadecimal color with # (e.g #FF0000)")
    }
};

/**
* Assert the value is not null or empty
* @param attributeName name of attribute for logging purpose
* @param attributevalue value of attribute
*/
export const assertNotNullNorEmpty = (attributeName: string, attributeValue: string) => {
    if (!attributeValue || attributeValue.trim() == "") {
        throw Error(`${attributeName} must not be null or empty`)
    }
};

/**
 * Wrap a promise call to add common functionnalities
 * @param promise promise to call
 */
export type PromiseSupplier<T> = () => Promise<T>
export const wrapPromise = async <T extends {} | void>(promiseSupplier: PromiseSupplier<T>, count = 0): Promise<T> => {
    try {
        return await promiseSupplier()
    } catch (err: any) {
        // If error corresponds to null activity (happens occasionally in Android), then we retry
        if (err.code == 'ERR_NULL_CURRENT_ACTIVITY' && count < 10) {
            await timeout(50); // -- sleep 50ms
            return wrapPromise(promiseSupplier, count + 1)
        }

        // Else, throw the enhanced error
        throw enhanceError(err)
    }
};

/**
 *
 * @param ms
 */
const timeout = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
};


/**
 *
 * @param id
 */
const getCategoryName = (categoryId: number): string => {

    switch (categoryId) {
        case 1 :
            return "Automotive";
        case 2 :
            return "Beverages Alcoholic";
        case 3 :
            return "Beverages Non Alcoholic";
        case 4 :
            return "Business";
        case 5 :
            return "Children & Parenting";
        case 6 :
            return "Coalition Loyalty Programs";
        case 7 :
            return "Destinations & Tourism";
        case 8 :
            return "Education";
        case 9 :
            return "Electronics, Computer Software";
        case 10 :
            return "Entertainment And Leisure";
        case 11 :
            return "Finance, Banking, Investing & Insurance";
        case 12 :
            return "Food";
        case 13 :
            return "Gambling, Lottery";
        case 14 :
            return "Government & Politics";
        case 15 :
            return "HealthCare";
        case 16 :
            return "Home";
        case 17 :
            return "Media & Publishing";
        case 18 :
            return "Personal Care";
        case 19 :
            return "Restaurants";
        case 20 :
            return "Sensitive & Explicit Content";
        case 21 :
            return "Smoking & Tobacco";
        case 22 :
            return "Social Research";
        case 23 :
            return "Sports Recreation Fitness";
        case 24 :
            return "Telecommunications";
        case 25 :
            return "Transportation";
        case 26 :
            return "Travel - Airlines";
        case 27 :
            return "Travel - Hotels";
        case 28 :
            return "Travel - Services, Agency, Booking";
        case 29 :
            return "Credit Cards";
        case 30 :
            return "Video Games";
        case 31 :
            return "Fashion & Clothing - Other";
        case 32 :
            return "Fashion & Clothing - Department Store";
        default:
            return "Unknown";
    
    }
};

/**
 *
 * @param categories
 */
export const mapCategories = (categories: []): { id: number, name: string }[] => {

    // @TODO ADD NULL CHECK 

    let namedCategories = categories.map( (categoryId) => {
        return { id: categoryId, name: getCategoryName(categoryId)};
    })

    return namedCategories;
};

/**
 *
 * @param categories
 */
export const updateData = (categories: []): { id: number, name: string }[] => {

    // @TODO ADD NULL CHECK 

    let namedCategories = categories.map( (categoryId) => {
        return { id: categoryId, name: getCategoryName(categoryId)};
    })

    return namedCategories;
};

