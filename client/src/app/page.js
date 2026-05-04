import styles from "./page.module.css";

export default function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      {/* Welcome Section */}
      <section className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Tableau de bord Global</h1>
        <p className={styles.welcomeSubtitle}>
          Vue d'ensemble de vos chantiers, finances et ressources.
        </p>
      </section>

      {/* KPI Cards */}
      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Chantiers Actifs</span>
            <span>🏗️</span>
          </div>
          <div className={styles.kpiValue}>12</div>
          <div className={styles.kpiFooter}>
            <span className={styles.trendUp}>+2</span> ce mois-ci
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Budget Consommé</span>
            <span>💰</span>
          </div>
          <div className={styles.kpiValue}>4.2M MAD</div>
          <div className={styles.kpiFooter}>
            <span className={styles.trendDown}>68%</span> du budget total
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Effectif sur Site</span>
            <span>👷</span>
          </div>
          <div className={styles.kpiValue}>145</div>
          <div className={styles.kpiFooter}>
            <span className={styles.trendUp}>98%</span> de présence ajd
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Matériel en Panne</span>
            <span>🚜</span>
          </div>
          <div className={styles.kpiValue}>3</div>
          <div className={styles.kpiFooter}>
            <span className={styles.trendDown}>Action requise</span>
          </div>
        </div>
      </section>

      {/* Charts & Alerts */}
      <section className={styles.chartsSection}>
        {/* Main Chart Area */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Avancement Financier vs Physique</h2>
          <div className={styles.mockChart}>
            {/* We will replace this with Chart.js later */}
            [Graphique d'évolution - Chart.js sera intégré ici]
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Alertes Récentes</h2>
          <div className={styles.alertsList}>
            <div className={`${styles.alertItem} ${styles.danger}`}>
              <span className={styles.alertTitle}>Retard Chantier "Résidence Al Boraq"</span>
              <span className={styles.alertDesc}>Tâche "Fondations" en retard de 4 jours.</span>
            </div>
            <div className={`${styles.alertItem} ${styles.warning}`}>
              <span className={styles.alertTitle}>Dépassement Budget Matériaux</span>
              <span className={styles.alertDesc}>Chantier "Usine Renault" à 110% du budget béton.</span>
            </div>
            <div className={`${styles.alertItem} ${styles.danger}`}>
              <span className={styles.alertTitle}>Panne Tractopelle CAT-01</span>
              <span className={styles.alertDesc}>Signalé par Ahmed T. (Chantier Hydraulique Sud).</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
