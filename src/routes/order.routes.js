import { Router } from "express";
import { createOrder, getAllOrder, getOrder, removeAllOrder, removeOrder, updateOrder } from "../controller/order.controller.js";

export const orderRoutes = Router()

orderRoutes
    .get("/:orderId", getOrder)
    .get("/", getAllOrder)
    .post("/add", createOrder)
    .put("/update/:orderId", updateOrder)
    .delete("/delete/:orderId", removeOrder)
    .delete("/delete", removeAllOrder)