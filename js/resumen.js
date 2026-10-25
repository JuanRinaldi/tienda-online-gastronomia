
document.addEventListener("DOMContentLoaded", () => {

    // ======================================
    // CARRITO DEL RESUMEN
    // ======================================

    // Recuperamos el carrito guardado desde menu.html
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Elementos de nuestra página
    const listaResumen = document.getElementById("lista-resumen");
    const totalResumen = document.getElementById("total-resumen");
    const botonContinuar = document.getElementById("continuar-pago");

    // ======================================
    // GUARDAR CARRITO
    // ======================================

    function guardarCarrito() {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    // ======================================
    // IDENTIFICAR PRODUCTOS
    // ======================================

    // Usamos ID, nombre y precio para diferenciar
    // combos que tienen distintas personalizaciones.

    function obtenerClave(producto) {

        return JSON.stringify([
            producto.id,
            producto.nombre,
            producto.precio
        ]);

    }

    // ======================================
    // ACTUALIZAR RESUMEN
    // ======================================

    function actualizarResumen() {

        // Limpiamos la lista
        listaResumen.innerHTML = "";

        // Agrupamos únicamente productos idénticos
        const productosAgrupados = {};

        carrito.forEach(producto => {

            const clave = obtenerClave(producto);

            if (!productosAgrupados[clave]) {

                productosAgrupados[clave] = {
                    ...producto,
                    clave,
                    cantidad: 0
                };

            }

            productosAgrupados[clave].cantidad++;

        });

        // ======================================
        // MOSTRAR PRODUCTOS
        // ======================================

        Object.values(productosAgrupados).forEach(producto => {

            const item = document.createElement("div");

            item.className = "item-resumen";

            item.innerHTML = `
                <h5>${producto.nombre}</h5>

                <p>
                    Precio unitario:
                    $${producto.precio.toLocaleString("es-AR")}
                </p>

                <p>
                    Subtotal:
                    $${(producto.precio * producto.cantidad).toLocaleString("es-AR")}
                </p>

                <div class="d-flex justify-content-center align-items-center gap-3 flex-wrap">

                    <button
                        class="btn btn-danger btn-sm restar"
                        data-clave="${encodeURIComponent(producto.clave)}">
                        −
                    </button>

                    <span>${producto.cantidad}</span>

                    <button
                        class="btn btn-success btn-sm sumar"
                        data-clave="${encodeURIComponent(producto.clave)}">
                        +
                    </button>

                    <button
                        class="btn btn-outline-danger btn-sm eliminar"
                        data-clave="${encodeURIComponent(producto.clave)}">
                        🗑️ Eliminar
                    </button>

                </div>
            `;

            listaResumen.appendChild(item);

        });

        // ======================================
        // CALCULAR TOTAL
        // ======================================

        const total = carrito.reduce((acumulador, producto) => {

            return acumulador + producto.precio;

        }, 0);

        totalResumen.textContent =
            "$" + total.toLocaleString("es-AR");

        // ======================================
        // CONTROLAR CARRITO VACÍO
        // ======================================

        botonContinuar.disabled = carrito.length === 0;

        if (carrito.length === 0) {

            listaResumen.innerHTML =
                "<p class='text-center'>Tu carrito está vacío 🍔</p>";

        }

    }

    // ======================================
    // BOTONES DEL RESUMEN
    // ======================================

    listaResumen.addEventListener("click", (evento) => {

        const boton = evento.target.closest("button");

        if (!boton) return;

        const clave = decodeURIComponent(boton.dataset.clave);

        // ======================================
        // SUMAR UNA UNIDAD
        // ======================================

        if (boton.classList.contains("sumar")) {

            const producto = carrito.find(
                item => obtenerClave(item) === clave
            );

            if (producto) {

                carrito.push({ ...producto });

            }

        }

        // ======================================
        // RESTAR UNA UNIDAD
        // ======================================

        if (boton.classList.contains("restar")) {

            const indice = carrito.findIndex(
                item => obtenerClave(item) === clave
            );

            if (indice !== -1) {

                carrito.splice(indice, 1);

            }

        }

        // ======================================
        // ELIMINAR PRODUCTO
        // ======================================

        if (boton.classList.contains("eliminar")) {

            carrito = carrito.filter(
                item => obtenerClave(item) !== clave
            );

        }

        // Guardamos y actualizamos
        guardarCarrito();
        actualizarResumen();

    });

    // ======================================
    // CONTINUAR A PAGOS
    // ======================================

    botonContinuar.addEventListener("click", () => {

        if (carrito.length > 0) {

            window.location.href = "pagos.html";

        }

    });

    // ======================================
    // INICIAR RESUMEN
    // ======================================

    actualizarResumen();

});
