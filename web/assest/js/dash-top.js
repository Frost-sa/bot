document.getElementById("section1").onclick = toggle
document.getElementById("section2").onclick = toggle
document.getElementById("section3").onclick = toggle

function toggle() {
    this.classList.toggle("active")
  
  // query.SelectorAll wybiera wszystkie zadane o danej klasie - tutaj question, a .forEach sprawdza kolejno poniższy warunek dla każdego question

document.querySelectorAll(".question").forEach(question => {
        if (question != this) {
            question.classList.remove("active")
        }
    })
}