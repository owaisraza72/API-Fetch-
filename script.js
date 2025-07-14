let show = document.getElementById("show");

let difficulty = [];
let cuisine = [];
let recipeName = [];

fetch(`https://dummyjson.com/recipes`)
  .then((raw) => raw.json())
  .then((data) => {
    data.recipes.forEach((element) => {
      // console.log(element.name);
      if (!difficulty.includes(element.difficulty)) {
        difficulty.push(element.difficulty);
      }

      if (!cuisine.includes(element.cuisine)) {
        cuisine.push(element.cuisine);
      }
      if (!recipeName.includes(element.name)) {
        recipeName.push(element.name);
        // console.log(element.name);
      }

      show.innerHTML += `<div class="recipe-card" style="width: 18rem;">
        <img src="${element.image}" class="card-img-top"></img>
      <div class="card-body">
     <h5 class="card-title">${element.name}</h5>
         <p class="card-text"><b>Cuisine:</b> ${element.cuisine}</p>
          <p class="card-text">⏱️ ${element.cookTimeMinutes} | 🔥 ${element.difficulty}</p>
  <button onclick="viewDetails(${element.id})" class="btn btn-primary">View Recipe</button>

  </div>

        </div>`;
    });

    // ------------------------------Select Defficulty---------------------------------------------------------------------------------------

    let selDifficulty = document.getElementById("seldifficulty");
    if (selDifficulty) {
      difficulty.forEach((value) => {
        selDifficulty.innerHTML += `<option value="${value}">${value}</option>
      `;
      });

      selDifficulty.addEventListener("change", (e) => {
        const selectedDifficulty = selDifficulty.value;
        const matchdifficulty = data.recipes.filter(
          (element) => element.difficulty === selectedDifficulty
        );

        show.innerHTML = "";

        matchdifficulty.forEach((element) => {
          show.innerHTML += `<div class="recipe-card" style="width: 20rem;">
        <img src="${element.image}" class="card-img-top"></img>
      <div class="card-body">
     <h5 class="card-title">${element.name}</h5>
         <p class="card-text"><b>Cuisine:</b> ${element.cuisine}</p>
          <p class="card-text">⏱️ ${element.cookTimeMinutes} | 🔥 ${element.difficulty}</p>
  <button onclick="viewDetails(${element.id})" class="btn btn-primary">View Recipe</button>

  </div>`;
        });
      });
    }
    // ------------------------------Select Cuisine---------------------------------------------------------------------------------------
    let selcuisine = document.getElementById("selcuisine");

    if (selcuisine) {
      cuisine.forEach((value) => {
        selcuisine.innerHTML += `<option value="${value}">${value}</option>a
      `;
      });

      selcuisine.addEventListener("change", (e) => {
        // console.log(selcuisine.value);
        const matchcuisine = data.recipes.filter(
          (element) => element.cuisine === selcuisine.value
        );
        show.innerHTML = "";
        matchcuisine.forEach((element) => {
          show.innerHTML += `<div class="recipe-card" style="width: 20rem;">
        <img src="${element.image}" class="card-img-top"></img>
      <div class="card-body">
     <h5 class="card-title">${element.name}</h5>
         <p class="card-text"><b>Cuisine:</b> ${element.cuisine}</p>
          <p class="card-text">⏱️ ${element.cookTimeMinutes} | 🔥 ${element.difficulty}</p>
  <button onclick="viewDetails(${element.id})" class="btn btn-primary">View Recipe</button>

  </div>`;
        });
      });
    }

    // ------------------------------Select Recipes---------------------------------------------------------------------------------------

    let selRecipes = document.getElementById("selrecipes");
    if (selRecipes) {
      recipeName.forEach((value) => {
        selRecipes.innerHTML += `<option value="${value}">${value}</option>`;
      });

      selRecipes.addEventListener("change", (e) => {
        console.log(selRecipes.value);

        // const search = document.getElementById('searchvalue');
        // const searchValue = search.value;
        // console.log(searchValue);

        const selectedRecipes = selRecipes.value;
        const matchrecipes = data.recipes.find(
          (elemnet) => elemnet.name === selectedRecipes
        );

        if (matchrecipes) {
          show.innerHTML = "";
          show.innerHTML += `<div class="recipe-card" style="width: 20rem;">
        <img src="${matchrecipes.image}" class="card-img-top"></img>
      <div class="card-body">
     <h5 class="card-title">${matchrecipes.name}</h5>
         <p class="card-text"><b>Cuisine:</b> ${matchrecipes.cuisine}</p>
          <p class="card-text">⏱️ ${matchrecipes.cookTimeMinutes} | 🔥 ${matchrecipes.difficulty}</p>
  <button onclick="viewDetails(${matchrecipes.id})" class="btn btn-primary">View Recipe</button>

  </div>`;
        }
      });
    }
  });

function viewDetails(id) {
  console.log("Clicked ID:", id); // Step 1: Console log for checking
  localStorage.setItem("recipeId", id); // Step 2: Store clicked recipe's ID
  window.location.href = "detail.html"; // Step 3: Redirect to detail page
}
