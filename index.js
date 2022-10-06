const express = require('express')
const cors = require('cors')
require('dotenv').config()
require('./connection_db')
const db = require('./models')
const data = require('./database/data2.json')
const app = express()
const { Op } = require('sequelize')
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET']
}))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

app.use('/api/v1/insert/', (req, res) => {
    try {
        const keyData = Object.keys(data)
        keyData.forEach((item) => {
            data[item].forEach(async (i) => {
                await db.Book.create({
                    name: i?.bookTitle,
                    cost: i?.bookPrice,
                    image_url: i?.imageUrl
                })
            })
        })
        return res.status(200).json({
            err: 0,
            mes: 'Insert data is successfully'
        })
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Internal Server Error'
        })
    }
})
app.use('/api/v1/book/all', async (req, res) => {
    try {
        const { order, name, ...query } = req.query
        const queries = { raw: true }
        if (order) queries.order = [order]
        if (name) query.name = { [Op.substring]: name }
        const response = await db.Book.findAll({
            where: query,
            ...queries
        })
        return res.status(200).json({
            err: response ? 0 : 1,
            mes: response ? 'Got' : 'Cannot get books',
            bookData: response
        })
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Internal Server Error'
        })
    }
})
app.use('/api/v1/book/', async (req, res) => {
    try {
        const { page, limitBook, order, name, ...query } = req.query
        const queries = { raw: true }
        const offset = (!page || +page <= 1) ? 0 : (+page - 1)
        const limit = +limitBook || +process.env.LIMIT_BOOK
        queries.offset = offset * limit
        queries.limit = limit
        if (order) queries.order = [order]
        if (name) query.name = { [Op.substring]: name }
        const response = await db.Book.findAndCountAll({
            where: query,
            ...queries
        })
        return res.status(200).json({
            err: response ? 0 : 1,
            mes: response ? 'Got' : 'Cannot get books',
            bookData: response
        })
    } catch (error) {
        return res.status(500).json({
            err: -1,
            mes: 'Internal Server Error'
        })
    }
})



const listener = app.listen(process.env.PORT, () => {
    console.log(`Server running on the port ${listener.address().port}`)
})