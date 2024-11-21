/**
 * Displays the years filters for the annaul averages.
 *
 * @param {int} yearNum The n year from the beginning of the course plan.
 * This is used to create the text in the options dynamically.
 *
 * @param {string[]} year The start and end date of the school year.
 *
 * @param {Function} setSelectedYear SetState to update the selected year value.
 *
 * @param {boolean} selected Defines whether this year is the selected year.
 *
 * @returns {JSX.Element}
 *
 */
const YearFilter = ({ yearNum, year, setSelectedYear, selected }) =>
{
    let prefix = "ème";

    if(yearNum === 1)
    {
        prefix = "ère";
    }

    return (
        <div className={`basis-1/4 p-1 text-center text-lg border-b-2 border-transparent transition-all
        hover:border-b-blue-light hover:cursor-pointer
        sm:basis-1/6
        ${selected && "border-b-blue-light text-blue-light"}`}
        onClick={() => setSelectedYear(year)}>
            {yearNum + prefix}
        </div>
    )
}

export default YearFilter;