import { useEffect, useState } from "react";
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
    // List of all summaries
    const [schoolReportsSummaries, setSchoolReportsSummaries] = useState([]);

    // List of all summaries filtered by the searchbar
    const [filteredList, setFilteredList] = useState([]);

    const [searchBar, setSearchBar] = useState("");

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

    // Filters the list by apprentice name when typing in the searchbar
    useEffect(() =>
    {
        if(searchBar !== "")
            setFilteredList(schoolReportsSummaries.filter(
                summary => summary.username.toLowerCase()
                    .includes(searchBar.toLowerCase())
            ));

        else
            setFilteredList(schoolReportsSummaries);
    }, [searchBar, schoolReportsSummaries])

    useEffect(() =>
    {
        const fetchData = async () =>
        {
            try
            {
                const data = await getSchoolReportsSummaries();
                setSchoolReportsSummaries(data);
                setFilteredList(data);
            }

            catch(error)
            {
                console.error("Erreur lors de l'affichage des données.", error)
            }

            finally
            {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [])

    return (
        <div className="space-y-4">
            <h1>Liste des bulletins de notes des apprentis</h1>

            <div className="w-full p-3 bg-beige-light
                sm:w-1/2 sm:m-auto sm:rounded-md
                xl:w-1/3">
                <input type="text" value={searchBar}
                    onChange={handleSearchBar} placeholder="Rechercher un apprenti..."
                    className="w-full px-2 py-1 rounded-sm"
                />
            </div>

            {isLoading ?
                <Loading />
            :
                <>
                    {filteredList.length > 0 ?
                        filteredList?.map(schoolReportSummary =>
                        (
                            <Apprentice key={schoolReportSummary.user_id}
                                apprentice={schoolReportSummary} showLink={true} />
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