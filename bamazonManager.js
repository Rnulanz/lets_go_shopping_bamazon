require('dotenv').config();
var mysql = require("mysql");
var inquirer = require('inquirer')

var connection = mysql.createConnection({
    host: "localhost",
    port:3306,
    user: process.env.mysql_User,
    password: process.env.mysql_Password,
    database: "letsGoShopping_db"
});

connection.connect(function(err){
    if(err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    managerMenu();
});
function createChoicesArray(res){
    let arrayID = [];
    for(var i in res)
        arrayID.push(`${res[i].id} : ${res[i].product_name} - ${res[i].stock_quantity}`);
    return arrayID;
};

function managerMenu(){
    inquirer
    .prompt([
        {
            type: "rawlist",
            message: "What would you like to review?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            name: "managerChoice"
        }
    ]).then(function(response){
        switch(response.managerChoice){
            case "View Products for Sale":
                productsForSale()
                break;
            case "View Low Inventory":
                lowInventory()
                break;
            case "Add to Inventory":
                addToInventory()
                break;
            case "Add New Product":
                newProduct()
                break;
            case "Exit":
                console.log(`Thank you for coming, have a great day.`)
                connection.end()
            break
        }
    })
}

function productsForSale(){
    connection.query("SELECT * FROM products", function(err, response) {
        if (err) throw err;
        var productArray = [];
            for (var i = 0; i < response.length; i++) {
            productArray.push(`${response[i].id} : Product:${response[i].product_name} - Price:${response[i].price} - Quantity:${response[i].stock_quantity}`);
            }
            console.log(productArray)
    })
    connection.end();
}

function lowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 30", function(err, response){
        if(err) throw err;
        var lowProducts = [];
        for(var i = 0; i < response.length; i++){
            lowProducts.push(`${response[i].id} : Product:${response[i].product_name} - Price:${response[i].price} - Quantity:${response[i].stock_quantity}`)
        }
        console.log(lowProducts)
    })
    connection.end();
}

function addToInventory(){
    connection.query("SELECT * FROM products", function(err, response){
        if(err) throw err;
        inquirer
        .prompt([
            {
                type: "rawlist",
                message: "What product would you like to add stock to?",
                choices: createChoicesArray(response),
                name: "managerProduct"
            },
            {
                type: "number",
                message: "How much product would you like to add to the stock quantity?",
                name: "stockIncrease"
            }
        ]).then(function(answer){
            var managerChoice;
            for(var i = 0; i < response.length; i++){
                if(response[i].id === parseInt(answer.managerProduct)){
                    managerChoice = response[i];
                }
            }

            var newStockAmount = managerChoice.stock_quantity + parseInt(answer.stockIncrease);

            connection.query(
                "UPDATE products SET ? WHERE ?",[
                    {
                        stock_quantity: newStockAmount
                    },
                    {
                        id: managerChoice.id
                    }
                ],
                function(err){
                    if(err) throw err;
                    console.log(`${managerChoice.product_name} has a new stock quantity of ${newStockAmount}`)
                    connection.end();
                }
            )
        })
    })
}

function newProduct(){
    inquirer
    .prompt([
        {
            type: "input",
            message: "What product would you like to add?",
            name: "newProduct"
        },
        {
            type: "input",
            message: "What department would you like to add the new product to?",
            name: "newDept"
        },
        {
            type: "number",
            message: "What price would you like for the new product?",
            name: "newPrice"
        },
        {
            type: "number",
            message: "How much of the new product would you like to add?",
            name: "newQuantity"
        }
    ]).then(function(answer){
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answer.newProduct,
                dept_name: answer.newDept,
                price: answer.newPrice || 0,
                stock_quantity: answer.newQuantity || 0
            },
        function(err){
            if(err) throw err;
            console.log('Your product has been add to the inventory.')
            connection.end()
        }
        )
    })
}

