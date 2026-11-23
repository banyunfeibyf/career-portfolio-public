(() => {
  'use strict';
  const content = window.RESUME_CONTENT;
  if (!content) return;
  const $ = id => document.getElementById(id);
  const dialog = $('project-dialog');
  let currentRole = 'strategy';
  let toastTimer;
  let lastTrigger;
  const escape = str => String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function setRole(role, push = false) {
    currentRole = Object.hasOwn(content, role) ? role : 'strategy';
    const data = content[currentRole];
    document.body.dataset.role = currentRole;
    document.title = `班云飞 · ${data.label}｜个人简历`;
    $('eyebrow').textContent = data.eyebrow;
    $('hero-title').innerHTML = data.title.map((line, i) => `<span${i ? ' class="accent"' : ''}>${escape(line)}</span>`).join('');
    $('hero-intro').textContent = data.intro;
    $('lens-text').textContent = data.lensText;
    $('lens-title').textContent = data.lensTitle;
    $('work-title').textContent = data.workTitle || '近期在做什么';
    document.getElementById('work').hidden = !!data.hideRecent;
    document.dispatchEvent(new CustomEvent('resume:role', {detail: currentRole}));
    document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === currentRole)));
    $('project-list').innerHTML = data.projects.map(project => `
      <article class="project-row">
        <span class="project-no" aria-hidden="true">${escape(project.number)}</span>
        <div class="project-main"><div class="project-meta"><span class="stage">${escape(project.stage)}</span><span>${currentRole === 'ai' && project.id !== 'ai-triage' ? '个人探索' : '近期工作'}</span></div><h3 class="project-title">${escape(project.title)}</h3><p class="project-subtitle">${escape(project.subtitle)}</p><div class="project-tags">${project.tags.map(tag => `<span>${escape(tag)}</span>`).join('')}</div></div>
        <p class="project-summary">${escape(project.summary)}</p>
        <button class="project-open" type="button" data-project="${escape(project.id)}" aria-label="查看${escape(project.title)}项目详情">↗</button>
        <div class="project-print-details"><p><strong>交付：</strong>${escape(project.delivery)}</p><p><strong>阶段：</strong>${escape(project.boundary)}</p></div>
      </article>`).join('');
    if (push) {
      const url = new URL(location.href);
      url.searchParams.set('role', currentRole);
      history.pushState({role:currentRole}, '', url);
      showToast(`已切换为${data.label}视角`);
    }
  }
  function openProject(id, trigger) {
    const project = content[currentRole].projects.find(item => item.id === id);
    if (!project) return;
    lastTrigger = trigger;
    $('dialog-content').innerHTML = `
      <p class="dialog-kicker">PROJECT ${escape(project.number)} / ${escape(project.stage)}</p>
      <h2 id="dialog-title">${escape(project.title)}</h2>
      <p class="dialog-summary">${escape(project.summary)}</p>
      <section class="dialog-block"><h3>问题 / 为什么做</h3><p>${escape(project.problem)}</p></section>
      <section class="dialog-block"><h3>产品工作 / 如何推进</h3><ul>${project.actions.map(item => `<li>${escape(item)}</li>`).join('')}</ul></section>
      <section class="dialog-block"><h3>交付 / 做到了什么</h3><p>${escape(project.delivery)}</p></section>
      <section class="dialog-block"><h3>当前阶段</h3><p>${escape(project.boundary)}</p></section>`;
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }
  function showToast(message) {
    clearTimeout(toastTimer);
    $('toast').textContent = message;
    $('toast').classList.add('visible');
    toastTimer = setTimeout(() => $('toast').classList.remove('visible'), 3500);
  }
  async function copy(text, message) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const field = document.createElement('textarea');
        field.value = text; field.style.position = 'fixed'; field.style.opacity = '0';
        document.body.appendChild(field); field.select();
        const success = document.execCommand('copy'); field.remove();
        if (!success) throw new Error('copy');
      }
      showToast(message);
    } catch {
      window.prompt('请复制以下内容', text);
    }
  }
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => setRole(button.dataset.view, true)));
  $('project-list').addEventListener('click', event => {
    const trigger = event.target.closest('[data-project]');
    if (trigger) openProject(trigger.dataset.project, trigger);
  });
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {document.body.style.overflow = '';if (lastTrigger?.isConnected) lastTrigger.focus();});
  $('print-button').addEventListener('click', () => window.print());
  $('share-button').addEventListener('click', () => {
    const url = new URL(location.href); url.hash = '';url.search = '';url.searchParams.set('role', currentRole);
    copy(url.toString(), '此岗位版本的链接已复制');
  });
  $('copy-email').addEventListener('click', () => copy('banyunfei.byf@gmail.com', '邮箱已复制'));
  window.addEventListener('popstate', () => setRole(new URL(location.href).searchParams.get('role')));
  setRole(new URL(location.href).searchParams.get('role'));
})();
