import { fetchData } from "../postgres/postgres.js"

export async function getOrder(req, res) {
    if (isNaN(req.params.orderId)) {
        res.status(400).send("Bad request")
        return;
    }

    const orderId = req.params.orderId
    const foundedOrder = await fetchData(`
        SELECT * FROM orders
        WHERE id = $1
        `, orderId)

    if (!foundedOrder.length) {
        res.status(404).send({
            message: "order not found"
        })
        return;
    }

    res.status(200).send({
        msessage: "ok",
        data: foundedOrder
    })
}

export async function getAllOrder(req, res){
    const allOrder = await fetchData(`
        SELECT * FROM orders`)

    if (!allOrder.length) {
        res.status(404).send({
            message: "orders not found"
        })
        return;
    }

    res.status(200).send({
        message: "ok",
        data: allOrder
    })
}

export async function createOrder(req, res) {
    const data = req.body

    // databasedagi not null ustunni postmanda aniq kiritishi uchun
    if (!(data?.customer_id)) {
        res.status(400).send("Bad request. !!! customer_id must be entered")
        return
    }

    await fetchData(`
        INSERT INTO orders (customer_id)
        VALUES ($1)
        `, data?.customer_id)

    res.status(201).send({
        message: "successfully created"
    })
}

export async function updateOrder(req, res) {
    if (isNaN(req.params.orderId)) {
        res.status(400).send("Bad request")
        return;
    }

    const orderId = req.params.orderId

    const selectedOrder = await fetchData(`
        SELECT * FROM orders WHERE id = $1
        `, orderId)

    if (!selectedOrder.length) {
        res.status(404).send("order not found")
        return
    }

    const updatedOrder = req.body
    await fetchData(`
        UPDATE orders SET customer_id = $1
        WHERE id = $2
        `, updatedOrder?.customer_id, orderId)

    res.status(200).send({
        message: "successfully updated"
    })
}

export async function removeOrder(req, res){
    if (isNaN(req.params.orderId)) {
        res.status(400).send("Bad request")
        return;
    }

    const orderId = req.params.orderId
    const selectedOrder = await fetchData(`
        SELECT * FROM orders WHERE id = $1
        `, orderId)

    if (!selectedOrder.length) {
        res.status(404).send("order not found")
        return
    }

    await fetchData(`
        DELETE FROM orders WHERE id = $1
        `, orderId)

    res.status(200).send({
        message: "deleted successfully"
    })
}

export async function removeAllOrder(req, res){
    const allOrder = await fetchData(`
        SELECT * FROM orders`)

    if (!allOrder.length) {
        res.status(404).send({
            message: "orders not found"
        })
        return;
    }

    await fetchData(`
        TRUNCATE TABLE orders CASCADE;
        `)

    res.status(404).send({
        message: "successfully deleted all orders"
    })
}