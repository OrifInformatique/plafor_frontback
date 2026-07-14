import React, { useEffect, useState } from "react";
import ProgressReport from "../../views/progress-report/ProgressReport";
import {
  getCoursePlans,
  getCoursePlanSections,
} from "../../../../services/api/course-plans";

/**
 * ProgressReportContainer
 *
 * Composant "smart" de la feature progress-report. Il détient l'état
 * (formation sélectionnée + sections), va chercher les données via le service
 * `course-plans`, gère le chargement / les erreurs, puis alimente le composant
 * bête <ProgressReport />. La vue reste 100 % présentationnelle.
 */
export default function ProgressReportContainer() {
  const [coursePlans, setCoursePlans] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1) Charger la liste des formations, une seule fois, au montage.
  useEffect(() => {
    let ignore = false;

    getCoursePlans()
      .then((plans) => {
        if (ignore) return;
        setCoursePlans(plans);
        // Confort : présélectionner la première formation s'il y en a une.
        if (plans.length > 0) setSelectedId(plans[0].id);
      })
      .catch((err) => {
        if (!ignore) setError(err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // 2) Recharger les sections à chaque changement de formation sélectionnée.
  useEffect(() => {
    if (!selectedId) {
      setSections([]);
      return;
    }

    let ignore = false;

    getCoursePlanSections(selectedId)
      .then((data) => {
        if (!ignore) setSections(data);
      })
      .catch((err) => {
        if (!ignore) setError(err);
      });

    // Garde-fou : si la sélection change avant l'arrivée de la réponse,
    // on ignore cette réponse-là (protection contre les réponses en désordre).
    return () => {
      ignore = true;
    };
  }, [selectedId]);

  // 3) Dérivé (pas un état) : on retrouve l'objet complet depuis l'id.
  //    Source unique de vérité = selectedId.
  const selectedCoursePlan =
    coursePlans.find((cp) => cp.id === selectedId) ?? null;

  // 4) Le handler ne fait que changer l'id ; l'effet ci-dessus recharge
  //    les sections tout seul.
  const handleCoursePlanChange = (value) => {
    setSelectedId(value);
  };

  // États de bord : à remplacer par tes composants/traductions dédiés.
  if (loading) {
    return <div data-testid="progress-report-loading">Chargement…</div>;
  }

  if (error) {
    return (
      <div data-testid="progress-report-error">
        Une erreur est survenue lors du chargement des formations.
      </div>
    );
  }

  return (
    <ProgressReport
      coursePlans={coursePlans}
      selectedCoursePlan={selectedCoursePlan}
      onCoursePlanChange={handleCoursePlanChange}
      sections={sections}
    />
  );
}
