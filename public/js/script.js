(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()


let alert = document.querySelector(".flash");

window.addEventListener("load", () => {
  if(alert){
    let i=-490;
    let id = setInterval( () => {
      alert.style.right = `${i}px`;
      console.log(i);
      if(i<0)
        i+=10;
      else
      clearInterval(id);
    }, 5);
  }
});