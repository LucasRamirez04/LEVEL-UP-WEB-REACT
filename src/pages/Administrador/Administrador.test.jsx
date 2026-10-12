import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, redirect } from "react-router-dom";
import { expect, test } from "vitest";
import Administrador from "./Administrador";
import { productosIniciales } from "../../data/productos";

test("Probar que el formulario vacío no debe agregar productos al storage" , () => {
    //limpiar localStorage
    localStorage.clear();

    render(
        <MemoryRouter>
            <Administrador />
        </MemoryRouter>
    )

    // 1. Hacer click en guardar sin registrar ningún campo
    const botonesGuardar = screen.getAllByRole("button", {name : /guardar/i});
    fireEvent.click(botonesGuardar[0]);

    //2. verificar que no aumento el tamaño de la lista en el localStorage
    const productosGuardados = JSON.parse(localStorage.getItem("productos"));
    expect(productosGuardados.length).toBe(productosIniciales.length)
});