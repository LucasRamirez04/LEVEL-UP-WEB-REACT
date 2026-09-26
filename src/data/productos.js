export const productosIniciales = [
  {
    codigo: "JM001",
    categoria: "Juegos de Mesa",
    nombre: "Catan",
    precio: 29000,
    stock: 3,
    enOferta: true,
    descuento: 30,
    imagen: "/img/catan.jpg",
  },
  {
    codigo: "JM002",
    categoria: "Juegos de Mesa",
    nombre: "Carcassonne",
    precio: 24990,
    stock: 2,
    enOferta: false,
    descuento: 0,
    imagen: "/img/carcassonne.jpg",
  },
  {
    codigo: "AC001",
    categoria: "Accesorios",
    nombre: "Controlador Inalámbrico Xbox Series X",
    precio: 59990,
    stock: 2,
    enOferta: true,
    descuento: 15,
    imagen: "/img/control-xbox.webp",
  },
  {
    codigo: "AC002",
    categoria: "Accesorios",
    nombre: "Auriculares Gamer HyperX Cloud II",
    precio: 79990,
    stock: 2,
    enOferta: false,
    descuento: 20,
    imagen: "/img/audifonos-hyperx.jpg",
  },
  {
    codigo: "CO001",
    categoria: "Consolas/Computadores",
    nombre: "PlayStation5",
    precio: 549990,
    stock: 4,
    enOferta: false,
    descuento: 0,
    imagen: "/img/play5.jpg",
  },
  {
    codigo: "CO002",
    categoria: "Consolas/Computadores",
    nombre: "PC Gamer ASUS ROG Strix",
    precio: 1299990,
    stock: 2,
    enOferta: true,
    descuento: 15,
    imagen: "/img/asus-rog.png",
  },
  {
    codigo: "PE001",
    categoria: "Perifericos",
    nombre: "Silla Gamer Secretlab Titan",
    precio: 349990,
    stock: 5,
    enOferta: false,
    descuento: 0,
    imagen: "/img/sillagamer3.jpg",
  },
  {
    codigo: "PE002",
    categoria: "Perifericos",
    nombre: "Mouse Gamer Logitech G502 HERO",
    precio: 49990,
    stock: 5,
    enOferta: true,
    descuento: 5,
    imagen: "/img/g502.webp",
  },
  {
    codigo: "PE003",
    categoria: "Perifericos",
    nombre: "Mousepad Razer Goliathus Extended Chroma",
    precio: 29990,
    stock: 10,
    enOferta: false,
    descuento: 0,
    imagen: "/img/mousepad.webp",
  },
  {
    codigo: "VE001",
    categoria: "Vestuario",
    nombre: "Polera Gamer Personalizada 'Level-Up'",
    precio: 14990,
    stock: 30,
    enOferta: false,
    descuento: 0,
    imagen: "/img/polera.jpg",
  },
];

export const usuarioAdminInicial = [
  {
    run: "19011022K",
    nombre: "Lucas",
    apellidos: "Administrador",
    correo: "admin@duoc.cl",
    rol: "Administrador",
    clave: "1234",
    direccion: "campeonodromo35",
  },
];

export function formatearPrecio(valor) {
  return "$" + Number(valor).toLocaleString("es-CL");
}

export function calcularPrecioFinal(producto) {
  return Math.round(producto.precio * (1 - producto.descuento / 100));
}
