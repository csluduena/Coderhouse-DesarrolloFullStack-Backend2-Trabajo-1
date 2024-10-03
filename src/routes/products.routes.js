// src/routes/products.routes.js
import { Router } from "express";
import ProductManager from '../dao/db/productManagerDb.js';
const manager = new ProductManager();
const router = Router();

router.get('/', async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 15;
        const querySort = req.query.sort || "defa";
        let sort = {};

        switch (querySort) {
            case "price_asc":
                sort = { price: 1 };
                break;
            case "price_desc":
                sort = { price: -1 };
                break;
            case "alpha_asc":
                sort = { title: 1 };
                break;
            case "alpha_desc":
                sort = { title: -1 };
                break;
            case "defa":
                sort = { createdAt: 1 };
                break;
            default:
                break;
        }

        const result = await manager.getProducts(page, limit, sort);

        res.status(200).json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&sort=${querySort}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&sort=${querySort}` : null
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});

router.get("/:pid", async (req, res) => {
    let id = req.params.pid;
    try {
        const product = await manager.getProductById(id);
        if (!product) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        res.status(200).json({ status: "success", product });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});

router.post("/", async (req, res) => {
    const newProduct = req.body;
    try {
        await manager.addProduct(newProduct);
        res.status(201).send({ message: "Producto agregado exitosamente", newProduct });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

//Ruta para agregar stock a un producto
router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const { stock } = req.body;
    try {
        const updatedProduct = await manager.updateProduct(pid, { stock });
        if (!updatedProduct) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        res.json({ status: "success", message: "Stock actualizado exitosamente", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const deletedProd = await manager.deleteProduct(id);
        !deletedProd ? res.status(404).send({ message: "Error al eliminar el producto", error: "Producto no encontrado" }) : res.status(200).send(`Se ha eliminado ${deletedProd.title} correctamente`);
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

export default router;