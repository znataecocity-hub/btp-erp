import "./globals.css";
import styles from "./layout.module.css";
import Link from "next/link";

export const metadata = {
  title: "BTP ERP | Système de Gestion de Chantier",
  description: "Solution complète pour les entreprises de construction",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className={styles.layoutWrapper}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              🏗️ BTP ERP
            </div>
            <nav className={styles.sidebarNav}>
              <Link href="/" className={`${styles.navItem} ${styles.active}`}>
                📊 Tableau de bord
              </Link>
              <Link href="/projects" className={styles.navItem}>
                🏗️ Chantiers
              </Link>
              <Link href="/tasks" className={styles.navItem}>
                ✅ Tâches & Avancement
              </Link>
              <Link href="/finance" className={styles.navItem}>
                💰 Finance & Budget
              </Link>
              <Link href="/hr" className={styles.navItem}>
                👷 Ressources Humaines
              </Link>
              <Link href="/equipment" className={styles.navItem}>
                🚜 Matériel
              </Link>
              <Link href="/reports" className={styles.navItem}>
                📈 Rapports
              </Link>
            </nav>
          </aside>

          {/* Main Content Wrapper */}
          <div className={styles.mainWrapper}>
            {/* Top Navbar */}
            <header className={styles.header}>
              <div className={styles.headerTitle}>Vue d'ensemble</div>
              <div className={styles.headerProfile}>
                <span style={{ color: "var(--text-muted)", fontWeight: "500" }}>Admin System</span>
                <div className={styles.profileAvatar}>AD</div>
              </div>
            </header>

            {/* Main Content */}
            <main className={styles.mainContent}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
