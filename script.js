// 🔽 Elements Selection: Dropdowns, input field, and display area
let selectDifficulty = document.getElementById("difficulty");
let selectCuisine = document.getElementById("cuisine");
let inputValue = document.getElementById("searchValue");
let selectRating = document.getElementById("rating");
let show = document.getElementById("show");
let Signupbtn = document.getElementById('Signup')

// 🌐 API Endpoint
let url = `https://dummyjson.com/recipes`;

// 📦 Arrays to store filter options and fetched data
let allData = [];
let difficulty = [];
let cuisine = [];
let rating = [];

// 🔁 Main Function: Fetch data from API and initialize UI
async function api() {
  let response = await fetch(url);
  let raw = await response.json();
  allData = raw.recipes;

  // Loop through data and collect unique filters
  allData.forEach((element) => {
    if (!difficulty.includes(element.difficulty)) {
      difficulty.push(element.difficulty);
    }

    if (!cuisine.includes(element.cuisine)) {
      cuisine.push(element.cuisine);
    }

    if (!rating.includes(element.rating)) {
      rating.push(element.rating);
    }
    // console.log(rating);

    // Render each recipe on page load
    render(element);
  });

  // Add dropdown change event listeners
  selectDifficulty.addEventListener("change", selectFilter);
  selectCuisine.addEventListener("change", selectFilter);
  selectRating.addEventListener("change", selectFilter);

  // Populate difficulty dropdown
  difficulty.forEach((ele) => {
    // console.log(ele);

    selectDifficulty.innerHTML += `<option value="${ele}">${ele}</option>`;
  });

  // Populate cuisine dropdown
  cuisine.forEach((ele) => {
    selectCuisine.innerHTML += `<option value="${ele}">${ele}</option>`;
  });

  rating.sort((a, b) => b - a); // ⭐️ Highest to lowest
  rating.forEach((ele) => {
    selectRating.innerHTML += `<option value="${ele}">⭐ ${ele}</option>`;
  });
}

// 📄 Function to render a single recipe card
function render(data) {
  show.innerHTML += `
    <div class="recipe-card" style="width: 20rem;">
      <img src="${data.image}" class="card-img-top" />
      <div class="card-body">
        <h5 class="card-title">${data.name}</h5>
        <p class="card-text"><b>Cuisine:</b> ${data.cuisine} | ⭐ ${data.rating}</p>
        <p class="card-text">⏱️ ${data.cookTimeMinutes} | 🔥 ${data.difficulty}</p>
        <button onclick="viewDetails(${data.id})" class="btn btn-primary">View Recipe</button>
      </div>
    </div>`;
}

// 🧠 Filtering recipes based on dropdowns
function selectFilter() {
  let difficultyValue = selectDifficulty.value;
  let cuisineValue = selectCuisine.value;
  let ratingValue = selectRating.value;

  let ratingNumber = parseFloat(ratingValue);
  // Filter the recipes based on selected values
  let filtered = allData.filter((element) => {
    // ⭐ Rating string ko number mein badlo
let matchRating =
  ratingValue === "" || element.rating === ratingNumber;

    return (
      (difficultyValue === "" || element.difficulty === difficultyValue) &&
      (cuisineValue === "" || element.cuisine === cuisineValue) &&
      matchRating
    );
  });

  // console.log(filtered);

  // Show filtered recipes
  show.innerHTML = "";
  filtered.forEach((element) => {
    render(element);
  });
}

// 🔍 Input-based search (runs on key press including Enter)
inputValue.addEventListener("keyup", () => {
  let searchValue = inputValue.value.toLowerCase();
  show.innerHTML = "";
  let matchFound = false;

  // Filter recipes by name
  allData.forEach((element) => {
    let recipeName = element.name.toLowerCase();
    if (recipeName.includes(searchValue)) {
      render(element);
      matchFound = true;
    }
  });

  // If no match found
  if (!matchFound) {
    show.innerHTML = "<p>No recipes found.</p>";
  }

  // // Reset dropdowns when user types
  selectDifficulty.value = "";
  selectCuisine.value = "";
  // selectRating.value = "";
});

// 👉 Store selected recipe ID and redirect to detail page
function viewDetails(id) {
  localStorage.setItem("recipeId", id);
  window.location.href = "detail.html";
}

// 🚀 Run API call on initial load
api();


Signupbtn.addEventListener('click',()=>{

  window.location.href="signup.html"
})

let  userlogined = JSON.parse(localStorage.getItem("userlogin"))
if(userlogined){
  Signupbtn.innerText="Logout"

  Signupbtn.addEventListener('click',()=>{
localStorage.removeItem("userlogin")
  // window.location.href="signup.html"
})

}
