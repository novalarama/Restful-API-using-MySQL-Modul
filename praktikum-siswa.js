// inisiasi library
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")
 
// implementation
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// create MySQL Connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pelanggaran_siswa"
})
 
connection.connect(error => {
    if (error) {
        console.log(error.message)
    } else {
        console.log("MySQL Connected")
    }
})

// 1. End Point untuk mengakses data siswa dengan method GET
app.get("/siswa", (request, response) => {
    // create sql query
    let sql = "select * from siswa"
 
    // run query
    connection.query(sql, (error, result) => {
        let res = null
        if (error) {
            res = {
                message: error.message // pesan error
            }            
        } else {
            res = {
                count: result.length, // jumlah data
                siswa: result // isi data
            }            
        }
        response.json(res) // send response
    })
})

// 2. End Point untuk mengakses siswa berdasarkan id dengan method GET
app.get("/siswa/:id", (request, response) => {
    let data = {
        id_siswa: request.params.id
    }
    // create sql query
    let sql = "select * from siswa WHERE ?"
 
    // run query
    connection.query(sql, data, (error, result) => {
        let res = null
        if (error) {
            res = {
                message: error.message // pesan error
            }            
        } else {
            res = {
                count: result.length, // jumlah data
                siswa: result // isi data
            }            
        }
        response.json(res) // send response
    })
})

// 3. End Point untuk menyimpan data siswa dengan method POST
app.post("/siswa", (request,response) => {
 
    // prepare data
    let data = {
        nis: request.body.nis,
        nama_siswa: request.body.nama_siswa,
        kelas: request.body.kelas,
        poin: request.body.poin
    }
 
    // create sql query insert
    let sql = "insert into siswa SET ?"
 
    // run query
    connection.query(sql, data, (error, result) => {
        let res = null
        if (error) {
            res = {
                message: error.message
            }
        } else {
            res = {
                message: result.affectedRows + " data inserted"
            }
        }
        response.json(res) // send response
    })
})

// 4. End Point untuk mengubah siswa dengan method PUT
app.put("/siswa", (request,response) => {
 
    // prepare data
    let data = [
        // data
        {
            nis: request.body.nis,
            nama_siswa: request.body.nama_siswa,
            kelas: request.body.kelas,
            poin: request.body.poin
        },
 
        // parameter (primary key)
        {
            id_siswa: request.body.id_siswa
        }
    ]
 
    // create sql query update
    let sql = "update siswa SET ? WHERE ?"
 
    // run query
    connection.query(sql, data, (error, result) => {
        let res = null
        if (error) {
            res = {
                message: error.message
            }
        } else {
            res = {
                message: result.affectedRows + " data updated"
            }
        }
        response.json(res) // send response
    })
})

// 5. End Point untuk menghapus siswa dengan method DELETE
app.delete("/siswa/:id", (request,response) => {
    // prepare data
    let data = {
        id_siswa: request.params.id
    }
 
    // create query sql delete
    let sql = "delete from siswa WHERE ?"
 
    // run query
    connection.query(sql, data, (error, result) => {
        let res = null
        if (error) {
            res = {
                message: error.message
            }
        } else {
            res = {
                message: result.affectedRows + " data deleted"
            }
        }
        response.json(res) // send response
    })
})

app.listen(8000, () => {
    console.log("Server run on port 8000")
})

