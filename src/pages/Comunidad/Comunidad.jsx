import { Link } from "react-router-dom";
import { casosComunidad } from "../../data/casosComunidad";
import styles from "./Comunidad.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CarritoOffcanvas from "../../components/CarritoOffcanvas/CarritoOffcanvas";
  import { eventosComunidad } from "../../data/eventosComunidad";

export default function Comunidad() {
  const casos = Object.values(casosComunidad);

  return (
    <>
      <Navbar />
      <CarritoOffcanvas />

      <main className="flex-grow-1 contenedor-principal">
        <section id="blogs" className="container py-5">
          <h1 className={`text-center mb-5 ${styles.titulo}`}>Noticias Importantes</h1>
          {casos.map((caso, index) => (
            <article
              key={caso.id}
              id={`Caso${caso.numero}`}
              className={`row align-items-center mb-4 p-3 ${styles.tarjetaBlog} ${index % 2 === 1 ? "flex-md-row-reverse" : ""
                }`}
            >
              <div className="col-md-6">
                <h2 className={styles.titulo}>Caso Curioso #{caso.numero}</h2>                <p>{caso.resumen}</p>
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
                <div
                  className={styles.tarjetaBlog}
                  style={evento.destacado ? { border: "2px solid #39FF14" } : undefined}
                >
                  <p
                    className="p-2 mb-0"
                    style={{ color: evento.destacado ? "#39FF14" : "#ffffff", fontWeight: 600 }}
                  >
                    {evento.ciudad} — {evento.titulo}
                  </p>
                  <div className="ratio ratio-4x3">
                    {evento.imagen ? (
                      <img
                        src={evento.imagen}
                        alt={`Mapa de ${evento.ciudad} mostrando la ubicación del evento ${evento.titulo}`}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <iframe
                        src={evento.mapaUrl}
                        title={`Mapa de ${evento.ciudad}`}
                        style={{ border: 0 }}
                        loading="lazy"
                      ></iframe>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}