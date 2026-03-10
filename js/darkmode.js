(function() {
  // Apply theme immediately to avoid flash
  var theme = localStorage.getItem('theme');
  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
})();

function toggleDarkMode() {
  var html = document.documentElement;
  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
  // Update toggle button icons
  document.querySelectorAll('.dark-icon').forEach(function(el) {
    el.style.display = html.classList.contains('dark') ? 'none' : 'block';
  });
  document.querySelectorAll('.light-icon').forEach(function(el) {
    el.style.display = html.classList.contains('dark') ? 'block' : 'none';
  });
}
