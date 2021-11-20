import './sass/main.scss';
import { Notify } from 'notiflix';

// var debounce = require('lodash.debounce');
const axios = require('axios').default;

// -------------------------------------------------------------------------------------------------------
// variables

let searchQueryResult = '';
let pageN = 1;
let q = '';

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

// -------------------------------------------------------------------------------------------------------
// event listener form

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');

searchForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const {
        elements: { searchQuery }
    } = e.target;

    searchQueryResult = searchQuery.value;
    console.log("searchQueryResult",searchQueryResult);
    console.log("q", q);
    

    if (q !== searchQueryResult) {
        console.log("CHANGED!!!");
        pageN = 1;
        pixabayAPI.page = `${pageN}`
    } else {
        console.log("page+1!!!");
        pageN += 1;
        pixabayAPI.page = `${pageN}`;
    };
    

    console.log("pageN", pageN);

    q = searchQueryResult;
    

    try {

        if (searchQueryResult === '' || searchQueryResult === null || searchQueryResult === 'underfined') {
       
            throw new Error();

        }

        const results = await fetchPhotos(searchQueryResult);
        const htmlCode = await renderedPhotos(results);
        
        gallery.insertAdjacentHTML("beforeend", htmlCode);
        
        Notify.success(`'Hooray! We found ${results.totalHits} images.'`);

        console.log("searchQueryResult", searchQueryResult);
        console.log("results", results);

    }

    catch (error) {
    
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');

    }
    
});

// -------------------------------------------------------------------------------------------------------
// button load more

const btnLoadMore = document.querySelector('.load-more');
btnLoadMore.addEventListener("click", () => {
    console.log("btnLoadMore working");
});

// -------------------------------------------------------------------------------------------------------
// fetch photos function

async function fetchPhotos(searchQueryResult) {
    
    const { baseUrl, key, image_type, orientation, safesearch, order, page, per_page } = pixabayAPI;

    console.log(searchQueryResult);
    console.log(q);

    pixabayAPI.page = `${pageN}`;
    // console.log(pixabayAPI);
    console.log("page", page);

    const response = await fetch(`${baseUrl}?key=${key}&q=${q}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&order=${order}&page=${page}&per_page=${per_page}`);
    const results = await response.json();

    console.log("response", response);
    console.log(page);
    
    //results destruction
   
    const {total, totalHits, hits} = results;

    if (total === 0) {
    throw new Error();
    };

    console.log("totalHits",totalHits);
    console.log("per_page", per_page);
    const totalPages = totalHits / per_page;
    console.log("totalPages=", totalPages);

    //total pages check

    if (page > totalPages) {

        Notify.failure("We're sorry, but you've reached the end of search results.");
        return results;

    };

    //received data
    return results;

    
};

async function renderedPhotos(results) {

    const { hits } = results;

    const markup = hits.map((hit) =>
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
    
    return markup;
    
};


// -------------------------------------------------------------------------------------------------------