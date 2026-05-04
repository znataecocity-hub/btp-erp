"use client";

import { useState, useEffect } from "react";
import styles from "./reports.module.css";
import API_URL from "../../apiConfig";

export default function Reports() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API_URL}/reports/summary`);
      if (res.ok) setSummary(await res.json());
    } catch (error) {
      console.error("Failed to fetch summary", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>📊 Rapports d'Activité</h1>
        <button className="btn-primary" onClick={() => window.print()}>
          🖨️ Imprimer Rapport
        </button>
      </div>

      <div className="grid">
        <div className="card">
          <h2 className={styles.sectionTitle}>État Global des Chantiers</h2>
          {loading ? (
            <p>Chargement du rapport...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Chantier</th>
                  <th>Avancement</th>
                  <th>Budget Total</th>
                  <th>Dépenses Actuelles</th>
                  <th>Utilisation Budget</th>
                </tr>
              </thead>
              <tbody>
                {summary.map(item => (
                  <tr key={item.id}>
                    <td className={styles.projectName}>{item.name}</td>
                    <td>
                      <div className={styles.progressCell}>
                        <div className={styles.progressBarBg}>
                          <div className={styles.progressBarFill} style={{ width: `${item.progress}%` }}></div>
                        </div>
                        <span>{item.progress}%</span>
                      </div>
                    </td>
                    <td>{item.budget.toLocaleString()} MAD</td>
                    <td className={item.spent > item.budget ? styles.overBudget : ""}>
                      {item.spent.toLocaleString()} MAD
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${item.efficiency > 90 ? styles.warning : styles.safe}`}>
                        {item.efficiency.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className="card">
          <h3>Analyse Financière</h3>
          <p className={styles.chartPlaceholder}>[ Graphique de rentabilité en cours de génération... ]</p>
        </div>
        <div className="card">
          <h3>Ressources & Matériel</h3>
          <p className={styles.chartPlaceholder}>[ Taux d'utilisation du parc matériel ]</p>
        </div>
      </div>
    </div>
  );
}
