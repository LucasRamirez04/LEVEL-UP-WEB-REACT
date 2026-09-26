import { NavLink } from "react-router-dom";
import { useCarrito } from "../../context/CarritoContext";
import { useUsuarios } from "../../context/UsuariosContext";
import styles from "./Navbar.module.css";

function claseEnlace({ isActive }) {
  return `nav-link ${styles.enlaceMenu} ${isActive ? "active" : ""}`;
}

export default function Navbar() {
  const { carrito } = useCarrito();
  const { usuarioActivo, cerrarSesion } = useUsuarios();

  return (
    <header className="cabecera-principal">
      <nav
        className={`navbar navbar-expand-lg fixed-top ${styles.barraNavegacionGamer}`}
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand d-flex align-items-center">
            <img src="/img/LOGO.png" alt="Logo Level-Up Gamer" className={styles.logoNavbar} />
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/" end className={claseEnlace}>
                  Inicio
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/productos" className={claseEnlace}>
                  Productos
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/comunidad" className={claseEnlace}>
                  Comunidad
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/contacto" className={claseEnlace}>
                  Contacto
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/administrador" className={claseEnlace}>
                  Administrador
                </NavLink>
              </li>
            </ul>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              {usuarioActivo ? (
                <li className="nav-item d-flex align-items-center gap-2">
                  <span className="text-white small">{usuarioActivo.nombre}</span>
                  <button
                    className="btn btn-sm btn-outline-danger py-0"
                    type="button"
                    onClick={cerrarSesion}
                  >
                    Salir
                  </button>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink to="/login" className={`nav-link ${styles.enlaceMenu} ${styles.enlaceLogin}`}>
                      Iniciar Sesión
                    </NavLink>
                  </li>
                  <li className="nav-item ms-2">
                    <NavLink
                      to="/registro"
                      className={`nav-link ${styles.enlaceMenu} ${styles.enlaceLogin}`}
                    >
                      Registrarse
                    </NavLink>
                  </li>
                </>
              )}
              <li className="nav-item ms-3">
                <button
                  className={`btn ${styles.botonCarritoNav} d-flex align-items-center gap-2`}
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#carritoCompras"
                  aria-controls="carritoCompras"
                >
                  <i className="bi bi-cart3"></i>
                  <span>Carrito</span>
                  <span className={`badge ${styles.badgeContador}`}>{carrito.length}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
