document.addEventListener("DOMContentLoaded", function () {
  const allButtons = document.querySelectorAll(".search-btn");
  const searchbar = document.querySelector(".searchbar");
  const searchInput = document.getElementById("searchInput");
  const searchClose = document.getElementById("searchClose");

  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener("click", function () {
      searchbar.style.visibility = "visible";
      searchbar.classList.add("open");
      this.setAttribute("aria-expanded", "true");
      searchInput.focus();
    });
  }
  searchClose.addEventListener("click", function () {
    searchbar.style.visibility = "hidden";
    searchbar.classList.remove("open");
    this.setAttribute("aria-expanded", "false");
  });
});
