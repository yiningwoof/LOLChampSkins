const searchBox = document.getElementById("searchBox");
const searchButton = document.getElementById("searchButton");
const searchForm = document.getElementById("searchForm");
const skinsContainer = document.getElementById("skinsContainer");
let searchText = "";

let champId = null;
let champSkinUrlList = [];

searchForm.addEventListener("submit", () => search());
// searchButton.addEventListener("keypress", checkIfEnter);

// function checkIfEnter(e) {
// 	e.preventDefault();
// 	if (e.keyCode === 13) {
// 		search();
// 	}
// }

searchBox.addEventListener("input", (e) => {
	searchText = e.target.value;
});

async function search() {
	skinsContainer.innerHTML = ""; // clear up existing images

	let sanitizedChampName = sanitizeSearchStr();

	fetch(
		"http://ddragon.leagueoflegends.com/cdn/12.9.1/data/en_US/champion.json"
	)
		.then((res) => res.json())
		.then((allData) => {
			champId = allData.data[sanitizedChampName].key;
			populateChampContent(allData.data[sanitizedChampName]);
		});
	// fetch(
	// "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg?api_key=RGAPI-7aef0bc6-2d7a-40ac-8fd6-c077309e36dc",
	// {
	// 	method: "GET",
	// 	accept: "image/jpg",
	// 	// mode: "cors",
	// 	// "X-Riot-Token": "RGAPI-7aef0bc6-2d7a-40ac-8fd6-c077309e36dc",
	// }
	// )
	// .then((res) => res.json())
	// .then((data) => console.log(data));
}

function populateChampContent(champData) {
	const nameSpan = document.getElementById("champName");
	const titleSpan = document.getElementById("champTitle");
	const blurbSpan = document.getElementById("champBlurb");
	nameSpan.textContent = champData.id;
	titleSpan.textContent = champData.title;
	blurbSpan.textContent = champData.blurb;

	getChampSkinList(champData.id);
}

function populateSkinList(skinArray, champName = "", isQuiz = false) {
	let skinData = {};
	skinArray.forEach((skin) => {
		skinData[skin.num] = {};

		let imageType = isQuiz ? "centered" : "splash";

		let skinUrl = `http://ddragon.leagueoflegends.com/cdn/img/champion/${imageType}/${champName}_${skin.num}.jpg`;
		skinData[skin.num]["url"] = skinUrl;
		skinData[skin.num]["name"] = skin.name;
		let skinContainer = document.createElement("div");
		skinContainer.className = "skinContainer";

		let skinName = document.createElement("div");
		skinName.innerText = skin.name;
		let splashImage = document.createElement("img");
		splashImage.src = skinUrl;
		skinContainer.append(splashImage);
		isQuiz ? null : skinContainer.append(skinName);
		skinsContainer.append(skinContainer);
	});
}

async function getChampSkinList(champName) {
	fetch(
		`http://ddragon.leagueoflegends.com/cdn/12.9.1/data/en_US/champion/${champName}.json`,
		{
			method: "GET",
		}
	)
		.then((res) => res.json())
		.then((data) => populateSkinList(data.data[champName].skins, champName));
}

function sanitizeSearchStr() {
	let allLowerSplitted = searchText.split(" ").map((str) => str.toLowerCase());
	let sanitizedText = allLowerSplitted
		.map((str) => str.charAt(0).toUpperCase() + str.slice(1))
		.join("");
	console.log(sanitizedText);
	return sanitizedText;
}
