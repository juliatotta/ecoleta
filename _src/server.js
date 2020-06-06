const express = require("express")
//Com essa linha eu posso usar o express para começar um servidor
const server = express()
//O server vai executar a função express no server

const db = require("./database/db")
//pegando o banco de dados

//configuar pasta pública
server.use(express.static("_public"))

//habilitar o uso do req.body na aplicação
server.use(express.urlencoded({ extended: true }))


//utilizando tamplate engine
const nunjucks = require("nunjucks")
nunjucks.configure("_src/views", {
    express: server,
    noCache: true
})


//configurar caminhos da minha aplicação
//página inicial
//req: requisição
//res: resposta
server.get("/", (req, res) => { 
    return res.render("index.html")
})

server.get("/create-point", (req, res) => { 

    //console.log(req.query)

    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    
    //req.body: O corpo do nosso formulário
    //console.log(req.body)

    //inserir dados no banco de dados
        const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES  (?,?,?,?,?,?,?);  
        `

    const values = [
      req.body.image,
      req.body.name,
      req.body.address,
      req.body.address2,
      req.body.state,
      req.body.city,
      req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            return console.log(err)
            return res.send("Erro no cadastro!")
        }

        console.log("Cadastrado com sucesso!")
        console.log(this)
    }

    db.run(query, values, afterInsertData)


    return res.render("create-point.html", { saved: true })
})

server.get("/search", (req, res) => { 

    const search = req.query.search

    if(search == "") {
        return res.render("search-results.html", { total: 0 }) 
    }

    //pegar os dados do banco de dados
        db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if (err) {
            return console.log(err)
        }

        const total = rows.length

        //mostrar a página html com os dados do banco de dados
       return res.render("search-results.html", { places: rows, total}) 
    })
    
})



//Ligar o servidor
server.listen(3000)
//estou pegando um objeto server e mandando ele executar a função de ligar o sevidor