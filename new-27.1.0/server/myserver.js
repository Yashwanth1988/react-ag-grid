const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const data = require('./dummy')
const app = express()
const port = 8080
// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//app.use(bodyParser.json({ type: 'application/*+json' }))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const copyAry = [...data.data]
app.get('/getEmployees', (req, res) => {
    const filterValue = req.query.query

    const result = data.data.filter((item) => {
        if(filterValue){
            return item.employee.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
        }
    })

    console.log('filterValue', filterValue)
    if(filterValue == '' || filterValue == undefined){
        res.json(data.data)
    } else {
        res.json(result);
    }
})
app.listen(port, () => console.log(`Example app listening on port ${port}`))
