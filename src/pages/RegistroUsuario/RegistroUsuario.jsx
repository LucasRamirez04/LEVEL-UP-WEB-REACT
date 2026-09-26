import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuarios } from "../../context/UsuariosContext";
import styles from "./RegistroUsuario.module.css";

const COMUNAS_POR_REGION = {
  "Región Metropolitana de Santiago": ["Santiago", "La Florida", "Maipú", "Puente Alto", "Providencia"],
  "Región de la Araucanía": ["Temuco", "Villarrica", "Pucón", "Angol", "Victoria"],
  "Región de Ñuble": ["Chillán", "San Carlos", "Bulnes", "Quillón", "Coihueco"],
};

const REGIONES = Object.keys(COMUNAS_POR_REGION);

export default function RegistroUsuario() {
  const { registrarUsuario } = useUsuarios();
  const navigate = useNavigate();

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

    if (form.run === "") return alert("El RUN es requerido.");
    if (form.run.includes(".") || form.run.includes("-"))
      return alert("El RUN debe ser ingresado sin puntos ni guion.");
    if (form.run.length < 7 || form.run.length > 9)
      return alert("El RUN debe tener entre 7 y 9 caracteres.");

    if (form.nombre === "") return alert("El nombre es requerido.");
    if (form.nombre.length > 50) return alert("El nombre no puede tener más de 50 caracteres.");

    if (form.apellidos === "") return alert("Los apellidos son requeridos.");
    if (form.apellidos.length > 100)
      return alert("Los apellidos no pueden tener más de 100 caracteres.");

    if (form.correo === "") return alert("El correo es requerido.");
    if (form.correo.length > 100) return alert("El correo no puede tener más de 100 caracteres.");
    if (
      !form.correo.endsWith("@duoc.cl") &&
      !form.correo.endsWith("@profesor.duoc.cl") &&
      !form.correo.endsWith("@gmail.com")
    )
      return alert("El correo solo puede ser @duoc.cl, @profesor.duoc.cl o @gmail.com");

    if (form.clave === "") return alert("La contraseña es requerida.");
    if (form.clave.length < 4 || form.clave.length > 10)
      return alert("La contraseña debe tener entre 4 y 10 caracteres.");

    if (form.confirmarClave === "") return alert("Debe confirmar su contraseña.");
    if (form.clave !== form.confirmarClave) return alert("Las contraseñas no coinciden.");

    if (form.fechaNacimiento === "") return alert("La fecha de nacimiento es requerida.");
    const fechaNac = new Date(form.fechaNacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    if (edad < 18) return alert("Debes ser mayor de 18 años para poder registrarte.");

    if (form.region === "") return alert("Debe seleccionar una región.");
    if (form.comuna === "") return alert("Debe seleccionar una comuna.");

    if (form.direccion === "") return alert("La dirección es requerida.");
    if (form.direccion.length > 300)
      return alert("La dirección no puede tener más de 300 caracteres.");

    registrarUsuario({
      run: form.run,
      nombre: form.nombre,
      apellidos: form.apellidos,
      correo: form.correo,
      rol: "Cliente",
      clave: form.clave,
      direccion: form.direccion,
    });

    alert("¡Registro exitoso!");
    navigate("/login");
  }

  return (
    <main className="container mb-5">
      <div className="row justify-content-center mt-4">
        <div className={`col-12 col-md-10 col-lg-8 ${styles.contenedorFormulario}`}>
          <h2
            className="text-center text-white mb-4"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            REGISTRO DE USUARIO
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="run" className="form-label">
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
                <label htmlFor="nombre" className="form-label">
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
                <label htmlFor="apellidos" className="form-label">
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
              <label htmlFor="correo" className="form-label">
                Correo
              </label>
              <input
                type="email"
                className="form-control"
                id="correo"
                placeholder="Ej: usuario@.cl/com"
                value={form.correo}
                onChange={(e) => actualizarCampo("correo", e.target.value)}
              />
            </div>

            <div className="row mb-3">
              <div className="col-12 col-md-6 mb-3 mb-md-0">
                <label htmlFor="clave" className="form-label">
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
                <label htmlFor="confirmarClave" className="form-label">
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
              <label htmlFor="fechaNacimiento" className="form-label">
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
                <label htmlFor="region" className="form-label">
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
                <label htmlFor="comuna" className="form-label">
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
              <label htmlFor="direccion" className="form-label">
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
  );
}
