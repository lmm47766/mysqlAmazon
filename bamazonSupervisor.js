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
				choices: ["View Products info by Department", "Create New Department","Quit"],
				name: "result"
			}

		]).then(function(choice) {

			var action = choice.result;

			switch (action) {
				case "View Products info by Department":
					view();
					break;

				case "Create New Department":
					createDepartment();
					break;

				case "Quit":
					quit();
					break;

			}

		});

}



function view() {
	var query = "SELECT products.department_name, SUM(product_sales) AS product_sales, sum(departments.over_head_cost) AS over_head_cost,"
	+" SUM(product_sales)-SUM(departments.over_head_cost) AS total_profit FROM products "+
	"RIGHT JOIN departments ON products.department_name = departments.department_name GROUP BY products.department_name";
	connection.query(query, function(error, results) {
		if (error) throw error;
		console.table(results);
		prompt();
	});
}

function createDepartment() {
	inquirer.prompt([
		{
			type: "input",
			message: "What department would you like to add?",
			name: "department_name"
		}, 
		{
			type: "input",
			message: "What is the over head cost of the department?",
			validate: function(value) {
			if (value.length>0 && !isNaN(value)) {
			  start = value;
			  return true;
			}
			  return false;
			}, 				
			name: "over_head_cost"
		},
		{
			type: "input",
			message: "What item would you like to add from that department?",
			name: "product_name"
		}, 		
		{
			type: "input",
			message: "What is the price of the item?",
			validate: function(value) {
			if (value.length>0 && !isNaN(value)) {
			  start = value;
			  return true;
			}
			  return false;
			}, 			
			name: "price"
		},
		{
			type: "input",
			message: "How many items do you want to add?",
			validate: function(value) {
			if (value.length>0 && !isNaN(value)) {
			  start = value;
			  return true;
			}
			  return false;
			},		
			name: "stock_quantity"
		} 				   
	]).then(function(data) {

		connection.query('INSERT INTO products SET ?', [
		{
			product_name: data.product_name,
			department_name: data.department_name,
			price: data.price,
			stock_quantity: data.stock_quantity,

		}], function(error, results) {
			if (error) throw error;
			connection.query('INSERT INTO departments SET ?', 
				[{
					department_name: data.department_name,
					over_head_cost: data.over_head_cost
				}], function(error, results) {
					if (error) throw error;
					setTimeout(view, 1000);
				});

		});


	});
}

function quit() {
	connection.end();
	console.log("Thanks for using bAmazon Supervisor");
}



