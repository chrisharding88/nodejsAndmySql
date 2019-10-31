
// imports the installation then stores it in a variable
require("dotenv").config();

var mysql = require ("mysql");

var inquirer = require("inquirer");

var Table = require("cli-table2");

// Connects the mySQL
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: process.env.DB_PASS,
    database: "bamazon"

});


connection.connect();

var displayTable = function(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;

        // Set up the table
        var tableBamazon = new Table({
            head: ["Item Id", "Product Desciption", "Cost", "Quanity"],
            colWidths:[12, 50, 10, 10],
            colAligns:["center", "left", "right", "center"],
            style:{
                head:["green"],
                compact:true
            }
        })

        // For loop is used to capture the list of items
        for(var i = 0; i < res.length; i++){
            var itemID = res[i].item_id;
            var productName = res[i].product_name;
            var productPrice = res[i].price;
            var currentQuanity = res[i].stock_quanity;
            tableBamazon.push([itemID, productName, productPrice, currentQuanity]);
        }
        // Displays the table
        console.log(tableBamazon.toString());
        shopBamazon();
    })
}


var shopBamazon = function() {
 inquirer.prompt([
     {
     name:"selectID",
     message: "Which product would you like to buy?",
     type: "input"
     }
 ]).then(function(answer){
    var bamazonChoice = answer.selectID;
    var selectQuery = "SELECT * FROM products WHERE item_id=?"


     connection.query (selectQuery, bamazonChoice, function(err, res){
     if (err) throw err;

        // When the user types in the number ID that's not 1-10, it's going to return a zero.
        // And once it returns to zero, it displays a message saying that the ID doesn't exit 
     if (res.length === 0){
         console.log("That ID doesn't exist. Please select the ID that is listed");
         shopBamazon();
     }else {
         inquirer.prompt([
             {
             name: "stockQuanity",
             type:"input",
             message: "How many items would you like?"
             }
         ]).then (function(answer2){
            var inputQuanity2 = answer2.stockQuanity;  
            var itemID2 = res[0].item_id;
            var productName2 = res[0].product_name;
            var productPrice2 = res[0].price;
            var currentQuanity2 = res[0].stock_quanity;    
            var totalPrice = inputQuanity2 * productPrice2;

            // If the quanities the user inputed is more than the current quanity
            // It will display a message saying that they have the currrent a amount remaining
            if(inputQuanity2 > currentQuanity2){
                console.log(`We're sorry. We only have ${currentQuanity2} items in stock`);
                shopBamazon();

            // If the current quanity is zero, then it's out of stock
            } else if (currentQuanity2 === 0){
                console.log("OUT OF STOCK");
            
            // Displays the product name, the items the user purchased by the product price, and the total amount
            } else {
                console.log("");
                console.log("------------------------------------");
                console.log(`${productName2} purchased`);
                console.log(`${inputQuanity2} @ $ ${productPrice2}`);
                console.log(`The total Price is: $ ${totalPrice}`);
                console.log("------------------------------------");

                // When the item is purchased, it decreases the number of quanities
                var updateQuanity = currentQuanity2 - inputQuanity2;
                // Updates the quanitites
                var updateQuery = `UPDATE products SET stock_quanity = ${updateQuanity} WHERE item_id = ${itemID2}`;

                connection.query(updateQuery, function (err,  resUpdate){
                    if (err) throw err;
                    console.log("---------------------------------");
                    console.log("Your order has been purchased");
                    console.log("Thanks for shopping")
                    console.log("---------------------------------");
                    connection.end();

                })
             
            }
         })
     }

     })
    
 })
    
} 

displayTable();
