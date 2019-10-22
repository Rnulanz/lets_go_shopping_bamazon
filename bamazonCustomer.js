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
    displayProducts();
});

function displayProducts(){
    connection.query("SELECT * FROM products", function(err,response){
        if(err){
            console.log(`There was an error finding your products ${err}`)
        connection.end()
        }else{
            // console.log(response)
            console.log("\n========================================\n")
            for(var i = 0; i < response.length; i++){
                console.log(`${response[i].id} : ${response[i].product_name} - $${response[i].price}`)
            }
        }
        customerPrompt();
    })
}

function customerPrompt(){
    connection.query("SELECT * FROM products", function(err,response){
        if(err) throw err
        inquirer
        .prompt([
            {
                type: "list",
                message: "Please selected the product ID that you would like to purchase. The information is located above.",
                choices: [1,2,3,4,5,6,7,8,9,10],
                name: "userChoice"
            },
            {
                type: "input",
                message: "How many items would you like to purchase",
                name: "productAmount"
            }
            ]).then(function(answer){
                for(var i = 0; i < response.length; i++){
                    if(response[i].id === answer.userChoice){
                        var customerChoice = response[i];
                    };
                };
                if(customerChoice.stock_quantity < parseInt(answer.productAmount)){
                    console.log("\n================================================");
                    console.log(`Sorry we do not have enough of that item in stock, we only have ${customerChoice.stock_quantity} of item ${answer.userChoice}`);
                    console.log("\n================================================");
                    connection.end();
                }else{
                    var newQuantityAmount = customerChoice.stock_quantity - parseInt(answer.productAmount);

                    connection.query(
                        "UPDATE products SET ? WHERE ?",[
                            {
                                stock_quantity: newQuantityAmount
                            },
                            {
                                id: customerChoice.id
                            }
                        ],
                        function(err){
                            if(err){
                                console.log(`There was an error finding your products ${err}`)
                                connection.end()
                            }else{
                                var total = customerChoice.price * parseInt(answer.productAmount);
                                console.log(`\n============================================\n`);
                                console.log(`Your total is $${total}`);
                                console.log(`Thank you for your purchase.`);
                                console.log(`We have ${newQuantityAmount} items left if you would like to purchase more of item ${customerChoice.id}`)
                                console.log(`\n============================================\n`)
                                connection.end();
                            }
                        }
                    )
                }
            })
    })
}