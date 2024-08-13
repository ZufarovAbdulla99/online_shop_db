import { Router } from "express";
import { createOrderDetail, getAllOrderDetail, getOrderDetail, removeAllOrderDetail, removeOrderDetail, updateOrderDetail } from "../controller/order_details.controller.js";
import { removeAllOrder } from "../controller/order.controller.js";

export const orderDetailsRoutes = Router()

orderDetailsRoutes
    .get("/:order_details_id", getOrderDetail)
    .get("/", getAllOrderDetail)
    .post("/add", createOrderDetail)
    .put("/update/:order_details_id", updateOrderDetail)
    .delete("/delete/:order_details_id", removeOrderDetail)
    .delete("/delete", removeAllOrderDetail)