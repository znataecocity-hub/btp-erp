"use client";

import { useState, useEffect } from "react";
import styles from "./tasks.module.css";
import API_URL from "../../apiConfig";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
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
        fetchTasks();
      }
    } catch (error) {
      console.error("Failed to update progress", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>✅ Tâches & Avancement</h1>
        <p className={styles.subtitle}>Suivi global de l'exécution des chantiers</p>
      </div>

      <div className="card">
        {loading ? (
          <p>Chargement des tâches...</p>
        ) : (
          <div className={styles.taskList}>
            {tasks.length === 0 ? (
              <p className={styles.empty}>Aucune tâche active pour le moment.</p>
            ) : (
              tasks.map(task => (
                <div key={task.id} className={styles.taskItem}>
                  <div className={styles.taskMain}>
                    <div className={styles.projectBadge}>{task.project?.name}</div>
                    <h3 className={styles.taskName}>{task.name}</h3>
                  </div>
                  
                  <div className={styles.progressContainer}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span className={styles.progressValue}>{task.progress}%</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={task.progress} 
                      onChange={(e) => handleUpdateProgress(task.id, e.target.value)}
                      className={styles.rangeInput}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
