window.onload = function() {
	getCategory();
	addFavouriteCards();
};

var categories = {},
	categoryCount = 0;

//Получаем категории
function getCategory() {
	fetch('https://api.chucknorris.io/jokes/categories')
			.then(response => response.json())
			.then(json => {categories = Object.assign({},json);});
}
// Добавляем выбраные карточки
function addFavouriteCards() {
	for(let i = 0; i < localStorage.length; i++) {
		let div = document.createElement('div'),
			key = localStorage.key(i),
			result;

		if (/^selected/.test(key)) {
			div.innerHTML = localStorage.getItem(key);
			result = div.firstChild;
			document.querySelector('.favourite__name').after(result);
			addRemoveFavourite();
		}
	}
}

function on() {
	document.querySelector(".overlay").style.display = "block";
	document.querySelector('.wrapper').classList.toggle('wrapper_active');
	document.querySelector('.favourite').classList.toggle('favourite__active');
}

function off() {
	document.querySelector(".overlay").style.display = "none";
	document.querySelector('.wrapper').classList.toggle('wrapper_active');
	document.querySelector('.favourite').classList.toggle('favourite__active');
}

// Убираем выбраные карточки
function addRemoveFavourite() {
	document.querySelector('.selected__like').addEventListener('click', (like) => {
		let id = like.target.parentNode.id;

		id = id.match(/\s+\S[^]*$/).toString().trim();
		if (document.getElementById(`${id}`) !== null) {
			document.querySelector(`${id}`).childNodes[0].src = 'img/heartOff.svg';
			document.querySelector(`${id}`).childNodes[0].classList.remove('liked');
		}
		like.target.parentNode.remove();
		localStorage.removeItem(like.target.parentNode.id);
	});
}

