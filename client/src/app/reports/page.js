"use client";

import { useState, useEffect } from "react";
import styles from "./reports.module.css";
import API_URL from "../../apiConfig";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function Reports() {
  const [summary, setSummary] = useState([]);
  const [equipStats, setEquipStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchData(parsedUser.companyId);
    } else {
      window.location.href = "/login";
    }
  }, []);

  const fetchData = async (companyId) => {
    try {
      const [summaryRes, equipRes] = await Promise.all([
        fetch(`${API_URL}/reports/summary?companyId=${companyId}`),
        fetch(`${API_URL}/reports/equipment-stats?companyId=${companyId}`)
      ]);
      if (summaryRes.ok) setSummary(await summaryRes.json());
      if (equipRes.ok) setEquipStats(await equipRes.json());
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Rapport d'Activité BTP ERP", 14, 15);
    doc.setFontSize(10);
    doc.text(`Généré le : ${new Date().toLocaleString()}`, 14, 22);

    const tableData = summary.map(item => [
      item.name,
      `${item.progress}%`,
      `${item.budget.toLocaleString()} MAD`,
      `${item.spent.toLocaleString()} MAD`,
      `${item.efficiency.toFixed(1)}%`
    ]);

    doc.autoTable({
      startY: 30,
      head: [['Chantier', 'Avancement', 'Budget Total', 'Dépenses', 'Utilisation']],
      body: tableData,
    });

    doc.save("rapport_btp_erp.pdf");
  };

  // Prepare Pie Chart Data (Global Expenses by Category)
  const categories = ['MATERIAL', 'LABOR', 'EQUIPMENT'];
  const categoryTotals = categories.map(cat => 
    summary.reduce((acc, p) => acc + (p.expenseBreakdown[cat] || 0), 0)
  );

  const pieData = {
    labels: ['Matériaux', 'Main d\'œuvre', 'Matériel'],
    datasets: [{
      data: categoryTotals,
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
      borderWidth: 1,
    }],
  };

  // Prepare Bar Chart Data (Equipment Usage)
  const barData = {
    labels: equipStats.map(e => e.name),
    datasets: [{
      label: 'Nombre d\'utilisations',
      data: equipStats.map(e => e.usageCount),
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1,
    }],
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <div className={styles.header}>
        <h1 className={styles.title}>📊 Rapports d'Activité</h1>
        <div className={styles.actions}>
          <button className="btn-secondary" onClick={() => window.print()}>🖨️ Imprimer</button>
          <button className="btn-primary" onClick={exportPDF}>📄 Export PDF</button>
        </div>
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
          <h3 className={styles.chartTitle}>Répartition des Dépenses</h3>
          <div className={styles.chartWrapper}>
            {loading ? <p>Chargement...</p> : <Pie data={pieData} />}
          </div>
        </div>
        <div className="card">
          <h3 className={styles.chartTitle}>Utilisation du Matériel</h3>
          <div className={styles.chartWrapper}>
            {loading ? <p>Chargement...</p> : (
              <Bar 
                data={barData} 
                options={{ 
                  indexAxis: 'y',
                  plugins: { legend: { display: false } }
                }} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

