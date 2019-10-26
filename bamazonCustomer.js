var mysql = require ("mysql");

var inquirer = require("inquirer");

var connection =mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "CHmySQL1988#",
    database: "bamazon"

});

connection.connect(function (err){
    if (err) throw err;
    bamazonPrompt();
});

function bamazonPrompt(){
 inquirer.prompt([
     {
     name:"selectID",
     message: "From 1-10, Which product would you like to buy",
     type: "input"
     },

     {
       name: "units",
       message: "How many units would you like to buy?",
       type: "input"  
     }

 ]).then(function(answer){
     if (answer.selectID < 1 && answer.selectID > 10){
         console.log("Try again!");
         
     }
 })
    
}