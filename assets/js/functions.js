var toggle = document.getElementsByClassName('toggle');

function toggleMenu() {
  document.getElementById('menu-toggle').classList.toggle('menu--open');
  document.getElementById('menu').classList.toggle('slide-down');
};

for (var i = 0; i < toggle.length; i++) {
  toggle[i].addEventListener('click', toggleMenu, false);
};
