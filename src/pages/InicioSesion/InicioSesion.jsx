import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CarritoOffcanvas from "../../components/CarritoOffcanvas/CarritoOffcanvas";
import { usuarioAdminInicial } from "../../data/productos";
import styles from "./InicioSesion.module.css";
import App_alert from "../../components/alerta/alerta";

export default function InicioSesion() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const navigate = useNavigate();

  // Estados de alerta
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const correoLimpio = correo.trim().toLowerCase();
    const claveLimpia = clave.trim();

    if (!correoLimpio) {
      setMostrarAlerta(true);
      setMensajeAlerta("El correo es requerido.");
      setTipoAlerta("danger");
      return;
    }
    if (!claveLimpia) {
      setMostrarAlerta(true);
      setMensajeAlerta("La contraseña es requerida.");
      setTipoAlerta("danger");
      return;
    }

    // Obtiene usuarios registrados de localStorage o el admin por defecto
    const usuariosRegistrados =
      JSON.parse(localStorage.getItem("usuarios")) || usuarioAdminInicial;

    // Busca coincidencia de correo y clave
    const usuarioEncontrado = usuariosRegistrados.find(
      (u) =>
        u.correo.toLowerCase() === correoLimpio &&
        (u.clave ? u.clave === claveLimpia : true)
    );

    if (usuarioEncontrado) {
      // Guarda la sesión activa en localStorage
      localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));

      // Notifica al Navbar para actualizar nombre y botón de salida
      window.dispatchEvent(new Event("storage"));

      setMostrarAlerta(true);
      setMensajeAlerta("¡Bienvenido " + usuarioEncontrado.nombre + "!");
      setTipoAlerta("success");
      navigate("/");
    } else {
      setMostrarAlerta(true);
      setMensajeAlerta("Correo o contraseña incorrectos.");
      setTipoAlerta("danger");
    }
  }

  return (
    <>
      <Navbar />
      <CarritoOffcanvas />

      <div style={{ position: "fixed", top: "90px", right: "20px", zIndex: 1060, maxWidth: "400px" }}>
        <App_alert
          mostrarAlert={mostrarAlerta}
          cerrarAlert={() => setMostrarAlerta(false)}
          variant={tipoAlerta}
          msgAlert={mensajeAlerta}
        />
      </div>

      <main className="container flex-grow-1 mb-5" style={{ marginTop: 120 }}>
        <div className="row justify-content-center">
          <div className={`col-12 col-md-8 col-lg-5 ${styles.contenedorFormulario}`}>
            <h2
              className="text-center text-white mb-4"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              INICIAR SESIÓN
            </h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="correo" className="form-label text-light">
                  Correo Electrónico
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark text-secondary border-secondary">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    id="correo"
                    placeholder="Ej: admin@duoc.cl"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="clave" className="form-label text-light">
                  Contraseña
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark text-secondary border-secondary">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    id="clave"
                    placeholder="Ingrese su contraseña"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="d-grid gap-2 mb-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Ingresar
                </button>
              </div>

              <div className="text-center">
                <p className="text-secondary small mb-0">
                  ¿No tienes una cuenta?{" "}
                  <Link to="/registro" className="text-success text-decoration-none fw-bold">
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}