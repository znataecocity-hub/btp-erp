"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../login/login.module.css"; // Reuse login styles
import API_URL from "../../apiConfig";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: ""
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>🏗️ BTP ERP</div>
        <h1 className={styles.title}>Inscription</h1>
        <p className={styles.subtitle}>Créez votre compte entreprise</p>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.group}>
            <label>Nom complet</label>
            <input 
              required 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="Ex: Ahmed Alami"
            />
          </div>
          <div className={styles.group}>
            <label>Nom de l'entreprise</label>
            <input 
              required 
              value={formData.companyName} 
              onChange={e => setFormData({...formData, companyName: e.target.value})} 
              placeholder="Ex: Alami Construction SARL"
            />
          </div>
          <div className={styles.group}>
            <label>Email</label>
            <input 
              type="email" 
              required 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              placeholder="votre@email.com"
            />
          </div>
          <div className={styles.group}>
            <label>Mot de passe</label>
            <input 
              type="password" 
              required 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className={styles.button}>Créer mon compte</button>
        </form>
        
        <p className={styles.footer}>
          Déjà un compte ? <a href="/login">Se connecter</a>
        </p>
      </div>
    </div>
  );
}
