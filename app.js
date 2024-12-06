

const ingredForm = document.forms['ingredients']

ingredForm?.addEventListener('submit', function(e) {
  e.preventDefault();
  const ingred1 = ingredForm.querySelector('input[id="ingredient-1"]').value;
  const ingred2 = ingredForm.querySelector('input[id="ingredient-2"]').value;
  const ingred3 = ingredForm.querySelector('input[id="ingredient-3"]').value;
  const ingred4 = ingredForm.querySelector('input[id="ingredient-4"]').value;
  //includeIngredients=${ingred1},+${ingred2},+${ingred3},+${ingred4}&number=10&instructionsRequired=true&apiKey=64bf1bceb4104664bbdfc0c611b195f6
  $.ajax(`https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${ingred1},+${ingred2},+${ingred3},+${ingred4}&number=10&instructionsRequired=true&apiKey=64bf1bceb4104664bbdfc0c611b195f6`)
    .then((data) => {
      console.log(data.results[0].title);
      console.log(data.results[0].image);
      console.log(data)
      //window.location.href = "searchResults.html";

      //document.getElementById("ingredients").style.visibility = "hidden";
      document.getElementById("ingredients").remove();

      // Create Div container
      const container = document.createElement("div");
      container.className = "container";

      document.getElementById("description").insertAdjacentElement("afterend", container);

      // Create Div element and insert title and image for each result
      for (let i = 0; i < data.results.length; i++) {
        const div = document.createElement("a");
        div.className = "item item-" + i;
        div.href = "#";

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
})

// Figure out how to get cooking instructions from request. Then work on adding new page with 
// instructions when user clicks a recipe from search results