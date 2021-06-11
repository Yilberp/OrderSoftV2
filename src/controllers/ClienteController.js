const { Cliente } = require("../repository/database/index").models;
const CarritoController = require("../controllers/CarritoController");
const CarritoProductoController = require("../controllers/CarritoProductoController");
const CategoriaController = require("../controllers/CategoriaController");
const FacturaController = require("../controllers/FacturaController");
const FacturaProductoController = require("../controllers/FacturaProductoController");
const IngredienteController = require("../controllers/IngredienteController");
const IngredienteProductoController = require("../controllers/IngredienteProductoController");
const IngredienteProductoExtraController = require("../controllers/IngredienteProductoExtraController");
const UsuarioController = require("../controllers/UsuarioController");
const nodeMailerFactura = require("../services/nodemailer-factura");
const stripe = require("stripe")(
    "sk_test_51IxwSbGF75uqNRTw4UQEKl9Km3nOqjUFyuqzJ5SBlIKvsXlxLBapVA02KhufrINF29GBibSnprw9SFKIGtpa8vaC00v8laQr6x"
);

module.exports = {
    create: async (req) => {
        const {
            apellidos,
            contrasena,
            direccion,
            documento,
            email,
            nombres,
            avatar = "http://static.elcorreo.com/RC/201501/12/media/cortadas/avatar--575x323.jpg",
            telefono,
        } = req.body;
        const userDB = await UsuarioController.create({
            contrasena,
            email,
            id_rol: process.env.ROL_CLIENTE,
        });
        if (userDB) {
            const clienteDB = await Cliente.create({
                apellidos,
                direccion,
                documento,
                id: userDB.id,
                nombres,
                telefono,
                avatar,
            });
            const carritoDB = clienteDB
                ? await CarritoController.create(clienteDB.id)
                : null;
            return carritoDB ? userDB : null;
        }
        return null;
    },
    deleteCarrito: async (req, res) => {
        const idUser = req.user.id;
        const { id, id_factura, cantidad, precio } = req.body;
        const adicionales = await FacturaController.getIngredientesIds(id);
        const precios = await IngredienteController.getTotalAdicionales(
            adicionales
        );
        const totalAdicionales = precios.reduce((a, b) => a + b, 0);
        let valor_total = await CarritoController.getTotal(idUser);
        valor_total -= Number(precio) * Number(cantidad);
        valor_total -= totalAdicionales * Number(cantidad);
        if (valor_total < 0) valor_total = 0;
        const carritoProducto = await FacturaProductoController.delete(id);
        if (carritoProducto) {
            await FacturaController.delete(id_factura);
            await CarritoController.update(idUser, valor_total);
            req.flash("success", `Se ha retirado el producto del carrito`);
        } else {
            req.flash(
                "error",
                `EL producto que ha intentado retirar no existe!`
            );
        }
        return res.redirect("/cliente/carrito");
    },
    cambioContrasena: (req, res) => {
        console.log(req.body);
        req.flash("success", `Contraseña actualizada correctamente`);
        return res.redirect("/cliente/perfil");
    },
    compra: async (req, res) => {
        try {
            console.log(req.body);
            const idsProductosFactura = req.body.idProductoFactura.split(",");
            let id_productos = req.body.id_productos;
            let stocks = req.body.stocks;
            let comprasBoolean = [];
            let auxStock = 0;
            let temStock = 0;
            if (typeof id_productos === "string") id_productos = [id_productos];
            if (typeof stocks === "string") stocks = [stocks];
            for (let i = 0; i < id_productos.length; i++) {
                const id_ingredientes =
                    await IngredienteProductoController.getCheck(
                        Number(id_productos[i])
                    );
                const stock_ingredientes =
                    await IngredienteController.getIngredientesStock(
                        id_ingredientes
                    );
                const esDisponibleIngrediente = stock_ingredientes
                    .map(
                        (stock) =>
                            Number(stock) - auxStock - Number(stocks[i]) >= 0
                    )
                    .every((value) => value);
                auxStock += Number(stocks[i]);

                const stock_adicionales =
                    await IngredienteController.getStockIngrediente(
                        Number(idsProductosFactura[i])
                    );
                const esDisponibleAdicional = stock_adicionales
                    .map(
                        (stock) =>
                            Number(stock) - temStock - Number(stocks[i]) >= 0
                    )
                    .every((value) => value);
                temStock += Number(stocks[i]);
                const esAgregable =
                    esDisponibleIngrediente && esDisponibleAdicional;
                comprasBoolean.push(esAgregable);
            }
            const esComprable = comprasBoolean.every((value) => value);
            if (esComprable) {
                const total = Number(req.body.total) * 100;
                let id_facturas = req.body.id_facturas;
                let productos = req.body.productos;
                let cantidades = req.body.cantidades;
                let adicionales = req.body.adicionales;
                let precios = req.body.precios;
                let id_factura;
                const envio = Number(process.env.COSTO_ENVIO);
                if (typeof productos === "string") productos = [productos];
                if (typeof id_facturas === "string")
                    id_facturas = [id_facturas];
                if (typeof cantidades === "string") cantidades = [cantidades];
                if (typeof precios === "string") precios = [precios];
                if (typeof precios === "string") precios = [precios];
                if (typeof adicionales === "string")
                    adicionales = [adicionales];
                let tablaHash = {};
                adicionales.map((i) => {
                    const aux = i.split(",");
                    if (tablaHash[aux[0]]) {
                        tablaHash[aux[0]].push(aux[1]);
                    } else {
                        tablaHash[aux[0]] = [aux[1]];
                    }
                });
                adicionales = Object.values(tablaHash);
                let descFactura = "";
                let descHtml = "";
                if (idsProductosFactura.length === 1) {
                    const facturaProductoDB =
                        await FacturaProductoController.find(
                            Number(idsProductosFactura[0])
                        );
                    id_factura = facturaProductoDB.id_factura;
                    descFactura = "NUM FACTURA ID:" + id_factura + "\n";
                    descHtml = `<p style="font-size: 25px; margin-bottom: 20px; text-align: center;">NUM FACTURA ID:${id_factura}</p>`;
                } else {
                    const nuevaFactura = {
                        id_cliente: req.user.id,
                        estadoFactura: 1,
                        fecha: new Date(),
                        total: total,
                        direccion: req.user.cliente.direccion,
                    };
                    const facturaDB = await FacturaController.create(
                        nuevaFactura
                    );
                    id_factura = facturaDB.getDataValue("id");
                    descFactura = "NUM FACTURA ID:" + id_factura + "\n";
                    descHtml = `<p style="font-size: 25px; margin-bottom: 20px; text-align: center;">NUM FACTURA ID:${id_factura}</p>`;
                }
                descFactura += "DOCUMENTO:" + req.user.cliente.documento + "\n";
                descHtml += `<p style="font-size: 25px; margin-bottom: 20px; text-align: center;">DOCUMENTO:${req.user.cliente.documento}</p>`;
                descFactura +=
                    "NOMBRES:" + req.user.cliente.nombres.toUpperCase() + "\n";
                descHtml += `<p style="font-size: 25px; margin-bottom: 20px; text-align: center;">NOMBRES:${req.user.cliente.nombres.toUpperCase()}</p>`;
                descFactura +=
                    "APELLIDOS:" +
                    req.user.cliente.apellidos.toUpperCase() +
                    "\n\n";
                descHtml += `<p style="font-size: 25px; margin-bottom: 20px; text-align: center;">APELLIDOS:${req.user.cliente.apellidos.toUpperCase()}</p>`;
                for (let i = 0; i < productos.length; i++) {
                    descFactura += cantidades[i] + "\n";
                    descHtml += `<p style="color: #626262">${cantidades[i]}</p>`;
                    descFactura += productos[i] + "\n";
                    descHtml += `<p style="color: #626262">${productos[i]}</p>`;
                    for (let j = 0; j < adicionales[i].length; j++) {
                        descFactura += adicionales[i][j] + "\n";
                        descHtml += `<p style="color: #626262">${adicionales[i][j]}</p>`;
                    }
                    descFactura += "SUBTOTAL PRODUCTO:" + precios[i] + "\n\n";
                    descHtml += `<p style="color: #626262">SUBTOTAL PRODUCTO:${precios[i]}</p>`;
                }
                descHtml += `<p style="color: #626262">ENVIO:$${envio}</p>`;
                const totalHtml = `<p style="font-size: 25px; margin-bottom: 20px; text-align: center;">$${Number(
                    req.body.total
                )}</p>`;
                const customer = await stripe.customers.create({
                    email: req.body.stripeEmail,
                    source: req.body.stripeToken,
                });
                const charge = await stripe.charges.create({
                    amount: total,
                    currency: "cop",
                    customer: customer.id,
                    description: descFactura,
                });
                for (let j = 0; j < idsProductosFactura.length; j++) {
                    const id_ingredientes =
                        await IngredienteProductoController.getCheck(
                            Number(id_productos[j])
                        );
                    const stock_ingredientes =
                        await IngredienteController.getIngredientesStock(
                            id_ingredientes
                        );
                    for (let i = 0; i < id_ingredientes.length; i++) {
                        const descontar =
                            Number(stock_ingredientes[i]) - Number(stocks[j]);
                        await IngredienteController.updateStock(
                            id_ingredientes[i],
                            descontar
                        );
                    }
                    const id_adicionales =
                        await FacturaController.getIngredientesIds(
                            Number(idsProductosFactura[j])
                        );
                    const stock_ingredientes_adicionales =
                        await IngredienteController.getIngredientesStock(
                            id_adicionales
                        );
                    for (let i = 0; i < id_adicionales.length; i++) {
                        const descontar =
                            Number(stock_ingredientes_adicionales[i]) -
                            Number(stocks[j]);
                        await IngredienteController.updateStock(
                            id_adicionales[i],
                            descontar
                        );
                    }
                }
                if (idsProductosFactura.length === 1) {
                    const valor_total = Number(req.body.total);
                    await FacturaController.updateEstadoCompra(
                        id_factura,
                        new Date(),
                        valor_total
                    );
                    let totalCarrito = await CarritoController.getTotal(
                        req.user.id
                    );
                    const diferencia = totalCarrito - valor_total;
                    totalCarrito = diferencia + envio;
                    await CarritoController.update(req.user.id, totalCarrito);
                } else {
                    const valor_total = Number(req.body.total);
                    for (let i = 0; i < idsProductosFactura.length; i++) {
                        await FacturaProductoController.updateFactura(
                            Number(idsProductosFactura[i]),
                            id_factura
                        );
                    }
                    for (let i = 0; i < id_facturas.length; i++) {
                        const eliminada = await FacturaController.delete(
                            Number(id_facturas[i])
                        );
                        if (eliminada)
                            console.log(
                                `Se elimino la factura con id: ${id_facturas[i]}`
                            );
                    }
                    let totalCarrito = await CarritoController.getTotal(
                        req.user.id
                    );
                    const diferencia = totalCarrito - valor_total;
                    totalCarrito = diferencia + envio;
                    await CarritoController.update(req.user.id, totalCarrito);
                }
                nodeMailerFactura(
                    req.body.stripeEmail,
                    descHtml,
                    totalHtml,
                    (err) => {
                        if (err) console.log(err);
                    }
                );
                nodeMailerFactura(
                    req.user.email,
                    descHtml,
                    totalHtml,
                    (err) => {
                        if (err) console.log(err);
                    }
                );
                //Finall show a succes view
                req.flash("success", `Se ha realizado la compra con exito`);
                return res.redirect("/cliente/carrito");
            } else {
                req.flash(
                    "error",
                    "No se encuentran la cantidad disponible de ingredientes que se requieren para su compra"
                );
                return res.redirect("/cliente/carrito");
            }
        } catch (error) {
            console.log(error);
            req.flash("error", `Error al realizar la compra!`);
            return res.redirect("/cliente/carrito");
        }
    },
    getById: async (id) => await Cliente.findByPk(id),
    guardarCarrito: async (req, res) => {
        const idUser = req.user.id;
        let { id_producto, cantidad, precio, adicionales } = req.body;
        const ids_factura_producto =
            await FacturaController.getFacturaProductoIds(idUser, id_producto);
        if (typeof adicionales === "undefined") adicionales = [];
        if (typeof adicionales === "string") adicionales = [adicionales];
        let existe = false;
        if (ids_factura_producto) {
            for (let i = 0; i < ids_factura_producto.length; i++) {
                const query = await FacturaController.getIngredientesIds(
                    ids_factura_producto[i]
                );
                existe = query.toString() === adicionales.toString();
                if (existe) i = ids_factura_producto.length;
            }
        }
        if (existe) {
            req.flash(
                "error",
                `Este producto ya se encuentra existente en el carrito`
            );
            return res.redirect("/producto/" + id_producto);
        }
        const id_ingredientes = await IngredienteProductoController.getCheck(
            id_producto
        );
        const stock_ingredientes =
            await IngredienteController.getIngredientesStock(id_ingredientes);
        const esAgregable = stock_ingredientes
            .map((stock) => Number(stock) - Number(cantidad) >= 0)
            .every((value) => value);
        stock_ingredientes.sort((a, b) => Number(a) - Number(b));
        if (esAgregable) {
            const nuevaFactura = {
                id_cliente: idUser,
                estadoFactura: 2,
                fecha: new Date(),
                total: 0,
                direccion: req.user.cliente.direccion,
            };
            const facturaDB = await FacturaController.create(nuevaFactura);
            if (facturaDB) {
                const id_factura = facturaDB.getDataValue("id");
                const nuevoFacturaProducto = {
                    id_factura,
                    id_producto,
                    cantidad,
                    precio,
                };
                const facturaProductoDB =
                    await FacturaProductoController.create(
                        nuevoFacturaProducto
                    );
                let valor_total = Number(precio) * Number(cantidad);
                if (adicionales) {
                    const precios =
                        await IngredienteController.getTotalAdicionales(
                            adicionales
                        );
                    const totalAdicionales = precios.reduce((a, b) => a + b, 0);
                    valor_total += totalAdicionales * Number(cantidad);
                    await IngredienteProductoExtraController.create(
                        facturaProductoDB.getDataValue("id"),
                        adicionales
                    );
                }
                await FacturaController.updateTotal(id_factura, valor_total);
                valor_total += await CarritoController.getTotal(idUser);
                await CarritoController.update(idUser, valor_total);
                req.flash(
                    "success",
                    `El producto se añadio correctamente al carrito`
                );
            } else {
                req.flash(
                    "error",
                    `Error al añadir el producto al carrito, inténtelo nuevamente`
                );
            }
        } else {
            req.flash(
                "error",
                `No puede añadir una cantidad superior a ${stock_ingredientes[0]}`
            );
        }
        return res.redirect("/producto/" + id_producto);
    },
    loadDataCliente: async function (id) {
        const userDB = await UsuarioController.getById(id);
        await this.getById(userDB.id).then(
            (data) => (userDB.dataValues.cliente = data.dataValues)
        );
        return userDB;
    },
    perfil: async (req, res) => {
        const id = req.user.id;
        const cliente = req.body;
        if (req.file !== undefined) {
            const imagen = req.file.originalname;
            cliente.avatar = imagen;
        }
        const clienteDB = await Cliente.findByPk(id);
        if (clienteDB) {
            clienteDB.nombres = cliente.nombres;
            clienteDB.apellidos = cliente.apellidos;
            clienteDB.direccion = cliente.direccion;
            clienteDB.telefono = cliente.telefono;
            clienteDB.avatar = cliente.avatar;
            clienteDB.save();
        } else {
            req.flash("error", `Ha ocurrido un error al actualizar el perfil`);
        }
        req.flash("success", `Perfil actualizado correctamente`);
        return res.redirect("/cliente/perfil");
    },
    updateCarrito: async (req, res) => {
        const idUser = req.user.id;
        const { id, id_producto, cantidad, precio, opcion } = req.body;
        let nuevaCantidad;
        if (opcion) {
            nuevaCantidad = cantidad + 1;
        } else {
            if (!opcion && cantidad === 1) return res.json({ ok: true });
            nuevaCantidad = cantidad - 1;
        }
        const id_ingredientes = await IngredienteProductoController.getCheck(
            id_producto
        );
        const stock_ingredientes =
            await IngredienteController.getIngredientesStock(id_ingredientes);
        const esAgregable = stock_ingredientes
            .map((stock) => Number(stock) - Number(nuevaCantidad) >= 0)
            .every((value) => value);

        stock_ingredientes.sort((a, b) => Number(a) - Number(b));

        if (esAgregable) {
            const carritoProducto = await CarritoProductoController.update(
                id,
                nuevaCantidad
            );
            if (carritoProducto) {
                let valor_total = await CarritoController.getTotal(idUser);
                valor_total -= Number(precio) * Number(cantidad);
                valor_total += Number(precio) * Number(nuevaCantidad);
                await CarritoController.update(idUser, valor_total);
            }
        }
        return res.json({ ok: true });
    },
    viewCarrito: async (req, res) => {
        const categorias = await CategoriaController.getCategorias();
        const carrito = await FacturaController.getCarrito(req.user.id);
        const valor_total = await CarritoController.getTotal(req.user.id);
        res.render("cliente/carrito", {
            user: req.user,
            categorias,
            carrito,
            title: "Carrito | Ordersoft",
            valor_total,
        });
    },
    viewPerfil: async (req, res) => {
        const categorias = await CategoriaController.getCategorias();
        res.render("cliente/perfil", {
            user: req.user,
            categorias,
            title: "Perfil | Ordersoft",
        });
    },
    viewPrecompra: async (req, res) => {
        const id_cliente = req.user.id;
        const categorias = await CategoriaController.getCategorias();
        let id = req.params.id;
        if (id === "0") id = await FacturaController.getProductoIds(id_cliente);
        const productos =
            await FacturaProductoController.getProductosPreecompra(id);
        productos.map(async (producto) => {
            const adicionales =
                await IngredienteProductoExtraController.getAdicionalesPreecompra(
                    producto.getDataValue("id")
                );
            producto.setDataValue("adicionales", adicionales);
        });
        let total = 0;
        productos.map((producto) => {
            total += producto.getDataValue("factura").getDataValue("total");
        });
        const numProductos = productos.length;
        const envio = Number(process.env.COSTO_ENVIO);
        const pagoTotal = total + envio;
        res.render("cliente/precompra", {
            user: req.user,
            idProductoFactura: id,
            categorias,
            productos,
            numProductos,
            total,
            envio,
            pagoTotal,
            title: "Precompra | Ordersoft",
        });
    },
};
