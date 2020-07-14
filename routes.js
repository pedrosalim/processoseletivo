const express = require('express')
const routes = express.Router()
const products = require('./controllers/products')


routes.get('/', function(req, res) {
    return res.redirect("/products")
})

routes.get('/products', products.index)
routes.get('/products/create', products.create)
routes.get('/products/:id', products.show)
routes.get('/products/:id/edit', products.edit)
routes.post('/products', products.post)
routes.put("/products", products.put)
routes.delete('/products', products.delete)


module.exports = routes