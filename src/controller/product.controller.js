import formidable from "formidable"
import { fetchData } from "../postgres/postgres.js"
import { unlink } from "node:fs/promises"
import path from "path"

const form = formidable({
    keepExtensions: true,
    uploadDir: "uploads"
})

export async function getProduct(req, res) {
    if (isNaN(req.params.productId)) {
        res.status(400).send("Bad request")
        return;
    }

    const productId = req.params.productId
    const foundedProduct = await fetchData(`
        SELECT * FROM product
        WHERE id = $1
        `, productId)

    if (!foundedProduct.length) {
        res.status(404).send({
            message: "product not found"
        })
        return;
    }

    res.status(200).send({
        msessage: "ok",
        data: foundedProduct
    })
}

export async function getAllProduct(req, res) {
    const allProducts = await fetchData(`
        SELECT * FROM product`)

    if (!allProducts.length) {
        res.status(404).send({
            message: "products not found"
        })
        return;
    }

    res.status(200).send({
        message: "ok",
        data: allProducts
    })
}

export async function createProduct(req, res) {
    const [fields, files] = await form.parse(req)

    await fetchData(`
        INSERT INTO product(name, description, price, count, rating, category_id, image_path)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, fields?.name[0], fields?.description[0], fields?.price[0], fields?.count[0], fields?.rating[0],
        fields?.categoryId ? fields.categoryId : null,
        files?.image_path[0]?.newFilename)

    res.status(201).send({
        message: "successfully created"
    })
}

export async function updateProduct(req, res) {
    if (isNaN(req.params.productId)) {
        res.status(400).send("Bad request")
        return;
    }

    const productId = req.params.productId
    const [fields, files] = await form.parse(req)

    const selectedProduct = await fetchData(`
        SELECT * FROM product WHERE id = $1
        `, productId)

    let currentImage = selectedProduct[0]?.image_path

    if (!selectedProduct.length) {
        res.status(404).send("product not found")
        return
    }

    if (files?.image_path) {
        unlink(path.join(process.cwd(), "uploads", selectedProduct[0].image_path), (err) => {
            if (err) {
                console.log(err)
            }
        })
        currentImage = files?.image_path[0]?.newFilename
    }
    await fetchData(`
        UPDATE product SET name = $1, description = $2, price = $3, count = $4,
        rating = $5, category_id = $6, image_path = $7
        WHERE id = $8
        `, fields?.name ? fields?.name[0] : selectedProduct?.name[0],
        fields?.description ? fields?.description[0] : selectedProduct?.description[0],
        fields?.price ? fields?.price[0] : selectedProduct?.price[0],
        fields?.count ? fields?.count[0] : selectedProduct?.count[0],
        fields?.rating ? fields?.rating[0] : selectedProduct?.rating[0],
        fields?.categoryId ? fields?.categoryId : selectedProduct?.categoryId,
        currentImage ? currentImage : null,
        productId)

    res.status(200).send({
        message: "successfully updated"
    })
}

export async function removeProduct(req, res) {
    if (isNaN(req.params.productId)) {
        res.status(400).send("Bad request")
        return;
    }
    const productId = req.params.productId

    const selectedProduct = await fetchData(`
        SELECT * FROM product WHERE id = $1
        `, productId)

    if (!selectedProduct.length) {
        res.status(404).send("product not found")
        return
    }

    await fetchData(`
        DELETE FROM product WHERE id = $1
        `, productId)
    
    res.status(200).send({
        message: "successfully deleted"
    })
}

export async function removeAllProduct(req, res) {
    const allProducts = await fetchData(`
        SELECT * FROM product`)

    if (!allProducts.length) {
        res.status(404).send({
            message: "products not found"
        })
        return;
    }

    await fetchData(`
        TRUNCATE TABLE product CASCADE;
        `)

    res.status(200).send({
        message: "successfully deleted all category"
    })
}