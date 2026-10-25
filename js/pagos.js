
document.addEventListener("DOMContentLoaded", () => {

    // ======================================
    // DATOS DEL CARRITO
    // ======================================

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // ======================================
    // ELEMENTOS DEL HTML
    // ======================================

    const totalPagos = document.getElementById("total-pagos");
    const botonContinuar = document.getElementById("continuar-envio");

    const opcionesPago = document.querySelectorAll(
        'input[name="metodo-pago"]'
    );

    // ======================================
    // CALCULAR TOTAL
    // ======================================

    const total = carrito.reduce((acumulador, producto) => {

        return acumulador + producto.precio;

    }, 0);

    totalPagos.textContent =
        "$" + total.toLocaleString("es-AR");

    // ======================================
    // RECUPERAR MEDIO DE PAGO
    // ======================================

    const pagoGuardado = localStorage.getItem("metodoPago");

    let pagoValido = false;

    opcionesPago.forEach(opcion => {

        if (opcion.value === pagoGuardado) {

            opcion.checked = true;
            pagoValido = true;

        }

    });

    // Eliminamos una selección antigua que ya no exista
    if (pagoGuardado && !pagoValido) {

        localStorage.removeItem("metodoPago");

    }

    // ======================================
    // GUARDAR MEDIO DE PAGO
    // ======================================

    opcionesPago.forEach(opcion => {

        opcion.addEventListener("change", () => {

            localStorage.setItem("metodoPago", opcion.value);

        });

    });

    // ======================================
    // CONTROLAR CARRITO VACÍO
    // ======================================

    if (carrito.length === 0) {

        botonContinuar.disabled = true;

    }

    // ======================================
    // CONTINUAR A ENVÍO
    // ======================================

    botonContinuar.addEventListener("click", () => {

        // Verificamos que haya productos
        if (carrito.length === 0) {

            alert("Tu carrito está vacío. Agregá una hamburguesa 🍔");

            window.location.href = "menu.html";

            return;

        }

        // Verificamos que haya seleccionado un medio de pago
        const pagoSeleccionado = document.querySelector(
            'input[name="metodo-pago"]:checked'
        );

        if (!pagoSeleccionado) {

            alert("Seleccioná un medio de pago para continuar 💳");

            return;

        }

        // Guardamos la selección
        localStorage.setItem(
            "metodoPago",
            pagoSeleccionado.value
        );

        // Pasamos a la siguiente pantalla
        window.location.href = "envio.html";

    });

});

