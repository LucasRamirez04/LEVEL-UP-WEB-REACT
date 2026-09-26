import { useState } from "react";
import { useProductos } from "../../context/ProductosContext";
import { useUsuarios } from "../../context/UsuariosContext";
import { formatearPrecio } from "../../data/productos";
import styles from "./Administrador.module.css";

const CATEGORIAS = [
  "Juegos de Mesa",
  "Accesorios",
  "Consolas/Computadores",
  "Perifericos",
  "Vestuario",
];

const PRODUCTO_VACIO = {
  codigo: "",
  nombre: "",
  categoria: "",
  precio: "",
  stock: 10,
  descuento: 0,
  enOferta: false,
  imagen: "",
};

const USUARIO_VACIO = {
  run: "",
  nombre: "",
  apellidos: "",
  correo: "",
  rol: "Cliente",
};

export default function Administrador() {
  const { productos, crearProducto, actualizarProducto, eliminarProducto } = useProductos();
  const { usuarios, registrarUsuario, actualizarUsuario, eliminarUsuario } = useUsuarios();

  const [formProd, setFormProd] = useState(PRODUCTO_VACIO);
  const [indiceProdEdicion, setIndiceProdEdicion] = useState(-1);

  const [formUser, setFormUser] = useState(USUARIO_VACIO);
  const [indiceUserEdicion, setIndiceUserEdicion] = useState(-1);

  // ---------- Productos ----------
  function iniciarEdicionProducto(index) {
    setFormProd(productos[index]);
    setIndiceProdEdicion(index);
  }

  function resetearFormularioProd() {
    setFormProd(PRODUCTO_VACIO);
    setIndiceProdEdicion(-1);
  }

  function handleSubmitProducto(e) {
    e.preventDefault();
    const datos = {
      ...formProd,
      precio: parseFloat(formProd.precio),
      stock: parseInt(formProd.stock),
      descuento: parseInt(formProd.descuento) || 0,
      imagen: formProd.imagen || "/img/catan.jpg",
    };

    if (indiceProdEdicion === -1) {
      crearProducto(datos);
    } else {
      actualizarProducto(indiceProdEdicion, datos);
    }
    resetearFormularioProd();
  }

  function handleEliminarProducto(index) {
    if (confirm("¿Deseas eliminar este producto?")) {
      eliminarProducto(index);
    }
  }

  // ---------- Usuarios ----------
  function iniciarEdicionUsuario(index) {
    setFormUser(usuarios[index]);
    setIndiceUserEdicion(index);
  }

  function resetearFormularioUser() {
    setFormUser(USUARIO_VACIO);
    setIndiceUserEdicion(-1);
  }

  function handleSubmitUsuario(e) {
    e.preventDefault();

    const correo = formUser.correo.trim().toLowerCase();
    const dominiosValidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
    if (!dominiosValidos.some((dom) => correo.endsWith(dom))) {
      alert("El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com");
      return;
    }

    const datos = { ...formUser, correo };

    if (indiceUserEdicion === -1) {
      registrarUsuario(datos);
    } else {
      actualizarUsuario(indiceUserEdicion, datos);
    }
    resetearFormularioUser();
  }

  function handleEliminarUsuario(index) {
    if (confirm("¿Deseas eliminar este usuario?")) {
      eliminarUsuario(index);
    }
  }

  return (
    <div className="container flex-grow-1" style={{ marginTop: 100, marginBottom: 60 }}>
      <section id="sec-dashboard" className="my-5 pt-4">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary">
          <div>
            <h2 className="text-white mb-0" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Panel de Control
            </h2>
            <small className="text-secondary">Gestión de inventario y usuarios</small>
          </div>
        </div>

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
        </ul>

        <div className="tab-content">
          {/* KPIs */}
          <div className="tab-pane fade show active" id="tab-resumen" role="tabpanel">
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <div className="card bg-dark text-white border-secondary p-3">
                  <span className="text-secondary small">Total Productos</span>
                  <h3 className="mt-1 mb-0" style={{ color: "#39FF14" }}>
                    {productos.length}
                  </h3>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card bg-dark text-white border-secondary p-3">
                  <span className="text-secondary small">Ofertas Activas</span>
                  <h3 className="text-warning mt-1 mb-0">
                    {productos.filter((p) => p.enOferta).length}
                  </h3>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card bg-dark text-white border-secondary p-3">
                  <span className="text-secondary small">Usuarios Registrados</span>
                  <h3 className="text-info mt-1 mb-0">{usuarios.length}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="tab-pane fade" id="tab-productos" role="tabpanel">
            <div className="row g-4">
              <div className="col-12 col-xl-4">
                <div className="card bg-dark text-white border-secondary p-3">
                  <h5 className="text-success mb-3">
                    <i
                      className={`bi ${
                        indiceProdEdicion === -1 ? "bi-plus-circle" : "bi-pencil-square"
                      } me-2`}
                    ></i>
                    {indiceProdEdicion === -1 ? "Nuevo Producto" : "Editar Producto"}
                  </h5>
                  <form onSubmit={handleSubmitProducto}>
                    <div className="mb-2">
                      <label className="form-label small text-secondary">Código *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        minLength={3}
                        value={formProd.codigo}
                        onChange={(e) => setFormProd({ ...formProd, codigo: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small text-secondary">Nombre *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        maxLength={100}
                        value={formProd.nombre}
                        onChange={(e) => setFormProd({ ...formProd, nombre: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small text-secondary">Categoría *</label>
                      <select
                        className="form-select form-select-sm"
                        required
                        value={formProd.categoria}
                        onChange={(e) => setFormProd({ ...formProd, categoria: e.target.value })}
                      >
                        <option value="">Seleccionar...</option>
                        {CATEGORIAS.map((c) => (
                          <option key={c} value={c}>
                            {c}
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
                          step="any"
                          value={formProd.precio}
                          onChange={(e) => setFormProd({ ...formProd, precio: e.target.value })}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small text-secondary">Stock *</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          required
                          min="0"
                          value={formProd.stock}
                          onChange={(e) => setFormProd({ ...formProd, stock: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <label className="form-label small text-secondary">Descuento (%)</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          min="0"
                          max="100"
                          value={formProd.descuento}
                          onChange={(e) => setFormProd({ ...formProd, descuento: e.target.value })}
                        />
                      </div>
                      <div className="col-6 d-flex align-items-end pb-1">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="prod-enOferta"
                            checked={formProd.enOferta}
                            onChange={(e) =>
                              setFormProd({ ...formProd, enOferta: e.target.checked })
                            }
                          />
                          <label className="form-check-label small" htmlFor="prod-enOferta">
                            ¿En Oferta?
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="form-label small text-secondary">Ruta Imagen</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="/img/catan.jpg"
                        value={formProd.imagen}
                        onChange={(e) => setFormProd({ ...formProd, imagen: e.target.value })}
                      />
                    </div>
                    <div className="d-flex gap-2 mt-3">
                      <button
                        type="submit"
                        className={`btn btn-sm flex-grow-1 ${
                          indiceProdEdicion === -1 ? "btn-success" : "btn-warning"
                        }`}
                      >
                        {indiceProdEdicion === -1 ? "Guardar" : "Actualizar"}
                      </button>
                      {indiceProdEdicion !== -1 && (
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
                <div className="table-responsive rounded-3 border border-secondary">
                  <table className="table table-dark table-hover mb-0 align-middle">
                    <thead>
                      <tr className="text-secondary small">
                        <th>CÓDIGO</th>
                        <th>NOMBRE</th>
                        <th>CATEGORÍA</th>
                        <th>PRECIO</th>
                        <th>STOCK</th>
                        <th>OFERTA</th>
                        <th className="text-end">ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map((prod, index) => (
                        <tr key={prod.codigo + index}>
                          <td className="fw-bold text-success">{prod.codigo}</td>
                          <td>{prod.nombre}</td>
                          <td>{prod.categoria}</td>
                          <td>{formatearPrecio(prod.precio)}</td>
                          <td>{prod.stock}</td>
                          <td>
                            {prod.enOferta ? (
                              <span className="badge bg-success text-dark">
                                -{prod.descuento}%
                              </span>
                            ) : (
                              <span className="badge bg-secondary">No</span>
                            )}
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-warning me-1"
                              onClick={() => iniciarEdicionProducto(index)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleEliminarProducto(index)}
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

          {/* Usuarios */}
          <div className="tab-pane fade" id="tab-usuarios" role="tabpanel">
            <div className="row g-4">
              <div className="col-12 col-xl-4">
                <div className="card bg-dark text-white border-secondary p-3">
                  <h5 className="text-info mb-3">
                    <i
                      className={`bi ${
                        indiceUserEdicion === -1 ? "bi-person-plus" : "bi-pencil-square"
                      } me-2`}
                    ></i>
                    {indiceUserEdicion === -1 ? "Nuevo Usuario" : "Editar Usuario"}
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
                      <label className="form-label small text-secondary">Nombre *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        maxLength={50}
                        value={formUser.nombre}
                        onChange={(e) => setFormUser({ ...formUser, nombre: e.target.value })}
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
                      <label className="form-label small text-secondary">Tipo de Usuario *</label>
                      <select
                        className="form-select form-select-sm"
                        required
                        value={formUser.rol}
                        onChange={(e) => setFormUser({ ...formUser, rol: e.target.value })}
                      >
                        <option value="Cliente">Cliente</option>
                        <option value="Vendedor">Vendedor</option>
                        <option value="Administrador">Administrador</option>
                      </select>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                      <button
                        type="submit"
                        className="btn btn-sm btn-info text-white flex-grow-1"
                      >
                        {indiceUserEdicion === -1 ? "Guardar" : "Actualizar"}
                      </button>
                      {indiceUserEdicion !== -1 && (
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
                <div className="table-responsive rounded-3 border border-secondary">
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
                      {usuarios.map((usr, index) => (
                        <tr key={usr.run + index}>
                          <td className="fw-bold">{usr.run}</td>
                          <td>
                            {usr.nombre} {usr.apellidos}
                          </td>
                          <td>{usr.correo}</td>
                          <td>
                            {usr.rol === "Administrador" ? (
                              <span className="badge bg-success">Administrador</span>
                            ) : (
                              <span className="badge bg-info text-dark">{usr.rol}</span>
                            )}
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-warning me-1"
                              onClick={() => iniciarEdicionUsuario(index)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleEliminarUsuario(index)}
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
        </div>
      </section>

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
                  <tr><td>Código</td><td>Obligatorio</td><td>Texto, mínimo 3 caracteres.</td></tr>
                  <tr><td>Nombre</td><td>Obligatorio</td><td>Máximo 100 caracteres.</td></tr>
                  <tr><td>Precio</td><td>Obligatorio</td><td>Mínimo 0 (0 = FREE), admite decimales.</td></tr>
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
                  <tr><td>Nombre</td><td>Obligatorio</td><td>Máximo 50 caracteres.</td></tr>
                  <tr><td>Correo</td><td>Obligatorio</td><td>@duoc.cl, @profesor.duoc.cl, @gmail.com.</td></tr>
                  <tr><td>Tipo Usuario</td><td>Obligatorio</td><td>Administrador, Vendedor, Cliente.</td></tr>
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
    </div>
  );
}
