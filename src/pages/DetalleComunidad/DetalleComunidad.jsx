import { useParams, Link } from "react-router-dom";
import { casosComunidad } from "../../data/casosComunidad";
import styles from "./DetalleComunidad.module.css";

export default function DetalleComunidad() {
  const { casoId } = useParams(); // "caso-1" o "caso-2"
  const caso = casosComunidad[casoId];

  if (!caso) {
    return (
      <div className="container py-5 text-center">
        <p className="text-white">No encontramos ese caso curioso.</p>
        <Link to="/comunidad" className="btn btn-outline-light">
          Volver a Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <Link to="/comunidad" className={`btn mb-4 ${styles.btnOutlineLight}`}>
        &larr; Volver
      </Link>

      <article>
        <h1>{caso.titulo}</h1>
        <img src={caso.imagen} className="img-fluid rounded my-4" alt={caso.imagenAlt} />
        {caso.parrafos.map((parrafo, i) => (
          <p key={i}>{parrafo}</p>
        ))}
      </article>
    </div>
  );
}
