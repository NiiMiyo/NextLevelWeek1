// Popular o campo de Estados
function populateUf() {
	// const pra criar uma variável final (imutável)
	const ufSelect = document.querySelector("select[name=uf]");

	fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
		.then((res) => res.json()) // Como executa apenas um comando eu posso tirar as chaves que fazem o bloco de código
		.then((states) => {
			// Foreach de "states"
			for (state of states) {
				// Pegar o HTML do objeto e adicionar coisa nele
				// Precisa ser com crase pra eu poder usar um ".format"
				ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`;
			}
		});
}

// Popular o campo de Cidades de acordo com o estado selecionado
function getCities(event) {
	const citySelect = document.querySelector("select[name=city]");
	const stateInput = document.querySelector("input[name=state]");

	// Limpar as opções de cidade porque se não ele só adiciona toda vez que mudar o estado
	// e vai ficar cidade do estado errado
	citySelect.disabled = true;
	citySelect.innerHTML = "<option value>Selecione a cidade</option>";

	const ufValue = event.target.value;

	const selectedStateIndex = event.target.selectedIndex;
	stateInput.value = event.target.options[selectedStateIndex].text;

	const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`;

	fetch(url)
		.then((res) => res.json())
		.then((cities) => {
			for (city of cities) {
				citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`;
			}

			citySelect.disabled = false;
		});
}

// Array com os itens selecionados
let selectedItems = [];

// Variável pra mexer no input escondido dos itens selecionados
const collectedItems = document.querySelector("input[name=items]");

// Gerencia o que acontece quando se clica na box de item
function handleSelectedItem(event) {
	const itemLi = event.target;

	// Adiciona ou remove uma classe
	// Se já tiver a classe ele remove e se não tiver ele adiciona
	itemLi.classList.toggle("selected");

	const itemId = itemLi.dataset.id;
	console.log("itemId: ", itemId);

	// Procura e retorna o index do item
	const alreadySelected = selectedItems.findIndex((item) => {
		return item == itemId;
	});

	// Se o item existir na lista a gente vai tirar
	if (alreadySelected != -1) {
		const removeIndex = selectedItems.indexOf(itemId);
		selectedItems.splice(removeIndex, 1);

		// Código zoado do cara do vídeo
		/*
		const filteredItems = selectedItems.filter((item) => {
			return item != itemId;
		});

		selectedItems = filteredItems;
		*/
	}
	// Se não existir a gente coloca lá
	else {
		// Append
		selectedItems.push(itemId);
	}

	console.log("selected: ", selectedItems);

	// Agora atualizar o input escondido lá do HTML
	collectedItems.value = selectedItems;
}

// Executar ao carregar a página ------------------------------------------------------------------------
document
	// Pega o campo Select que tiver name = uf
	.querySelector("select[name=uf]")
	// Quando aquele campo mudar de valor ele vai executar a getCities
	.addEventListener("change", getCities);

populateUf();

// Adiciona um Listener de clicks nas li
const itemsToCollect = document.querySelectorAll(".items-grid li");
for (const item of itemsToCollect) {
	item.addEventListener("click", handleSelectedItem);
}
