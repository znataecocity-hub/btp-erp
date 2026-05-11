"use client";

import { useState, useEffect } from "react";
import styles from "./equipment.module.css";
import API_URL from "../../apiConfig";

export default function Equipment() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    type: "MACHINERY",
    status: "AVAILABLE",
    dailyCost: ""
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchEquipment(parsedUser.companyId);
    } else {
      window.location.href = "/login";
    }
  }, []);

  const fetchEquipment = async (companyId) => {
    try {
      const res = await fetch(`${API_URL}/equipment?companyId=${companyId}`);
      if (res.ok) setEquipment(await res.json());
    } catch (error) {
      console.error("Failed to fetch equipment", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const res = await fetch(`${API_URL}/equipment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newEquipment, companyId: user.companyId })
      });
      if (res.ok) {
        setShowModal(false);
        fetchEquipment(user.companyId);
        setNewEquipment({ name: "", type: "MACHINERY", status: "AVAILABLE", dailyCost: "" });
      }
    } catch (error) {
      console.error("Failed to create equipment", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🚜 Matériel & Équipement</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Nouvel Équipement
        </button>
      </div>

      <div className="card">
        <h2 className={styles.sectionTitle}>Inventaire du Parc</h2>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Désignation</th>
                <th>Type</th>
                <th>État</th>
                <th>Coût Journalier</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.type}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[item.status.toLowerCase()]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className={styles.cost}>{item.dailyCost.toLocaleString()} MAD</td>
                </tr>
              ))}
              {equipment.length === 0 && (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Aucun équipement trouvé.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Equipment Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Nouvel Équipement</h2>
            <form onSubmit={handleCreate} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Nom de l'équipement</label>
                <input required placeholder="ex: Pelle hydraulique, Camion Benne..." value={newEquipment.name} onChange={e => setNewEquipment({...newEquipment, name: e.target.value})} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Type</label>
                  <select value={newEquipment.type} onChange={e => setNewEquipment({...newEquipment, type: e.target.value})}>
                    <option value="MACHINERY">Engin</option>
                    <option value="VEHICLE">Véhicule</option>
                    <option value="TOOL">Outillage</option>
                    <option value="OTHER">Autre</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>État initial</label>
                  <select value={newEquipment.status} onChange={e => setNewEquipment({...newEquipment, status: e.target.value})}>
                    <option value="AVAILABLE">Disponible</option>
                    <option value="IN_USE">En service</option>
                    <option value="MAINTENANCE">En maintenance</option>
                    <option value="BROKEN">En panne</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Coût Journalier (MAD)</label>
                <input type="number" required value={newEquipment.dailyCost} onChange={e => setNewEquipment({...newEquipment, dailyCost: e.target.value})} />
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
