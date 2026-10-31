(() => {
  const section = document.getElementById('s8');
  const copy = section.querySelector('.seo-copy');
  const toggle = section.querySelector('.seo-toggle');
  function setExpanded(expanded) {
    copy.classList.toggle('expanded', expanded);
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.textContent = expanded ? 'Свернуть' : 'Читать полностью';
  }
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    setExpanded(expanded);
    if (!expanded) section.scrollIntoView({block:'start'});
  });
  section.querySelectorAll('.seo-toc a').forEach(link => link.addEventListener('click', () => setExpanded(true)));
  if (location.hash.startsWith('#seo-topic-')) setExpanded(true);
})();
