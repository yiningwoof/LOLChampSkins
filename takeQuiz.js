let takeQuizButton = document.getElementById("takeQuizButton");
let searchContainer = document.getElementById("searchContainer");
let resultContainer = document.getElementById("resultContainer");

let count = 5;

let quizPayload = {};

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
			let data = allData.data;
			let champKeyList = Object.keys(data);
			let champIndices = generateRandomNumbers(champKeyList.length);
			let randChampNames = champIndices.map((ind) => champKeyList[ind]);
			let randChampList = randChampNames.map((n) => data[n]);
			return randChampList;
		})
		.then((list) => getSkinList(list));
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

async function getSkinList(champList) {
	champData = {}; // champData = { champId: {champDisplayName: "", sanitizedSkins: [{skin}] }}
	for (let i = 0; i < champList.length; i++) {
		champData[champList[i].id] = await getSanitizedSkinForChamp(champList[i]);
	}
	generateQuizPayload(champData);
}

async function getSanitizedSkinForChamp(champ) {
	let payload = await fetch(
		`http://ddragon.leagueoflegends.com/cdn/12.9.1/data/en_US/champion/${champ.id}.json`
	)
		.then((res) => res.json())
		.then((data) => {
			let champData = {};
			champData["champDisplayName"] = champ.name;

			let skins = data.data[champ.id].skins;
			let champNameLength = champ.name.length;

			// sanitize skin list to filter out skins with name not ending with champ name, including "default"
			let sanitizedChampSkinList = skins.filter(
				(s) => s.name.slice(s.name.length - champNameLength) === champ.name
			);
			champData["sanitizedSkins"] = sanitizedChampSkinList;
			return champData;
		});
	return payload;
}

function generateQuizPayload(champData) {
	resultContainer.innerHTML = "";
	let matchingContainer = createEle("div");
	resultContainer.appendChild(matchingContainer);
	let cardsContainer = document.createElement("div");
	// resultContainer.appendChild(cardsContainer);
	for (let champId in champData) {
		let randSkinIndex = Math.floor(
			Math.random() * champData[champId].sanitizedSkins.length
		);
		console.log("champData:", champData);
		console.log("sanitizedSkins:", champData[champId].sanitizedSkins);
		console.log("randSkinIndex:", randSkinIndex);

		let randSkinNum = champData[champId].sanitizedSkins[randSkinIndex].num;

		let skinContainer = createEle((tag = "div"));
		resultContainer.append(skinContainer);

		let skin = createEle((tag = "div"));
		skinContainer.append(skin);

		let imgSrc = `http://ddragon.leagueoflegends.com/cdn/img/champion/centered/${champId}_${randSkinNum}.jpg`;
		let img = createEle("img", undefined, undefined, undefined, imgSrc);
		skin.appendChild(img);

		let skinNameEmptyContainer = createEle(
			"div",
			undefined,
			"skinNameEmptyContainer"
		);
		skinContainer.append(skinNameEmptyContainer);

		let skinChampName = champData[champId].sanitizedSkins[randSkinIndex].name;

		let skinName = skinChampName.slice(
			0,
			skinChampName.length - champData[champId].champDisplayName.length - 1
		);
		let skinNameCard = createEle("div", "skinNameCard", undefined, skinName);
		cardsContainer.appendChild(skinNameCard);

		let champName = champData[champId].champDisplayName;
		let champNameCard = createEle("div", "champNameCard", undefined, champName);
		cardsContainer.append(champNameCard);
		resultContainer.appendChild(cardsContainer);
	}
}

function createEle(tag, className, id, textContent, src) {
	let ele = document.createElement(tag);
	if (src !== undefined) ele.src = src;
	if (className !== undefined) ele.className = className;
	if (id !== undefined) ele.id = id;
	if (textContent !== undefined) ele.textContent = textContent;
	console.log("ele:", id);
	return ele;
}
