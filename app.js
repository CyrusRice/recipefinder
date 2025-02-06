const ingredForm = document.forms['ingredients']

const search = function(e, ingredients) {
  e.preventDefault();
  let includeIngredients = "";
  const num_ingred = sessionStorage.getItem('num_ingred');
  for (let i = 0; i < num_ingred; i++) {
    const ingred = sessionStorage.getItem('ingred' + i);
    if (ingred != "") {
      includeIngredients += sessionStorage.getItem('ingred' + i) + ",+";
    }
  }
  //includeIngredients=${ingred1},+${ingred2},+${ingred3},+${ingred4}&number=10&instructionsRequired=true&apiKey=64bf1bceb4104664bbdfc0c611b195f6
  $.ajax(`https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${includeIngredients}&number=10&instructionsRequired=true&apiKey=64bf1bceb4104664bbdfc0c611b195f6`)
    .then((data) => {
      //console.log(data.results[0].title);
      //console.log(data.results[0].image);
      //console.log(data)
      //window.location.href = "searchResults.html";

      //document.getElementById("ingredients").style.visibility = "hidden";
      document.getElementById("ingredients")?.remove();
      document.getElementById("description")?.remove();
      document.getElementsByClassName("recipe")[0]?.remove();
      const results_link = document.getElementById("results-link");
      if (typeof(results_link) != 'undefined' && results_link != null) {
        results_link.style.display = "none";
      }

      // Link to return back home
      const home_link = document.getElementById("home-link");
      if (typeof(home_link) == 'undefined' || home_link == null) {
        const home = document.createElement("a");
        home.href = "index.html";
        home.textContent = "Back to search";
        home.id = "home-link";
  
        document.getElementById("website-title").insertAdjacentElement("afterend", home);
      }

      // Create Div container
      const container = document.createElement("div");
      container.className = "container";
      container.id = "container";

      document.getElementById("home-link").insertAdjacentElement("afterend", container);

      // Create Div element and insert title and image for each result
      for (let i = 0; i < data.results.length; i++) {
        const div = document.createElement("div");
        div.className = "item item-" + i;
        div.id = data.results[i].id;
        //a.href = "#";
        //div.addEventListener('click', showRecipe(e, data.results[i]));

        const title = document.createElement("p");
        const text = document.createTextNode(data.results[i].title);
        title.appendChild(text);
        title.className = "title title-" + i;
  
        const img = document.createElement("img");
        img.src = data.results[i].image;
        img.className = "img img-" + i;

        div.appendChild(title);
        div.appendChild(img);

        container.appendChild(div);
      }
  })
}
const button = document.getElementById("add-ingredient");
button.addEventListener('click', function(e) {
  // When add ingred + button clicked, add ingred input to form
});

ingredForm?.addEventListener('submit', function(e) {
  const ingredients = ingredForm.getElementsByClassName("ingredient");
  sessionStorage.setItem('num_ingred', ingredients.length);
  for (let i = 0; i < ingredients.length; i++) {
    sessionStorage.setItem('ingred' + i, ingredients[i].value);
  }
  /*const ingred1 = ingredForm.querySelector('input[id="ingredient-1"]').value;
  const ingred2 = ingredForm.querySelector('input[id="ingredient-2"]').value;
  const ingred3 = ingredForm.querySelector('input[id="ingredient-3"]').value;
  const ingred4 = ingredForm.querySelector('input[id="ingredient-4"]').value;
  sessionStorage.setItem('ingred1', ingred1);
  sessionStorage.setItem('ingred2', ingred2);
  sessionStorage.setItem('ingred3', ingred3);
  sessionStorage.setItem('ingred4', ingred4);*/
  search(e, ingredients);
});

document.addEventListener("click", function(e){
  //const target = e.target.closest("#btnPrepend"); // Or any other selector.

  if(e.target && e.target.closest("div.item")) {
    // Do something with `target`.
    //console.log(document.getElementsByClassName(e.target.className)[0].closest(".item").id);
    showRecipe(e, document.getElementsByClassName(e.target.className)[0].closest(".item").id);
  } else if (e.target && e.target.id == "results-link") {
    e.target.style.color = "purple";
    const ingredients = [];
    for (let i = 0; i < sessionStorage.getItem('num_ingred'); i++) {
      ingredients.push(sessionStorage.getItem('ingred' + i));
    }
    /*let ingred1 = sessionStorage.getItem('ingred1');
    let ingred2 = sessionStorage.getItem('ingred2');
    let ingred3 = sessionStorage.getItem('ingred3');
    let ingred4 = sessionStorage.getItem('ingred4');*/
    search(e, ingredients);
  } else if (e.target && e.target.id == "add-ingredient") {
    const ingred_arr = document.getElementsByClassName("ingredient");
    console.log(ingred_arr[4]);
    const new_ingred = document.createElement("input");
    new_ingred.type = "text";
    new_ingred.className = "ingredient";
    new_ingred.id = "ingredient-" + (ingred_arr.length + 1);
    new_ingred.placeholder = "ingredient " + (ingred_arr.length + 1);
    ingred_arr[ingred_arr.length - 1].insertAdjacentElement("afterend", new_ingred);
    ingred_arr[ingred_arr.length - 2].insertAdjacentHTML("afterend", "<br><br>");
  }
});

