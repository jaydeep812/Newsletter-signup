const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended :true}));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req,res){
  const first_n = req.body.firstName;
  const last_n = req.body.lastName;
  const email = req.body.email;

  const data={
    members: [
      {
        email_address : email,
        status : "subscribed",
        merge_fields: {
          FNAME : first_n,
          LNAME : last_n
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us6.api.mailchimp.com/3.0/lists/7bb70d725f";
  const options = {
    method : "POST",
    auth : "jaydeep:b1523129c7d60f3755ae676dd4cfac12-us6",
  }
  const request = https.request(url, options, function(response){
    if (response.statusCode ===200){
      res.sendFile(__dirname+"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data",function(data){
      console.log(JSON.parse(data));
    });
  })
  request.write(jsonData);
  request.end();
});
app.post("/failure",function(req,res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000");
})


//API KEY
// b1523129c7d60f3755ae676dd4cfac12-us6
//LIST ID - 7bb70d725f
