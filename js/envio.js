
document.addEventListener("DOMContentLoaded", () => {

    // ======================================
    // DATOS DEL PEDIDO
    // ======================================

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const metodoPago = localStorage.getItem("metodoPago");

    // ======================================
    // ELEMENTOS DEL FORMULARIO
    // ======================================

    const opcionesEntrega = document.querySelectorAll(
        'input[name="tipo-entrega"]'
    );

    const campoDireccion = document.getElementById("campo-direccion");
    const nombre = document.getElementById("nombre");
    const telefono = document.getElementById("telefono");
    const direccion = document.getElementById("direccion");
    const observaciones = document.getElementById("observaciones");
    const botonConfirmar = document.getElementById("confirmar-pedido");
    const botonNuevoPedido = document.getElementById("nuevo-pedido");

    // ======================================
    // MOSTRAR U OCULTAR DIRECCIÓN
    // ======================================

    opcionesEntrega.forEach(opcion => {

        opcion.addEventListener("change", () => {

            if (opcion.value === "Envío a domicilio") {

                campoDireccion.classList.remove("d-none");

            } else {

                campoDireccion.classList.add("d-none");

                // Limpiamos la dirección si elige retiro
                direccion.value = "";

            }

        });

    });

    // ======================================
    // IDENTIFICAR PRODUCTOS
    // ======================================

    // Diferenciamos los combos por ID, nombre
    // y precio para respetar cada personalización.

    function obtenerClave(producto) {

        return JSON.stringify([
            producto.id,
            producto.nombre,
            producto.precio
        ]);

    }

    // ======================================
    // CONFIRMAR PEDIDO
    // ======================================

    botonConfirmar.addEventListener("click", () => {

        const entregaSeleccionada = document.querySelector(
            'input[name="tipo-entrega"]:checked'
        );

        // ======================================
        // VALIDACIONES
        // ======================================

        // Carrito vacío
        if (carrito.length === 0) {

            alert("Tu carrito está vacío 🍔");

            window.location.href = "menu.html";

            return;
        }

        // Medio de pago
        if (!metodoPago) {

            alert("Seleccioná un medio de pago");

            window.location.href = "pagos.html";

            return;
        }

        // Forma de entrega
        if (!entregaSeleccionada) {

            alert("Seleccioná una forma de entrega");

            return;
        }

        // Nombre
        if (!nombre.value.trim()) {

            alert("Ingresá tu nombre");

            nombre.focus();

            return;
        }

        // Teléfono
        if (!telefono.value.trim()) {

            alert("Ingresá tu teléfono");

            telefono.focus();

            return;
        }

        // Dirección para delivery
        if (
            entregaSeleccionada.value === "Envío a domicilio" &&
            !direccion.value.trim()
        ) {

            alert("Ingresá la dirección de entrega");

            direccion.focus();

            return;
        }

        // ======================================
        // AGRUPAR PRODUCTOS IDÉNTICOS
        // ======================================

        const productosAgrupados = {};

        carrito.forEach(producto => {

            const clave = obtenerClave(producto);

            if (!productosAgrupados[clave]) {

                productosAgrupados[clave] = {
                    ...producto,
                    cantidad: 0
                };

            }

            productosAgrupados[clave].cantidad++;

        });

        // ======================================
        // CALCULAR TOTAL
        // ======================================

        const total = carrito.reduce((suma, producto) => {

            return suma + producto.precio;

        }, 0);

        const descuento = metodoPago === "Efectivo"
    ? Math.round(total * 10) / 100
    : 0;

        const totalFinal =
            Math.round((total - descuento) * 100) / 100;

        // ======================================
        // CONSTRUIR MENSAJE DE WHATSAPP
        // ======================================

        let mensaje = "🍔 *NUEVO PEDIDO - HELIX BURGER*\n\n";

        mensaje += "━━━━━━━━━━━━━━━━━━\n";
        mensaje += "🛒 *PRODUCTOS*\n";
        mensaje += "━━━━━━━━━━━━━━━━━━\n\n";

        Object.values(productosAgrupados).forEach(producto => {

            const subtotal = producto.precio * producto.cantidad;

            mensaje += `• *${producto.nombre}*\n`;

            mensaje += `  Cantidad: ${producto.cantidad}\n`;

            mensaje += `  Precio unitario: $${producto.precio.toLocaleString("es-AR")}\n`;

            mensaje += `  Subtotal: $${subtotal.toLocaleString("es-AR")}\n\n`;

        });

        mensaje += "━━━━━━━━━━━━━━━━━━\n";

        if (metodoPago === "Efectivo") {

    mensaje += `Subtotal: $${total.toLocaleString("es-AR")}\n`;

    mensaje += `Descuento en efectivo (10%): -$${descuento.toLocaleString("es-AR")}\n`;

}

    mensaje += `💰 *TOTAL: $${totalFinal.toLocaleString("es-AR")}*\n`;

        mensaje += "━━━━━━━━━━━━━━━━━━\n\n";

        // ======================================
        // MEDIO DE PAGO
        // ======================================

        mensaje += `💳 *FORMA DE PAGO:* ${metodoPago}\n\n`;

        // ======================================
        // FORMA DE ENTREGA
        // ======================================

        mensaje += `🛵 *ENTREGA:* ${entregaSeleccionada.value}\n`;

        if (entregaSeleccionada.value === "Envío a domicilio") {

            mensaje += `📍 *DIRECCIÓN:* ${direccion.value.trim()}\n`;

        }

        // ======================================
        // DATOS DEL CLIENTE
        // ======================================

        mensaje += "\n👤 *DATOS DEL CLIENTE*\n\n";

        mensaje += `*Nombre:* ${nombre.value.trim()}\n`;

        mensaje += `*Teléfono:* ${telefono.value.trim()}\n`;

        // ======================================
        // OBSERVACIONES
        // ======================================

        if (observaciones.value.trim()) {

            mensaje += `\n📝 *OBSERVACIONES:*\n`;

            mensaje += `${observaciones.value.trim()}\n`;

        }

        mensaje += "\n¡Muchas gracias por tu pedido! 🍔";

        // ======================================
        // ENVIAR PEDIDO POR WHATSAPP
        // ======================================

        // IMPORTANTE:
        // Reemplazar por el número real del comercio
        // antes de publicar la web.

        const numeroWhatsApp = "5491168503388";

        const url =
            `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

        // Abrimos WhatsApp con el mensaje preparado
        window.location.href = url;

    });


    // ======================================
    // INICIAR NUEVO PEDIDO
    // ======================================

    botonNuevoPedido.addEventListener("click", () => {

        const confirmar = confirm(
            "¿Querés iniciar un nuevo pedido? Se borrará el carrito actual."
        );

        if (!confirmar) {
            return;
        }

        // Eliminamos los datos del pedido anterior
        localStorage.removeItem("carrito");
        localStorage.removeItem("metodoPago");

        // Regresamos al menú
        window.location.href = "menu.html";

    });


});
