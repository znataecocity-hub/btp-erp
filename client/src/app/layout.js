"use client";

import "./globals.css";
import styles from "./layout.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className={styles.layoutWrapper}>
          {!isAuthPage && (
            <aside className={styles.sidebar}>
              <div className={styles.sidebarHeader}>
                🏗️ BTP ERP
              </div>
              <nav className={styles.sidebarNav}>
                <Link href="/" className={`${styles.navItem} ${pathname === "/" ? styles.active : ""}`}>
                  📊 Tableau de bord
                </Link>
                <Link href="/projects" className={`${styles.navItem} ${pathname === "/projects" ? styles.active : ""}`}>
                  🏗️ Chantiers
                </Link>
                <Link href="/tasks" className={`${styles.navItem} ${pathname === "/tasks" ? styles.active : ""}`}>
                  ✅ Tâches & Avancement
                </Link>
                <Link href="/finance" className={`${styles.navItem} ${pathname === "/finance" ? styles.active : ""}`}>
                  💰 Finance & Budget
                </Link>
                <Link href="/hr" className={`${styles.navItem} ${pathname === "/hr" ? styles.active : ""}`}>
                  👷 Ressources Humaines
                </Link>
                <Link href="/equipment" className={`${styles.navItem} ${pathname === "/equipment" ? styles.active : ""}`}>
                  🚜 Matériel
                </Link>
                <Link href="/reports" className={`${styles.navItem} ${pathname === "/reports" ? styles.active : ""}`}>
                  📈 Rapports
                </Link>
              </nav>
            </aside>
          )}

          {/* Main Content Wrapper */}
          <div className={isAuthPage ? styles.authWrapper : styles.mainWrapper}>
            {/* Top Navbar */}
            {!isAuthPage && (
              <header className={styles.header}>
                <div className={styles.headerTitle}>
                  {pathname === "/" ? "Vue d'ensemble" : 
                   pathname.substring(1).charAt(0).toUpperCase() + pathname.substring(2)}
                </div>
                <div className={styles.headerProfile}>
                  <span style={{ color: "var(--text-muted)", fontWeight: "500" }}>Admin System</span>
                  <div className={styles.profileAvatar}>AD</div>
                </div>
              </header>
            )}

            {/* Main Content */}
            <main className={isAuthPage ? styles.authContent : styles.mainContent}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

