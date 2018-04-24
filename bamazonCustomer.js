var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("cli-table");
var color = require("colors");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "",
  database: "bamazon_DB"
});

connection.connect(function (err) {
  if (err) throw err;
  
  displayItems();
});
function displayItems(){
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    
    // var table = new Table({
    //   head: ['TH 1 label', 'TH 2 label']
    //   , colWidths: [100, 200]
    // });

    // // table is an Array, so you can `push`, `unshift`, `splice` and friends 
    // table.push(
    //   ['id', 'product_name', 'department', 'price', 'stock_quantity']
    //   , ['id', 'product_name', 'department', 'price', 'stock_quantity']
    // );

    console.log(table.toString());

    // Log all results of the SELECT statement
    console.log(res);
    start();
  });
}
// function which prompts the user for what action they should take
function start() {

  inquirer
    .prompt([
      {
        name: "idRequest",
        type: "input",
        message: "What is the item ID of the item you want?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to purchase?"
      }
    ])
    .then(function (answer) {
      console.log(answer);
      var itemID = answer.idRequest;
      var quantityNo = answer.quantity;

      connection.query("SELECT * FROM products WHERE id = ?", itemID ,function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res, "res");
        console.log(res[0].stock_quantity, "Our stock");
        if (!res.length) {
          console.log("ID is invalid.");
        start();
        }else if (res[0].stock_quantity >= quantityNo){
          console.log("You have purchased " + quantityNo + " " + res[0].product_name + "(s) at $" + res[0].price + " each." );
        }else {
          console.log("Insufficient quantity!");
          start();
        }
      });
    });
    // var newQuanity = stock_quantity - quantityNo;

    // connection.query("DELETE ? FROM products WHERE id = ?", quantityNo, function(err,res){
    //   if (err) throw err;
    //   console.log(newQuantity);
    // // }else {
    // // console.log("Inventory has changed")
    // }
}
