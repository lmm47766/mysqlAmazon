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
		display();
	}

});



function display() {
	connection.query('SELECT * FROM products', function(error, results, fields) {
		if (error) throw error;
		console.table(results);
		setTimeout(prompt, 1000);
	});
}


function prompt() {
	inquirer
		.prompt([{
			type: "input",
			message: "Enter the product ID of item you want to purchase: ",
			validate: function(value) {
				if (!isNaN(value) && value > 1) {
					return true;
				}
				return false;
			},
			name: "product_id"
		}, {
			type: "input",
			message: "How many would you like to purchase: ",
			validate: function(value) {
				if (!isNaN(value) && value > 1) {
					return true;
				}
				return false;
			},
			name: "quantity"
		}]).then(function(data) {

			connection.query('SELECT * FROM products where item_id=?', [data.product_id], function(error, results, fields) {

				if (data.quantity > parseInt(results[0].stock_quantity)) {
					console.log('Insufficient quantity!')
				} 
				else {
					connection.query('UPDATE products SET stock_quantity=?, product_sales=product_sales+? WHERE item_id=?', [parseInt(results[0].stock_quantity) - data.quantity, parseInt(data.quantity) * results[0].price, data.product_id], function(error, results, fields) {
						console.log("Purchase complete");
						setTimeout(buyAgain, 1000);

					});
				}
			});


		});
}

function buyAgain() {
	inquirer.prompt({
		type: "confirm",
		name: "again",
		message: "Would you like to make another purchase?"
	}).then(function(answer) {


		if (answer.again === true) {
			display();
		} 
		else {
			console.log("Thank you for shopping!");
			connection.end();
		}
	});
}