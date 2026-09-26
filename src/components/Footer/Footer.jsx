import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={`py-5 mt-auto ${styles.piePaginaGamer}`} data-bs-theme="dark">
      <div className="container">
        <div className="row gy-4">
          <div className="col-12 col-md-4">
            <h5 className="mb-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Level-Up Gamer
            </h5>
            <p className={`mb-2 ${styles.textoPie}`}>
              Tu tienda online de tecnología, consolas y accesorios en Chile. Despachos a todo el
              país.
            </p>
          </div>

          <div className="col-12 col-md-4">
            <h6 className={`mb-3 ${styles.tituloPie}`}>Navegación</h6>
            <ul className="nav flex-column gap-2">
              <li className="nav-item">
                <Link to="/" className={`nav-link p-0 ${styles.enlacePie}`}>
                  <i className="bi bi-chevron-right text-success me-1"></i>Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/#sec-ofertas" className={`nav-link p-0 ${styles.enlacePie}`}>
                  <i className="bi bi-chevron-right text-success me-1"></i>Ofertas Destacadas
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/#nosotros" className={`nav-link p-0 ${styles.enlacePie}`}>
                  <i className="bi bi-chevron-right text-success me-1"></i>Sobre Nosotros
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-12 col-md-4">
            <h6 className={`mb-3 ${styles.tituloPie}`}>Síguenos en Redes</h6>
            <p className={`mb-3 ${styles.textoPie}`}>
              Conéctate a nuestra comunidad y entérate de nuevos drops.
            </p>
            <div className="d-flex gap-3 fs-4 mb-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.enlacePie}
                aria-label="Instagram"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.enlacePie}
                aria-label="Discord"
              >
                <i className="bi bi-discord"></i>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.enlacePie}
                aria-label="TikTok"
              >
                <i className="bi bi-tiktok"></i>
              </a>
              <a
                href="https://twitch.tv"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.enlacePie}
                aria-label="Twitch"
              >
                <i className="bi bi-twitch"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <p className={`mb-0 ${styles.textoPie}`}>
            &copy; 2026 Level-Up Gamer. Todos los derechos reservados.
          </p>
          <span className={`small ${styles.textoPie}`}>Hecho para la comunidad gamer</span>
        </div>
      </div>
    </footer>
  );
}
