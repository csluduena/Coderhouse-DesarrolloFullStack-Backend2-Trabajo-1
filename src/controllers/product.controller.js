// src/controllers/product.controller.js
import ProductManager from '../dao/db/productManagerDb.js';

const productManager = new ProductManager();

export const getProducts = async (req, res) => {
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

    try {
        const { prodRender, productsList } = await productManager.getProducts(page, limit, sort);
        res.json({
            status: "success",
            payload: prodRender,
            totalPages: productsList.totalPages,
            prevPage: productsList.prevPage,
            nextPage: productsList.nextPage,
            page: productsList.page,
            hasPrevPage: productsList.hasPrevPage,
            hasNextPage: productsList.hasNextPage,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const getProductById = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productManager.getProductsById(pid);
        if (!product) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        res.json({ status: "success", product });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json({ status: "success", message: "Producto creado exitosamente", product: newProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const updatedProduct = await productManager.updateProduct(pid, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        res.json({ status: "success", message: "Producto actualizado exitosamente", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const deletedProduct = await productManager.deleteProduct(pid);
        if (!deletedProduct) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        res.json({ status: "success", message: "Producto eliminado exitosamente", product: deletedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};