let filters = document.querySelectorAll(".filter");
let allListing = document.getElementById("all");
let taxSwitch = document.querySelector("#flexSwitchCheckDefault");
let Filter = document.querySelector(".Filter");

for(let filter of filters){
    filter.addEventListener("click", () => {
        let category = filter.id;
        window.location.href = `http://localhost:8080/listings/filter/${category}`;
    });
}

taxSwitch.addEventListener("click", () => {
    let taxInfo = document.querySelectorAll(".tax-info")
    for(info of taxInfo){
        if(info.style.display != "inline") info.style.display = "inline";
        else info.style.display = "none";
    }
});

Filter.addEventListener("change", () => {
    let selectedValue = Filter.value; 
    console.log(selectedValue);
    if (selectedValue !== "") { 
        window.location.href = `http://localhost:8080/listings/filter/${selectedValue}`;
    } 
})

