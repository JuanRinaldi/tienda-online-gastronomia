
document.addEventListener("DOMContentLoaded", () => {

    // ======================================
    // CARRITO DE COMPRAS
    // ======================================

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const botones = document.querySelectorAll(".agregar-carrito");
    const cantidadCarrito = document.getElementById("cantidad-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const listaCarrito = document.getElementById("lista-carrito");
    const miniCarrito = document.getElementById("mini-carrito");
    const miniCantidad = document.getElementById("mini-cantidad");
    const miniTotal = document.getElementById("mini-total");

    function guardarCarrito() {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    function actualizarCarrito() {

        const cantidad = carrito.length;

        const total = carrito.reduce((acumulador, item) => {
            return acumulador + item.precio;
        }, 0);

        cantidadCarrito.textContent = cantidad;
        totalCarrito.textContent = "$" + total.toLocaleString("es-AR");
        // Actualizar mini carrito flotante
        miniCantidad.textContent =
            cantidad + (cantidad === 1 ? " producto" : " productos");

        miniTotal.textContent =
            "$" + total.toLocaleString("es-AR");

        if (cantidad > 0) {
            miniCarrito.classList.remove("d-none");
        } else {
            miniCarrito.classList.add("d-none");
        }

        listaCarrito.innerHTML = "";

    const productosAgrupados = {};

    carrito.forEach(producto => {

        const clave = JSON.stringify([
            producto.id,
            producto.nombre,
            producto.precio
        ]);

        if (!productosAgrupados[clave]) {
            productosAgrupados[clave] = {
                ...producto,
                clave,
                cantidad: 0
            };
        }

        productosAgrupados[clave].cantidad++;
    });

        Object.values(productosAgrupados).forEach(producto => {

            const item = document.createElement("div");
            item.className = "item-carrito";

            item.innerHTML = `
                <p class="nombre-producto">${producto.nombre}</p>

                <p>
                    ${producto.cantidad} x
                    $${producto.precio.toLocaleString("es-AR")}
                </p>

                <button class="btn btn-sm btn-danger restar"
                        data-clave="${encodeURIComponent(producto.clave)}"">
                    −
                </button>

                <span>${producto.cantidad}</span>

                <button class="btn btn-sm btn-success sumar"
                        data-clave="${encodeURIComponent(producto.clave)}"">
                    +
                </button>

                <button class="btn btn-sm btn-outline-danger eliminar"
                        data-clave="${encodeURIComponent(producto.clave)}"">
                    🗑️
                </button>
            `;

            listaCarrito.appendChild(item);
        });
    }

    // Agregar productos normales al carrito
    botones.forEach(boton => {

        boton.addEventListener("click", () => {

            const producto = {
                id: Number(boton.dataset.id),
                nombre: boton.dataset.nombre,
                precio: Number(boton.dataset.precio)
            };

            carrito.push(producto);

            guardarCarrito();
            actualizarCarrito();
        });
    });

    listaCarrito.addEventListener("click", (evento) => {

    const boton = evento.target.closest("button");
    if (!boton) return;

    const clave = decodeURIComponent(boton.dataset.clave);

    const obtenerClave = (item) => JSON.stringify([
        item.id,
        item.nombre,
        item.precio
    ]);

    if (boton.classList.contains("sumar")) {

        const producto = carrito.find(
            item => obtenerClave(item) === clave
        );

        if (producto) {
            carrito.push({ ...producto });
        }
    }

    if (boton.classList.contains("restar")) {

        const indice = carrito.findIndex(
            item => obtenerClave(item) === clave
        );

        if (indice !== -1) {
            carrito.splice(indice, 1);
        }
    }

    if (boton.classList.contains("eliminar")) {

        carrito = carrito.filter(
            item => obtenerClave(item) !== clave
        );
    }

    guardarCarrito();
    actualizarCarrito();

});

    actualizarCarrito();

    // Continuar al resumen
    const botonVerPedido = document.getElementById("ver-pedido");

    botonVerPedido.addEventListener("click", () => {

        if (carrito.length === 0) {
            alert("Primero agregá un producto al pedido 🍔");
            return;
        }

        window.location.href = "resumen.html";
    });


    // ======================================
    // BUSCADOR Y FILTROS DEL MENÚ
    // ======================================

    const buscador = document.getElementById("buscar-producto");
    const botonesFiltro = document.querySelectorAll(".filtro-btn");
    const productosMenu = document.querySelectorAll(".producto");

    let categoriaActual = "todos";

    function filtrarProductos() {

        const textoBuscado = buscador.value.toLowerCase().trim();

        productosMenu.forEach(producto => {

            const categoria = producto.dataset.categoria;

            const nombre = producto.querySelector(".card-title")
                .textContent.toLowerCase();

            const descripcion = producto.querySelector(".card-text")
                .textContent.toLowerCase();

            const coincideCategoria =
                categoriaActual === "todos" ||
                categoria === categoriaActual;

            const coincideBusqueda =
                nombre.includes(textoBuscado) ||
                descripcion.includes(textoBuscado);

            if (coincideCategoria && coincideBusqueda) {
                producto.classList.remove("d-none");
            } else {
                producto.classList.add("d-none");
            }
        });
    }

    buscador.addEventListener("input", filtrarProductos);

    botonesFiltro.forEach(boton => {

        boton.addEventListener("click", () => {

            categoriaActual = boton.dataset.categoria;

            botonesFiltro.forEach(btn => {
                btn.classList.remove("btn-danger", "active");
                btn.classList.add("btn-outline-danger");
            });

            boton.classList.remove("btn-outline-danger");
            boton.classList.add("btn-danger", "active");

            filtrarProductos();
        });
    });


    // ======================================
    // PERSONALIZACIÓN DE COMBOS
    // ======================================

    const modalCombo = document.getElementById("modalCombo");
    const comboPapas = document.getElementById("combo-papas");
    const comboBebida = document.getElementById("combo-bebida");
    const comboTotal = document.getElementById("combo-total");

    let precioBaseCombo = 0;

    // Detectamos qué combo abrió el cliente
    modalCombo.addEventListener("show.bs.modal", (evento) => {

        const boton = evento.relatedTarget;

        precioBaseCombo = Number(boton.dataset.precio);

        // Reiniciamos las selecciones
        comboPapas.selectedIndex = 0;
        comboBebida.selectedIndex = 0;

        actualizarPrecioCombo();
    });

    // Calculamos el precio total
    function actualizarPrecioCombo() {

        const adicionalPapas = Number(comboPapas.value);

        const total = precioBaseCombo + adicionalPapas;

        comboTotal.textContent =
            "$" + total.toLocaleString("es-AR");
    }

    // Actualizamos el precio al cambiar las papas
    comboPapas.addEventListener("change", actualizarPrecioCombo);


    // ======================================
    // AGREGAR COMBO PERSONALIZADO AL CARRITO
    // ======================================

    const botonConfirmarCombo = document.getElementById("confirmar-combo");

    let idComboSeleccionado = 0;
    let nombreComboSeleccionado = "";

    // Guardamos los datos del combo cuando se abre el modal
    modalCombo.addEventListener("show.bs.modal", (evento) => {

        const boton = evento.relatedTarget;

        idComboSeleccionado = Number(boton.dataset.id);
        nombreComboSeleccionado = boton.dataset.nombre;
    });

    // Agregamos el combo al pedido
    botonConfirmarCombo.addEventListener("click", () => {

        const opcionPapas = comboPapas.selectedOptions[0];
        const papas = opcionPapas.dataset.nombre;
        const bebida = comboBebida.value;

        const precioFinal =
            precioBaseCombo + Number(comboPapas.value);

        const producto = {
            id: idComboSeleccionado,
            nombre: `${nombreComboSeleccionado} (${papas} + ${bebida})`,
            precio: precioFinal
        };

        carrito.push(producto);

        guardarCarrito();
        actualizarCarrito();

        // Cerramos el modal
        const instanciaModal = bootstrap.Modal.getInstance(modalCombo);
        instanciaModal.hide();

    });

});