const showRecipe = function(e, data) {
  e.preventDefault();
  document.getElementById("container").remove();
  $.ajax(`https://api.spoonacular.com/recipes/${data}/information?apiKey=64bf1bceb4104664bbdfc0c611b195f6`).then((recipe) => {
    const recipe_container = document.createElement("div");
    recipe_container.className = "recipe";
    //console.log(recipe);
    //console.log(recipe.extendedIngredients[0].original);
    //console.log(recipe.instructions);
    //console.log(recipe.analyzedInstructions[0].steps[0].step);
    const recipe_title = document.createElement("p");
    recipe_title.id = "recipe-title";
    const recipe_title_text = document.createTextNode(recipe.title);
    recipe_title.appendChild(recipe_title_text);

    const recipe_img = document.createElement("img");
    recipe_img.id = "recipe-img";
    recipe_img.src = recipe.image;

    recipe_container.appendChild(recipe_title);
    recipe_container.appendChild(recipe_img);

    const ingred_title = document.createElement("p");
    const ingred_title_text = document.createTextNode("Ingredients");
    ingred_title.appendChild(ingred_title_text);

    recipe_container.appendChild(ingred_title);

    const ingred_container = document.createElement("ul");
    ingred_container.id = "ingred-container";
    const ingredients = recipe.extendedIngredients;

    for (let i = 0; i < ingredients.length; i++) {
      const ingred_div = document.createElement("li");
      ingred_div.className = "ingred-item";
      const ingred_text = document.createTextNode(ingredients[i].original);
      ingred_div.appendChild(ingred_text);
      ingred_container.appendChild(ingred_div);
    }
    recipe_container.appendChild(ingred_container);

    //const recipe_instructions = document.createElement("p");
    //recipe_instructions.id = "recipe-instructions";
    //const recipe_instructions_text = document.createTextNode(recipe.instructions);
    //var test = recipe_instructions_text.textContent;
    //const regex = /<ol>|<\/ol>|<li>|<\/li>/gi;
    //test = test.replaceAll(regex, "");
    //const instructions = test.split(".");
    const instruction_title = document.createElement("p");
    const instruction_title_text = document.createTextNode("Instructions");
    instruction_title.appendChild(instruction_title_text);

    recipe_container.appendChild(instruction_title);

    const instruction_container = document.createElement("ul");
    instruction_container.id = "recipe-container";
    const instructions = recipe.analyzedInstructions[0].steps;

    for (let i = 0; i < instructions.length - 1; i++) {
      const instruction_div = document.createElement("li");
      instruction_div.className = "recipe-instruction";
      const instruction_text = document.createTextNode(instructions[i].step);
      instruction_div.appendChild(instruction_text);
      instruction_container.appendChild(instruction_div);
      //recipe_container.appendChild(instruction_div);
    }
    recipe_container.appendChild(instruction_container);
    //console.log(instructions);
    //recipe_instructions.appendChild(recipe_instructions_text);

    // Link to return back to results
    var results_link = document.getElementById("results-link");
    if (typeof(results_link) != 'undefined' && results_link != null) {
        results_link.style.display = "block";
    } else {
      results_link = document.createElement("div");
      results_link.textContent = "Back to results";
      results_link.id = "results-link";
      document.getElementById("home-link").insertAdjacentElement("beforeBegin", results_link);
    }

    document.getElementById("home-link").insertAdjacentElement("afterend", recipe_container);
    /*console.log(recipe.title);
    console.log(recipe.image);
    for (let i = 0; i < recipe.extendedIngredients.length; i++) {
      let currentIngred = recipe.extendedIngredients[i];
      console.log(currentIngred.nameClean + " (" + currentIngred.amount + " " + currentIngred.unit + ")");
    }
    console.log(recipe.instructions);*/
  })
}
// Add ability to switch between search by ingreds and recipe name