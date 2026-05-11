"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./projects.module.css";
import API_URL from "../../apiConfig";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [newProject, setNewProject] = useState({
    name: "",
    location: "",
    type: "BATIMENT",
    budget: "",
    startDate: ""
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchProjects(parsedUser.companyId);
    } else {
      window.location.href = "/login";
    }
  }, []);

  const fetchProjects = async (companyId) => {
    try {
      const res = await fetch(`${API_URL}/projects?companyId=${companyId}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const payload = { ...newProject, companyId: user.companyId };
      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setShowModal(false);
        fetchProjects(user.companyId);
        setNewProject({ name: "", location: "", type: "BATIMENT", budget: "", startDate: "" });
      } else {
        const error = await res.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error("Failed to create project", error);
      alert("Erreur de connexion au serveur");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🏗️ Chantiers</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Nouveau Chantier
        </button>
      </div>

      {loading ? (
        <p>Chargement des chantiers...</p>
      ) : projects.length === 0 ? (
        <div className="card">
          <p>Aucun chantier trouvé. Créez-en un nouveau !</p>
        </div>
      ) : (
        <div className={styles.projectList}>
          {projects.map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id} className={`${styles.projectLink} card`}>
              <div className={styles.projectHeader}>
                <h3>{project.name}</h3>
                <span className={styles.badge}>{project.type}</span>
              </div>
              <div className={styles.projectBody}>
                <p>📍 {project.location}</p>
                <p>💰 {project.budget.toLocaleString()} MAD</p>
                <div className={styles.progressContainer}>
                  <div className={styles.progressText}>
                    <span>Avancement</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div 
                      className={styles.progressBarFill} 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Nouveau Chantier</h2>
            <form onSubmit={handleCreate} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Nom du projet</label>
                <input 
                  required 
                  value={newProject.name} 
                  onChange={e => setNewProject({...newProject, name: e.target.value})} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Localisation</label>
                <input 
                  required 
                  value={newProject.location} 
                  onChange={e => setNewProject({...newProject, location: e.target.value})} 
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Type</label>
                  <select 
                    value={newProject.type} 
                    onChange={e => setNewProject({...newProject, type: e.target.value})}
                  >
                    <option value="BATIMENT">Bâtiment</option>
                    <option value="INDUSTRIEL">Industriel</option>
                    <option value="HYDRAULIQUE">Hydraulique</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Budget (MAD)</label>
                  <input 
                    type="number" 
                    required 
                    value={newProject.budget} 
                    onChange={e => setNewProject({...newProject, budget: e.target.value})} 
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Date de début</label>
                <input 
                  type="date" 
                  required 
                  value={newProject.startDate} 
                  onChange={e => setNewProject({...newProject, startDate: e.target.value})} 
                />
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
