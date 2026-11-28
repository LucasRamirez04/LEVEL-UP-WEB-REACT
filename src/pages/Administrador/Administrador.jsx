import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CarritoOffcanvas from "../../components/CarritoOffcanvas/CarritoOffcanvas";
import { formatearPrecio } from "../../data/productos";
import { obtenerProductos, agregarProducto, actualizarProducto, eliminarProducto,} from "../../api/productoApi";
import { obtenerCategorias } from "../../api/categoriaApi";
import {listarUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario,} from "../../api/usuariosApi";
import { obtenerVentas } from "../../api/ventaApi";
import { obtenerDetallesVenta } from "../../api/detalleVentasApi";
import styles from "./Administrador.module.css";

const PRODUCTO_VACIO = {
  nombre_producto: "",
  descripcion_producto: "",
  id_categoria: "",
  precio_producto: "",
  stock_producto: 10,
  porcentaje_producto: 0,
  imagen_producto: "",
};

const USUARIO_VACIO = {
  run: "",
  nombres: "",
  apellidos: "",
  correo: "",
  contrasena: "",
  fecha_nacimiento: "",
  direccion: "",
  rol: "CLIENTE",
};

export default function Administrador() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [detallesVenta, setDetallesVenta] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [formProd, setFormProd] = useState(PRODUCTO_VACIO);
  const [idProdEdicion, setIdProdEdicion] = useState(null);

  const [formUser, setFormUser] = useState(USUARIO_VACIO);
  const [idUserEdicion, setIdUserEdicion] = useState(null);

  const ingresosTotales = ventas.reduce((acc, venta) => acc + (venta.total || 0), 0);

  const cargarTodo = async () => {
    setCargando(true);
    setError("");
    try {
      const [prodsData, catsData, usersData, ventasData, detallesData] = await Promise.all([
        obtenerProductos(),
        obtenerCategorias(),
        listarUsuarios(),
        obtenerVentas(),
        obtenerDetallesVenta(),
      ]);
      setProductos(prodsData || []);
      setCategorias(catsData || []);
      setUsuarios(usersData || []);
      setVentas(ventasData || []);
      setDetallesVenta(detallesData || []);
    } catch {
      setError("No se pudieron cargar los datos del panel. Verifica tu sesión de Administrador.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  // ---------- Manejo de Productos con API ----------
  function iniciarEdicionProducto(prod) {
    setFormProd({
      nombre_producto: prod.nombre_producto || "",
      descripcion_producto: prod.descripcion_producto || "",
      id_categoria: prod.categoria?.id_categoria ?? "",
      precio_producto: prod.precio_producto ?? "",
      stock_producto: prod.stock_producto ?? 0,
      porcentaje_producto: prod.porcentaje_producto ?? 0,
      imagen_producto: prod.imagen_producto || "",
    });
    setIdProdEdicion(prod.codigo_producto);
  }

  function resetearFormularioProd() {
    setFormProd(PRODUCTO_VACIO);
    setIdProdEdicion(null);
  }

  async function handleSubmitProducto(e) {
    e.preventDefault();
    setError("");

    const datos = {
      nombre_producto: formProd.nombre_producto.trim(),
      descripcion_producto: formProd.descripcion_producto.trim(),
      precio_producto: parseInt(formProd.precio_producto, 10),
      stock_producto: parseInt(formProd.stock_producto, 10),
      porcentaje_producto: parseInt(formProd.porcentaje_producto, 10) || 0,
      imagen_producto: formProd.imagen_producto.trim() || "/img/catan.jpg",
      categoria: {
        id_categoria: parseInt(formProd.id_categoria, 10),
      },
    };

    try {
      if (idProdEdicion === null) {
        await agregarProducto(datos);
      } else {
        await actualizarProducto(idProdEdicion, datos);
      }
      const listaActualizada = await obtenerProductos();
      setProductos(listaActualizada || []);
      resetearFormularioProd();
    } catch {
      setError("Error al guardar el producto.");
    }
  }

  async function handleEliminarProducto(prod) {
    if (!confirm("¿Deseas eliminar este producto?")) return;
    setError("");

    try {
      await eliminarProducto(prod.codigo_producto);
      const listaActualizada = await obtenerProductos();
      setProductos(listaActualizada || []);
      if (idProdEdicion === prod.codigo_producto) {
        resetearFormularioProd();
      }
    } catch {
      setError("Error al eliminar el producto. Puede estar asociado a una venta.");
    }
  }

  // ---------- Manejo de Usuarios con API ----------
  function iniciarEdicionUsuario(usr) {
    setFormUser({
      run: usr.run || "",
      nombres: usr.nombres || "",
      apellidos: usr.apellidos || "",
      correo: usr.correo || "",
      contrasena: "",
      fecha_nacimiento: usr.fecha_nacimiento || "",
      direccion: usr.direccion || "",
      rol: usr.rol || "CLIENTE",
    });
    setIdUserEdicion(usr.id_usuario);
  }

  function resetearFormularioUser() {
    setFormUser(USUARIO_VACIO);
    setIdUserEdicion(null);
  }

  async function handleSubmitUsuario(e) {
    e.preventDefault();
    setError("");

    const correo = formUser.correo.trim().toLowerCase();
    const dominiosValidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
    if (!dominiosValidos.some((dom) => correo.endsWith(dom))) {
      alert("El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com");
      return;
    }

    const datos = { ...formUser, correo };
    if (idUserEdicion !== null && !datos.contrasena) {
      delete datos.contrasena;
    }

    try {
      if (idUserEdicion === null) {
        await crearUsuario(datos);
      } else {
        await actualizarUsuario(idUserEdicion, datos);
      }
      const listaActualizada = await listarUsuarios();
      setUsuarios(listaActualizada || []);
      resetearFormularioUser();
    } catch {
      setError("Error al guardar el usuario. Verifica que los datos sean válidos.");
    }
  }

  async function handleEliminarUsuario(usr) {
    if (!confirm("¿Deseas eliminar este usuario?")) return;
    setError("");

    try {
      await eliminarUsuario(usr.id_usuario);
      const listaActualizada = await listarUsuarios();
      setUsuarios(listaActualizada || []);
      if (idUserEdicion === usr.id_usuario) {
        resetearFormularioUser();
      }
    } catch {
      setError("Error al eliminar el usuario. Puede tener ventas asociadas.");
    }
  }

  return (
    <>
      <Navbar />
      <CarritoOffcanvas />

      <main className="container flex-grow-1" style={{ marginTop: 100, marginBottom: 60 }}>
        <section id="sec-dashboard" className="my-5 pt-4">
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary">
            <div>
              <h2 className="text-white mb-0" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Panel de Control
              </h2>
              <small className="text-secondary">Gestión de inventario, usuarios y ventas</small>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {cargando && <p className="text-secondary">Cargando datos del panel...</p>}

          <ul className="nav nav-tabs border-secondary mb-4" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link active ${styles.pestanaGamer}`}
                data-bs-toggle="tab"
                data-bs-target="#tab-resumen"
                type="button"
                role="tab"
              >
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${styles.pestanaGamer}`}
                data-bs-toggle="tab"
                data-bs-target="#tab-productos"
                type="button"
                role="tab"
              >
                <i className="bi bi-box-seam me-2"></i>Productos
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${styles.pestanaGamer}`}
                data-bs-toggle="tab"
                data-bs-target="#tab-usuarios"
                type="button"
                role="tab"
              >
                <i className="bi bi-people me-2"></i>Usuarios
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${styles.pestanaGamer}`}
                data-bs-toggle="tab"
                data-bs-target="#tab-ventas"
                type="button"
                role="tab"
              >
                <i className="bi bi-currency-dollar me-2"></i>Ventas
              </button>
            </li>
          </ul>

          <div className="tab-content">
            {/* Dashboard / KPIs */}
            <div className="tab-pane fade show active" id="tab-resumen" role="tabpanel">
              <div className="row g-3">
                <div className="col-12 col-md-3">
                  <div className="card bg-dark text-white border-secondary p-3 shadow">
                    <span className="text-secondary small">Total Productos</span>
                    <h3 className="mt-1 mb-0" style={{ color: "#39FF14" }}>
                      {productos.length}
                    </h3>
                  </div>
                </div>
                <div className="col-12 col-md-3">
                  <div className="card bg-dark text-white border-secondary p-3 shadow">
                    <span className="text-secondary small">Ofertas Activas</span>
                    <h3 className="text-warning mt-1 mb-0">
                      {productos.filter((p) => p.porcentaje_producto > 0).length}
                    </h3>
                  </div>
                </div>
                <div className="col-12 col-md-3">
                  <div className="card bg-dark text-white border-secondary p-3 shadow">
                    <span className="text-secondary small">Usuarios Registrados</span>
                    <h3 className="text-info mt-1 mb-0">{usuarios.length}</h3>
                  </div>
                </div>
                <div className="col-12 col-md-3">
                  <div className="card bg-dark text-white border-success p-3 shadow">
                    <span className="text-secondary small">Ingresos Totales</span>
                    <h3 className="text-success mt-1 mb-0">{formatearPrecio(ingresosTotales)}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Pestaña Productos */}
            <div className="tab-pane fade" id="tab-productos" role="tabpanel">
              <div className="row g-4">
                <div className="col-12 col-xl-4">
                  <div className="card bg-dark text-white border-secondary p-3 shadow">
                    <h5 className="text-success mb-3">
                      <i
                        className={`bi ${
                          idProdEdicion === null ? "bi-plus-circle" : "bi-pencil-square"
                        } me-2`}
                      ></i>
                      {idProdEdicion === null ? "Nuevo Producto" : `Editar Producto #${idProdEdicion}`}
                    </h5>
                    <form onSubmit={handleSubmitProducto}>
                      <div className="mb-2">
                        <label className="form-label small text-secondary">Nombre *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          required
                          maxLength={100}
                          value={formProd.nombre_producto}
                          onChange={(e) =>
                            setFormProd({ ...formProd, nombre_producto: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label small text-secondary">Descripción *</label>
                        <textarea
                          className="form-control form-control-sm"
                          rows={2}
                          required
                          value={formProd.descripcion_producto}
                          onChange={(e) =>
                            setFormProd({ ...formProd, descripcion_producto: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label small text-secondary">Categoría *</label>
                        <select
                          className="form-select form-select-sm"
                          required
                          value={formProd.id_categoria}
                          onChange={(e) =>
                            setFormProd({ ...formProd, id_categoria: e.target.value })
                          }
                        >
                          <option value="">Seleccionar...</option>
                          {categorias.map((c) => (
                            <option key={c.id_categoria} value={c.id_categoria}>
                              {c.nombre_categoria}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="row g-2 mb-2">
                        <div className="col-6">
                          <label className="form-label small text-secondary">Precio *</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            required
                            min="0"
                            value={formProd.precio_producto}
                            onChange={(e) =>
                              setFormProd({ ...formProd, precio_producto: e.target.value })
                            }
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label small text-secondary">Stock *</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            required
                            min="0"
                            value={formProd.stock_producto}
                            onChange={(e) =>
                              setFormProd({ ...formProd, stock_producto: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="form-label small text-secondary">
                          Descuento (%) — 0 si no está en oferta
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          min="0"
                          max="100"
                          value={formProd.porcentaje_producto}
                          onChange={(e) =>
                            setFormProd({ ...formProd, porcentaje_producto: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label small text-secondary">Ruta Imagen *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="/img/catan.jpg"
                          required
                          value={formProd.imagen_producto}
                          onChange={(e) =>
                            setFormProd({ ...formProd, imagen_producto: e.target.value })
                          }
                        />
                      </div>
                      <div className="d-flex gap-2 mt-3">
                        <button
                          type="submit"
                          className={`btn btn-sm flex-grow-1 ${
                            idProdEdicion === null ? "btn-success" : "btn-warning"
                          }`}
                        >
                          {idProdEdicion === null ? "Guardar" : "Actualizar"}
                        </button>
                        {idProdEdicion !== null && (
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={resetearFormularioProd}
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>

                <div className="col-12 col-xl-8">
                  <div className="table-responsive rounded-3 border border-secondary shadow">
                    <table className="table table-dark table-hover mb-0 align-middle">
                      <thead>
                        <tr className="text-secondary small">
                          <th>ID</th>
                          <th>NOMBRE</th>
                          <th>CATEGORÍA</th>
                          <th>PRECIO</th>
                          <th>STOCK</th>
                          <th>OFERTA</th>
                          <th className="text-end">ACCIONES</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productos.map((prod) => (
                          <tr key={prod.codigo_producto}>
                            <td className="fw-bold text-success">{prod.codigo_producto}</td>
                            <td>{prod.nombre_producto}</td>
                            <td>{prod.categoria?.nombre_categoria || "-"}</td>
                            <td>{formatearPrecio(prod.precio_producto)}</td>
                            <td>{prod.stock_producto}</td>
                            <td>
                              {prod.porcentaje_producto > 0 ? (
                                <span className="badge bg-success text-dark">
                                  -{prod.porcentaje_producto}%
                                </span>
                              ) : (
                                <span className="badge bg-secondary">No</span>
                              )}
                            </td>
                            <td className="text-end">
                              <button
                                className="btn btn-sm btn-outline-warning me-1"
                                onClick={() => iniciarEdicionProducto(prod)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleEliminarProducto(prod)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Pestaña Usuarios */}
            <div className="tab-pane fade" id="tab-usuarios" role="tabpanel">
              <div className="row g-4">
                <div className="col-12 col-xl-4">
                  <div className="card bg-dark text-white border-secondary p-3 shadow">
                    <h5 className="text-info mb-3">
                      <i
                        className={`bi ${
                          idUserEdicion === null ? "bi-person-plus" : "bi-pencil-square"
                        } me-2`}
                      ></i>
                      {idUserEdicion === null ? "Nuevo Usuario" : "Editar Usuario"}
                    </h5>
                    <form onSubmit={handleSubmitUsuario}>
                      <div className="mb-2">
                        <label className="form-label small text-secondary">
                          RUN (Sin puntos ni guion) *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          required
                          minLength={7}
                          maxLength={9}
                          value={formUser.run}
                          onChange={(e) => setFormUser({ ...formUser, run: e.target.value })}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label small text-secondary">Nombres *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          required
                          maxLength={50}
                          value={formUser.nombres}
                          onChange={(e) => setFormUser({ ...formUser, nombres: e.target.value })}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label small text-secondary">Apellidos *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          required
                          maxLength={100}
                          value={formUser.apellidos}
                          onChange={(e) => setFormUser({ ...formUser, apellidos: e.target.value })}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label small text-secondary">Correo *</label>
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          required
                          maxLength={100}
                          value={formUser.correo}
                          onChange={(e) => setFormUser({ ...formUser, correo: e.target.value })}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label small text-secondary">
                          Contraseña {idUserEdicion === null ? "*" : "(opcional al editar)"}
                        </label>
                        <input
                          type="password"
                          className="form-control form-control-sm"
                          required={idUserEdicion === null}
                          value={formUser.contrasena}
                          onChange={(e) => setFormUser({ ...formUser, contrasena: e.target.value })}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label small text-secondary">
                          Fecha de Nacimiento *
                        </label>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          required
                          value={formUser.fecha_nacimiento}
                          onChange={(e) =>
                            setFormUser({ ...formUser, fecha_nacimiento: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label small text-secondary">Dirección *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          required
                          value={formUser.direccion}
                          onChange={(e) => setFormUser({ ...formUser, direccion: e.target.value })}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label small text-secondary">Tipo de Usuario *</label>
                        <select
                          className="form-select form-select-sm"
                          required
                          value={formUser.rol}
                          onChange={(e) => setFormUser({ ...formUser, rol: e.target.value })}
                        >
                          <option value="CLIENTE">Cliente</option>
                          <option value="VENDEDOR">Vendedor</option>
                          <option value="ADMINISTRADOR">Administrador</option>
                        </select>
                      </div>
                      <div className="d-flex gap-2 mt-3">
                        <button
                          type="submit"
                          className="btn btn-sm btn-info text-white flex-grow-1"
                        >
                          {idUserEdicion === null ? "Guardar" : "Actualizar"}
                        </button>
                        {idUserEdicion !== null && (
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={resetearFormularioUser}
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>

                <div className="col-12 col-xl-8">
                  <div className="table-responsive rounded-3 border border-secondary shadow">
                    <table className="table table-dark table-hover mb-0 align-middle">
                      <thead>
                        <tr className="text-secondary small">
                          <th>RUN</th>
                          <th>NOMBRE COMPLETO</th>
                          <th>CORREO</th>
                          <th>ROL</th>
                          <th className="text-end">ACCIONES</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usuarios.map((usr) => (
                          <tr key={usr.id_usuario}>
                            <td className="fw-bold">{usr.run}</td>
                            <td>
                              {usr.nombres} {usr.apellidos}
                            </td>
                            <td>{usr.correo}</td>
                            <td>
                              {usr.rol?.toUpperCase() === "ADMINISTRADOR" ? (
                                <span className="badge bg-success">Administrador</span>
                              ) : (
                                <span className="badge bg-info text-dark">{usr.rol}</span>
                              )}
                            </td>
                            <td className="text-end">
                              <button
                                className="btn btn-sm btn-outline-warning me-1"
                                onClick={() => iniciarEdicionUsuario(usr)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleEliminarUsuario(usr)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Pestaña Ventas */}
            <div className="tab-pane fade" id="tab-ventas" role="tabpanel">
              <div className="card bg-dark border-secondary text-white p-4 shadow-lg">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary">
                  <h4 className="text-info mb-0">Registro de Ventas</h4>
                </div>

                {ventas.length === 0 ? (
                  <div className="text-center p-5 text-secondary border border-secondary rounded">
                    <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                    <p>No hay ventas registradas aún.</p>
                  </div>
                ) : (
                  <div className="table-responsive rounded-3 border border-secondary shadow">
                    <table className="table table-dark table-hover mb-0 align-middle">
                      <thead>
                        <tr className="text-secondary small">
                          <th>ID VENTA</th>
                          <th>FECHA</th>
                          <th>CLIENTE</th>
                          <th>PRODUCTOS COMPRADOS</th>
                          <th className="text-end">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ventas.slice().reverse().map((venta) => {
                          const detallesDeEstaVenta = detallesVenta.filter(
                            (d) => d.venta?.id_venta === venta.id_venta
                          );
                          return (
                            <tr key={venta.id_venta}>
                              <td className="text-secondary small fw-bold">#{venta.id_venta}</td>
                              <td>{venta.fecha_venta}</td>
                              <td>
                                {venta.usuario
                                  ? `${venta.usuario.nombres} ${venta.usuario.apellidos}`
                                  : "-"}
                              </td>
                              <td>
                                <ul className="mb-0 list-unstyled small text-info">
                                  {detallesDeEstaVenta.map((det) => (
                                    <li key={det.id_detalle_venta}>
                                      • {det.producto?.nombre_producto} (x{det.cantidad_producto})
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td className="text-success fw-bold fs-6 text-end">
                                {formatearPrecio(venta.total)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Tablas fijas de Reglas de Negocio */}
        <section id="sec-reglasNegocio" className="my-5 pt-4">
          <div className="mb-4 pb-2 border-bottom border-secondary">
            <h2 className="text-white mb-0" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Reglas de Negocio
            </h2>
            <small className="text-secondary">Lineamientos para el negocio</small>
          </div>

          <div className="row g-4 align-items-stretch">
            <div className="col-12 col-lg-6 d-flex flex-column">
              <h5 className="text-success mb-3">
                <i className="bi bi-box-seam me-2"></i>Reglas de Productos
              </h5>
              <div className="rounded-3 overflow-hidden border border-secondary flex-grow-1">
                <table className="table table-dark table-striped mb-0 table-sm h-100 align-middle">
                  <thead>
                    <tr className="border-bottom border-secondary text-success small">
                      <th>Campo</th>
                      <th>Tipo</th>
                      <th>Regla</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Nombre</td><td>Obligatorio</td><td>Máximo 100 caracteres.</td></tr>
                    <tr><td>Descripción</td><td>Obligatorio</td><td>Texto descriptivo del producto.</td></tr>
                    <tr><td>Precio</td><td>Obligatorio</td><td>Mínimo 0 (0 = FREE), entero.</td></tr>
                    <tr><td>Stock</td><td>Obligatorio</td><td>Mínimo 0, números enteros.</td></tr>
                    <tr><td>Categoría</td><td>Obligatorio</td><td>Selección desde lista (Select).</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-12 col-lg-6 d-flex flex-column">
              <h5 className="text-info mb-3">
                <i className="bi bi-people me-2"></i>Reglas de Usuarios
              </h5>
              <div className="rounded-3 overflow-hidden border border-secondary flex-grow-1">
                <table className="table table-dark table-striped mb-0 table-sm h-100 align-middle">
                  <thead>
                    <tr className="border-bottom border-secondary text-info small">
                      <th>Campo</th>
                      <th>Tipo</th>
                      <th>Regla</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>RUN</td><td>Obligatorio</td><td>7 a 9 car., sin puntos ni guión.</td></tr>
                    <tr><td>Nombres</td><td>Obligatorio</td><td>Máximo 50 caracteres.</td></tr>
                    <tr><td>Correo</td><td>Obligatorio</td><td>@duoc.cl, @profesor.duoc.cl, @gmail.com.</td></tr>
                    <tr><td>Tipo Usuario</td><td>Obligatorio</td><td>ADMINISTRADOR, VENDEDOR, CLIENTE.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-12 mt-4">
              <h5 className="text-warning mb-3">
                <i className="bi bi-shield-lock me-2"></i>Roles y Permisos
              </h5>
              <div className="rounded-3 overflow-hidden border border-secondary">
                <table className="table table-dark table-striped mb-0">
                  <thead>
                    <tr className="border-bottom border-secondary text-warning small">
                      <th style={{ width: "25%" }}>Rol</th>
                      <th>Permisos</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Administrador</td><td>Acceso total al sistema.</td></tr>
                    <tr><td>Vendedor</td><td>Solo ver lista/detalle de productos y órdenes.</td></tr>
                    <tr><td>Cliente</td><td>Solo acceso a la tienda.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}