"use client";

import { useState, useEffect } from "react";
import styles from "./finance.module.css";
import API_URL from "../../apiConfig";

export default function Finance() {
  const [expenses, setExpenses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ total: 0, byCategory: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "MATERIAL",
    date: new Date().toISOString().split('T')[0],
    projectId: ""
  });

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
      const [expRes, projRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/expenses?companyId=${companyId}`),
        fetch(`${API_URL}/projects?companyId=${companyId}`),
        fetch(`${API_URL}/expenses/stats?companyId=${companyId}`)
      ]);
      
      if (expRes.ok) setExpenses(await expRes.json());
      if (projRes.ok) setProjects(await projRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (error) {
      console.error("Failed to fetch finance data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await fetch(`${API_URL}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense)
      });
      if (res.ok) {
        setShowModal(false);
        fetchData(user.companyId);
        setNewExpense({ amount: "", category: "MATERIAL", date: new Date().toISOString().split('T')[0], projectId: "" });
      }
    } catch (error) {
      console.error("Failed to create expense", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>💰 Finance & Budget</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Nouvelle Dépense
        </button>
      </div>

      {/* Stats Summary */}
      <div className={styles.statsGrid}>
        <div className="card">
          <p className={styles.statLabel}>Dépenses Totales</p>
          <h2 className={styles.statValue}>{stats.total.toLocaleString()} MAD</h2>
        </div>
        {stats.byCategory.map(cat => (
          <div key={cat.category} className="card">
            <p className={styles.statLabel}>{cat.category}</p>
            <h2 className={styles.statValue}>{cat._sum.amount.toLocaleString()} MAD</h2>
          </div>
        ))}
      </div>

      {/* Expenses Table */}
      <div className="card">
        <h2 className={styles.sectionTitle}>Journal des Dépenses</h2>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Chantier</th>
                <th>Catégorie</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id}>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td>{exp.project?.name}</td>
                  <td><span className={styles.badge}>{exp.category}</span></td>
                  <td className={styles.amount}>{exp.amount.toLocaleString()} MAD</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Nouvelle Dépense</h2>
            <form onSubmit={handleCreate} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Montant (MAD)</label>
                <input 
                  type="number" 
                  required 
                  value={newExpense.amount} 
                  onChange={e => setNewExpense({...newExpense, amount: e.target.value})} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Chantier</label>
                <select 
                  required 
                  value={newExpense.projectId} 
                  onChange={e => setNewExpense({...newExpense, projectId: e.target.value})}
                >
                  <option value="">Sélectionner un chantier</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Catégorie</label>
                  <select 
                    value={newExpense.category} 
                    onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                  >
                    <option value="MATERIAL">Matériaux</option>
                    <option value="LABOR">Main d'œuvre</option>
                    <option value="EQUIPMENT">Matériel</option>
                    <option value="SUBCONTRACTOR">Sous-traitant</option>
                    <option value="OTHER">Autre</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Date</label>
                  <input 
                    type="date" 
                    required 
                    value={newExpense.date} 
                    onChange={e => setNewExpense({...newExpense, date: e.target.value})} 
                  />
                </div>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
