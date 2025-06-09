document.addEventListener('DOMContentLoaded', function() {
    fetch('nav.html')
      .then(res => res.text())
      .then(html => {
        document.getElementById('nav-placeholder').innerHTML = html;
      })
      .catch(err => console.error('Error cargando nav:', err));
  });