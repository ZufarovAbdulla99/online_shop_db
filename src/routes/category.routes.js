import { Router } from "express";
import { createCategory, getAllCategory, getCategory, removeAllCategory, removeCategory, updateCategory } from "../controller/category.controller.js";

export const categoryRoutes = Router()

categoryRoutes
    .get("/:categoryId", getCategory)
    .get("/", getAllCategory)
    .post("/add", createCategory)
    .put("/update/:categoryId", updateCategory)
    .delete("/delete/:categoryId", removeCategory)
    .delete("/delete", removeAllCategory)