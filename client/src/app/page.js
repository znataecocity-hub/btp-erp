"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import API_URL from "../apiConfig";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    projectsCount: 0,
    totalSpent: 0,
    totalBudget: 0,
    employeesCount: 0,
    brokenEquipment: 0
  });
  const [financialData, setFinancialData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchDashboardData(parsedUser.companyId);
    } else {
      window.location.href = "/login";
    }
  }, []);

  const fetchDashboardData = async (companyId) => {
    try {
      const [summaryRes, financialRes, hrRes, equipRes] = await Promise.all([
        fetch(`${API_URL}/reports/summary?companyId=${companyId}`),
        fetch(`${API_URL}/reports/financial?companyId=${companyId}`),
        fetch(`${API_URL}/hr/employees?companyId=${companyId}`),
        fetch(`${API_URL}/equipment?companyId=${companyId}`)
      ]);

      if (summaryRes.ok && financialRes.ok && hrRes.ok && equipRes.ok) {
        const summary = await summaryRes.json();
        const financial = await financialRes.json();
        const hr = await hrRes.json();
        const equip = await equipRes.json();

        // Calculate KPIs
        const totalSpent = summary.reduce((acc, p) => acc + p.spent, 0);
        const totalBudget = summary.reduce((acc, p) => acc + p.budget, 0);
        const brokenCount = equip.filter(e => e.status === 'BROKEN').length;

        setStats({
          projectsCount: summary.length,
          totalSpent,
          totalBudget,
          employeesCount: hr.length,
          brokenEquipment: brokenCount
        });

        // Prepare Chart Data
        const months = Object.keys(financial);
        const amounts = Object.values(financial);

        setFinancialData({
          labels: months,
          datasets: [
            {
              label: 'Dépenses Mensuelles (MAD)',
              data: amounts,
              fill: true,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              tension: 0.4,
            },
          ],
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value.toLocaleString()} MAD`
        }
      }
    }
  };

  return (
    <div className={`${styles.dashboardContainer} animate-fade-in`}>
      <section className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Tableau de bord Global</h1>
        <p className={styles.welcomeSubtitle}>
          Vue d'ensemble de vos chantiers, finances et ressources.
        </p>
      </section>

      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Chantiers Actifs</span>
            <span>🏗️</span>
          </div>
          <div className={styles.kpiValue}>{stats.projectsCount}</div>
          <div className={styles.kpiFooter}>
            Projets en cours d'exécution
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Dépenses Totales</span>
            <span>💰</span>
          </div>
          <div className={styles.kpiValue}>{(stats.totalSpent / 1000000).toFixed(1)}M MAD</div>
          <div className={styles.kpiFooter}>
            <span className={stats.totalSpent > stats.totalBudget ? styles.trendDown : styles.trendUp}>
              {((stats.totalSpent / (stats.totalBudget || 1)) * 100).toFixed(0)}%
            </span> du budget total
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Effectif Total</span>
            <span>👷</span>
          </div>
          <div className={styles.kpiValue}>{stats.employeesCount}</div>
          <div className={styles.kpiFooter}>
            Collaborateurs enregistrés
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Matériel en Panne</span>
            <span>🚜</span>
          </div>
          <div className={styles.kpiValue}>{stats.brokenEquipment}</div>
          <div className={styles.kpiFooter}>
            <span className={stats.brokenEquipment > 0 ? styles.trendDown : styles.trendUp}>
              {stats.brokenEquipment > 0 ? 'Action requise' : 'Tout est OK'}
            </span>
          </div>
        </div>
      </section>

      <section className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Évolution des Dépenses</h2>
          <div className={styles.chartContainer}>
            {loading ? (
              <p>Chargement du graphique...</p>
            ) : (
              <Line data={financialData} options={chartOptions} />
            )}
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Alertes Récentes</h2>
          <div className={styles.alertsList}>
            {stats.brokenEquipment > 0 && (
              <div className={`${styles.alertItem} ${styles.danger}`}>
                <span className={styles.alertTitle}>Panne Matériel</span>
                <span className={styles.alertDesc}>{stats.brokenEquipment} équipement(s) hors service.</span>
              </div>
            )}
            {stats.totalSpent > stats.totalBudget * 0.9 && (
              <div className={`${styles.alertItem} ${styles.warning}`}>
                <span className={styles.alertTitle}>Alerte Budget</span>
                <span className={styles.alertDesc}>90% du budget global a été consommé.</span>
              </div>
            )}
            <div className={`${styles.alertItem} ${styles.safe}`}>
              <span className={styles.alertTitle}>Système à jour</span>
              <span className={styles.alertDesc}>Toutes les données sont synchronisées.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

