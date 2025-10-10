import React from 'react';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getSchoolReportsSummaries } from "../services/api/school_reports";

import Apprentice from "../components/Apprentice";
import Loading from "../components/Loading";
import NoResults from "../components/NoResults";

/**
 * Displays the list of all apprentices, with their user courses and their global averages.
 *
 * @returns {JSX.Element}
 *
 */
const SchoolReportList = () =>
{
    const { t } = useTranslation(["titles", "apprenticesList"]);

    // List of all summaries
    const [schoolReportsSummaries, setSchoolReportsSummaries] = useState([]);

    const [trainers, setTrainers] = useState([]);

    // List of all summaries filtered by the searchbar
    const [filteredList, setFilteredList] = useState([]);

    const [searchBar, setSearchBar] = useState("");
    const [trainerFilter, setTrainerFilter] = useState("all");

    const [isLoading, setIsLoading] = useState(true);

    /**
     * Updates the content of the searchbar when typing.
     *
     * @param {Event} event OnChange event.
     *
     * @returns {void}
     *
     */
    const handleSearchBar = (event) =>
    {
        setSearchBar(event.target.value);
    }

    /**
     * Updates the trainer filter when selected.
     *
     * @param {Event} event OnChange event.
     *
     * @returns {void}
     *
     */
    const handleTrainersFilter = (event) =>
    {
        setTrainerFilter(event.target.value)
    }

    // Filters the list when selecting a trainer or typing in the searchbar
    useEffect(() =>
    {
        let filteredData = schoolReportsSummaries;

        switch(trainerFilter)
        {
            case "all":
                // filteredData = schoolReportsSummaries;
                break;

            case "unassigned":
                filteredData = filteredData.filter(
                    apprentice => apprentice.fk_trainer === null
                );
                break;

            default:
                filteredData = filteredData.filter(
                    apprentice => apprentice.fk_trainer === parseInt(trainerFilter)
                );
        }

        if(searchBar !== "")
            filteredData = filteredData.filter(
                apprentice => apprentice.username.toLowerCase()
                    .includes(searchBar.toLowerCase())
            );

        setFilteredList(filteredData);

    }, [searchBar, trainerFilter, schoolReportsSummaries])

    /**
     * Fetches school report summaries.
     *
     * @returns {void}
     *
     */
    const fetchSchoolReportSummaries = async () =>
    {
        const data = await getSchoolReportsSummaries();

        if(data?.apprentices && data?.trainers)
        {
            setSchoolReportsSummaries(data.apprentices);
            setFilteredList(data.apprentices);
            setTrainers(data.trainers);
        }

        setIsLoading(false);
    }

    useEffect(() =>
    {
        fetchSchoolReportSummaries();
    }, [])

    return (
        <div
            className="space-y-4"
            data-testid="school-summaries-container"
        >
            <h1 data-testid="school-summaries-title">
                {t("school_report_list", { ns: "titles" })}
            </h1>

            <div
                className="w-full p-3 bg-beige-light space-x-2 flex justify-between items-center
                sm:w-1/2 sm:m-auto sm:rounded-md xl:w-1/3"
                data-testid="school-summaries-filters-container"
            >
                <select
                    className="basis-1/3 max-w-24 sm:max-w-36 px-2 py-1 rounded-sm"
                    onChange={handleTrainersFilter}
                    data-testid="school-summaries-trainer-filter"
                >
                    <option
                        value="all"
                        data-testid="school-summaries-trainers-filters-all-option"
                    >
                        {t("all", { ns: "apprenticesList" })}
                    </option>

                    <option
                        value="unassigned"
                        data-testid="school-summaries-trainers-filters-unassigned-option"
                    >
                        {t("unassigned", { ns: "apprenticesList" })}
                    </option>

                    {trainers?.map(trainer => (
                        <option
                            key={trainer.user_id}
                            value={trainer.user_id}
                            data-testid="school-summaries-trainers-filters-dynamic-option"
                        >
                            {trainer.username.length > 40 ?
                                trainer.username.slice(0, 39) + "..."
                            :
                                trainer.username
                            }
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    value={searchBar}
                    onChange={handleSearchBar}
                    placeholder={t("search_for_apprentice", { ns: "apprenticesList" })}
                    className="basis-2/3 px-2 py-1 rounded-sm"
                    data-testid="school-summaries-apprentice-name-filter"
                />
            </div>

            {isLoading ?
                <Loading />
            :
                <>
                    {filteredList?.length > 0 ?
                        filteredList.map(schoolReportSummary =>
                        (
                            <Apprentice
                                key={schoolReportSummary.user_id}
                                apprentice={schoolReportSummary}
                                showLink={true}
                            />
                        ))
                    :
                        <NoResults />
                    }
                </>
            }
        </div>
    )
}

export default SchoolReportList;