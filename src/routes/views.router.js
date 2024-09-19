import express from "express";
import ProductManager from "../dao/db/product-manager-db.js";

const router = express.Router();
const productManager = new ProductManager();

router.get("/", (req, res) => {
    res.render("home");
});

router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 5, sort = 'asc', query = '' } = req.query;
        const validSort = ['asc', 'desc'].includes(sort) ? sort : 'asc';

        const productos = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit),
            query,
            sort: validSort,
        });

        const nuevoArray = productos.docs.map((producto) => {
            const rest = producto.toObject();
            return rest;
        });

        res.render("products", {
            productos: nuevoArray,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            currentPage: productos.page,
            totalPages: productos.totalPages,
        });
    } catch (error) {
        console.error("Error getting products:", error);
        res.status(500).json({
            status: "error",
            error: "Internal Server Error",
        });
    }
});

router.get("/products/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);

        if (!product) {
            res.status(404).json({
                status: "error",
                error: "Product not found",
            });
            return;
        }

        res.render("productsDetails", { product });
    } catch (error) {
        console.error("Error getting product:", error);
        res.status(500).json({
            status: "error",
            error: "Internal Server Error",
        });
    }
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        const { sort = 'asc', query = '' } = req.query;
        const validSort = ['asc', 'desc'].includes(sort) ? sort : 'asc';

        const products = await productManager.getProducts(query);

        const sortedProducts = products.sort((a, b) => {
            return validSort === 'asc' ? a.price - b.price : b.price - a.price;
        });

        res.render('realtimeproducts', { products: sortedProducts });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.get("/products/add", (req, res) => {
    res.render("addProduct");
});

export default router;
