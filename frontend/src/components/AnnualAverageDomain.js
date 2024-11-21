import Grade from "./Grade";

/**
 * Displays the average of a domain in a annual average.
 *
 * @param {array} yearlyUserCourse User course containg all grades made during a selected year.
 *
 * @returns {JSX.Element}
 *
 */
const AnnualAverageDomain = ({ yearlyUserCourse }) =>
{
   return (
       <>
           {yearlyUserCourse.map(teachingDomain => (
                <div key={teachingDomain.id} className="my-4">
                    <div className="w-full p-2 bg-white flex justify-between items-center space-x-2 border-b-4 border-b-blue text-blue">
                        <p className="text-lg">
                            {teachingDomain.title}
                        </p>

                        <Grade grade={teachingDomain.average} />
                    </div>

                    <div className="divide-y-2 divide-black">
                        {teachingDomain.subjects?.map(subject => (
                            <div key={subject.id} className="bg-white flex justify-between items-center space-x-2 p-2">
                                <p className="text-lg">
                                    {subject.name}
                                </p>

                                <div className="flex flex-col justfy-center items-center">
                                    <Grade grade={subject.average} />

                                    {/* TODO : Specfiy what the subgrades are. */}
                                    <div className="flex flex-row justify-center items-center">
                                        {subject.grades.map(grade => (
                                            <div key={grade.id} className="inline-block mx-1">
                                                <Grade grade={grade.grade} isLarge={false} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        ))}

                        {teachingDomain.modules?.map(module => (
                            <div key={module.id} className="bg-white flex justify-between items-center space-x-2 p-2">
                                <p className="text-lg">
                                    {module.name}
                                </p>

                                <Grade grade={module.grade} />
                            </div>
                        ))}
                    </div>
                </div>
           ))}
       </>
   )
}

export default AnnualAverageDomain;