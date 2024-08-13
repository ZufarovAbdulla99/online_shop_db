import { Router } from "express";
import { createCustomer, getAllCustomer, getCustomer, removeAllCustomer, removeCustomer, updateCustomer } from "../controller/customer.controller.js";

export const customerRoutes = Router()

customerRoutes
    .get("/:customerId", getCustomer)
    .get("/", getAllCustomer)
    .post("/add", createCustomer)
    .put("/update/:customerId", updateCustomer)
    .delete("/delete/:customerId", removeCustomer)
    .delete("/delete", removeAllCustomer)