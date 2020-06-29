import {elements} from './base';

export const getInput = () => elements.searchInput.value;//captures search query

export const clearInput = () => {//clears input from input field
    elements.searchInput.value='';
};

export const clearResults = () => {//clears result of previous search
    elements.searchResList.innerHTML='';//deletes the HTML of the list
    elements.searchResPages.innerHTML='';//deletes the HTML of the buttons
    
}

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

const limitRecipeTitle = (title, limit = 17) => {//default parameter
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => //reduce applies a function to each element of an array
            {                                 //acc and cur are inbuilt
                if(acc + cur.length <= limit) //accumulator and current 
                {
                    newTitle.push(cur);
                }
                return acc + cur.length;
            }, 0
        );    //splitting it will turn it into an array; reduce method can be used on an array
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}   

const renderRecipe = recipe => {//receives single recipe as input
    const markup = //pass markup to be injected as a string
    `<li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;
    elements.searchResList.insertAdjacentHTML("beforeend",markup);
};

// type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1) {
        // Only button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // Only button to go to prev page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 2, resPerPage = 10) => {
    // render results of currente page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};