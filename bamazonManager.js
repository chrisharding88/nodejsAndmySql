// imports the installation then stores it in a variable
var mysql = require ("mysql");

var inquirer = require("inquirer");

var Table = require("cli-table2");

// Conncects the mySQL
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "CHmySQL1988#",
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
    function managerSelection(managerChoice){

        switch(managerChoice){

            case "View Products For Sale":
            displayTable()
            break;

            case "View Low Inventory":
            checkLowInventory()
            break;

            case "Add to Inventory":
            addInventory()
            break;

            case "Add New Product":
            addNewProduct()
            break;

            case "EXIT":
            connection.end()
            break;

            default:
        }

    }

    
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
                if (res.length === 0){
                    console.log("That ID doesn't exist. Please select the ID from 1 to 10")
                    checkLowInventory();
                 // If the product is less than 5 units, then it displays the message that the stock is low
                } else if (currentQuanity2 < 5){
                    console.log("WARNING: LOW INVENTORY! RESTOCK IMMEDIATELY");
                    checkLowInventory();
                    connection.end();
                 } else {
                    console.log(productName2 + " IS IN GOOD STANDING");
                    checkLowInventory();
                    connection.end();

                 }


        })

       })


    }

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
                    console.log("That ID doesn't exist. Please select the ID from 1 to 10")
                    addInventory();
                 // If the product is less than 5 units, then it displays the message that the stock is low
                } else {
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

        connection.query(updateQuery, function(err, res){
            if (err) throw err;
            console.log("Product Added!!!")
            displayTable();
            connection.end();

        })

    })
}








