// initial library
const express = require('express')//untuk membuat endpoint
const bodyParser = require('body-parser')//untuk membaca request bagian body
const cors = require('cors')// untuk mengijinkan API diakses oleh server lain
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
app.get("/user", (request, response)=>{
    //create sql query
    let sql = "select * from user"

    //run query
    connection.query(sql,(error, result)=>{
        let res = null
        if (error) {
            res = {
                message : error.message // pesan error
            }
        } else {
            res = {
                "Jumlah User" : result.length, // jumlah data
                "Data User" : result // isi data
            }
        }
        response.json(res) // send response
    })
})

// 2. End Point untuk mengakses data mobil berdasarkan id dengan method GET
app.get("/user/:id", (request, response)=>{
    let data = {id_user: request.params.id}

    //create sql query
    let sql = "select * from user WHERE ?"

    //run query
    connection.query(sql, data,(error, result)=>{
        let res = null
        if (error) {
            res = {
                message : error.message // pesan error
            }
        } else {
            res = {
                "Jumlah User" : result.length, // jumlah data
                "Data User" : result // isi data
            }
        }
        response.json(res) // send response
    })
})

// 3. End Point untuk menyimpan data mobil baru dengan method POST
app.post("/user", (request, response)=>{
    // membuat data
    let data = {
        nama_user : request.body.nama_user,
        username : request.body.username,
        password : request.body.password
    }
    //create sql query
    let sql = "insert into user SET ?";

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

// 4. End Point untuk mengubah data mobil dengan method PUT
app.put("/user", (request, response)=>{
    // menyiapkan data
    let data = [
        {
        nama_user : request.body.nama_user,
        username : request.body.username,
        password : request.body.password

        },
        //primary key
        {
            id_user : request.body.id_user
        }
    ]
    //create sql query
    let sql = "update user SET ? WHERE ?"

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

// 5. End Point untuk menghapus data mobil dengan method DELETE
app.delete("/user/:id", (request, response)=>{
    // menyiapkan data
    let data = {
        id_user : request.params.id
    }
    //create sql query
    let sql = "delete from user WHERE ?"

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