import { useState } from "react";
import styles from "./Contacto.module.css";

const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

function validarNombre(valor) {
  if (valor.trim() === "") return "El nombre es obligatorio.";
  if (valor.length > 100) return "El nombre no puede superar los 100 caracteres.";
  return "";
}

function validarCorreo(valor) {
  const v = valor.trim();
  if (v === "") return "El correo es obligatorio.";
  if (v.length > 100) return "El correo no puede superar los 100 caracteres.";
  if (!DOMINIOS_PERMITIDOS.some((dom) => v.endsWith(dom))) {
    return "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
  }
  return "";
}

function validarMensaje(valor) {
  if (valor.trim() === "") return "El mensaje es obligatorio.";
  if (valor.length > 500) return "El mensaje no puede superar los 500 caracteres.";
  return "";
}

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({ nombre: "", correo: "", mensaje: "" });
  const [tocado, setTocado] = useState({ nombre: false, correo: false, mensaje: false });
  const [exito, setExito] = useState(false);

  function claseCampo(campo) {
    if (!tocado[campo]) return "form-control";
    return `form-control ${errores[campo] ? "is-invalid" : "is-valid"}`;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const errorNombre = validarNombre(nombre);
    const errorCorreo = validarCorreo(correo);
    const errorMensaje = validarMensaje(mensaje);

    setErrores({ nombre: errorNombre, correo: errorCorreo, mensaje: errorMensaje });
    setTocado({ nombre: true, correo: true, mensaje: true });

    if (errorNombre || errorCorreo || errorMensaje) {
      setExito(false);
      return;
    }

    const mensajesGuardados = JSON.parse(localStorage.getItem("mensajesContacto")) || [];
    mensajesGuardados.push({
      nombre: nombre.trim(),
      correo: correo.trim(),
      mensaje: mensaje.trim(),
      fecha: new Date().toISOString(),
    });
    localStorage.setItem("mensajesContacto", JSON.stringify(mensajesGuardados));

    setExito(true);
    setNombre("");
    setCorreo("");
    setMensaje("");
    setTocado({ nombre: false, correo: false, mensaje: false });
    setErrores({ nombre: "", correo: "", mensaje: "" });
  }

  return (
    <div className="container py-5">
      <div className={styles.filaContacto}>
        <section className={styles.columnaDatosEmpresa}>
          <img src="/img/LOGO.png" alt="Logo Level-Up Gamer" className={styles.logoContacto} />
          <h1 className={styles.nombreEmpresa}>Level-Up Gamer</h1>
          <p className={styles.textoSecundario}>
            Tienda online de tecnología y accesorios gamer. Sin sucursales físicas, despacho a
            todo Chile.
          </p>
          <ul className={`list-unstyled ${styles.listaDatosContacto}`}>
            <li>
              <i className="bi bi-envelope me-2" style={{ color: "#39FF14" }}></i>
              contacto@levelupgamer.cl
            </li>
            <li>
              <i className="bi bi-telephone me-2" style={{ color: "#39FF14" }}></i>
              +56 9 0000 0000
            </li>
            <li>
              <i className="bi bi-truck me-2" style={{ color: "#39FF14" }}></i>
              Despacho a todo Chile (sin tienda física)
            </li>
          </ul>
        </section>

        <section className={styles.columnaFormulario}>
          <h2 className={styles.tituloFormulario}>Escríbenos</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="campo-nombre" className="form-label">
                Nombre completo
              </label>
              <input
                type="text"
                className={claseCampo("nombre")}
                id="campo-nombre"
                maxLength={100}
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (tocado.nombre)
                    setErrores((er) => ({ ...er, nombre: validarNombre(e.target.value) }));
                }}
                onBlur={() => {
                  setTocado((t) => ({ ...t, nombre: true }));
                  setErrores((er) => ({ ...er, nombre: validarNombre(nombre) }));
                }}
              />
              <div className="invalid-feedback">{errores.nombre}</div>
            </div>

            <div className="mb-3">
              <label htmlFor="campo-correo" className="form-label">
                Correo electrónico
              </label>
              <input
                type="email"
                className={claseCampo("correo")}
                id="campo-correo"
                maxLength={100}
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  if (tocado.correo)
                    setErrores((er) => ({ ...er, correo: validarCorreo(e.target.value) }));
                }}
                onBlur={() => {
                  setTocado((t) => ({ ...t, correo: true }));
                  setErrores((er) => ({ ...er, correo: validarCorreo(correo) }));
                }}
              />
              <div className={`form-text ${styles.textoSecundario}`}>
                Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com
              </div>
              <div className="invalid-feedback">{errores.correo}</div>
            </div>

            <div className="mb-3">
              <label htmlFor="campo-mensaje" className="form-label">
                Mensaje
              </label>
              <textarea
                className={claseCampo("mensaje")}
                id="campo-mensaje"
                rows={5}
                maxLength={500}
                value={mensaje}
                onChange={(e) => {
                  setMensaje(e.target.value);
                  if (tocado.mensaje)
                    setErrores((er) => ({ ...er, mensaje: validarMensaje(e.target.value) }));
                }}
                onBlur={() => {
                  setTocado((t) => ({ ...t, mensaje: true }));
                  setErrores((er) => ({ ...er, mensaje: validarMensaje(mensaje) }));
                }}
              ></textarea>
              <div className={`form-text ${styles.textoSecundario}`}>
                <span>{mensaje.length}</span>/500 caracteres
              </div>
              <div className="invalid-feedback">{errores.mensaje}</div>
            </div>

            <button type="submit" className={`btn ${styles.botonEnviarContacto}`}>
              Enviar mensaje
            </button>

            {exito && (
              <div className="alert alert-success mt-3" role="alert">
                ¡Mensaje enviado! Te responderemos a la brevedad.
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
