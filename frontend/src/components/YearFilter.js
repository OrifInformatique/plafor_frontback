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