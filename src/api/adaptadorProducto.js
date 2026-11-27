// Convierte un producto del backend (campos _producto) al formato que usa el front
export function adaptarProducto(p) {
    return {
        codigo: String(p.codigo_producto), // en la URL llega como texto
        nombre: p.nombre_producto,
        descripcion: p.descripcion_producto,
        categoria: p.categoria ? p.categoria.nombre_categoria : "",
        idCategoria: p.categoria ? p.categoria.id_categoria : null,
        precio: p.precio_producto,
        stock: p.stock_producto,
        descuento: p.porcentaje_producto,
        enOferta: p.porcentaje_producto > 0,
        imagen: p.imagen_producto,
    };
}