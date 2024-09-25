// import express from 'express';
// import ProductManager from '../dao/db/product-manager-db.js';

// const router = express.Router(); // Crear una instancia del router
// const productManager = new ProductManager(); // Inicializar el ProductManager

// // Ruta para obtener todos los productos con paginación, ordenamiento y filtrado
// router.get('/', async (req, res) => {
//     try {
//         const { limit = 10, page = 1, sort = 'asc', query = '' } = req.query;

//         const products = await productManager.getProducts({
//             limit: parseInt(limit),
//             page: parseInt(page),
//             sort,
//             query,
//         });

//         // Enviar respuesta con información de productos
//         res.json({
//             status: 'success',
//             payload: products.docs,
//             totalPages: products.totalPages,
//             prevPage: products.prevPage,
//             nextPage: products.nextPage,
//             page: products.page,
//             hasPrevPage: products.hasPrevPage,
//             hasNextPage: products.hasNextPage,
//             prevLink: products.prevLink,
//             nextLink: products.nextLink,
//         });

//     } catch (error) {
//         console.error("Error getting products", error);
//         res.status(500).json({
//             status: 'error',
//             error: "Internal server error" // 500 Internal Server Error
//         });
//     }
// });

// // Ruta para obtener un producto específico por ID
// router.get('/:pid', async (req, res) => {
//     const id = req.params.pid;

//     try {
//         const product = await productManager.getProductById(id);
//         if (!product) {
//             return res.status(404).json({
//                 status: 'error',
//                 error: "Product not found" // 404 Not Found
//             });
//         }

//         res.json(product); // Enviar el producto encontrado
//     } catch (error) {
//         console.error("Error getting product", error);
//         res.status(500).json({
//             status: 'error',
//             error: "Internal server error" // 500 Internal Server Error
//         });
//     }
// });

// // Ruta para agregar un nuevo producto
// router.post('/', async (req, res) => {
//     const newProduct = req.body;

//     try {
//         await productManager.addProduct(newProduct);
//         res.status(201).json({
//             status: 'success',
//             message: "Product added successfully" // 201 Created
//         });
//     } catch (error) {
//         console.error("Error adding product", error);
//         res.status(500).json({
//             status: 'error',
//             error: "Internal server error" // 500 Internal Server Error
//         });
//     }
// });

// // Ruta para actualizar un producto por ID (agregar stock, etc.)
// router.put('/:pid', async (req, res) => {
//     const id = req.params.pid;
//     const updatedProduct = req.body;

//     try {
//         await productManager.updateProduct(id, updatedProduct);
//         res.json({
//             status: 'success',
//             message: "Product updated successfully" // 200 OK
//         });
//     } catch (error) {
//         console.error("Error updating product", error);
//         res.status(500).json({
//             status: 'error',
//             error: "Internal server error" // 500 Internal Server Error
//         });
//     }
// });

// // Ruta para eliminar un producto por ID
// router.delete('/:pid', async (req, res) => {
//     const id = req.params.pid;

//     try {
//         await productManager.deleteProduct(id);
//         res.json({
//             status: 'success',
//             message: "Product deleted successfully" // 200 OK
//         });
//     } catch (error) {
//         console.error("Error deleting product", error);
//         res.status(500).json({
//             status: 'error',
//             error: "Internal server error" // 500 Internal Server Error
//         });
//     }
// });

// export default router; // Exporta el router


import express from 'express';
import ProductManager from '../dao/db/product-manager-db.js';
import { getProducts } from '../controllers/productsController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/view', authenticateJWT, getProducts);

// Ruta para renderizar la página de productos
router.get('/view', getProducts); // Ruta que renderiza la vista de productos

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = 'asc', query = '' } = req.query;

        const products = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.prevLink,
            nextLink: products.nextLink,
        });

    } catch (error) {
        console.error("Error getting products", error);
        res.status(500).json({
            status: 'error',
            error: "Internal server error"
        });
    }
});

router.get('/:pid', async (req, res) => {
    const id = req.params.pid;

    try {
        const product = await productManager.getProductById(id);
        if (!product) {
            return res.status(404).json({
                status: 'error',
                error: "Product not found"
            });
        }

        res.json(product);
    } catch (error) {
        console.error("Error getting product", error);
        res.status(500).json({
            status: 'error',
            error: "Internal server error"
        });
    }
});

router.post('/', async (req, res) => {
    const newProduct = req.body;

    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({
            status: 'success',
            message: "Product added successfully"
        });
    } catch (error) {
        console.error("Error adding product", error);
        res.status(500).json({
            status: 'error',
            error: "Internal server error"
        });
    }
});

router.put('/:pid', async (req, res) => {
    const id = req.params.pid;
    const updatedProduct = req.body;

    try {
        await productManager.updateProduct(id, updatedProduct);
        res.json({
            status: 'success',
            message: "Product updated successfully"
        });
    } catch (error) {
        console.error("Error updating product", error);
        res.status(500).json({
            status: 'error',
            error: "Internal server error"
        });
    }
});

router.delete('/:pid', async (req, res) => {
    const id = req.params.pid;

    try {
        await productManager.deleteProduct(id);
        res.json({
            status: 'success',
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting product", error);
        res.status(500).json({
            status: 'error',
            error: "Internal server error"
        });
    }
});

export default router;