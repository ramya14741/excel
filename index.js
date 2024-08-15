
//const express = require('express')
const fs = require('fs')
const express = require('express');
const fileURLToPath = require('url');
const path = require('path')
const __basedir = path.resolve(path.dirname(''));
const bodyparser = require('body-parser')
const readXlsxFile = require('read-excel-file/node')
const mysql = require('mysql')
const multer = require('multer')
const app = express()
app.use(express.static('./public'))
app.use(bodyparser.json())
app.use(
  bodyparser.urlencoded({
    extended: true,
  }),
)
//import path from "path"
//const __dirname = path.resolve();
db.connect(function (err) {
  if (err) {
    return console.error('error: ' + err.message)
  }
  console.log('Database connected.')
})
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,__dirname + '/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
  },
})
const uploadFile = multer({ storage: storage })
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' })
})
app.post('/import-excel', uploadFile.single('import-excel'), (req, res) => {
  importFileToDb(__basedir + '/uploads/' + req.file.filename)
  console.log(res)
})
function importFileToDb(exFile) {
  readXlsxFile(exFile).then((rows) => {
    rows.shift()
    //db.connect((error) => {
      //if (error) {
        //console.error(error)
      //} else {
        let query = 'INSERT INTO homeneeds.Product VALUES ?'
        db.query(query, [rows], (error, response) => {
          console.log(error || response)
        })
      //}
    //})
  })
}
let nodeServer = app.listen(4000, function () {
  let port = nodeServer.address().port
  let host = nodeServer.address().address
  console.log('App working on: ', host, port)
})