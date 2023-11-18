import { debounce } from 'lodash';
import Notiflix from 'notiflix';
import SlimSelect from '../../../node_modules/slim-select/src/slim-select';
import 'slim-select/dist/slimselect.css';
import { createGalleryCard } from './galleryCard';
import { axiosRecipes } from './axiosRecipes';
import { axiosCard } from './axiosCategories';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

const BASE_URL = 'https://tasty-treats-backend.p.goit.global/api/';
const categoriesRef = 'categories';
const areaRef = 'areas';
const ingredientsRef = 'ingredients';

const refs = {
  form: document.querySelector('.myForm'),
  categoriesEl: document.querySelector('.categories-list'),
  inputEl: document.querySelector('.input-filter'),
  timeEl: document.querySelector('.time-select'),
  areaEl: document.querySelector('.area-select'),
  timeMob: document.querySelector('.time-select-mob'),
  areaMob: document.querySelector('.area-select-mob'),
  ingredientsEl: document.querySelector('.ingredients-select'),
  ratingBackdrop: document.querySelector('.rating-backdrop'),
  gallery: document.querySelector('.gallery'),

  btn_all_categories: document.querySelector('.btn-all-categories'),
  resetFilter: document.querySelector('.reset-filter'),
  optionCss: document.querySelector('.option-css'),
};

const axiosRecipesInstance = new axiosRecipes();

///////////////////////////// Додаємо option

axiosRecipesInstance.getFilteredData(categoriesRef).then(categories => {
  categories.forEach(category => {
    const liEl = document.createElement('li');
    liEl.textContent = category.name;
    liEl.setAttribute('value', category.name);
    liEl.classList.add('category-item');
    refs.categoriesEl.append(liEl);
  });
});

axiosRecipesInstance.getFilteredData(areaRef).then(areas => {
  areas.forEach(area => {
    const optionEl = document.createElement('option');
    optionEl.id = area._id;
    optionEl.value = area.name;
    optionEl.textContent = area.name;
    optionEl.classList.add('option-text');
    refs.areaMob.appendChild(optionEl);
  });
  const slimSelect = new SlimSelect({
    select: refs.areaMob,
  });
});

axiosRecipesInstance.getFilteredData(areaRef).then(areas => {
  areas.forEach(area => {
    const optionEl = document.createElement('option');
    optionEl.id = area._id;
    optionEl.value = area.name;
    optionEl.textContent = area.name;
    optionEl.classList.add('option-text');
    refs.areaEl.appendChild(optionEl);
  });
  const slimSelect = new SlimSelect({
    select: refs.areaEl,
  });
});

axiosRecipesInstance.getFilteredData(ingredientsRef).then(ingredients => {
  ingredients.forEach(ingredient => {
    const optionEl = document.createElement('option');
    optionEl.value = ingredient._id;
    optionEl.id = ingredient._id;
    optionEl.textContent = ingredient.name;
    optionEl.classList.add('option-text');
    refs.ingredientsEl.appendChild(optionEl);
  });
  const slimSelect = new SlimSelect({
    select: refs.ingredientsEl,
  });
});
selectTime();
function selectTime() {
  for (let i = 5; i <= 120; i += 5) {
    const optionEl = document.createElement('option');
    optionEl.textContent = [i] + ' min';
    optionEl.value = [i];
    optionEl.classList.add('option-text');
    refs.timeEl.appendChild(optionEl);
  }

  const slimSelectEl = new SlimSelect({
    select: refs.timeEl,
  });
}

selectTimeMob();

function selectTimeMob() {
  for (let i = 5; i <= 120; i += 5) {
    const optionEl = document.createElement('option');
    optionEl.textContent = [i] + ' min';
    optionEl.value = [i];
    optionEl.classList.add('option-text');
    optionEl.style.backgroundColor = 'var(--option-color)';
    optionEl.style.color = 'var(--primary-color-03)';
    refs.timeMob.appendChild(optionEl);
  }

  const slimSelectEl = new SlimSelect({
    select: refs.timeMob,
  });
}

// Отримуємо обрані значення
let selectedCategoryId;
let selectedAreaId;
let selectedIngredientsId;
let selectedTimeId;
let inputValue;
let totalPages = 1;
let arrayRecept;
let limitID;
let results = [];

let activeCategories;

refs.categoriesEl.addEventListener('click', handleCategory);
const axiosCardInstance = new axiosCard();
function handleCategory(e) {
  if (e.target.classList.contains('category-item')) {
    refs.btn_all_categories.classList.remove('active_all-categories');
    selectedCategoryId = e.target.getAttribute('value');
    axiosCardInstance.category = selectedCategoryId;
    axiosCardInstance.page = 1;

    showRecipes();
    pagination.movePageTo(1);

    if (activeCategories !== undefined) {
      activeCategories.classList.remove('active');
    }
  }
  activeCategories = e.target;
  e.target.classList.add('active');
}

refs.inputEl.addEventListener('input', debounce(handleInputEl, 300));

function handleInputEl(e) {
  inputValue = e.target.value.trim();
  axiosCardInstance.title = inputValue;
  showRecipes();
  pagination.movePageTo(1);
}

refs.areaMob.addEventListener('change', handleAreaMob);
function handleAreaMob(e) {
  selectedAreaId = e.target.value;
  axiosCardInstance.area = selectedAreaId;
  showRecipes();
  pagination.movePageTo(1);
}

refs.areaEl.addEventListener('change', handleArea);

