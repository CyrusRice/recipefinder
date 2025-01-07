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
      //console.log(data.results[0].title);
      //console.log(data.results[0].image);
      //console.log(data)
      //window.location.href = "searchResults.html";

      //document.getElementById("ingredients").style.visibility = "hidden";
      document.getElementById("ingredients").remove();

      // Create Div container
      const container = document.createElement("div");
      container.className = "container";
      container.id = "container";

      document.getElementById("description").insertAdjacentElement("afterend", container);

      document.getElementById("description").addEventListener("click", () => {
        console.log("Inner button clicked");
      });

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
})

document.addEventListener("click", function(e){
  //const target = e.target.closest("#btnPrepend"); // Or any other selector.

  if(e.target && e.target.closest("div.item")) {
    // Do something with `target`.
    //console.log(document.getElementsByClassName(e.target.className)[0].closest(".item").id);
    showRecipe(e, document.getElementsByClassName(e.target.className)[0].closest(".item").id);
  }
});

const showRecipe = function(e, data) {
  e.preventDefault();
  document.getElementById("container").remove();
  $.ajax(`https://api.spoonacular.com/recipes/${data}/information?apiKey=64bf1bceb4104664bbdfc0c611b195f6`).then((recipe) => {
    console.log(recipe.title);
    console.log(recipe.image);
    for (let i = 0; i < recipe.extendedIngredients.length; i++) {
      let currentIngred = recipe.extendedIngredients[i];
      console.log(currentIngred.nameClean + " (" + currentIngred.amount + " " + currentIngred.unit + ")");
    }
    console.log(recipe.instructions);
  })
}
// Get event listener for divs working (right now it doesn't wait for click, just displays recipe) (the problem seems to be
// creating the div in the current event listener, as already made elements work)