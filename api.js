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
    database : "sewa_mobil"
})

connection.connect(error => {
    if (error) {
        console.log(error.message);
    } else {
        console.log("MySQL Connected");
    }
})

// 1. End Point untuk mengakses data siswa dengan method GET
app.get("/mobil", (request, response)=>{
    //create sql query
    let sql = "select * from mobil"

    //run query
    connection.query(sql,(error, result)=>{
        let res = null
        if (error) {
            res = {
                message : error.message // pesan error
            }
        } else {
            res = {
                "Jumlah Data" : result.length, // jumlah data
                "Data Mobil" : result // isi data
            }
        }
        response.json(res) // send response
    })
})

// 2. End Point untuk mengakses data mobil berdasarkan id dengan method GET
app.get("/mobil/:id", (request, response)=>{
    let data = {id_mobil: request.params.id}

    //create sql query
    let sql = "select * from mobil where ?"

    //run query
    connection.query(sql, data,(error, result)=>{
        let res = null
        if (error) {
            res = {
                message : error.message // pesan error
            }
        } else {
            res = {
                "Jumlah Data" : result.length, // jumlah data
                "Data Mobil" : result // isi data
            }
        }
        response.json(res) // send response
    })
})

// 3. End Point untuk menyimpan data mobil baru dengan method POST
app.post("/mobil", (request, response)=>{
    // membuat data
    let data = {
        nomor_mobil : request.body.nomor_mobil,
        merk : request.body.merk,
        jenis : request.body.jenis,
        warna : request.body.warna,
        tahun_pembuatan : request.body.tahun_pembuatan,
        biaya_sewa : request.body.biaya_sewa,
        image : request.body.image
    }
    //create sql query
    let sql = "insert into mobil SET ?";

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
app.put("/mobil", (request, response)=>{
    // menyiapkan data
    let data = [
        {
            id_mobil:request.body.id_mobil,
            nomor_mobil : request.body.nomor_mobil,
            merk : request.body.merk,
            jenis : request.body.jenis,
            warna : request.body.warna,
            tahun_pembuatan : request.body.tahun_pembuatan,
            biaya_sewa : request.body.biaya_sewa,
            image : request.body.image 
        },

        //primary key
        {
            id_mobil : request.body.id_mobil
        }
    ]
    //create sql query
    let sql = "update mobil set ? where ?"

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
app.delete("/mobil/:id", (request, response)=>{
    // menyiapkan data
    let data = {
        id_mobil : request.params.id
    }
    //create sql query
    let sql = "delete from mobil WHERE ?"

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