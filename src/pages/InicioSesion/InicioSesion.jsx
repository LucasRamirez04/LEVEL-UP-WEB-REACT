import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUsuarios } from "../../context/UsuariosContext";
import styles from "./InicioSesion.module.css";

export default function InicioSesion() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const { iniciarSesion } = useUsuarios();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (correo === "") {
      alert("El correo es requerido.");
      return;
    }
    if (clave === "") {
      alert("La contraseña es requerida.");
      return;
    }

    const usuario = iniciarSesion(correo, clave);

    if (usuario) {
      alert("¡Bienvenido " + usuario.nombre + "!");
      navigate("/");
    } else {
      alert("Correo o contraseña incorrectos.");
    }
  }

  return (
    <main className="container mb-5">
      <div className="row justify-content-center mt-4">
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
                  placeholder="Ej: usuario@duoc.cl"
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
  );
}
