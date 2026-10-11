import { useState } from "react";
import { Link } from "react-router-dom";
import { casosComunidad } from "../../data/casosComunidad";
import styles from "./Comunidad.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CarritoOffcanvas from "../../components/CarritoOffcanvas/CarritoOffcanvas";
import { eventosComunidad } from "../../data/eventosComunidad";
import App_alert from "../../components/alerta/alerta";

const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

// Guarda una inscripción en el navegador (localStorage), sumándola a las que ya había
function guardarInscripcion(inscripcion) {
  // 1. Leemos lo que había guardado antes (puede no haber nada todavía)
  const textoGuardado = localStorage.getItem("inscripcionesEventos");

  // 2. Armamos la lista: si no había nada, partimos con una lista vacía
  let lista = [];
  if (textoGuardado !== null) {
    lista = JSON.parse(textoGuardado); // convierte el texto guardado en una lista
  }

  // 3. Agregamos la inscripción nueva al final de la lista
  lista.push(inscripcion);

  // 4. Guardamos la lista completa, de vuelta como texto
  localStorage.setItem("inscripcionesEventos", JSON.stringify(lista));
}


export default function Comunidad() {
  const casos = Object.values(casosComunidad);
  // Estados de la alerta 
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");


  // Estados del formulario de inscripción
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [eventoId, setEventoId] = useState("");

  function mostrarMensaje(mensaje, tipo) {
    setMensajeAlerta(mensaje);
    setTipoAlerta(tipo);
    setMostrarAlerta(true);
  }

  function manejarInscripcion(e) {
    e.preventDefault();

    if (nombre.trim() === "") {
      mostrarMensaje("El nombre es obligatorio.", "danger");
      return;
    }
    if (nombre.length > 100) {
      mostrarMensaje("El nombre no puede superar los 100 caracteres.", "danger");
      return;
    }
    if (correo.trim() === "") {
      mostrarMensaje("El correo es obligatorio.", "danger");
      return;
    }
    if (!DOMINIOS_PERMITIDOS.some((dominio) => correo.trim().endsWith(dominio))) {
      mostrarMensaje("El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.", "danger");
      return;
    }
    if (eventoId === "") {
      mostrarMensaje("Debes elegir un evento.", "danger");
      return;
    }

    // Buscamos en la lista de eventos el que eligió la persona
    const evento = eventosComunidad.find((ev) => ev.id === eventoId);

    // Guardamos la inscripción
    guardarInscripcion({
      nombre: nombre.trim(),
      correo: correo.trim(),
      eventoId: eventoId,
    });

    // Avisamos con la alerta verde
    mostrarMensaje(`¡Quedaste inscrito en ${evento.ciudad}!`, "success");
    setNombre("");
    setCorreo("");
    setEventoId("");
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

      <main className="flex-grow-1 contenedor-principal">
        <section id="blogs" className="container py-5">
          <h1 className={`text-center mb-5 ${styles.titulo}`}>Noticias Importantes</h1>

          {casos.map((caso, index) => (
          
            <article
              key={caso.id}
              id={`Caso${caso.numero}`}
              className={`row align-items-center mb-4 p-3 ${styles.tarjetaBlog} ${
                index % 2 === 1 ? "flex-md-row-reverse" : ""
              }`}
            >
              <div className="col-md-6">
                <h2 className={styles.titulo}>Caso Curioso #{caso.numero}</h2>
                <p>{caso.resumen}</p>
                <Link to={`/comunidad/${caso.id}`} className={`btn ${styles.btnCaso}`}>
                  Ver caso
                </Link>
              </div>
              <div className="col-md-6">
                <img src={caso.imagen} className="img-fluid rounded" alt={caso.imagenAlt} />
              </div>
            </article>
          ))}
        </section>

        <section id="mapa-eventos" className="container py-5">
          <h2 className={`text-center mb-2 ${styles.titulo}`}>Eventos Gamer a lo largo de Chile</h2>
          <p className="text-center mb-4" style={{ color: "#D3D3D3" }}>
            Participa presencialmente y suma puntos LevelUp en cada ciudad.
          </p>

          <div className="row g-3 justify-content-center">
            {eventosComunidad.map((evento) => (
              <div className="col-md-4" key={evento.id}>
                <div className={styles.tarjetaBlog}>
                  <p className="p-2 mb-0 text-white" style={{ fontWeight: 600 }}>
                    {evento.ciudad} — {evento.titulo}
                  </p>
                  <div className="ratio ratio-4x3">
                    <iframe
                      src={evento.mapaUrl}
                      title={`Mapa de ${evento.ciudad}`}
                      style={{ border: 0 }}
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="inscripcion-evento" className="container py-5">
          <h2 className={`text-center mb-4 ${styles.titulo}`}>Inscríbete a un evento</h2>

         
          <form
            onSubmit={manejarInscripcion}
            noValidate
            data-bs-theme="dark"
            className={`mx-auto p-4 ${styles.tarjetaBlog}`}
            style={{ maxWidth: 500 }}
          >
            
            <div className="mb-3">
              <label htmlFor="insc-nombre" className="form-label">Nombre</label>
              <input
                id="insc-nombre"
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="insc-correo" className="form-label">Correo</label>
              <input
                id="insc-correo"
                type="email"
                className="form-control"
                placeholder="usuario@duoc.cl"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="insc-evento" className="form-label">Evento</label>
              <select
                id="insc-evento"
                className="form-select"
                value={eventoId}
                onChange={(e) => setEventoId(e.target.value)}
              >
                <option value="">-- Elige un evento --</option>
                {eventosComunidad.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.ciudad} - {ev.titulo}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className={`btn ${styles.btnCaso}`}>Inscribirme</button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}