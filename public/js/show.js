let starsdiv = document.querySelector(".star-input");
let stars = document.querySelectorAll(".si");
let input = document.querySelector(".real-star");
let str = "abcde";

for(let star of stars){
    star.addEventListener("click", () => {
        let x = star.getAttribute("id");
        let newRate = x.charCodeAt(0) - 96;
        input.value = newRate;
        let i;
        for(i=0; i<str.length; i++){
            let s = document.getElementById(`${str[i]}`);
            s.classList.remove("fa-solid");
            s.classList.add("fa-regular");
            setTimeout(() => {
                s.classList.add("fa-solid");
                s.classList.remove("fa-regular");
            }, 50);
            if(str[i] == x) break;
        }
        for(i = i+1; i<str.length; i++){
            let s = document.getElementById(`${str[i]}`);
            s.classList.add("fa-regular");
            s.classList.remove("fa-solid");
        }
    });
}
