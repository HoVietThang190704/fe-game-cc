import styles from "./FooterSection.module.css"

export function FooterSection() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.brandBlock}>
            <p className={styles.brand}>MineSweeper CC</p>
            <p className={styles.copyright}>
              © 2026 MineSweeper CC. All rights reserved.
            </p>
          </div>

          <nav className={styles.links} aria-label="Footer navigation">
            <a className={styles.link} href="mailto:support@minesweepercc.com">
              Support
            </a>
            <a className={styles.link} href="#feature-heading">
              About
            </a>
            <a
              className={styles.link}
              href="mailto:support@minesweepercc.com?subject=Bug%20Report"
            >
              Bug Report
            </a>
          </nav>
        </div>
      </footer>

      <a
        className={styles.fab}
        href="mailto:support@minesweepercc.com"
        aria-label="Open support assistant button"
      >
        <span className={styles.fabLabel}>SAB</span>
        <span className={styles.fabText}>Support</span>
      </a>
    </>
  )
}
