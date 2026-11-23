(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const projects=window.CAREER_PROJECTS||[];
  const themes=window.ALIPAY_THEMES||[];
  const byId=Object.fromEntries(projects.map(p=>[p.id,p]));
  const companies={
    alipay:{name:'支付宝',period:'2023.12 — 至今',role:'高级产品经理 · 流量调控与策略',summary:'围绕保量控量、排序优化和 AI 结合推进平台演进，兼顾流量履约、分配效率与持续优化能力。'},
    kuaishou:{name:'快手',period:'2023.02 — 2023.12',role:'策略产品经理 · 达人营销商单',summary:'负责商单流量分发模块，衔接预估、自然分发与商业补量。'},
    baidu:{name:'百度',period:'2021.06 — 2023.01',role:'产品经理 · 垂类搜索与广告变现',summary:'负责招商加盟搜索与站内渠道变现，做过 Query 处理、泛化召回、重排分配及转化预估协作。'},
    cfl:{name:'华夏幸福',period:'2019.07 — 2021.06',role:'产品经理 · 产业大数据',summary:'围绕潜在投资企业识别，将模型预测、专家复核与订阅交付衔接起来。'},
    personal:{name:'个人项目',period:'持续实践',role:'AI 与内容工作流',summary:'以个人兴趣为起点，探索来源整理、AI 协作与人工审核。'}
  };
  let companyFilter='all';
  function renderStrengths(role){
    const selected=window.RESUME_CONTENT[role]?role:'strategy';
    const items=window.RESUME_CONTENT[selected].strengths||[];
    $('strengths-grid').innerHTML=items.map((item,i)=>`<article><span class="strength-index">0${i+1}</span><h3>${esc(item.title)}</h3><p class="strength-source">${esc(item.source)}</p><p>${esc(item.text)}</p><a href="${item.projectId?'#'+item.projectId:item.anchor||'#career-projects'}" ${item.projectId?'data-open-project="'+item.projectId+'"':''}>看具体经历 ↗</a></article>`).join('');
  }
  function projectMarkup(p,i){
    return `<details class="career-project" id="${p.id}"><summary><span class="career-index">${String(i+1).padStart(2,'0')}</span><span class="career-heading"><strong>${esc(p.title)}</strong><span>${esc(p.summary)}</span></span><span class="career-category">${esc(p.category)}</span><span class="expand-icon" aria-hidden="true">＋</span></summary><div class="career-body"><div><h4>我做了什么</h4><p class="career-role">${esc(p.role)}</p><ul>${p.actions.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></div><div><h4>交付与阶段</h4><p>${esc(p.delivery)}</p>${p.stage!=='项目实践'?`<p class="career-stage">${esc(p.stage)}</p>`:''}${p.links?`<div class="personal-links">${p.links.map(link=>`<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)}</a>`).join('')}</div>`:''}${p.image?`<a class="workflow-diagram" href="${esc(p.image)}" target="_blank" rel="noopener noreferrer"><img src="${esc(p.image)}" alt="投资观点内容工作流架构图，点击查看大图" loading="lazy"><span>查看工作流架构大图</span></a>`:''}</div></div></details>`;
  }
  function themeMarkup(theme){
    const cases=theme.projectIds.map(id=>byId[id]).filter(Boolean);
    return `<section class="alipay-theme" id="${theme.id}" tabindex="-1" aria-labelledby="${theme.id}-title"><header class="theme-header"><span class="theme-number">${theme.number}</span><div><p class="theme-subtitle">${esc(theme.subtitle)}</p><h4 id="${theme.id}-title">${esc(theme.title)}</h4><p class="theme-lead">${esc(theme.lead)}</p></div></header><div class="theme-points">${theme.points.map(p=>`<div><h5>${esc(p.title)}</h5><p>${esc(p.text)}</p></div>`).join('')}</div>${theme.outlook?`<p class="theme-outlook">${esc(theme.outlook)}</p>`:''}<details class="theme-projects" id="${theme.id}-projects"><summary><span>展开具体项目与阶段</span><span>${cases.length} 项 <b aria-hidden="true">＋</b></span></summary><div class="theme-cases">${cases.map(projectMarkup).join('')}</div></details></section>`;
  }
  function renderProjects(){
    document.querySelectorAll('[data-company]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.company===companyFilter)));
    $('filter-result').textContent=companyFilter==='all'?'支付宝按三条主线展开；过往经历按公司保留，个人项目单独展示。':`${companies[companyFilter].name} · 职责、项目与阶段`;
    $('career-list').innerHTML=Object.entries(companies).filter(([key])=>companyFilter==='all'||key===companyFilter).map(([key,company])=>{
      const body=key==='alipay'?`<div class="alipay-themes">${themes.map(themeMarkup).join('')}</div><p class="theme-foundation">共同基础：标准接入、目标与任务、数据口径、实验观测与执行治理。</p>`:`<div class="company-projects">${projects.filter(p=>p.company===key).map(projectMarkup).join('')}</div>`;
      return `<section class="company-group" aria-labelledby="company-${key}"><div class="company-heading"><div><span class="company-period">${company.period}</span><h3 id="company-${key}">${company.name}<small>${company.role}</small></h3><p>${company.summary}</p></div></div>${body}</section>`;
    }).join('');
  }
  document.addEventListener('resume:role',event=>{renderStrengths(event.detail);companyFilter='all';renderProjects();});
  document.addEventListener('click',event=>{
    const link=event.target.closest('[data-open-project]');
    if(link){event.preventDefault();companyFilter='all';renderProjects();const element=$(link.dataset.openProject);if(element){if(element.matches('details'))element.open=true;let parent=element.parentElement;while(parent){if(parent.matches('details'))parent.open=true;parent=parent.parentElement;}element.scrollIntoView({behavior:'smooth',block:'start'});const focus=element.matches('details')?element.querySelector('summary'):element;focus.focus({preventScroll:true});}}
    const company=event.target.closest('[data-company]');if(company){companyFilter=company.dataset.company;renderProjects();}
  });
  let printState;
  window.addEventListener('beforeprint',()=>{printState={companyFilter,open:[...document.querySelectorAll('#career-list details[open]')].map(d=>d.id)};companyFilter='all';renderProjects();document.querySelectorAll('#career-list details').forEach(d=>d.open=true);});
  window.addEventListener('afterprint',()=>{if(!printState)return;companyFilter=printState.companyFilter;renderProjects();printState.open.forEach(id=>{if($(id))$(id).open=true;});printState=null;});
  renderStrengths(new URL(location.href).searchParams.get('role'));renderProjects();
})();
