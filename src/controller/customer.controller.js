import { fetchData } from "../postgres/postgres.js"

export async function getCustomer(req, res) {
    if (isNaN(req.params.customerId)) {
        res.status(400).send("Bad request")
        return;
    }

    const customerId = req.params.customerId
    const foundedCustomer = await fetchData(`
        SELECT * FROM customer
        WHERE id = $1
        `, customerId)

    if (!foundedCustomer.length) {
        res.status(404).send({
            message: "customer not found"
        })
        return;
    }

    res.status(200).send({
        msessage: "ok",
        data: foundedCustomer
    })
}

export async function getAllCustomer(req, res) {
    const allCustomer = await fetchData(`
        SELECT * FROM customer`)

    if (!allCustomer.length) {
        res.status(404).send({
            message: "customers not found"
        })
        return;
    }

    res.status(200).send({
        message: "ok",
        data: allCustomer
    })
}

export async function createCustomer(req, res) {
    const data = req.body

    // databasedagi not null ustunlarni postmanda aniq kiritishi uchun
    if (!(data?.email && data?.password && data?.phone_number)) {
        res.status(400).send("Bad request. !!! email, password, phone number must be entered")
        return
    }

    await fetchData(`
        INSERT INTO customer (first_name, last_name, email, password, phone_number, address)
        VALUES ($1, $2, $3, $4, $5, $6)
        `, data?.first_name, data?.last_name, data?.email, data?.password, data?.phone_number, data?.address)

    res.status(201).send({
        message: "successfully created"
    })
}

export async function updateCustomer(req, res) {
    if (isNaN(req.params.customerId)) {
        res.status(400).send("Bad request")
        return;
    }

    const customerId = req.params.customerId

    const selectedCustomer = await fetchData(`
        SELECT * FROM customer WHERE id = $1
        `, customerId)

    if (!selectedCustomer.length) {
        res.status(404).send("customer not found")
        return
    }

    const updatedCustomer = req.body
    await fetchData(`
        UPDATE customer SET first_name = $1, last_name = $2, email = $3,
        password = $4, phone_number = $5, address = $6
        WHERE id = $7
        `
        , updatedCustomer?.first_name || selectedCustomer?.first_name,
        updatedCustomer?.last_name || selectedCustomer?.last_name,
        updatedCustomer?.email || selectedCustomer?.email,
        updatedCustomer?.password || selectedCustomer?.password,
        updatedCustomer?.phone_number || selectedCustomer?.phone_number,
        updatedCustomer?.address || selectedCustomer?.address,
        customerId
    )

    res.status(200).send({
        message: "successfully updated"
    })
}

export async function removeCustomer(req, res){
    if (isNaN(req.params.customerId)) {
        res.status(400).send("Bad request")
        return;
    }

    const customerId = req.params.customerId
    const selectedCustomer = await fetchData(`
        SELECT * FROM customer WHERE id = $1
        `, customerId)

    if (!selectedCustomer.length) {
        res.status(404).send("customer not found")
        return
    }

    await fetchData(`
        DELETE FROM customer WHERE id = $1
        `, customerId)

    res.status(200).send({
        message: "deleted successfully"
    })
}

export async function removeAllCustomer(req, res){
    const allCustomer = await fetchData(`
        SELECT * FROM customer`)

    if (!allCustomer.length) {
        res.status(404).send({
            message: "customers not found"
        })
        return;
    }

    await fetchData(`
        TRUNCATE TABLE customer CASCADE;
        `)

    res.status(404).send({
        message: "successfully deleted all customers"
    })
}