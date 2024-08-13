import { fetchData } from "../postgres/postgres.js"

export async function getOrderDetail(req, res) {
    if (isNaN(req.params.order_details_id)) {
        res.status(400).send("Bad request")
        return;
    }

    const order_details_id = req.params.order_details_id
    const foundedOrderDetail = await fetchData(`
        SELECT * FROM order_details
        WHERE id = $1
        `, order_details_id)

    if (!foundedOrderDetail.length) {
        res.status(404).send({
            message: "order item not found"
        })
        return;
    }

    res.status(200).send({
        msessage: "ok",
        data: foundedOrderDetail
    })
}

export async function getAllOrderDetail(req, res) {
    const alldata = await fetchData(`
        SELECT * FROM order_details`)

    if (!alldata.length) {
        res.status(404).send({
            message: "order items not found"
        })
        return;
    }

    res.status(200).send({
        message: "ok",
        data: alldata
    })
}

export async function createOrderDetail(req, res) {
    const data = req.body

    // databasedagi not null ustunlarni postmanda aniq kiritishi uchun
    if (!(data?.order_id && data?.product_id && data?.quantity && data?.price)) {
        res.status(400).send("Bad request. !!! order_id, product_id, quantity, price must be entered")
        return
    }

    await fetchData(`
        INSERT INTO order_details(product_id, order_id, quantity, price)
        VALUES ($1, $2, $3, $4)
        `, data?.product_id, data?.order_id, data?.quantity, data?.price)

    res.status(201).send({
        message: "successfully created"
    })
}

export async function updateOrderDetail(req, res) {
    if (isNaN(req.params.order_details_id)) {
        res.status(400).send("Bad request")
        return;
    }

    const order_details_id = req.params.order_details_id

    const selectedOrderDetail = await fetchData(`
        SELECT * FROM order_details WHERE id = $1
        `, order_details_id)

    if (!selectedOrderDetail.length) {
        res.status(404).send("order item not found")
        return
    }

    const updatedOrderDetail = req.body
    await fetchData(`
        UPDATE order_details SET product_id = $1, order_id = $2, quantity = $3, price = $4
        WHERE id = $5
        `
        , updatedOrderDetail?.product_id || selectedOrderDetail?.product_id,
        updatedOrderDetail?.order_id || selectedOrderDetail?.order_id,
        updatedOrderDetail?.quantity || selectedOrderDetail?.quantity,
        updatedOrderDetail?.price || selectedOrderDetail?.price,
        order_details_id
    )

    res.status(200).send({
        message: "successfully updated"
    })
}

export async function removeOrderDetail(req, res) {
    if (isNaN(req.params.order_details_id)) {
        res.status(400).send("Bad request")
        return;
    }

    const order_details_id = req.params.order_details_id
    const selectedOrderDetail = await fetchData(`
        SELECT * FROM order_details WHERE id = $1
        `, order_details_id)

    if (!selectedOrderDetail.length) {
        res.status(404).send("order item not found")
        return
    }

    await fetchData(`
        DELETE FROM order_details WHERE id = $1
        `, order_details_id)

    res.status(200).send({
        message: "deleted successfully"
    })
}

export async function removeAllOrderDetail(req, res) {
    const allOrderDetail = await fetchData(`
        SELECT * FROM order_details`)

    if (!allOrderDetail.length) {
        res.status(404).send({
            message: "order items not found"
        })
        return;
    }

    await fetchData(`
        TRUNCATE TABLE order_details CASCADE;
        `)

    res.status(404).send({
        message: "successfully deleted all order items"
    })
}