function handleArea(e) {
  selectedAreaId = e.target.value;
  axiosCardInstance.area = selectedAreaId;
  showRecipes();
  pagination.movePageTo(1);
}

refs.timeMob.addEventListener('change', handleTimeMob);

function handleTimeMob(e) {
  selectedTimeId = e.target.value;
  axiosCardInstance.time = selectedTimeId;
  arrayRecept = selectedTimeId;
  showRecipes();
  pagination.movePageTo(1);
}

refs.timeEl.addEventListener('change', handleTime);

function handleTime(e) {
  selectedTimeId = e.target.value;
  axiosCardInstance.time = selectedTimeId;
  arrayRecept = selectedTimeId;
  showRecipes();
  pagination.movePageTo(1);
}

refs.ingredientsEl.addEventListener('change', handleIngredients);

function handleIngredients(e) {
  selectedIngredientsId = e.target.value;

  axiosCardInstance.ingredients = selectedIngredientsId;

  showRecipes();
  pagination.movePageTo(1);
}

// Адаптив

if (window.screen.width >= 1280) {
  limitID = 9;
  axiosCardInstance.limit = limitID;
  arrayRecept = limitID;
  showRecipesAdapt();
} else if (window.screen.width >= 768) {
  limitID = 8;
  axiosCardInstance.limit = limitID;
  arrayRecept = limitID;
  showRecipesAdapt();
} else {
  showRecipesAdapt();
}

// Якщо рецептів не знайдено, або показати рецепти

function showRecipes() {
  axiosCardInstance.getCardData().then(data => {
    totalPages = data.totalPages;
    if (totalPages === null) {
      Notiflix.Notify.info("😪 We don't have recipes for your request!");
    }

    totalPages = data.totalPages;
    if (totalPages <= 3) {
    }
    refs.gallery.innerHTML = createGalleryCard(data.results);
  });
}
function showRecipesAdapt() {
  axiosCardInstance.getCardData().then(data => {
    console.log('це рецепти', data);
    totalPages = data.totalPages;
    refs.gallery.innerHTML = createGalleryCard(data.results);
  });
}

// pagination
const container = document.getElementById('pagination');

const option = {
  totalItems: 500,
  itemsPerPage: 9,
  visiblePages: 3,
};
const pagination = new Pagination(container, option);

const updatePaginationTotalItems = totalPages => {
  const screenWidth = window.innerWidth;
  const itemsPerPage = screenWidth >= 768 && screenWidth < 1280 ? 8 : 9;

  const totalItems = totalPages * itemsPerPage;

  pagination.setTotalItems(totalItems);
};

pagination.on('afterMove', eventData => {
  axiosCardInstance.page = eventData.page;
  axiosCardInstance.getCardData().then(data => {
    totalPages = data.totalPages;
    updatePaginationTotalItems(totalPages);
    refs.gallery.innerHTML = createGalleryCard(data.results);
  });
  console.log('eventData', eventData.page);
});

axiosCardInstance.getCardData().then(data => {
  const totalPages = data.totalPages;

  updatePaginationTotalItems(totalPages);
});

//Cкинути фільтри
refs.resetFilter.addEventListener('click', resetAllFilters);

function resetAllFilters() {
  refs.timeEl.value = '';
  refs.areaEl.value = '';
  refs.timeMob.value = '';
  refs.areaMob.value = '';
  refs.ingredientsEl.value = '';

  axiosCardInstance.category = selectedCategoryId;
  axiosCardInstance.area = null;
  axiosCardInstance.time = null;
  axiosCardInstance.ingredients = null;
  axiosCardInstance.title = null;
  axiosCardInstance.page = 1;
  refs.inputEl.value = '';
  showRecipesAdapt();
  pagination.movePageTo(1);
}

refs.btn_all_categories.addEventListener('click', displayAllCategories);

function displayAllCategories(e) {
  selectedCategoryId = null;
  activeCategories.classList.remove('active');
  activeCategories = e.target;
  e.target.classList.add('active');
  axiosCardInstance.category = null;

  showRecipesAdapt();

  if (activeCategories === e.target) {
    activeCategories.classList.remove('active');
  }
  activeCategories = e.target;
  e.target.classList.add('active');
}

//  ADD TO  FAVORITE
const KEY_FAVORITE = 'favorite';
let favoriteArr = JSON.parse(localStorage.getItem(KEY_FAVORITE)) ?? [];

function fetchRecipeById(recipeId) {
  return fetch(
    `https://tasty-treats-backend.p.goit.global/api/recipes/${recipeId}`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => console.error('Error:', error));
}

refs.gallery.addEventListener('click', addFavorite);

async function addFavorite(e) {
  if (e.target.tagName !== 'BUTTON') {
    return;
  }
  if (e.target.classList.contains('btn-heard')) {
    const recipeId = e.target.id;

    const inStorage = favoriteArr.some(({ _id }) => _id === recipeId); //якщо вже в локал сторажд
    if (inStorage) {
      favoriteArr = favoriteArr.filter(({ _id }) => _id !== recipeId);
      e.target.classList.remove('heart-icon-active');
      localStorage.setItem(KEY_FAVORITE, JSON.stringify(favoriteArr));
      console.log('Updated Favorite Array:', favoriteArr);

      return;
    }
    try {
      const recipe = await fetchRecipeById(recipeId);

      favoriteArr.push(recipe);

      localStorage.setItem(KEY_FAVORITE, JSON.stringify(favoriteArr));

      console.log('Favorite Array:', favoriteArr);
      e.target.classList.add('heart-icon-active');
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
