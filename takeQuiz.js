let takeQuizButton = document.getElementById("takeQuizButton");
let searchContainer = document.getElementById("searchContainer");
let resultContainer = document.getElementById("resultContainer");

let count = 5;

takeQuizButton.addEventListener("click", loadQuizPage);

function loadQuizPage() {
	searchContainer.innerHTML = "";
	resultContainer.innerHTML = "";
	fetchAllChampions();
}

function fetchAllChampions() {
	fetch(
		"http://ddragon.leagueoflegends.com/cdn/12.9.1/data/en_US/champion.json"
	)
		.then((res) => res.json())
		.then((allData) => {
			console.log(allData.data);
			let data = allData.data;
			let champKeyList = Object.keys(data);
			let champIndices = generateRandomNumbers(champKeyList.length);
			let randChampNames = champIndices.map((ind) => champKeyList[ind]);
			let randChampList = randChampNames.map((n) => data[n]);
			return randChampList;
		})
		.then((list) => getRandomizedSkin(list));
}

function generateRandomNumbers(max) {
	let numbers = [];
	let i = 0;
	while (i < count) {
		numbers.push(Math.floor(Math.random() * max));
		i++;
	}
	return numbers;
}

function getRandomizedSkin(champList) {
	console.log(champList);
	champList.forEach((champ) => {
		// let skinRootUrl = `http://ddragon.leagueoflegends.com/cdn/img/champion/centered/${champName}_${skin.num}.jpg`;
		fetch(
			`http://ddragon.leagueoflegends.com/cdn/12.9.1/data/en_US/champion/${champ.id}.json`
		)
			.then((res) => res.json())
			.then((data) => data.data[champ.id].skins);
		// let randSkinIds = generateRandomNumbers();
	});
}
