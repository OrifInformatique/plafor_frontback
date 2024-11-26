import Grade from "./Grade"
import TeachingDomainTable from "./TeachingDomainTable"
import { useState, useEffect } from "react";
import { roundNumber } from "../utils/numberUtils";
import { CalculateSubjectAverage, CalculateDomainModulesAverage } from "../utils/teachingUtils";

/**
 * Displays the details of a teaching domain, in the school report details.
 *
 * @param {array} teachingDomain
 *
 * @returns {JSX.Element}
 *
 */
const TeachingDomain = ({ teachingDomain }) =>
{
    const [domainAverage, setDomainAverage] = useState(null);

    useEffect(() =>
    {
        if(teachingDomain.subjects)
        {
            const domainAverage = teachingDomain.subjects.reduce((sum, subject) => {
                const subjectAverage = CalculateSubjectAverage(subject);
                return sum + subjectAverage * subject.weight;
            }, 0);

            setDomainAverage(roundNumber(domainAverage));
        }

        else if(teachingDomain.modules)
        {
            const schoolModules = teachingDomain.modules.filter(module => module.is_school);
            const nonSchoolModules = teachingDomain.modules.filter(module => !module.is_school);

            const modulesAverage = CalculateDomainModulesAverage(schoolModules, nonSchoolModules);

            setDomainAverage(roundNumber(modulesAverage));
        }
    }, [teachingDomain]);

    /**
     * Opens or closes the details of a teaching domain.
     *
     * @param {int} teachingDomainId ID of the teaching domain.
     *
     * @returns {void}
     *
     */
    const toggleDetails = (teachingDomainId) =>
    {
        const child = document.getElementById(`teaching-domain-details-${teachingDomainId}`)

        if (child.style.maxHeight)
            child.style.maxHeight = null;

        else
            // The extra 15px are for the horizontal scrollbar height (for subjects)
            child.style.maxHeight = `${child.scrollHeight + 15}px`;

        document.getElementById(`teaching-domain-${teachingDomainId}`)
            .classList.toggle("sm:rounded-b-md");
    }

    return (
        <div className="my-4">
            <div id={`teaching-domain-${teachingDomain.id}`}
                className="w-full p-3 bg-beige-light flex justify-between items-center transition-colors space-x-2
                sm:w-1/2 sm:m-auto sm:rounded-t-md sm:rounded-b-md
                xl:w-1/3
                hover:bg-beige-dark hover:cursor-pointer"
                onClick={() => toggleDetails(teachingDomain.id)}>
                <p className="text-lg select-none">
                    {teachingDomain.title}

                    {teachingDomain.is_eliminatory && (
                        <em className="block -mt-2 text-sm text-rose-500">
                            Éliminatoire
                        </em>
                    )}
                </p>

                <div className="flex flex-col justify-center content-center select-none">
                    <Grade grade={domainAverage} />

                    <p className="-mt-2">
                        ({teachingDomain.weight * 100}%)
                    </p>
                </div>
            </div>

            <div id={`teaching-domain-details-${teachingDomain.id}`}
                className="w-full bg-beige flex flex-col content-center overflow-x-auto
                sm:w-1/2 sm:m-auto sm:rounded-b-md
                xl:w-1/3
                max-h-0 overflow-hidden transition-all duration-[425ms]">
                {teachingDomain.subjects &&
                    <TeachingDomainTable subjects={teachingDomain.subjects} />
                }

                {teachingDomain.modules &&
                    <TeachingDomainTable modules={teachingDomain.modules} />
                }
            </div>
        </div>
    )
}

export default TeachingDomain;