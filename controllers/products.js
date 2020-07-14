const fs = require('fs')
const data = require('../data.json')
const Intl = require('intl')

exports.index = function(req, res) {

    return res.render("products/index", { products: data.products })
}

exports.show = function(req, res) {
    const { id } = req.params // Desestruturar o id

    //Buscar o produto dentro do arquivo data
    const foundProducts = data.products.find(function(product) {
        return product.id == id
    })

    if (!foundProducts) return res.send("Produto não encontrado")  

    const product = {
        ...foundProducts, // ESPALHAR TUDO QUE TEM DENTRO DO INSTRUCTOR QUE NÃO PRECISA SER CORRIGIDO
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundProducts.created_at), // Formatar a data de criaçao do produto para data padrão
    }

    return res.render("products/show", { product })
}

// Rota de criação do produto
exports.create = function(req, res) {

    return res.render("products/create")
}

// create
exports.post = function(req, res) {

    const keys = Object.keys(req.body)

    // VERIFICAR SE TODOS OS CAMPOS ESTÃO PREENCHIDOS
    for (key of keys) {
        if (req.body[key] == "") {
            return res.send("Preencha todos os campos!")
        }
    }

    let {avatar_url, value, name, cod, typeProduct} = req.body

    const created_at = Date.now()
    const id = Number(data.products.length + 1)

    // Array para pegar informções do produto
    data.products.push({
        id,
        avatar_url,
        name,
        typeProduct,
        cod,
        value,
        created_at
    })


    // Escrever o protudo no arquivo data.json
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Houve um erro!")

        return res.redirect(`/products/${id}`)
    })

}

exports.edit = function(req, res) {

    const { id } = req.params

    const foundProducts = data.products.find(function(product) {
        return product.id == id
    })

    if (!foundProducts) return res.send("Produto não encontrado")

    // Array para espalhar dados do produto
    const product = {
        ...foundProducts,
    }


    return res.render("products/edit", { product })
}

exports.put = function(req, res) {
    const { id } = req.body
    let index = 0

    const foundProducts = data.products.find(function(product, foundIndex) {
        if (id == product.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundProducts) return res.send("Produto não encontrado")

    // Espalhar os dados do produto e do req.body
    const product = {
        ...foundProducts,
        ...req.body,
        id: Number(req.body.id) // Transformar a string "id" em um number para evitar complicações
    }

    data.products[index] = product

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Write error!")

        return res.redirect(`/products/${id}`)
    })

}

exports.delete = function(req, res) {
    const { id } = req.body
    
    // Filtrar o produto a ser deletado
    const filteredProduct = data.products.filter(function(product) {
        return product.id != id

    })

    data.products = filteredProduct

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Houve um erro!")

        return res.redirect("/products")
    })
}