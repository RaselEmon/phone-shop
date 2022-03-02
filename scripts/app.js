const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const spinner = document.getElementById("spinner");
const productsDisplay = document.getElementById("products-display");
const productDetailsContainer = document.getElementById(
    "product-details-container"
);

let allPhones = [];

// Search Listener
searchBtn.addEventListener("click", (e) => {
    try {
        displayPhones(searchInput.value.toLowerCase());
        clearSearchInput();
    } catch (error) {
        console.log(error);
    }
});

async function displayPhones(phoneName) {
    clearDisplay();
    clearShowMoreBtn();
    allPhones = await getData(phoneName, true);

    // return if no data found
    if (allPhones.length <= 0) return nothingFound();

    // Render Only 20 results
    renderCards(allPhones.slice(0, 20));

    // display show more btn if there are more items than 20
    if (allPhones.length > 20) renderShowMoreBtn();
}

function renderCards(phones) {
    clearDisplay();
    phones.forEach((phone) => {
        productsDisplay.insertAdjacentHTML(
            "beforeend",
            `<div class="col">
        <div class="card pt-3 text-center">
          <img src="${phone.image}" class="card-img-top w-50 mx-auto" alt="..." />
          <div class="card-body">
            <h5 class="card-title">${phone.phone_name}</h5>
            <h6 class="card-title">${phone.brand}</h6>
            <a href="#" onclick="displayProductDetails('${phone.slug}')" class="btn btn-primary">View details</a>
          </div>
        </div>
      </div>`
        );
    });
}

// This function displays details of a product on th UI
async function displayProductDetails(id) {
    productDetailsContainer.textContent = "";
    let phone = await getData(id, false);
    productDetailsContainer.innerHTML = `
    <div class="text-center shadow shadow-lg rounded-3 py-4">
      <h2 class="text-success">Product Details</h2>
      <img id="details-img" src="${phone.image}" class="w-75" alt="..." />
      <div class="card-body text-start ms-4">
        <h3 class="card-title">${phone.name}</h3>
        <h6 class="card-title">Brand: <span class="text-muted">${
          phone.brand
        }</span></h6>
        <h6 class="card-title">Release Date: <span class="text-muted">${
          phone.releaseDate ? phone.releaseDate : "Not found"
        }</span>
        </h6>
        <div>
        ${displayFeatures(phone.mainFeatures, "Main Features")}
        </div>
        <div>
        ${displayFeatures(phone.others, "Other Connectivity")}
        </div>
      </div>
    </div>`;
}

// utility functions
async function getData(arg, allData) {
    let phones = allData ? [] : {};
    const apiLink = allData ?
        `https://openapi.programming-hero.com/api/phones?search=${arg}` :
        `https://openapi.programming-hero.com/api/phone/${arg}`;

    try {
        showSpinner(true);
        const res = await fetch(apiLink);
        const {
            data
        } = await res.json();
        phones = data;
    } catch (error) {
        console.log(error);
    } finally {
        showSpinner(false);
        return phones;
    }
}

function displayFeatures(features, title) {
    if (!features) return "";
    let string = `<h3 class='fw-bold mt-5'>${title}:</h3>`;
    for (let [key, value] of Object.entries(features)) {
        if (key == "sensors") value = value.join(", ");
        string += `
    <h6 class="card-title">${key}: <span class="text-muted">${value}</span></h6>
    <hr>
    `;
    }
    return string;
}

function renderShowMoreBtn() {
    const allProducts = document.getElementById("all-products");
    allProducts.insertAdjacentHTML(
        "beforeend",
        `
    <div class="text-center my-3"> 
      <button id="show-more" type="button" class="btn btn-warning">Show More</button>
    </div>
    `
    );

    // show more Listener
    document
        .getElementById("show-more")
        .addEventListener("click", showMoreHandler);
}

function showMoreHandler() {
    renderCards(allPhones);
    clearShowMoreBtn();
}

function clearShowMoreBtn() {
    const showMoreBtn = document.getElementById("show-more");
    if (!showMoreBtn) return null;
    showMoreBtn.parentNode.removeChild(showMoreBtn);
}

function clearDisplay() {
    productDetailsContainer.textContent = "";
    productsDisplay.textContent = "";
}

function nothingFound() {
    productDetailsContainer.innerHTML = `<h2 class="text-danger text-center">No Products found</h2>`;
}

// to show spinner
function showSpinner(value) {
    spinner.setAttribute("style", `display: ${value ? "block" : "none"}`);
}

function clearSearchInput() {
    searchInput.value = ''
}