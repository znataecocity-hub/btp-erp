"use client";

import { useState, useEffect } from "react";
import styles from "./hr.module.css";
import API_URL from "../../apiConfig";

export default function HR() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    role: "WORKER",
    specialty: "",
    salaryType: "HOURLY",
    rate: ""
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_URL}/hr/employees`);
      if (res.ok) setEmployees(await res.json());
    } catch (error) {
      console.error("Failed to fetch employees", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/hr/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newEmployee, companyId: "comp-1" })
      });
      if (res.ok) {
        setShowModal(false);
        fetchEmployees();
        setNewEmployee({ firstName: "", lastName: "", role: "WORKER", specialty: "", salaryType: "HOURLY", rate: "" });
      }
    } catch (error) {
      console.error("Failed to create employee", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>👥 Ressources Humaines</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Nouveau Collaborateur
        </button>
      </div>

      <div className="card">
        <h2 className={styles.sectionTitle}>Liste du Personnel</h2>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nom Complet</th>
                <th>Rôle</th>
                <th>Spécialité</th>
                <th>Type de Salaire</th>
                <th>Taux</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.firstName} {emp.lastName}</td>
                  <td><span className={styles.badge}>{emp.role}</span></td>
                  <td>{emp.specialty}</td>
                  <td>{emp.salaryType}</td>
                  <td className={styles.rate}>{emp.rate.toLocaleString()} MAD</td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Aucun employé trouvé.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Nouveau Collaborateur</h2>
            <form onSubmit={handleCreate} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Prénom</label>
                  <input required value={newEmployee.firstName} onChange={e => setNewEmployee({...newEmployee, firstName: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Nom</label>
                  <input required value={newEmployee.lastName} onChange={e => setNewEmployee({...newEmployee, lastName: e.target.value})} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Rôle</label>
                <select value={newEmployee.role} onChange={e => setNewEmployee({...newEmployee, role: e.target.value})}>
                  <option value="WORKER">Ouvrier</option>
                  <option value="FOREMAN">Chef de Chantier</option>
                  <option value="MANAGER">Conducteur de Travaux</option>
                  <option value="ADMIN">Administration</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Spécialité</label>
                <input placeholder="ex: Maçon, Plombier, Électricien..." value={newEmployee.specialty} onChange={e => setNewEmployee({...newEmployee, specialty: e.target.value})} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Type de Salaire</label>
                  <select value={newEmployee.salaryType} onChange={e => setNewEmployee({...newEmployee, salaryType: e.target.value})}>
                    <option value="HOURLY">Horaire</option>
                    <option value="DAILY">Journalier</option>
                    <option value="MONTHLY">Mensuel</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Taux (MAD)</label>
                  <input type="number" required value={newEmployee.rate} onChange={e => setNewEmployee({...newEmployee, rate: e.target.value})} />
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
