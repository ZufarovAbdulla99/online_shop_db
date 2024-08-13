import { Router } from "express";
import { categoryRoutes } from "./category.routes.js";
import { productRoutes } from "./product.routes.js";
import { customerRoutes } from "./customer.routes.js";
import { orderRoutes } from "./order.routes.js";
import { orderDetailsRoutes } from "./order_details.routes.js";

export const routes = Router()

routes
    .use("/category/", categoryRoutes)
    .use("/product/", productRoutes)
    .use("/customer/", customerRoutes)
    .use("/order/", orderRoutes)
    .use("/order_details/", orderDetailsRoutes)
    // .use("/payments/", paymentsRoutes)