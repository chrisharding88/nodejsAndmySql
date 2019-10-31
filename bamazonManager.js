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
        });

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

    // Once it connects bamazonManager.js, it starts with the list of options the manager is going to pick
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
            connection.end();
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
            var viewLowStockQuery = "SELECT * FROM products WHERE stock_quanity < 5";
           
            connection.query(viewLowStockQuery,  function(err, res){
                if (err) throw err;
                var lowInventoryTable = new Table({
                    head: ["Item Id", "Product Desciption","Department", "Cost", "Quanity"],
                    colWidths:[12, 50, 45, 10, 10],
                    colAligns:["center", "left", "left", "right", "center"],
                    style:{
                        head:["green"],
                        compact:true
                    }
                });
                for (var i = 0; i< res.length; i++){
                    var itemID = res[i].item_id;
                    var productName = res[i].product_name;
                    var department = res[i].department_name
                    var productPrice = res[i].price;
                    var currentUnits = res[i].stock_quanity;
                    lowInventoryTable.push([itemID, productName,department, productPrice, currentUnits]);
                }
                // If the doesn't pick the ID number listed below, it returns a zero.
                // In other words, it displays a message that the ID doesn't exist
                if (currentUnits < 5){
                    console.log ("HERE ARE THE PRODUCTS THAT ARE LOW IN QUALITY:");
                    console.log(lowInventoryTable.toString())
                    connection.end();

                } else {
                    console.log("You don't have any products that are low in inventory")
                    connection.end();
                }

             


        })

       


    }

    // Function that allows the user, or manager, to add the inventory
    var addInventory = function (){
        
        inquirer.prompt([
            {
                name:"selectInventoryID",
                message:"Which Product Do You Like To Add More Units?",
                type:"input"

            },
            {
                name:"inputQuanity",
                message: "How Much Do You Like To Add?",
                type:"input"
            },

        ]).then(function(managerAddUnits){
            var managerAddPick = managerAddUnits.selectInventoryID;
            var managerInputQuanity = managerAddUnits.inputQuanity;
            var updateInventoryQuery = `SELECT * FROM products WHERE item_id = ${managerAddPick}`;
            connection.query(updateInventoryQuery, managerAddPick, function(err, res){
                if (err) throw err;

                if (res.length === 0){
                    console.log("That ID doesn't exist. Please select the ID")
                    addInventory();
                } else {
                    var addQuanityTable = new Table({
                        head: ["Item Id", "Product Desciption","Department", "Cost", "Quanity"],
                        colWidths:[12, 50, 45, 10, 10],
                        colAligns:["center", "left", "left", "right", "center"],
                        style:{
                            head:["green"],
                            compact:true
                        }
                    });
                    for (var i = 0; i< res.length; i++){
                        var itemID = res[i].item_id;
                        var productName = res[i].product_name;
                        var department = res[i].department_name
                        var productPrice = res[i].price;
                        var currentUnits = res[i].stock_quanity;
                        addQuanityTable.push([itemID, productName,department, productPrice, currentUnits]);
                    }
                      var updateQuanity = parseInt(currentUnits) + parseInt(managerInputQuanity);

                    // Displays the message in the terminal that the product is selected to add more quanities
                    // And it displays the new quanity number
                    console.log("-----------------------------------------");
                    console.log(`${productName} is Selected`);
                    console.log(`${managerInputQuanity} has been added to ${productName} `);
                    console.log(`The new quanity for ${productName} is ${updateQuanity} units.`)
                    console.log("-----------------------------------------");
                    console.log(addQuanityTable.toString());
                    connection.end();
            
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








