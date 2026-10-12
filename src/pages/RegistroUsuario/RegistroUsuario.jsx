import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CarritoOffcanvas from "../../components/CarritoOffcanvas/CarritoOffcanvas";
import { usuarioAdminInicial } from "../../data/productos";
import styles from "./RegistroUsuario.module.css";
import App_alert from "../../components/alerta/alerta";

const COMUNAS_POR_REGION = {
  "Región Metropolitana de Santiago": ["Santiago", "La Florida", "Maipú", "Puente Alto", "Providencia"],
  "Región de la Araucanía": ["Temuco", "Villarrica", "Pucón", "Angol", "Victoria"],
  "Región de Ñuble": ["Chillán", "San Carlos", "Bulnes", "Quillón", "Coihueco"],
};

const REGIONES = Object.keys(COMUNAS_POR_REGION);

export default function RegistroUsuario() {
  const navigate = useNavigate();

  // Estados de la alerta
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  function mostrarMensaje(mensaje, tipo = "danger") {
    setMensajeAlerta(mensaje);
    setTipoAlerta(tipo);
    setMostrarAlerta(true);
  }

  const [form, setForm] = useState({
    run: "",
    nombre: "",
    apellidos: "",
    correo: "",
    clave: "",
    confirmarClave: "",
    fechaNacimiento: "",
    region: "",
    comuna: "",
    direccion: "",
  });

  const comunasDisponibles = useMemo(
    () => COMUNAS_POR_REGION[form.region] || [],
    [form.region]
  );

  function actualizarCampo(campo, valor) {
    setForm((actual) => ({
      ...actual,
      [campo]: valor,
      ...(campo === "region" ? { comuna: "" } : {}), // al cambiar región, se resetea la comuna
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (form.run.trim() === "") return mostrarMensaje("El RUN es requerido.", "danger");
    if (form.run.includes(".") || form.run.includes("-"))
      return mostrarMensaje("El RUN debe ser ingresado sin puntos ni guion.", "danger");
    if (form.run.trim().length < 7 || form.run.trim().length > 9)
      return mostrarMensaje("El RUN debe tener entre 7 y 9 caracteres.", "danger");

    if (form.nombre.trim() === "") return mostrarMensaje("El nombre es requerido.", "danger");
    if (form.nombre.trim().length > 50) return mostrarMensaje("El nombre no puede tener más de 50 caracteres.", "danger");

    if (form.apellidos.trim() === "") return mostrarMensaje("Los apellidos son requeridos.", "danger");
    if (form.apellidos.trim().length > 100)
      return mostrarMensaje("Los apellidos no pueden tener más de 100 caracteres.", "danger");

    const correoLimpio = form.correo.trim().toLowerCase();
    if (correoLimpio === "") return mostrarMensaje("El correo es requerido.", "danger");
    if (correoLimpio.length > 100) return mostrarMensaje("El correo no puede tener más de 100 caracteres.", "danger");
    if (
      !correoLimpio.endsWith("@duoc.cl") &&
      !correoLimpio.endsWith("@profesor.duoc.cl") &&
      !correoLimpio.endsWith("@gmail.com")
    )
      return mostrarMensaje("El correo solo puede ser @duoc.cl, @profesor.duoc.cl o @gmail.com", "danger");

    if (form.clave === "") return mostrarMensaje("La contraseña es requerida.", "danger");
    if (form.clave.length < 4 || form.clave.length > 10)
      return mostrarMensaje("La contraseña debe tener entre 4 y 10 caracteres.", "danger");

    if (form.confirmarClave === "") return mostrarMensaje("Debe confirmar su contraseña.", "danger");
    if (form.clave !== form.confirmarClave) return mostrarMensaje("Las contraseñas no coinciden.", "danger");

    if (form.fechaNacimiento === "") return mostrarMensaje("La fecha de nacimiento es requerida.", "danger");
    const fechaNac = new Date(form.fechaNacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    if (edad < 18) return mostrarMensaje("Debes ser mayor de 18 años para poder registrarte.", "danger");

    if (form.region === "") return mostrarMensaje("Debe seleccionar una región.", "danger");
    if (form.comuna === "") return mostrarMensaje("Debe seleccionar una comuna.", "danger");

    if (form.direccion.trim() === "") return mostrarMensaje("La dirección es requerida.", "danger");
    if (form.direccion.trim().length > 300)
      return mostrarMensaje("La dirección no puede tener más de 300 caracteres.", "danger");

    // 1. Obtener lista actual de usuarios desde localStorage
    const usuariosRegistrados =
      JSON.parse(localStorage.getItem("usuarios")) || usuarioAdminInicial;

    // 2. Verificar que no exista un usuario con el mismo RUN o correo
    const runExiste = usuariosRegistrados.some((u) => u.run === form.run.trim());
    if (runExiste) {
      return mostrarMensaje("Ya existe un usuario registrado con este RUN.", "danger");
    }

    // 3. Crear el nuevo usuario
    const nuevoUsuario = {
      run: form.run.trim(),
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      correo: correoLimpio,
      rol: "Cliente",
      clave: form.clave,
      region: form.region,
      comuna: form.comuna,
      direccion: form.direccion.trim(),
    };

    // 4. Guardar en localStorage
    const nuevaLista = [...usuariosRegistrados, nuevoUsuario];
    localStorage.setItem("usuarios", JSON.stringify(nuevaLista));

    mostrarMensaje("¡Registro exitoso! Ya puedes iniciar sesión.", "success");
    navigate("/login");
  }

  return (
    <>
      <Navbar />
      <CarritoOffcanvas />

      {/* BORRAR CUANDO SE CREE EL ESTILO CSS DE ALERTA*/}
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
          <div className={`col-12 col-md-10 col-lg-8 ${styles.contenedorFormulario}`}>
            <h2
              className="text-center text-white mb-4"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              REGISTRO DE USUARIO
            </h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="run" className="form-label text-light">
                  RUN
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="run"
                  placeholder="Ingrese su RUN sin punto ni guion"
                  value={form.run}
                  onChange={(e) => actualizarCampo("run", e.target.value)}
                />
              </div>

              <div className="row mb-3">
                <div className="col-12 col-md-6 mb-3 mb-md-0">
                  <label htmlFor="nombre" className="form-label text-light">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    value={form.nombre}
                    onChange={(e) => actualizarCampo("nombre", e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="apellidos" className="form-label text-light">
                    Apellidos
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="apellidos"
                    value={form.apellidos}
                    onChange={(e) => actualizarCampo("apellidos", e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="correo" className="form-label text-light">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="correo"
                  placeholder="Ej: usuario@duoc.cl"
                  value={form.correo}
                  onChange={(e) => actualizarCampo("correo", e.target.value)}
                />
              </div>

              <div className="row mb-3">
                <div className="col-12 col-md-6 mb-3 mb-md-0">
                  <label htmlFor="clave" className="form-label text-light">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="clave"
                    value={form.clave}
                    onChange={(e) => actualizarCampo("clave", e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="confirmarClave" className="form-label text-light">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmarClave"
                    value={form.confirmarClave}
                    onChange={(e) => actualizarCampo("confirmarClave", e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="fechaNacimiento" className="form-label text-light">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="fechaNacimiento"
                  value={form.fechaNacimiento}
                  onChange={(e) => actualizarCampo("fechaNacimiento", e.target.value)}
                />
              </div>

              <div className="row mb-3">
                <div className="col-12 col-md-6 mb-3 mb-md-0">
                  <label htmlFor="region" className="form-label text-light">
                    Región
                  </label>
                  <select
                    className="form-select"
                    id="region"
                    value={form.region}
                    onChange={(e) => actualizarCampo("region", e.target.value)}
                  >
                    <option value="">-- Seleccione la Región --</option>
                    {REGIONES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="comuna" className="form-label text-light">
                    Comuna
                  </label>
                  <select
                    className="form-select"
                    id="comuna"
                    value={form.comuna}
                    onChange={(e) => actualizarCampo("comuna", e.target.value)}
                  >
                    <option value="">-- Seleccione la Comuna --</option>
                    {comunasDisponibles.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="direccion" className="form-label text-light">
                  Dirección
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="direccion"
                  placeholder="Ingrese su dirección"
                  value={form.direccion}
                  onChange={(e) => actualizarCampo("direccion", e.target.value)}
                />
              </div>

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Registrar Cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}