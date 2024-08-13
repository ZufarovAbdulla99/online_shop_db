import { Router } from "express";
import { createProduct, getAllProduct, getProduct, removeAllProduct, removeProduct, updateProduct } from "../controller/product.controller.js";

export const productRoutes = Router()

productRoutes
    .get("/:productId", getProduct)
    .get("/", getAllProduct)
    .post("/add", createProduct)
    .put("/update/:productId", updateProduct)
    .delete("/delete/:productId", removeProduct)
    .delete("/delete", removeAllProduct)