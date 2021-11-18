import './sass/main.scss';
// import { debounce } from 'lodash';
// import { axios } from 'axios';
import { Notify } from 'notiflix';
var debounce = require('lodash.debounce');
const axios = require('axios').default;


const searchForm = document.querySelector('.search-form');

let inputSearch = document.querySelector('input[name="searchQuery"]');
// const btnSearch = document.querySelector('.btn-search');

const inputSearchFunc = () => {
    console.log(inputSearch.value);
}

inputSearch.addEventListener("input", debounce(inputSearchFunc, 1000, {'trailing': true, 'leading': false }));
// btnSearch.addEventListener("button", console.log("btnSearch"));



searchForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const {
    elements: { searchQuery }
    } = e.currentTarget;

    console.log("hi");
    console.log(searchQuery.value);

    Notify.success('Sol lucet omnibus');
    Notify.failure('Qui timide rogat docet negare');
});


