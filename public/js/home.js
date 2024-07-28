let filters = document.querySelectorAll(".filter");
let allListing = document.getElementById("all");

for(let filter of filters){
    filter.addEventListener("click", () => {
        let category = filter.id;
        window.location.href = `http://localhost:8080/listings/filter/${category}`;
    });
}