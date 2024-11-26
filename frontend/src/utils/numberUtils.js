/**
 * Rounds a specifiend number to a specified number of decimals.
 *
 * @param {int|float} number Number to round.
 *
 * @param {int} [decimals=1] Number of decimals. 1 by default.
 *
 * @returns {float|null} The rounded number. If below 0, returns null.
 *
 */
export const roundNumber = (number, decimals = 1) =>
{
    const factor = Math.pow(10, decimals);

    const roundedNumber = Math.round(number * factor) / factor;

    if(roundedNumber > 0)
        return roundedNumber;

    else
        return null;
}