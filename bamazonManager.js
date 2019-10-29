// imports the installation then stores it in a variable
require("dotenv").config();

var mysql = require ("mysql");

var inquirer = require("inquirer");

var Table = require("cli-table2");

// Conncects the mySQL
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: process.env.DB_PASS,
    database: "bamazon"

});

var displayTable = function(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;

        // Set up the table
        var tableBamazon = new Table({
            head: ["Item Id", "Product Desciption","Department", "Cost", "Quanity"],
            colWidths:[12, 50, 45, 10, 10],
            colAligns:["center", "left", "left", "right", "center"],
            style:{
                head:["green"],
                compact:true
            }
        })

        // For loop is used to capture the list of items
        for(var i = 0; i < res.length; i++){
            var itemID = res[i].item_id;
            var productName = res[i].product_name;
            var department = res[i].department_name
            var productPrice = res[i].price;
            var currentQuanity = res[i].stock_quanity;
            tableBamazon.push([itemID, productName, department, productPrice, currentQuanity]);
        }
        // Displays the table
        console.log(tableBamazon.toString());
    })
}

    connection.connect(function(err){
      if (err) throw err;
      inventory();
    })

    // Lists a menu of options 
    var inventory = function(){
    inquirer.prompt([
        {
            name:"options",
            type: "list",
            message: "Choose The Selection Below",
            choices: ["View Products For Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
        }

    ]).then(function(managerChoice){
        managerChoice = managerChoice.options;
        managerSelection(managerChoice);   
    });

    }


    // A function that allows a manager to choose an option
    function managerSelection(managerChoice){

        switch(managerChoice){
            // Shows the table of every item: itemIDs, product names, prices, stock units
            case "View Products For Sale":
            displayTable()
            break;

            // When the item has less than 5 quanities
            case "View Low Inventory":
            checkLowInventory()
            break;

            // Adds more quanities
            case "Add to Inventory":
            addInventory()
            break;

            // Adds new product to the table.
            case "Add New Product":
            addNewProduct()
            break;

            case "EXIT":
            connection.end()
            break;

            default:
        }

    }

    // Checks to see if the inventory is less than 5 quanities
    var checkLowInventory = function (){
        inquirer.prompt([
            {
                name:"selectInventoryID",
                message:"Which Product Do You Like To Check?",
                type:"input"

            }
        ]).then(function(managerChoice2){
            var managerPick = managerChoice2.selectInventoryID;
            var selectQuery = "SELECT * FROM products WHERE item_id=?";
            connection.query(selectQuery, managerPick, function(err, res){
                if (err) throw err;
                var productName2 = res[0].product_name;
                var currentQuanity2 = res[0].stock_quanity;
                // If the doesn't pick the ID number listed below, it returns a zero.
                // In other words, it displays a message that the ID doesn't exist
                if (res.length === 0){
                    console.log("That ID doesn't exist. Please select the ID below")
                    checkLowInventory();

                 // If the product is less than 5 units, then it displays the message that the stock is low
                } else if (currentQuanity2 < 5){
                    console.log("WARNING: LOW INVENTORY! RESTOCK IMMEDIATELY");
                    checkLowInventory();
                    connection.end();
                // If the product has 0 units, then it displays the message that it is out of stock.
                } else if(currentQuanity2 === 0){
                    console.log("OUT OF STOCK! RESTOCK IMMEDIATELY!!!")
                    checkLowInventory();
                } else {
                    // If the product has more than 5 units, then it displays the message that it is good standing
                    console.log(productName2 + " IS IN GOOD STANDING");
                    checkLowInventory();
                    connection.end();

                 }


        })

       })


    }

    // Function that allows the user, or manager, to add the inventory
    var addInventory = function (){
        
        inquirer.prompt([
            {
                name:"selectInventoryID",
                message:"Which Product Do You Like To Check?",
                type:"input"

            },
            {
                name:"inputQuanity",
                message: "How Much Do You Like To Add?",
                type:"input"
            },

        ]).then(function(managerChoice3){
            var managerAddPick = managerChoice3.selectInventoryID;
            var updateInventoryQuery = `UPDATE products SET stock_quanity = ${updateQuanity} WHERE item_id = ${itemSelect}`;
            connection.query(updateInventoryQuery, managerAddPick, function(err, res){
                if (err) throw err;
                
                if (res.length === 0){
                    console.log("That ID doesn't exist. Please select the ID")
                    addInventory();
                } else {
                    // Displays the message in the terminal that the product is selected to add more quanities
                    // And it displays the new quanity number
                    console.log("-----------------------------------------");
                    console.log(`${productName2} is Selected`);
                    console.log(`${managerChoice3.inputQuanity} has been added to ${productName2} `);
                    console.log(`The new quanity for ${productName2} is ${updateQuanity} units.`)
                    console.log("-----------------------------------------");
                    displayTable();
                    var productName2 = res[0].product_name;
                    var currentQuanity3 = res[0].stock_quanity;
                    var updateQuanity = currentQuanity3 + managerChoice3.inputQuanity;
                    var itemSelect = res[0].item_id;
    

                }


           });

       })


    }

// Function that allows the user to add a new product to the table
var addNewProduct = function(){
    inquirer.prompt([
        {
            name:"newProduct",
            type:"input",
            message: "What New Product Do You Want To Add?"
        },
        {
            name:"newDepartment",
            type:"input",
            message: "What's The Department For The New Product?"
        },
        {
            name:"newPrice",
            type:"input",
            message: "What's The Price of The New Product?"
        },
        {
            name:"newProductQuanity",
            type:"input",
            message: "How Many Units For The New Product?"
        }    
        
    ]).then(function(managerInputs){
         var newProductName = managerInputs.newProduct;
         var newProductPrice = managerInputs.newPrice
         var newProductDepartment = managerInputs.newDepartment;
         var newStockQuanity = managerInputs.newProductQuanity;
         var updateQuery = `INSERT INTO products (product_name, department_name, price, stock_quanity)
                            VALUES("${newProductName}", "${newProductDepartment}", ${newProductPrice}, ${newStockQuanity})`

        // Displays the updated table
        connection.query(updateQuery, function(err, res){
            if (err) throw err;
            console.log("Product Added!!!")
            displayTable();
            connection.end();

        })

    })
}








