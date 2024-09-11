let starsdiv = document.querySelector(".star-input");
let stars = document.querySelectorAll(".si");
let input = document.querySelector(".real-star");
let str = "abcde";
let startDate = document.getElementById("startDate");
let endDate = document.getElementById("endDate");
let price = document.getElementById("price");

function bookingHandler() {
  let date1 = new Date(startDate.value);
  let date2 = new Date(endDate.value);
  let date3 = new Date();
  const diffTime = date2 - date1;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const validTime = date1 - date3;
  const validDays = Math.floor(validTime / (1000 * 60 * 60 * 24));
  if (
    diffDays < 0 ||
    validDays + 1 < 0 ||
    date1 == "Invalid Date" ||
    date2 == "Invalid Date"
  ) {
    window.alert("Invalid Dates");
    return false;
  } else if (diffDays > 10) {
    window.alert("Cannot book more than 10 days");
    return false;
  } else {
    let totalPrice = (diffDays + 1) * listing.price;
    price.value = totalPrice;
    return true;
  }
}

// let bookingDiv = document.querySelector(".bookingDiv");

// bookingDiv.addEventListener("submit", (event) => {
//   event.preventDefault();
//   let date1 = new Date(startDate.value);
//   let date2 = new Date(endDate.value);
//   let date3 = new Date();
//   const diffTime = date2 - date1;
//   const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
//   const validTime = date1 - date3;
//   const validDays = Math.floor(validTime / (1000 * 60 * 60 * 24));
//   if (
//     diffDays < 0 ||
//     validDays + 1 < 0 ||
//     date1 == "Invalid Date" ||
//     date2 == "Invalid Date"
//   ) {
//     window.alert("Invalid Dates");
//     return false;
//   }
//   if (diffDays > 10) {
//     window.alert("Cannot book more than 10 days");
//     return false;
//   }
//   let totalPrice = (diffDays + 1) * listing.price;
//   console.log(totalPrice);
//   // window.location.replace("/pay");
//   return true;
// });

for (let star of stars) {
  star.addEventListener("click", () => {
    let x = star.getAttribute("id");
    let newRate = x.charCodeAt(0) - 96;
    input.value = newRate;
    let i;
    for (i = 0; i < str.length; i++) {
      let s = document.getElementById(`${str[i]}`);
      s.classList.remove("fa-solid");
      s.classList.add("fa-regular");
      setTimeout(() => {
        s.classList.add("fa-solid");
        s.classList.remove("fa-regular");
      }, 50);
      if (str[i] == x) break;
    }
    for (i = i + 1; i < str.length; i++) {
      let s = document.getElementById(`${str[i]}`);
      s.classList.add("fa-regular");
      s.classList.remove("fa-solid");
    }
  });
}

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>${listing.loc}</h5><p>Exact location will be provided after booking</p>`
    )
  )
  .addTo(map);
