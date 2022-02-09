// inisiasi library
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")
const moment = require("moment")
const req = require("express/lib/request")
 
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

// End Point untuk menambahkan data Pelanggaran Siswa
app.post("/pelanggaranSiswa",(request,response)=>{
    //prepare data
    let data = {
        id_siswa : request.body.id_siswa,
        id_user : request.body.id_user,
        waktu : moment().format('YYYY-MM-DD HH:mm:ss')
    }

    //parse to JSON
    let pelanggaran = JSON.parse(request.body.pelanggaran)

    //query to insert
    let sql = "insert into pelanggaran_siswa SET ?"

    //run query
    connection.query(sql, data, (error,result)=>{
        let res = null

        if (error) {
            response.json({message: error.message})
        } else {
            // get last inserted id_pelanggaran
            let lastID = result.insertId

            // prepare data to detail_pelanggaran
            let data = []
            for (let i = 0; i < pelanggaran.length; i++) {
                data.push([
                    lastID, pelanggaran[i].id_pelanggaran
                ])
                
            }

            // create query insert detail_pelanggaran
            let sql = "insert into detail_pelanggaran_siswa VALUES ?"

            connection.query(sql, [data], (error, result)=>{
                if (error) {
                    response.json({message : error.message})
                } else {
                    response.json({message : "Data has been inserted"})
                }
            })
        }
    })
})

// End Point untuk menampilkan data pelanggaran siswa
app.get("/pelanggaranSiswa",(request,response)=>{
    // create query
    let sql = "select p.id_pelanggaran_siswa, p.id_siswa,p.waktu, s.nis, s.nama_siswa, p.id_user, u.nama_user " +
    "from pelanggaran_siswa p join siswa s on p.id_siswa = s.id_siswa " +
    "join user u on p.id_user = u.id_user"

    //run query
    connection.query(sql, (error,result)=>{
        if (error) {
            response.json({message: error.message})
        } else {
            response.json({
                count: result.length,
                pelanggaran_siswa: result
            })
        }
    })
})

//End Point untuk menampilkan data detail pelanggaran berdasarkan method id pelanggaran
app.get("/pelanggaranSiswa/:id_pelanggaran_siswa",(request,response)=>{
    let param = { id_pelanggaran_siswa: request.params.id_pelanggaran_siswa}
 
    // create sql query
    let sql = "select p.nama_pelanggaran, p.poin " + 
    "from detail_pelanggaran_siswa dps join pelanggaran p "+
    "on p.id_pelanggaran = dps.id_pelanggaran " +
    "WHERE ?"

    connection.query(sql, param, (error, result)=>{
        if (error) {
            response.json({message: error.message})
        } else {
            response.json({
                count : result.length,
                detail_pelanggaran_siswa : result
            })
        }
    })

})

// End Point untuk menghapus data berdasarkan id pelanggaran
app.delete("/pelanggaranSiswa/:id_pelanggaran_siswa",(request,response)=>{
    let param = { id_pelanggaran_siswa: request.params.id_pelanggaran_siswa}
 
    // create sql query delete detail_pelanggaran
    let sql = "delete from detail_pelanggaran_siswa WHERE ?"

    connection.query(sql, param, (error, result)=>{
        if (error) {
            response.json({message : error.message})
        } else {
            let param = {id_pelanggaran_siswa:request.params.id_pelanggaran_siswa}
        }

        //create sql query
        let sql = "delete from pelanggaran_siswa WHERE ?"

        connection.query(sql, param, (error, result)=>{
            if (error) {
                response.json({message: error.message})
            } else {
                response.json({message : "Data has been deleted"})
            }
        })
    })
})

app.listen(8000, () => {
    console.log("Server run on port 8000")
})
