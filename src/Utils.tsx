
const REGEX_COLOR = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

/**
 * Assert the color is an hex color (e.g #ffffff)
 * @param color 
 */
export const assertIsColor = (color: string) => {
   if(!color.match(REGEX_COLOR))  {
       throw Error("Color me be an hexadecimal color")
   }
}

