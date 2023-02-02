const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const request = require('request');
// const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signUp.html");
})

app.post("/", (req, res) =>{
    var firstName = req.body.fname;
    var lastName = req.body.lname;
    var email = req.body.mail;

    if(!firstName || !lastName || !email){
        res.redirect("/failure.html");
    }

        var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }

    var jsondata = JSON.stringify(data);

    const url = "https://us13.api.mailchimp.com/3.0/lists/0895b6d673"

    var options = {
        method: "POST",
        auth: "anirban:80623b18a68adf53e900391d06d3f810-us13"
    }

   var request = https.request(url, options, function (response){
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })

        if (response.statusCode === 200) {
            res.redirect('/success.html');
        } else {
            res.redirect('/failure.html');
        }

    })

    request.write(jsondata);
    request.end();
})

app.post("/failure", (req, res) => {
    res.redirect("/");
})

const port = process.env.PORT || 3000;

app.listen(port, function(req, res){
    console.log('The server is started on ' + port);
})

// 0895b6d673
// 80623b18a68adf53e900391d06d3f810-us13