const express = require("express");
const server = express();

// Pegar nosso banco de dados
const db = require("./database/db.js");

// Configurar pasta pública pra ter acesso sem precisar de /public/path/file.ext
server.use(express.static("public"));

// Habilitar o uso do 'req.body' na Aplicação
server.use(express.urlencoded({ extended: true }));

// Configurando uma Template Engine (Nunjucks) pra usar lógica dentro do HTML
const nunjucks = require("nunjucks");
nunjucks.configure("src/views", {
	express: server,
	noCache: true,
});

// Criando a tabela do banco de dados caso não exista uma
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

// Configurar os caminhos da aplicação
// Caminho da home (localhost:3000/)
server.get("/", (req, res) => {
	// Devolve como resposta o nosso arquivo .html
	return res.render("index.html");
});

// Caminho do create-point (localhost:3000/create-point)
server.get("/create-point", (req, res) => {
	// req = requisição/pedido
	// res = resposta;

	// Devolve como resposta o nosso arquivo .html
	return res.render("create-point.html");
});

server.get("/search", (req, res) => {
	const searchString = req.query.search;

	if (searchString == "") {
		// Pesquisa vazia
		// Envia nenhum dado
		return res.render("search-results.html", {
			total: 0,
		});
	}

	// Pegar os dados do Banco de Dados para serem jogados no HTML
	db.all(
		`SELECT * FROM places WHERE city LIKE '%${searchString}%'`,
		function (err, rows) {
			if (err) {
				return console.log(err);
			}

			//console.log("Registros::");
			//console.log(rows);

			const total = rows.length;

			// Envia os dados da rows como objeto
			return res.render("search-results.html", {
				places: rows,
				total, // O mesmo que "total: total", pois o valor e o nome do objeto são iguais
			});
		}
	);
});

// Caminho do verbo POST do create-point (localhost:3000/save-point) (Não pode ser acessado por meios normais)
// POST = Verbo usado para simbolizar uma entrada de dados no backend
server.post("/save-point", (req, res) => {
	// Inserir os dados enviados no formulário no Banco de Dados (Ver 'src/database/db.js')
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
		req.body.image,
		req.body.name,
		req.body.address,
		req.body.address2,
		req.body.state,
		req.body.city,
		req.body.items,
	];

	function afterInsertData(err) {
		if (err) {
			console.log(err);
			return res.send("Erro no cadastro");
		}

		console.log('Cadastrado novo ponto "', values.name, '"');
		// console.log(values);

		res.render("create-point.html", { saved: true });
	}

	db.run(query, values, afterInsertData);
});

// Ligar o servidor na porta 3000
server.listen(3000);

/* ANOTAÇÕES ============
	Verbo GET = Usado por padrão pelo navegador para acessar uma página
		Dá a ideia de enviar dados do Backend para o Frontend
	
	Verbo POST = Só pode ser acesso através do próprio HTML/JavaScript
		Dá a ideia de enviar dados do Frontend para o Backend

	req = requisição/pedido
	res = resposta;

	req.query() => Usada para pegar as Query Strings
		Query Strings são os argumentos na url
		Ex.: url.com/path?QueryString1=Value1&QueryString2=Value2
	
	req.body() => Usada para pegar o corpo de uma requisição
		Desabilitada por padrão pelo Express (Ver linha 10)
	
	res.send(String) => Usada para enviar uma String de volta para o Frontend
		Não vai enviar uma página HTML
	
	res.sendFile(String) => Usada para enviar um arquivo de volta para o Frontend
		Pode enviar uma página HTML, porém não deve ser usada em conjunto com o Express
	
	res.render(String) => Usada para enviar um arquivo de volta para o Frontend
		Pode enviar uma página HTML e DEVE ser usada com o Express
*/
