const express = require('express')
const mysql = require('mysql')
var cors = require('cors')
const app = express()
const port = 3000
app.use(express.json())
app.use(cors())

var connection;
function kapcsolat() {
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'szakdolgozat'
  })
  connection.connect()
}



app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

app.get('/tanuloLista', (req, res) => {
  kapcsolat()
  connection.query('SELECT * from tanulo_adatok', (err, rows, fields) => {
      if (err) {
          console.log(err)
          res.status(500).send("Hiba")
      }
      else{
          console.log(rows)
          res.status(200).send(rows)
      }
    })
    connection.end()
})

//----------------------tanuló lista

app.post('/tanulobejelentkezes', (req, res) => {
  kapcsolat()
  connection.query(`
  SELECT tanulo.tanulo_nev, tanulo.tanulo_oktatoja, tanulo.tanulo_orak, 
       tanulo.tanulo_felhasznaloID, felhasznalo.felhasznalo_username, 
       felhasznalo.felhasznalo_jelszo, oktato.oktato_nev, autosiskola.autosiskola_neve
FROM tanulo_adatok AS tanulo
INNER JOIN felhasznaloi_adatok AS felhasznalo 
    ON tanulo.tanulo_felhasznaloID = felhasznalo.felhasznalo_id
    INNER JOIN oktato_adatok AS oktato 
    ON tanulo.tanulo_oktatoja = oktato.oktato_id
    INNER JOIN autosiskola_adatok AS autosiskola 
    ON oktato.autosiskola_id = autosiskola.autosiskola_id
  WHERE felhasznalo.felhasznalo_username = ? 
    AND felhasznalo.felhasznalo_jelszo = ?
  `,[req.body.bevitel1, req.body.bevitel2], (err, rows, fields) => {
    if (err) {
      console.log("Hiba")
      res.status(500).send("Hiba")
    }
    else {
      console.log(rows)
      res.status(200).send(rows)
    }
  })
  connection.end()
})

//tanuló bejelentkezés
//---------------------------------

app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

app.post('/oktatobejelentkezes', (req, res) => {
  kapcsolat()
  connection.query(`
  SELECT oktato.oktato_nev, oktato_felhasznaloID, felhasznalo.felhasznalo_username, 
       felhasznalo.felhasznalo_jelszo, autosiskola.autosiskola_neve
FROM oktato_adatok AS oktato
INNER JOIN felhasznaloi_adatok AS felhasznalo 
    ON oktato.oktato_felhasznaloID = felhasznalo.felhasznalo_id
INNER JOIN autosiskola_adatok AS autosiskola 
    ON oktato.autosiskola_id = autosiskola.autosiskola_id
  WHERE felhasznalo.felhasznalo_username = ? 
    AND felhasznalo.felhasznalo_jelszo = ?
  `,[req.body.bevitel1, req.body.bevitel2], (err, rows, fields) => {
    if (err) {
      console.log("Hiba")
      res.status(500).send("Hiba")
    }
    else {
      console.log(rows)
      res.status(200).send(rows)
    }
  })
  connection.end()
})


//oktató bejelentkezés 
//-----------------------------

app.post('/tanuloMindenAdatLekerdez', (req, res) => {
    kapcsolat()
    connection.query(`
    SELECT tanulo.tanulo_nev, tanulo.tanulo_oktatoja, tanulo.tanulo_orak, 
       tanulo.tanulo_felhasznaloID, felhasznalo.felhasznalo_username, 
       felhasznalo.felhasznalo_jelszo, fizetes.befizetett_osszeg, 
       fizetes.befizetes_ideje, oktato.oktato_nev, autosiskola.autosiskola_neve
FROM tanulo_adatok AS tanulo
INNER JOIN felhasznaloi_adatok AS felhasznalo 
    ON tanulo.tanulo_felhasznaloID = felhasznalo.felhasznalo_id
INNER JOIN befizetesek AS fizetes 
    ON tanulo.tanulo_id = fizetes.tanulo_id
    INNER JOIN oktato_adatok AS oktato 
    ON tanulo.tanulo_oktatoja = oktato.oktato_id
    INNER JOIN autosiskola_adatok AS autosiskola 
    ON oktato.autosiskola_id = autosiskola.autosiskola_id
WHERE tanulo.tanulo_id =${req.body.bevitel1}`, (err, rows, fields) => {
      if (err) {
        console.log("Hiba")
        res.status(500).send("Hiba")
      }
      else {
        console.log(rows)
        res.status(200).send(rows)
      }
    })
    connection.end()
})


//tanuló adatai 
//--------------------------------------
app.post('/tanuloOktatojaLekerdez', (req, res) => {
    kapcsolat()
    connection.query(`
      SELECT tanulo_oktatoja	
      from tanulo_adatok
      where tanulo_id=${req.body.bevitel1}`, (err, rows, fields) => {
      if (err) {
        console.log("Hiba")
        res.status(500).send("Hiba")
      }
      else {
        console.log(rows)
        res.status(200).send(rows)
      }
    })
    connection.end()
})

//tanuló oktatója 
//-------------------------------


app.post('/tanuloRegisztracio', (req, res) => {
  kapcsolat()
  connection.query(`
    INSERT INTO felhasznaloi_adatok VALUES (NULL, ?, ? ); INSERT INTO tanulo_adatok VALUES (NULL, ?, ?, ?, ?);`,
    [req.body.bevitel1, req.body.bevitel2, req.body.bevitel3, req.body.bevitel4, req.body.bevitel5, req.body.bevitel6], (err, rows, fields) => {
    if (err) {
      console.log("Hiba")
      console.log(err)
      res.status(500).send("Hiba")
    }
    else {
      console.log("Sikeres felvitel!")
      res.status(200).send("Sikeres felvitel!")
    }
  })
  connection.end()
})

//tanuló regisztráció
//--------------------

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })