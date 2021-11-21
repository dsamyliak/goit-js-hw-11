import './sass/main.scss';
import { Notify } from 'notiflix';
const axios = require('axios').default;
// Описан в документации
// import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
// import 'simplelightbox/dist/simple-lightbox.min.css';
// var debounce = require('lodash.debounce');

// -------------------------------------------------------------------------------------------------------
// variables
const queryObj = {
searchQueryResult: '',
q: '',
pageN: 1,
};

let searchQueryResult = '';
let q = '';
let pageN = 1;

const pixabayAPI = {

        baseUrl: 'https://pixabay.com/api/',
        key: '3705719-850a353db1ffe60c326d386e6',
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
        order: "popular",
        page: '1',
        per_page: "40",

    };
const markupData = {
    markup: "",
    htmlCode: "",
};

// -------------------------------------------------------------------------------------------------------
// event listener form

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');


searchForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const { elements: { searchQuery } } = e.target;

    searchQueryResult = searchQuery.value;
    queryObj.searchQueryResult = searchQuery.value;

    
    console.log("searchQueryResult",searchQueryResult);
    console.log("q", q);
    

    if (searchQueryResult !== q) {
        console.log("CHANGED!!! NOT EMPTY QUERY");

        queryObj.pageN = 1;
        pageN = 1;

        pixabayAPI.page = `${pageN}`;
        gallery.innerHTML = "";
        btnLoadMore.classList.remove("is-visible");
    } else {
        console.log("page+1!!!");

        queryObj.pageN += 1;
        pageN += 1;

        pixabayAPI.page = `${pageN}`;
        btnLoadMore.classList.remove("is-visible");
    };
    
    q = searchQueryResult;
    queryObj.q = queryObj.searchQueryResult;

    console.log("pageN", pageN);

    
    try {

        if (searchQueryResult === '') {
       
            throw new Error();
            
        }

        const results = await fetchPhotos(searchQueryResult);
        markupData.htmlCode = await renderedPhotos(results);
        
        gallery.insertAdjacentHTML("beforeend", markupData.htmlCode);
        btnLoadMore.classList.add("is-visible");
        

        const { baseUrl, key, image_type, orientation, safesearch, order, page, per_page } = pixabayAPI;
        const { total, totalHits, hits } = results;    
        const totalPages = Math.round(totalHits / per_page);
        
        
        if (page > totalPages) {
        
        btnLoadMore.classList.remove("is-visible");

        };


        Notify.success(`'Hooray! We found ${results.totalHits} images.'`);
        console.log("searchQueryResult", searchQueryResult);
        console.log("results", results);

    }

    catch (error) {
    
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');

    }
    console.log("queryObj", queryObj);
});

// -------------------------------------------------------------------------------------------------------
// button load more

const btnLoadMore = document.querySelector('.load-more');
btnLoadMore.addEventListener("click", async () => {

        queryObj.pageN += 1;

        pageN += 1;
        pixabayAPI.page = `${pageN}`;

try {

        const results = await fetchPhotos(searchQueryResult);
        markupData.htmlCode = await renderedPhotos(results);
        
        gallery.insertAdjacentHTML("beforeend", markupData.htmlCode);
        btnLoadMore.classList.add("is-visible");
        

        const { baseUrl, key, image_type, orientation, safesearch, order, page, per_page } = pixabayAPI;
        const { total, totalHits, hits } = results;    
        const totalPages = Math.round(totalHits / per_page);
        
        if (page > totalPages) {
        
            btnLoadMore.classList.remove("is-visible");
            throw new Error();

        };

        
        console.log("searchQueryResult", searchQueryResult);
        console.log("results", results);

    }

    catch (error) {
    
        Notify.failure("We're sorry, but you've reached the end of search results.");

    }

    console.log("btnLoadMore working");
    console.log("queryObj", queryObj);
});

// -------------------------------------------------------------------------------------------------------
// fetch photos function

async function fetchPhotos(searchQueryResult) {
    
    const { baseUrl, key, image_type, orientation, safesearch, order, page, per_page } = pixabayAPI;

    // const { searchQueryResult, q, pageN } = queryObj;

    console.log(searchQueryResult);
    console.log(q);

    pixabayAPI.page = `${pageN}`;
    // page = `${pageN}`;
    
    
    console.log("page", page);

    const response = await fetch(`${baseUrl}?key=${key}&q=${q}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&order=${order}&page=${page}&per_page=${per_page}`);
    const results = await response.json();

    console.log("response", response);
    console.log("page", page);
    
    //results destruction
   
    const {total, totalHits, hits} = results;
    const totalPages = Math.round(totalHits / per_page);
    
    if (total === 0) {
    throw new Error();
    };

    console.log("totalHits",totalHits);
    console.log("per_page", per_page);
    
    console.log("totalPages=", totalPages);

    //total pages check

    if (page > totalPages) {
        
        btnLoadMore.classList.remove("is-visible");
        Notify.failure("We're sorry, but you've reached the end of search results.");
        return results;

    };

    //received data
    return results;

};

// -------------------------------------------------------------------------------------------------------
// render photos function, make html markup

async function renderedPhotos(results) {

    const { hits } = results;

    markupData.markup = hits.map((hit) =>
        `<div class="photo-card">
        <a href="${hit.largeImageURL}" rel="noopener noreferrer"><img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" width="100%" height="200vh" class="img-item" /></a>
        <div class="info">
    <p class="info-item">
      <b>Likes: ${hit.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${hit.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${hit.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${hit.downloads}</b>
    </p>
  </div>
</div>`).join("");
    
    return markupData.markup;
    
};

// -------------------------------------------------------------------------------------------------------