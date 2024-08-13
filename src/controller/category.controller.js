import formidable from "formidable"
import { fetchData } from "../postgres/postgres.js"
import { unlink } from "node:fs/promises"
import path from "path"

const form = formidable({
    keepExtensions: true,
    uploadDir: "uploads"
})

export async function getCategory(req, res) {
    if (isNaN(req.params.categoryId)) {
        res.status(400).send("Bad request")
        return;
    }

    const categoryId = req.params.categoryId
    const foundedCategory = await fetchData(`
        SELECT * FROM category
        WHERE id = $1
        `, categoryId)

    if (!foundedCategory.length) {
        res.status(404).send({
            message: "category not found"
        })
        return;
    }

    res.status(200).send({
        msessage: "ok",
        data: foundedCategory
    })
}

export async function getAllCategory(req, res) {
    const allCategories = await fetchData(`
        SELECT * FROM category`)

    if (!allCategories.length) {
        res.status(404).send({
            message: "categories not found"
        })
        return;
    }

    res.status(200).send({
        message: "ok",
        data: allCategories
    })
}

export async function createCategory(req, res) {
    const [fields, files] = await form.parse(req)

    await fetchData(`
        INSERT INTO category (name, image_path, category_id)
        VALUES ($1, $2, $3)
        `, fields?.name[0], files?.image_path[0]?.newFilename, fields?.categoryId ? fields.categoryId : null,)

    res.status(201).send({
        message: "successfully created"
    })
}

export async function updateCategory(req, res) {
    if (isNaN(req.params.categoryId)) {
        res.status(400).send("Bad request")
        return;
    }

    const categoryId = req.params.categoryId
    const [fields, files] = await form.parse(req)

    const selectedCategory = await fetchData(`
        SELECT * FROM category WHERE id = $1
        `, categoryId)

    if (!selectedCategory.length) {
        res.status(404).send("category not found")
        return
    }
    let currentImage = files.image_path[0].newFilename;

    if(files.image_path){
        unlink(path.join(process.cwd(), "uploads", selectedCategory[0].image_path), (err) => {
            if (err) {
                console.log(err)
            }
        })
        currentImage = files.image_path[0].newFilename
    }
    await fetchData(`
        UPDATE category SET name = $1, image_path = $2, category_id = $3
        WHERE id = $4
        `, fields?.name ? fields?.name[0] : selectedCategory?.name[0],
        currentImage ? currentImage : null,
        fields?.categoryId ? fields.categoryId : selectedCategory.category_id, categoryId)

    res.status(200).send({
        message: "successfully updated"
    })
}

export async function removeCategory(req, res) {
    if (isNaN(req.params.categoryId)) {
        res.status(400).send("Bad request")
        return;
    }

    const categoryId = req.params.categoryId
    const selectedCategory = await fetchData(`
        SELECT * FROM category WHERE id = $1
        `, categoryId)

    if (!selectedCategory.length) {
        res.status(404).send("category not found")
        return
    }

    await fetchData(`
        DELETE FROM category WHERE id = $1
        `, categoryId)

    res.status(200).send({
        message: "deleted successfully"
    })
}

export async function removeAllCategory(req, res) {
    const allCategories = await fetchData(`
        SELECT * FROM category`)

    if (!allCategories.length) {
        res.status(404).send({
            message: "categories not found"
        })
        return;
    }

    await fetchData(`
        TRUNCATE TABLE category CASCADE;
        `)

    res.status(200).send({
        message: "successfully deleted all category"
    })
}