const ingredForm = document.forms['ingredients'];
sessionStorage.setItem('search_type', 0);

// Function called when user clicks to search for a recipe
const search = function(e) {
  e.preventDefault();

  if (sessionStorage.getItem('search_type') == 0) {
    let includeIngredients = "";
    const num_ingred = sessionStorage.getItem('num_ingred');
    for (let i = 0; i < num_ingred; i++) {
      const ingred = sessionStorage.getItem('ingred' + i);
      if (ingred != "") {
        includeIngredients += sessionStorage.getItem('ingred' + i) + ",+";
      }
    }
    api_call = `includeIngredients=${includeIngredients}`;
  } else {
    const recipe_name = sessionStorage.getItem('recipe-name');
    api_call = `titleMatch=${recipe_name}`;
  }

  // Call Spoonacular API to get recipe information
  $.ajax(`https://api.spoonacular.com/recipes/complexSearch?${api_call}&number=10&instructionsRequired=true&apiKey=64bf1bceb4104664bbdfc0c611b195f6`)
    .then((data) => {
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

// Function called when user hits submit to search for recipes
ingredForm?.addEventListener('submit', function(e) {
  // Searching by ingredients vs recipe name
  if (sessionStorage.getItem('search_type') == 0) {
    const ingredients = ingredForm.getElementsByClassName("ingredient");
    sessionStorage.setItem('num_ingred', ingredients.length);
    for (let i = 0; i < ingredients.length; i++) {
      sessionStorage.setItem('ingred' + i, ingredients[i].value);
    }
  } else {
    const recipe_name = document.getElementById("recipe-name").value;
    sessionStorage.setItem('recipe-name', recipe_name);
  }
  search(e);
});

// General purpose click event listener to do things when stuff is clicked
document.addEventListener("click", function(e) {
  // If recipe picture clicked, show recipe page
  if(e.target && e.target.closest("div.item")) {
    // Do something with `target`.
    showRecipe(e, document.getElementsByClassName(e.target.className)[0].closest(".item").id);
  } else if (e.target && e.target.id == "results-link") {
    // If clicking results link, go to search results page showing recipes w/ pictures
    e.target.style.color = "purple";
    search(e);
  } else if (e.target && e.target.id == "add-ingredient") {
    // Clicking add ingredient button
    const ingred_arr = document.getElementsByClassName("ingredient");
    const new_ingred = document.createElement("input");
    new_ingred.type = "text";
    new_ingred.className = "ingredient";
    new_ingred.id = "ingredient-" + (ingred_arr.length + 1);
    new_ingred.placeholder = "ingredient " + (ingred_arr.length + 1);
    ingred_arr[ingred_arr.length - 1].insertAdjacentElement("afterend", new_ingred);
    ingred_arr[ingred_arr.length - 2].insertAdjacentHTML("afterend", "<br><br>");
  } else if (e.target && e.target.id == "search-by-recipe-name") {
    // Clicking search by recipe name button, switch layout to accomodate this
    let recipe_name = document.getElementById("recipe-name");
    if (typeof(recipe_name) == 'undefined' || recipe_name == null) {
      // If searching by recipe name, remove ingredients list & add recipe name box
      // Remove ingredients list
      const ingred_len = document.getElementsByClassName("ingredient").length;
      for (let i = 0; i < ingred_len; i++) {
        document.getElementById("ingredient-" + (i + 1))?.remove();
      }
      document.getElementById("add-ingredient")?.remove();
      const break_arr = document.getElementsByClassName("ingred-break");
      const break_arr_len = break_arr.length;
      for (let i = 0; i < break_arr_len; i++) {
        break_arr[0].remove();
      }

      // Add recipe name box
      recipe_name = document.createElement("input");
      recipe_name.type = "text";
      recipe_name.id = "recipe-name";
      recipe_name.placeholder = "recipe name";
      document.getElementById("search-by-recipe-name").insertAdjacentElement("afterend", recipe_name);
      document.getElementById("search-by-recipe-name").insertAdjacentHTML("afterend", "<br class=\"name-break\"><br class=\"name-break\">");
      document.getElementById("recipe-name").insertAdjacentHTML("afterend", "<br class=\"name-break\"><br class=\"name-break\">");
      sessionStorage.setItem('search_type', 1);
    }
  } else if (e.target && e.target.id == "search-by-ingredients") {
    // If searching by ingredients, remove recipe name box and add ingredients list
    const ingred_1 = document.getElementById("ingredient-1");
    if (typeof(ingred_1) == 'undefined' || ingred_1 == null) {
      // Remove recipe name box
      document.getElementById("recipe-name")?.remove();
      const break_arr = document.getElementsByClassName("name-break");
      const break_arr_len = break_arr.length;
      for (let i = 0; i < break_arr_len; i++) {
        break_arr[0].remove();
      }

      // Add ingredients list
      const submit = document.getElementById("submit");
      submit.insertAdjacentHTML("beforebegin", "<br class=\"ingred-break\"><br class=\"ingred-break\">");
      for (let i = 0; i < 4; i++) {
        const new_ingred = document.createElement("input");
        new_ingred.type = "text";
        new_ingred.className = "ingredient";
        new_ingred.id = "ingredient-" + (i + 1);
        new_ingred.placeholder = "ingredient " + (i + 1);
        submit.insertAdjacentElement("beforebegin", new_ingred);
        submit.insertAdjacentHTML("beforebegin", "<br class=\"ingred-break\"><br class=\"ingred-break\">");
      }
      const add_ingred = document.createElement("input");
      add_ingred.type = "button";
      add_ingred.id = "add-ingredient";
      add_ingred.value = "+";
      submit.insertAdjacentElement("beforebegin", add_ingred);
      submit.insertAdjacentHTML("beforebegin", "<br class=\"ingred-break\"><br class=\"ingred-break\">");
      sessionStorage.setItem('search_type', 0);
    }
  }
});

// Function to show the recipe page when recipe image clicked
const showRecipe = function(e, data) {
  e.preventDefault();
  document.getElementById("container").remove();
  // Call Spoonacular API to get recipe ingredients, instructions, and image
  $.ajax(`https://api.spoonacular.com/recipes/${data}/information?apiKey=64bf1bceb4104664bbdfc0c611b195f6`).then((recipe) => {
    const recipe_container = document.createElement("div");
    recipe_container.className = "recipe";

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
    }
    recipe_container.appendChild(instruction_container);

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
  })
}