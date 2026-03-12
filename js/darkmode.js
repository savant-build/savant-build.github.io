(function() {
  // Apply theme immediately to avoid flash
  var theme = localStorage.getItem('theme');
  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    // System preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Listen for system preference changes when in system mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      updateThemeIcons();
    }
  });
})();

function cycleTheme() {
  var current = localStorage.getItem('theme');
  var next;
  if (current === 'light') {
    next = 'dark';
  } else if (current === 'dark') {
    next = null; // system
  } else {
    next = 'light';
  }

  if (next) {
    localStorage.setItem('theme', next);
  } else {
    localStorage.removeItem('theme');
  }

  // Apply
  if (next === 'light') {
    document.documentElement.classList.remove('dark');
  } else if (next === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  updateThemeIcons();
}

function updateThemeIcons() {
  var theme = localStorage.getItem('theme');
  document.querySelectorAll('.theme-icon-light').forEach(function(el) {
    el.style.display = theme === 'light' ? 'block' : 'none';
  });
  document.querySelectorAll('.theme-icon-dark').forEach(function(el) {
    el.style.display = theme === 'dark' ? 'block' : 'none';
  });
  document.querySelectorAll('.theme-icon-system').forEach(function(el) {
    el.style.display = !theme ? 'block' : 'none';
  });
}
