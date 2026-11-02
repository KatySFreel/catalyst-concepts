(() => {
  const section = document.getElementById('s8');
  const copy = section.querySelector('.seo-copy');
  const toggle = section.querySelector('.seo-toggle');
  const main = section.querySelector('.seo-main');
  const dock = document.createElement('div');
  dock.className = 'seo-toggle-dock';
  toggle.before(dock);
  dock.append(toggle);
  let expanded = false, frame = 0;
  function updateDock() {
    frame = 0;
    const rect = main.getBoundingClientRect();
    const height = window.innerHeight;
    const visible = expanded && rect.top < height - 120 && rect.bottom > 120;
    toggle.classList.toggle('is-pinned', visible);
    if (visible) {
      toggle.style.left = `${rect.left}px`;
      toggle.style.bottom = `${Math.max(24, height - rect.bottom + 12)}px`;
      toggle.style.maxWidth = `${rect.width}px`;
    } else {
      toggle.style.removeProperty('left');
      toggle.style.removeProperty('bottom');
      toggle.style.removeProperty('max-width');
    }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(updateDock); }
  function setExpanded(value) {
    expanded = value;
    section.classList.toggle('seo-expanded', value);
    copy.classList.toggle('expanded', value);
    toggle.setAttribute('aria-expanded', String(value));
    toggle.textContent = value ? 'Свернуть' : 'Читать полностью';
    updateDock();
  }
  toggle.addEventListener('click', () => {
    setExpanded(!expanded);
    if (!expanded) {
      section.scrollIntoView({block:'start', behavior:'instant'});
      toggle.focus({preventScroll:true});
    }
  });
  section.querySelectorAll('.seo-toc a').forEach(link => link.addEventListener('click', () => setExpanded(true)));
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule);
  new ResizeObserver(schedule).observe(main);
  setExpanded(false);
  const tocLinks = [...section.querySelectorAll('.seo-toc a')];
  const tocTargets = tocLinks.map(link => document.getElementById(link.hash.slice(1)));
  function markActive(index) {
    tocLinks.forEach((link, i) => {
      if (i === index) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  let tocFrame = 0;
  function updateActive() {
    tocFrame = 0;
    let index = 0;
    if (expanded) tocTargets.forEach((target, i) => {
      if (target && target.getBoundingClientRect().top <= (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 92) + 48) index = i;
    });
    markActive(index);
  }
  tocLinks.forEach((link, i) => link.addEventListener('click', () => markActive(i)));
  window.addEventListener('scroll', () => {
    if (!tocFrame) tocFrame = requestAnimationFrame(updateActive);
  }, {passive:true});
  window.addEventListener('resize', updateActive);
  toggle.addEventListener('click', updateActive);
  updateActive();


  // Keep one answer open across both FAQ columns, including older browsers.
  const originalQuestions = [...document.querySelectorAll('#s9 details.question')];
  // Start with the practical questions needed to plan an event.
  const priorities = [2, 13, 1, 10, 12, 3];
  const questions = [...priorities.map(index => originalQuestions[index]), ...originalQuestions.filter((_, index) => !priorities.includes(index))];
  document.querySelector('#s9 .faq-columns').replaceChildren(...questions);
  const faq = document.getElementById('s9');
  if (questions.length > 6) {
    questions.slice(6).forEach(question => question.classList.add('faq-extra'));
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'faq-more';
    more.textContent = 'Смотреть ещё';
    more.setAttribute('aria-expanded', 'false');
    const list = faq.querySelector('.faq-columns');
    list.id = 'faq-questions';
    more.setAttribute('aria-controls', list.id);
    list.after(more);
    more.addEventListener('click', () => {
      faq.classList.add('faq-expanded');
      more.setAttribute('aria-expanded', 'true');
      questions[6].querySelector('summary').focus({preventScroll:true});
      more.hidden = true;
    });
  }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const states = new Map();
  function animateQuestion(question, expanded) {
    const state = states.get(question);
    const startHeight = question.getBoundingClientRect().height;
    if (state.animation) {
      state.animation.onfinish = null;
      state.animation.cancel();
    }
    state.expanded = expanded;
    state.summary.setAttribute('aria-expanded', String(expanded));
    question.style.height = '';
    // Measure the destination in normal layout, then keep the answer rendered
    // until the closing animation completes.
    question.open = expanded;
    const endHeight = question.getBoundingClientRect().height;
    if (reducedMotion.matches) {
      state.animation = null;
      return;
    }
    question.open = true;
    state.animation = question.animate(
      [{height: `${startHeight}px`}, {height: `${endHeight}px`}],
      {duration: 280, easing: 'cubic-bezier(.22, 1, .36, 1)'}
    );
    state.animation.onfinish = () => {
      question.open = state.expanded;
      state.animation = null;
    };
  }
  questions.forEach(question => {
    // Native exclusive details close immediately; coordinate the animation here.
    question.removeAttribute('name');
    const summary = question.querySelector('summary');
    states.set(question, {expanded: question.open, animation: null, summary});
    summary.setAttribute('aria-expanded', String(question.open));
    summary.addEventListener('click', event => {
      event.preventDefault();
      const expanded = !states.get(question).expanded;
      if (expanded) questions.forEach(other => {
        if (other !== question && states.get(other).expanded) animateQuestion(other, false);
      });
      animateQuestion(question, expanded);
    });
  });
})();
