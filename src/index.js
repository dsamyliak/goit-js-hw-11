import './sass/main.scss';
// import { debounce } from 'lodash';
// import { axios } from 'axios';
import { Notify } from 'notiflix';

var debounce = require('lodash.debounce');
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
        page: `1`,
        per_page: "40",

    };

// -------------------------------------------------------------------------------------------------------
// event listener form

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

    console.log("searchQueryResult", searchQueryResult);
    console.log("results", results);
            
    
        // pixabayAPI.page = `${pageN}`;
        // console.log(pageN);
        // pageN += 1;

    Notify.success(`'Hooray! We found ${results.totalHits} images.'`);

    }

    catch (error) {
    
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');

    }
    
});

// -------------------------------------------------------------------------------------------------------
// fetch photos function

async function fetchPhotos(searchQueryResult) {
    
    const { baseUrl, key, image_type, orientation, safesearch, order, page, per_page } = pixabayAPI;

    console.log(searchQueryResult);
    console.log(q);

    pixabayAPI.page = `${pageN}`;
    console.log(pixabayAPI);
    console.log("page", page);

    console.log(q);

    const response = await fetch(`${baseUrl}?key=${key}&q=${q}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&order=${order}&page=${page}&per_page=${per_page}`);
    const results = await response.json();

    console.log("response", response);
    console.log(page);
    
    //results destruction
   
    const {total, totalHits, hits} = results;

    if (total === 0) {
    throw new Error();
    };

    //received data
    return results;

    
};



// -------------------------------------------------------------------------------------------------------
// some code

// Notify.failure('Write some word to search!');

    // const arrayOfPromises = searchItems.map(async searchItem => {
    //     const response = await fetch(`${baseUrl}?key=${key}&q=${q}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}`);
    //     return response.json();
    // });

    // const searchedPhotos = await Promise.all(arrayOfPromises);
    // console.log(searchedPhotos);
    // return searchedPhotos;

// };

//----------------------------------------------------------------------------------------------

// let inputSearch = document.querySelector('input[name="searchQuery"]');

// const inputSearchFunc = () => {
//     console.log(inputSearch.value)
// };

// inputSearch.addEventListener("input", debounce(inputSearchFunc, 1000, {'trailing': true, 'leading': false }));

// const btnSearch = document.querySelector('.btn-search');
// btnSearch.addEventListener("button", console.log("btnSearch"));

//