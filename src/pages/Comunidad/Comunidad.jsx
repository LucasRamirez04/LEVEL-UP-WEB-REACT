import { Link } from "react-router-dom";
import { casosComunidad } from "../../data/casosComunidad";
import styles from "./Comunidad.module.css";

export default function Comunidad() {
  const casos = Object.values(casosComunidad);

  return (
    <>
      <section id="blogs" className="container py-5">
        <h1 className="text-center mb-5">Noticias Importantes</h1>

        {casos.map((caso, index) => (
          <article
            key={caso.id}
            id={`Caso${caso.numero}`}
            className={`row align-items-center mb-4 p-3 ${styles.tarjetaBlog} ${
              index % 2 === 1 ? "flex-md-row-reverse" : ""
            }`}
          >
            <div className="col-md-6">
              <h2>Caso Curioso #{caso.numero}</h2>
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
        <h2 className="text-center mb-2">Eventos Gamer a lo largo de Chile</h2>
        <p className="text-center mb-4" style={{ color: "#D3D3D3" }}>
          Participa presencialmente y suma puntos LevelUp en cada ciudad.
        </p>
        <div
          className={`${styles.tarjetaBlog} mx-auto`}
          style={{ maxWidth: 500, border: "2px solid #39FF14" }}
        >
          <p className="p-2 mb-0" style={{ color: "#39FF14", fontWeight: 600 }}>
            Santiago — Level Up - ExpoGamer
          </p>
          <div className="ratio ratio-4x3">
            <img
              src="/img/mapa-santiago.png"
              alt="Mapa de Santiago mostrando la ubicación del evento Level Up ExpoGamer"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
