// Importar o SQLite3
const sqlite3 = require("sqlite3").verbose();

// Criar o objeto do banco de dados
const db = new sqlite3.Database("./src/database/database.db");

// Faz o módulo exportar o objeto do banco de dados (permite usar require("db.js"))
module.exports = db;

/*
// Como utilizar o banco de dados =>
db.serialize(() => {
	// Criar uma tabela com comandos SQL
	// Usa a crase pra poder quebrar a linha
	db.run(`
		CREATE TABLE IF NOT EXISTS places (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			image TEXT,
			name TEXT,
			address TEXT,
			address2 TEXT,
			state TEXT,
			city TEXT,
			items TEXT
		);
	`);

	// Inserir um dado na tabela 'places'
	const query = `
		INSERT INTO places (
			image,
			name,
			address,
			address2,
			state,
			city,
			items
		) VALUES (
			?, ?, ?, ?, ?, ?, ?
		);
	`;

	values = [
		"https://images.unsplash.com/photo-1528323273322-d81458248d40?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=801&q=80",
		"Colectoria",
		"Guilherme Gemballa, Jardim América",
		"Número 260",
		"Santa Catarina",
		"Rio do Sul",
		"Resíduos Eletrônicos, Lâmpadas",
	];

	function afterInsertData(err) {
		if (err) {
			return console.log(err);
		}

		console.log("Cadastrado");
		console.log(this);
	}

	db.run(query, values, afterInsertData);

	// Consultar um valor no banco de dados
	// Pode substituir o '*' por um campo da tabela (name, id, image, etc.)
	db.all(`SELECT * FROM places`, function (err, rows) {
		if (err) {
			return console.log(err);
		}

		console.log("Registros::");
		console.log(rows);
	});

	// Deletar o dado da tabela onde id for igual ao valor passado no próximo argumento
	db.run(`DELETE FROM places WHERE id = ?`, [1], function (err) {
		if (err) {
			return console.log(err);
		}

		console.log("Registro deletado");
	});
});
*/
