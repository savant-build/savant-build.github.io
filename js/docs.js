document.addEventListener('DOMContentLoaded', function() {
  var toc = document.getElementById('toc-list');
  var content = document.getElementById('docs-content');
  if (!toc || !content) return;

  // Build TOC from h2 and h3 elements
  var headings = content.querySelectorAll('h2, h3');
  if (headings.length === 0) {
    return;
  }

  headings.forEach(function(heading) {
    // Ensure heading has an id
    if (!heading.id) {
      heading.id = heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#' + heading.id;
    a.textContent = heading.textContent;
    a.className = 'block py-1 text-slate-500 hover:text-slate-300 no-underline transition-colors text-xs';
    if (heading.tagName === 'H3') {
      a.classList.add('pl-3');
    }
    li.appendChild(a);
    toc.appendChild(li);
  });

  // Highlight current section on scroll
  var tocLinks = toc.querySelectorAll('a');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        tocLinks.forEach(function(link) { link.classList.remove('text-sky-400'); link.classList.add('text-slate-500'); });
        var activeLink = toc.querySelector('a[href="#' + entry.target.id + '"]');
        if (activeLink) {
          activeLink.classList.remove('text-slate-500');
          activeLink.classList.add('text-sky-400');
        }
      }
    });
  }, { rootMargin: '-80px 0px -80% 0px' });

  headings.forEach(function(heading) { observer.observe(heading); });

  // Smooth scroll
  toc.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      var target = document.querySelector(e.target.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, null, e.target.getAttribute('href'));
      }
    }
  });
});
