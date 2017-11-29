var inquirer = require("inquirer");
require('console.table');
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'bamazon'
});



connection.connect(function(err) {

	if (!err) {
		prompt();
	}

});


function prompt() {

	inquirer
		.prompt([{
				type: "list",
				message: "What would you like to do?",
				choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
				name: "result"
			}

		]).then(function(choice) {

			var action = choice.result;

			switch (action) {
				case "View Products for Sale":
					view();
					break;

				case "View Low Inventory":
					lowInventory();
					break;

				case "Add to Inventory":
					addInv();
					break;

				case "Add New Product":
					addProd();
					break;
				case "Quit":
					quit();
					break;

			}

		});

}

function view() {
	connection.query('SELECT * FROM products', function(error, results) {
		if (error) throw error;
		console.table(results);
		prompt();
	});
}

function lowInventory() {
	connection.query('SELECT * FROM products WHERE stock_quantity < "20"', function(error, results) {
		if (error) throw error;
		console.table(results);
		prompt();
	});
}

function addInv() {
	var prods = [];

	connection.query('SELECT * FROM products', function(error, results) {
		if (error) throw error;
		for (var i = 0; i < results.length; i++) {
			prods.push(results[i].product_name);
		}

		inquirer
			.prompt([{
					type: "list",
					message: "What item would you like to more inventory to?",
					choices: prods,
					name: "inv"
				}, {
					type: "input",
					message: "How many would you like to add",
					name: "quant"
				}

			]).then(function(choice) {

				connection.query('UPDATE products SET stock_quantity=stock_quantity+? WHERE product_name=?', [choice.quant, choice.inv], function(error, results) {
					// setTimeout(view, 1000);
					view();
				});

			});
	});
}

function addProd() {
	inquirer.prompt([
		{
			type: "input",
			message: "What item would you like to add?",
			name: "product_name"
		}, 
		{
			type: "input",
			message: "What is the department of the item?",
			name: "department_name"
		},		
		{
			type: "input",
			message: "What is the price of the item?",
			name: "price"
		},
		{
			type: "input",
			message: "How many items do you want to add?",
			name: "stock_quantity"
		} 		   
	]).then(function(data) {

		connection.query('INSERT INTO products SET ?', data, function(error, results) {
			if (error) throw error;
			view();
		});


	});

}


function quit() {
	connection.end();
	console.log("Thanks for using bAmazon Manager");
}