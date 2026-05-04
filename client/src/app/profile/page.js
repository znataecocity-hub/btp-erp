"use client";

import { useState, useEffect } from "react";
import styles from "./profile.module.css";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>👤 Mon Profil</h1>
      
      <div className="grid">
        <div className="card">
          <h2 className={styles.sectionTitle}>Informations Personnelles</h2>
          <div className={styles.infoRow}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{user.email}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Rôle:</span>
            <span className={styles.badge}>{user.role}</span>
          </div>
        </div>

        <div className="card">
          <h2 className={styles.sectionTitle}>Entreprise</h2>
          <div className={styles.infoRow}>
            <span className={styles.label}>ID Entreprise:</span>
            <span className={styles.value}>{user.companyId}</span>
          </div>
          <p className={styles.hint}>
            Toutes les données de chantiers, matériels et RH sont liées à cet identifiant d'entreprise.
          </p>
        </div>
      </div>

      <button className={styles.logoutButton} onClick={() => {
        localStorage.clear();
        window.location.href = "/login";
      }}>
        Se déconnecter
      </button>
    </div>
  );
}
