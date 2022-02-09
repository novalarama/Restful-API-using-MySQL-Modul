// initial library
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')

// implementation
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//create mysql connect
const connection = mysql.createConnection({
    host:"localhost",
    user : "root",
    password : "",
    database : "pelanggaran_siswa"
})

connection.connect(error => {
    if (error) {
        console.log(error.message);
    } else {
        console.log("MySQL Connected");
    }
})

// 1. End Point untuk mengakses data siswa dengan method GET
app.get("/pelanggaran", (request, response)=>{
    //create sql query
    let sql = "select * from pelanggaran"

    //run query
    connection.query(sql,(error, result)=>{
        let res = null
        if (error) {
            res = {
                message : error.message // pesan error
            }
        } else {
            res = {
                "Jumlah Pelanggaran" : result.length, // jumlah data
                "Data Pelanggaran" : result // isi data
            }
        }
        response.json(res) // send response
    })
})

// 2. End Point untuk mengakses data pelanggaran berdasarkan id dengan method GET
app.get("/pelanggaran/:id", (request, response)=>{
    let data = {id_pelanggaran: request.params.id}

    //create sql query
    let sql = "select * from pelanggaran WHERE ?"

    //run query
    connection.query(sql, data,(error, result)=>{
        let res = null
        if (error) {
            res = {
                message : error.message // pesan error
            }
        } else {
            res = {
                "Jumlah Pelanggaran" : result.length, // jumlah data
                "Data Pelanggaran" : result // isi data
            }
        }
        response.json(res) // send response
    })
})

// 3. End Point untuk menyimpan data pelanggaran baru dengan method POST
app.post("/pelanggaran", (request, response)=>{
    // membuat data
    let data = {
        nama_pelanggaran : request.body.nama_pelanggaran,
        poin : request.body.poin
    }
    //create sql query
    let sql = "insert into pelanggaran SET ?";

    //run query
    connection.query(sql,data,(error, result)=>{
        let res = null
        if (error) {
            res = {
                message : error.message // pesan error
            }
        } else {
            res = {
                message : result.affectedRows + " data inserted"
            }
        }
        response.json(res) // send response
    })
})

// 4. End Point untuk mengubah data pelanggaran dengan method PUT
app.put("/pelanggaran", (request, response)=>{
    // menyiapkan data
    let data = [
        {
            nama_pelanggaran:request.body.nama_pelanggaran,
            poin : request.body.poin
        },

        //primary key
        {
            id_pelanggaran : request.body.id_pelanggaran
        }
    ]
    //create sql query
    let sql = "update pelanggaran SET ? WHERE ?"

    //run query
    connection.query(sql, data,(error, result)=>{
        let res = null
        if (error) {
            res = {
                message : error.message // pesan error
            }
        } else {
            res = {
                message: result.affectedRows + " data updated"
            }
        }
        response.json(res) // send response
    })
})

// 5. End Point untuk menghapus data pelanggaran dengan method DELETE
app.delete("/pelanggaran/:id", (request, response)=>{
    // menyiapkan data
    let data = {
        id_pelanggaran : request.params.id
    }
    //create sql query
    let sql = "delete from pelanggaran WHERE ?"

    //run query
    connection.query(sql, data,(error, result)=>{
        let res = null
        if (error) {
            res = {
                message : error.message // pesan error
            }
        } else {
            res = {
                message: result.affectedRows + " data updated"
            }
        }
        response.json(res) // send response
    })
})

app.listen(8000, () => {
    console.log(`Server run on port 8000`);
})