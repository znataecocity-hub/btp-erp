"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "./projectDetails.module.css";
import API_URL from "../../../apiConfig";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tasks");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ name: "", startDate: "" });

  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        fetch(`${API_URL}/projects/${id}`),
        fetch(`${API_URL}/tasks/project/${id}`)
      ]);
      
      if (projRes.ok) setProject(await projRes.json());
      if (tasksRes.ok) setTasks(await tasksRes.json());
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newTask, projectId: id })
      });
      if (res.ok) {
        setShowTaskModal(false);
        setNewTask({ name: "", startDate: "" });
        fetchProjectData();
      }
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  const handleUpdateProgress = async (taskId, newProgress) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: newProgress })
      });
      if (res.ok) {
        fetchProjectData(); // Refresh both tasks and project progress
      }
    } catch (error) {
      console.error("Failed to update progress", error);
    }
  };

  if (loading) return <div className={styles.loading}>Chargement des détails du projet...</div>;
  if (!project) return <div className={styles.error}>Projet non trouvé.</div>;

  return (
    <div className={styles.container}>
      {/* Project Header */}
      <div className={styles.projectHeader}>
        <div>
          <h1 className={styles.title}>{project.name}</h1>
          <p className={styles.subtitle}>📍 {project.location} | 💰 {project.budget.toLocaleString()} MAD</p>
        </div>
        <div className={styles.globalProgress}>
          <div className={styles.progressCircle}>
            <span className={styles.progressValue}>{project.progress}%</span>
          </div>
          <span className={styles.progressLabel}>Avancement Global</span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === "tasks" ? styles.active : ""}`}
          onClick={() => setActiveTab("tasks")}
        >
          📋 Tâches & Suivi
        </button>
        <button 
          className={`${styles.tab} ${activeTab === "finance" ? styles.active : ""}`}
          onClick={() => setActiveTab("finance")}
        >
          💰 Finance
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === "tasks" && (
          <div className={styles.tasksSection}>
            <div className={styles.sectionHeader}>
              <h2>Liste des tâches</h2>
              <button className="btn-primary" onClick={() => setShowTaskModal(true)}>+ Ajouter une tâche</button>
            </div>

            <div className={styles.taskList}>
              {tasks.length === 0 ? (
                <p>Aucune tâche pour le moment.</p>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className={styles.taskCard}>
                    <div className={styles.taskInfo}>
                      <h3>{task.name}</h3>
                      <span>Début: {new Date(task.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.taskProgress}>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={task.progress} 
                        onChange={(e) => handleUpdateProgress(task.id, e.target.value)}
                        className={styles.rangeInput}
                      />
                      <span className={styles.progressBadge}>{task.progress}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "finance" && (
          <div className={styles.financeSection}>
            <div className={styles.financeGrid}>
              <div className="card">
                <p className={styles.statLabel}>Budget Initial</p>
                <h2 className={styles.statValue}>{project.budget.toLocaleString()} MAD</h2>
              </div>
              <div className="card">
                <p className={styles.statLabel}>Dépenses Totales</p>
                <h2 className={styles.statValue}>{project.totalExpenses.toLocaleString()} MAD</h2>
              </div>
              <div className="card">
                <p className={styles.statLabel}>Bénéfice Prévu</p>
                <h2 className={`${styles.statValue} ${project.profit < 0 ? styles.negative : styles.positive}`}>
                  {project.profit.toLocaleString()} MAD
                </h2>
                <span className={styles.marginBadge}>{project.profitMargin.toFixed(1)}% Marge</span>
              </div>
            </div>
            
            <div className={styles.expensesTable}>
              <h3>Journal des dépenses du projet</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Catégorie</th>
                    <th>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {project.expenses.map(exp => (
                    <tr key={exp.id}>
                      <td>{new Date(exp.date).toLocaleDateString()}</td>
                      <td>{exp.category}</td>
                      <td>{exp.amount.toLocaleString()} MAD</td>
                    </tr>
                  ))}
                  {project.expenses.length === 0 && (
                    <tr><td colSpan="3" style={{textAlign: 'center', padding: '1rem'}}>Aucune dépense enregistrée.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Ajouter une tâche</h2>
            <form onSubmit={handleAddTask} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Nom de la tâche</label>
                <input 
                  required 
                  placeholder="ex: Fondations, Plomberie..."
                  value={newTask.name} 
                  onChange={e => setNewTask({...newTask, name: e.target.value})} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Date de début</label>
                <input 
                  type="date" 
                  required 
                  value={newTask.startDate} 
                  onChange={e => setNewTask({...newTask, startDate: e.target.value})} 
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowTaskModal(false)}>Annuler</button>
                <button type="submit" className="btn-primary">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