window.addEventListener('DOMContentLoaded', () => {
	const menu = document.querySelector('.menu'),
		favourite = document.querySelector('.favourite'),
		hamburger = document.querySelector('.hamburger'),
		wrapper = document.querySelector('.wrapper'),
		form = document.querySelector('form'),
		radios = document.getElementsByName('category'),
		navigation = document.querySelector('.modes__navigation'),
		search = document.querySelector('.modes__search'),

		message = {
			loading: 'Загрузка',
			success: 'Все сработало',
			fail: 'Что-то пошло не так, попробуйте зайти позже'
		};

	hamburger.addEventListener('click', (button) => {
		if ( document.querySelector('.favourite').classList.contains('favourite__active')) {
			off();
		} else {
			on();
		}
	});

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		
		const cats = document.querySelectorAll('input[name="category"');
		let chosen;
		let filter;
		let currentCategory;
		let newCard = {};
		const formDate = new FormData(form);
		const object = {};

		for (let i = 0; i < cats.length; i++) {
			if(cats[i].checked) {
				chosen = cats[i].value;
				break;
			}
		}

		if (chosen === 'random') {
			filter = chosen;
		} else if (chosen === 'caterogies') {
			filter = `random?category=${document.querySelector('.clicked').firstChild.textContent}`;
			currentCategory = document.querySelector('.clicked').textContent;
		} else if (chosen === 'search') {
			formDate.forEach(function(value, key) {
				object[key] = value;
			});
			if (object.category != '') {
				filter = `search?query=${object.category}`;
			} else {
				alert(`Поле 'Free text search' нужно заполнить`);
				return;
			}
		}

		fetch('https://api.chucknorris.io/jokes/'+filter)
		.then(res => res.ok ? res : Promise.reject(res))
			.then(response => response.json())
			.catch(reject => alert(`Ошибка, статус ${reject.status}`))
			.then(json => {
				let object = {};

				if(json.result) {
					let rand = Math.floor(Math.random() * json.result.length);
					object = Object.assign({}, json.result[rand]);
				} else {
					object = Object.assign({}, json);
				}

				let t = Date.parse(new Date()) - Date.parse(object.updated_at);
				t = (Math.floor((t/(1000*60*60))));

				let card = document.createElement('div'),
					like = document.createElement('img'),
					cardFrame = document.createElement('div'),
					cardId = document.createElement('div'),
					cardIcon = document.createElement('img'),
					cardIconLink = document.createElement('img'),
					cardContent = document.createElement('div'),
					cardCategory = document.createElement('div'),
					link = document.createElement('a'),
					cardDate = document.createElement('div'),
					subcontent = document.createElement('div');
					
					
				card.className = 'card';
				card.id = object.id;
				like.className = 'card__like';
				cardFrame.className = 'card__frame';
				cardId.className = 'card__id';
				cardIcon.className = 'card__icon';
				cardContent.classList = 'card__content';
				cardCategory.classList = 'card__category';
				cardDate.classList = 'card__date';
				subcontent.classList = 'card__subcontent';
				cardIconLink.classList = 'card__iconlink';

				cardIcon.src = 'img/cardIcon.svg';
				like.src = 'img/heartOff.svg';
				like.alt = 'like';
				cardId.textContent = 'ID:';
				cardIcon.alt = 'card-icon';
				link.textContent = object.id;
				link.href = object.url;
				link.target = "_blank";
				cardContent.textContent = object.value;
				cardDate.textContent = `Last update: ${t} hours ago`;
				cardCategory.textContent = currentCategory;
				cardIconLink.src = 'img/link.png';


				card.append(like);
				cardId.append(link,cardIconLink);
				subcontent.append(cardDate, cardCategory);
				cardFrame.append(cardId, cardIcon, cardContent);
				card.append(like,cardFrame, subcontent);

				document.querySelector('.modes').after(card);
				addFavourite();
			})
			.finally(() => {
				form.reset();
			});
	});

	function addFavourite() {
			document.querySelector('.card__like').addEventListener('click', (button) => {
				let likedCard = button.target.parentNode;

				if (button.target.classList.contains('liked')) {
					let removeId = `selected ${likedCard.id}`;

					document.getElementById(`${removeId}`).remove();
					likedCard.childNodes[0].src = 'img/heartOff.svg';
					button.target.classList.remove('liked');
				} else {
					button.target.classList.add('liked');
					let card = document.createElement('div'),
						like = document.createElement('img'),
						cardFrame = document.createElement('div'),
						cardId = document.createElement('div'),
						cardIcon = document.createElement('img'),
						cardIconLink = document.createElement('img'),
						cardContent = document.createElement('div'),
						cardCategory = document.createElement('div'),
						link = document.createElement('a'),
						cardDate = document.createElement('div'),
						subcontent = document.createElement('div'),
						id = likedCard.childNodes[1].childNodes[0].childNodes[1].textContent;

						card.className = 'selected';
						card.id = `selected ${id}`;
						like.className = 'selected__like';
						cardFrame.className = 'selected__frame';
						cardId.className = 'selected__id';
						cardIcon.className = 'selected__icon';
						cardContent.classList = 'selected__content';
						cardCategory.classList = 'selected__category';
						cardDate.classList = 'selected__date';
						subcontent.classList = 'selected__subcontent';
						cardIconLink.classList = 'selected__iconlink';

					like.src = 'img/heartOn.svg';
					like.alt = 'like';
					cardId.textContent = 'ID:';
					cardIcon.src = 'img/cardIcon.svg';
					cardIconLink.src = 'img/link.png';
					cardIcon.alt = 'card-icon';
					link.textContent = likedCard.childNodes[1].childNodes[0].childNodes[1].textContent;
					link.href = likedCard.childNodes[1].childNodes[0].childNodes[1].href;
					link.target = "_blank";
					cardContent.textContent = likedCard.childNodes[1].childNodes[2].textContent;
					cardDate.textContent = likedCard.childNodes[2].childNodes[0].textContent;
					cardCategory.textContent = likedCard.childNodes[2].childNodes[1].textContent;

					card.append(like);
					cardId.append(link, cardIconLink);
					subcontent.append(cardDate, cardCategory);
					cardFrame.append(cardId, cardIcon, cardContent);
					card.append(like,cardFrame, subcontent);

					document.querySelector('.favourite__name').after(card);
					likedCard.childNodes[0].src = 'img/heartOn.svg';

					localStorage.setItem(`selected ${id}`, card.outerHTML);

					addRemoveFavourite();
				}
			});
		}
	
	function generateCategory() {
		let count = categoryCount;
		if ( categoryCount < Object.keys(categories).length) {
		} else {
			categoryCount = 0;
			count = categoryCount;
		}

		for (let i = count; i < categoryCount + 4; i++) {
			let category = document.createElement('li');
			let shell = document.createElement('div');
			category.className = 'modes__category';
			shell.className = 'modes__subname';
			shell.textContent = categories[i];
			category.append(shell);
			navigation.append(category);
		}
		document.querySelector('.modes__category').classList.add('clicked');
		categoryCount += 4;

		addNavigation();
	}

	function removeCategory() {
		let currentCategories = document.querySelectorAll('.modes__category');

		currentCategories.forEach(cat => {
			cat.remove();
		});
	}

	radios.forEach(radio => {
		radio.addEventListener('click', () => {
			if(radio.value === 'caterogies') {
				removeCategory();
				search.classList.remove('active');
				generateCategory();
				navigation.classList.add('active');
			} else if (radio.value === 'search') {
				navigation.classList.remove('active');
				search.classList.add('active');
				removeCategory();
			} else if (radio.value === 'random') {
				navigation.classList.remove('active');
				search.classList.remove('active');
				removeCategory();
			}
		});
	});
	
	function addNavigation() {
		navigation.addEventListener('click', (e) => {
			if (e.target.classList.contains('modes__category')) {
				let clickedTag = e.target;
				removeActiveTags();
				selectClickedTag(clickedTag);
			} else if (e.target.classList.contains('modes__subname')) {
				let clickedTag = e.target.parentNode;
				removeActiveTags();
				selectClickedTag(clickedTag);
			}
		});
	}

	const removeActiveTags = () => {
		let items = document.querySelectorAll('.modes__category');

		items.forEach(item => {
			item.classList.remove('clicked');
		});
	};

	const selectClickedTag = (clickedTag) => {
		clickedTag.classList.add('clicked');
	};
});
