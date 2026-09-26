import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useProductos } from "../../context/ProductosContext";
import { useCarrito } from "../../context/CarritoContext";
import { calcularPrecioFinal, formatearPrecio } from "../../data/productos";
import styles from "./Home.module.css";

export default function Home() {
  const { productos } = useProductos();
  const { agregarAlCarrito } = useCarrito();

  // Top 3 ofertas con mayor descuento (misma lógica que index.js: filter + sort + slice)
  const ofertasEspeciales = useMemo(() => {
    return productos
      .filter((p) => p.enOferta)
      .sort((a, b) => b.descuento - a.descuento)
      .slice(0, 3);
  }, [productos]);

  return (
    <>
      <section id="sec-ofertas" className="py-5">
        <div className="container">
          <h2
            className="mb-4 text-white text-uppercase"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            OFERTAS ESPECIALES <span className={styles.textoNeonVerde}>• Top Drops</span>
          </h2>
          <div className="row g-4">
            {ofertasEspeciales.map((producto) => {
              const precioFinal = calcularPrecioFinal(producto);
              return (
                <div className="col-12 col-md-4" key={producto.codigo}>
                  <div className="card h-100 bg-dark text-white border-secondary position-relative overflow-hidden">
                    <span
                      className="badge position-absolute top-0 end-0 m-2 px-2 py-1"
                      style={{ backgroundColor: "#39FF14", color: "#000000", fontWeight: "bold" }}
                    >
                      -{producto.descuento}% OFF
                    </span>
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="card-img-top"
                      style={{
                        height: 250,
                        objectFit: "contain",
                        backgroundColor: "#111",
                        padding: 10,
                      }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{producto.nombre}</h5>
                      <div className="my-2">
                        <small className="text-decoration-line-through text-secondary me-2">
                          {formatearPrecio(producto.precio)}
                        </small>
                        <span className="fw-bold fs-5" style={{ color: "#39FF14" }}>
                          {formatearPrecio(precioFinal)}
                        </span>
                      </div>
                      <a
                        href="#"
                        className={`btn mt-auto ${styles.botonAgregar}`}
                        onClick={(e) => {
                          e.preventDefault();
                          agregarAlCarrito(producto, 1, precioFinal);
                        }}
                      >
                        Añadir al Carrito
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-5" id="nosotros">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <h2 className={`mb-3 ${styles.tituloNosotros}`}>Sobre Level-Up Gamer</h2>
              <p className={styles.textoNosotros}>
                Nacimos como respuesta a la creciente pasión por los videojuegos en Chile,
                transformándonos en una plataforma dedicada exclusivamente a equipar a la
                comunidad gamer con tecnología y accesorios de primer nivel.
              </p>
              <p className={styles.textoNosotros}>
                Aunque operamos sin sucursales físicas, conectamos con jugadores de todo el país a
                través de envíos rápidos y seguros, llevando lo último en consolas, PC armados,
                periféricos y ergonomía directo a tu setup.
              </p>

              <ul className="list-unstyled mt-4 d-flex flex-column gap-3">
                <li className="d-flex align-items-center gap-3">
                  <i className={`bi bi-truck fs-4 ${styles.textoNeonVerde}`}></i>
                  <span>Despachos garantizados a todas las regiones de Chile.</span>
                </li>
                <li className="d-flex align-items-center gap-3">
                  <i className={`bi bi-controller fs-4 ${styles.textoNeonVerde}`}></i>
                  <span>Catálogo seleccionado por y para jugadores.</span>
                </li>
                <li className="d-flex align-items-center gap-3">
                  <i className={`bi bi-shield-check fs-4 ${styles.textoNeonVerde}`}></i>
                  <span>Garantía y soporte técnico especializado.</span>
                </li>
              </ul>
            </div>

            <div className="col-12 col-lg-6">
              <div className="d-flex flex-column gap-4">
                <div className={`p-4 rounded border-secondary ${styles.tarjetaMisionVision}`}>
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <i className={`bi bi-bullseye fs-3 ${styles.textoNeonVerde}`}></i>
                    <h4 className={`mb-0 text-white ${styles.subtituloNosotros}`}>Nuestra Misión</h4>
                  </div>
                  <p className="mb-0 text-secondary">
                    Proporcionar productos de alta calidad para gamers en todo Chile, ofreciendo
                    una experiencia de compra única y personalizada, con un enfoque en la
                    satisfacción del cliente y el crecimiento de la comunidad gamer.
                  </p>
                </div>

                <div className={`p-4 rounded border-secondary ${styles.tarjetaMisionVision}`}>
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <i className={`bi bi-trophy fs-3 ${styles.textoNeonVerde}`}></i>
                    <h4 className={`mb-0 text-white ${styles.subtituloNosotros}`}>Nuestra Visión</h4>
                  </div>
                  <p className="mb-0 text-secondary">
                    Ser la tienda online líder en productos para gamers en Chile, reconocida por
                    su innovación, servicio al cliente excepcional, y un programa de fidelización
                    basado en gamificación que recompense a nuestros clientes más fieles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
