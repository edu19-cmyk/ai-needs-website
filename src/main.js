import './style.css';

const indicators = [
  { id: 'youth-employment', name: '청년 고용률', category: '고용·노동', value: '46.8', unit: '%', period: '2026년 1분기', source: '통계청 고용동향', sourceUrl: 'https://kostat.go.kr/board.es?mid=a10301010000&bid=210', cycle: '분기', status: 'review', due: '오늘', change: '+1.2%p', trend: [38, 40, 39, 43, 42, 47], definition: '15세 이상 29세 이하 인구 중 취업자가 차지하는 비율', updated: '2026.08.28' },
  { id: 'startup', name: '기술창업 기업 수', category: '산업·경제', value: '1,284', unit: '개', period: '2025년', source: '중소벤처기업부', sourceUrl: 'https://www.mss.go.kr/site/smba/main.do', cycle: '연간', status: 'current', due: '2027.02.15', change: '+8.4%', trend: [22, 28, 35, 34, 42, 49], definition: '해당 연도에 설립된 기술 기반 창업기업의 수', updated: '2026.07.30' },
  { id: 'tourism', name: '외국인 관광객 수', category: '관광·문화', value: '219.6', unit: '만 명', period: '2026년 2분기', source: '한국관광 데이터랩', sourceUrl: 'https://datalab.visitkorea.or.kr/', cycle: '분기', status: 'current', due: '2026.10.12', change: '+14.6%', trend: [20, 31, 27, 45, 54, 61], definition: '부산 지역을 방문한 외국인 관광객 추정 인원', updated: '2026.07.12' },
  { id: 'population', name: '청년 인구 비율', category: '인구·사회', value: '24.1', unit: '%', period: '2025년', source: '주민등록인구통계', sourceUrl: 'https://jumin.mois.go.kr/', cycle: '연간', status: 'late', due: '14일 지연', change: '-0.5%p', trend: [49, 47, 46, 44, 42, 40], definition: '전체 인구 중 19~34세 청년 인구가 차지하는 비율', updated: '2025.08.14' },
  { id: 'rnd', name: '지역 R&D 투자 비중', category: '과학·기술', value: '3.72', unit: '%', period: '2025년', source: '국가연구개발사업조사', sourceUrl: 'https://www.ntis.go.kr/', cycle: '연간', status: 'current', due: '2026.12.31', change: '+0.18%p', trend: [28, 31, 30, 35, 38, 41], definition: '지역내총생산 대비 연구개발 투자액의 비율', updated: '2026.05.21' }
];

let route = 'dashboard';
let selectedId = 'youth-employment';
let filter = 'all';
let query = '';
let approved = false;

const icons = {
  grid: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  list: '<svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
  chart: '<svg viewBox="0 0 24 24"><path d="M3 3v18h18M7 16l4-5 3 3 6-8"/></svg>',
  refresh: '<svg viewBox="0 0 24 24"><path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>',
  file: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5"/></svg>'
};

const statusMeta = { current: ['최신', 'green'], review: ['검토 필요', 'orange'], late: ['갱신 지연', 'red'] };
const selected = () => indicators.find((item) => item.id === selectedId) || indicators[0];

function chart(values, color = '#44b48b') {
  const points = values.map((v, i) => `${i * 68 + 10},${112 - v * 1.5}`).join(' ');
  return `<svg class="trend-chart" viewBox="0 0 360 130" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="${color}" stop-opacity=".20"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><path d="M10 120H350" class="gridline"/><path d="M10 85H350" class="gridline"/><path d="M10 50H350" class="gridline"/><path d="M${points} L350,120 L10,120Z" fill="url(#fill)"/><polyline points="${points}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${values.map((v, i) => `<circle cx="${i * 68 + 10}" cy="${112 - v * 1.5}" r="4" fill="white" stroke="${color}" stroke-width="2"/>`).join('')}</svg>`;
}

function badge(status) { const [label, color] = statusMeta[status]; return `<span class="status ${color}"><i></i>${label}</span>`; }
function navItem(key, label, icon) { return `<button class="nav-item ${route === key ? 'active' : ''}" data-route="${key}">${icons[icon]}<span>${label}</span></button>`; }
function stat(label, value, note, tone = '') { return `<article class="stat-card ${tone}"><span class="eyebrow">${label}</span><strong>${value}</strong><small>${note}</small></article>`; }

function shell(content) {
  return `<div class="app-shell"><aside class="sidebar"><div class="brand"><span class="brand-mark">I</span><span>INDEXA</span></div><p class="workspace">RESEARCH OPS</p><nav>${navItem('dashboard','대시보드','grid')}${navItem('indicators','지표 목록','list')}<div class="nav-divider"></div><p class="nav-label">WORKFLOW</p>${navItem('update','업데이트 검토','refresh')}</nav><div class="sidebar-bottom"><div class="help-card"><span>${icons.file}</span><p>지표 관리<br/><b>가이드 보기</b></p></div><div class="profile"><div class="avatar">김</div><div><b>김연구원</b><span>정책연구팀</span></div><span class="dots">···</span></div></div></aside><main><header class="topbar"><div class="breadcrumb">Research / <b>${route === 'dashboard' ? 'Overview' : route === 'indicators' ? 'Indicators' : route === 'detail' ? 'Indicator detail' : 'Update review'}</b></div><div class="top-actions"><button class="icon-button">${icons.bell}<i class="notification"></i></button><span class="date-stamp">2026. 08. 28 · 금</span></div></header><section class="content">${content}</section></main></div>`;
}

function dashboard() {
  const review = indicators.filter(x => x.status === 'review').length;
  return shell(`<div class="page-intro"><div><span class="section-kicker"><i></i> RESEARCH INDICATORS</span><h1>연구지표 최신화 현황</h1><p>기관 핵심 지표의 업데이트 상태와 검토 업무를 관리하세요.</p></div><button class="primary" data-route="update">업데이트 검토하기 ${icons.arrow}</button></div><div class="stat-grid">${stat('관리 중인 지표','48','이번 달 +3')} ${stat('최신 상태','39','전체의 81%', 'green-stat')} ${stat('검토 필요',String(review),'오늘 처리 권장', 'orange-stat')} ${stat('갱신 지연','3','담당자 확인 필요', 'red-stat')}</div><div class="dashboard-grid"><section class="card priority-card"><div class="card-heading"><div><span class="eyebrow">PRIORITY QUEUE</span><h2>검토가 필요한 지표</h2></div><button class="text-button" data-route="update">전체 보기 ${icons.arrow}</button></div><div class="priority-row"><div class="metric-icon">%</div><div class="priority-title"><b>청년 고용률</b><span>통계청 고용동향 · 오늘 업데이트 감지</span></div><div class="metric-change up">+1.2%p</div>${badge('review')}<button class="row-arrow" data-route="update">${icons.arrow}</button></div><div class="priority-row"><div class="metric-icon blue">◫</div><div class="priority-title"><b>지역 혁신역량지수</b><span>한국과학기술기획평가원 · 기준연도 변경</span></div><div class="metric-change neutral">—</div>${badge('review')}<button class="row-arrow" data-route="update">${icons.arrow}</button></div></section><section class="card schedule-card"><div class="card-heading"><div><span class="eyebrow">UPCOMING</span><h2>다가오는 갱신 일정</h2></div></div><div class="schedule"><span class="day">02<small>SEP</small></span><p><b>지역 R&D 투자 비중</b><span>국가연구개발사업조사</span></p><span class="due">5일 후</span></div><div class="schedule"><span class="day">12<small>OCT</small></span><p><b>외국인 관광객 수</b><span>한국관광 데이터랩</span></p><span class="due">45일 후</span></div></section><section class="card wide-chart"><div class="card-heading"><div><span class="eyebrow">ACTIVITY</span><h2>최근 6개월 업데이트 추이</h2></div><div class="legend"><i></i> 업데이트 완료</div></div>${chart([25, 32, 29, 40, 43, 52])}<div class="chart-labels"><span>3월</span><span>4월</span><span>5월</span><span>6월</span><span>7월</span><span>8월</span></div></section><section class="ai-card"><div><span class="spark">✦</span><span class="eyebrow">AI INSIGHT</span><h2>업데이트 우선순위를<br/>제안해 드릴게요.</h2><p>마감일과 출처 신뢰도를 분석해<br/>오늘 검토할 지표를 안내합니다.</p></div><button class="orange-button" data-route="update">검토 시작 ${icons.arrow}</button></section></div>`);
}

function indicatorsPage() {
  const list = indicators.filter(x => (filter === 'all' || x.status === filter) && x.name.includes(query));
  return shell(`<div class="page-intro compact"><div><span class="section-kicker"><i></i> INDICATOR DIRECTORY</span><h1>연구지표 관리</h1><p>총 ${indicators.length}개 지표의 최신화 상태를 관리합니다.</p></div><button class="primary" data-action="add">새 지표 등록 ${icons.arrow}</button></div><section class="card table-card"><div class="table-controls"><label class="searchbox">${icons.search}<input id="search" value="${query}" placeholder="지표명으로 검색"/></label><div class="filters">${[['all','전체'],['current','최신'],['review','검토 필요'],['late','갱신 지연']].map(([key,label]) => `<button class="filter ${filter===key?'selected':''}" data-filter="${key}">${label}</button>`).join('')}</div></div><div class="data-table"><div class="table-head"><span>지표명</span><span>분야</span><span>최신값</span><span>기준 시점</span><span>상태</span><span></span></div>${list.map(item => `<button class="table-row" data-detail="${item.id}"><span class="indicator-name"><b>${item.name}</b><small>${item.source}</small></span><span class="category">${item.category}</span><span class="number">${item.value}<small>${item.unit}</small></span><span>${item.period}</span><span>${badge(item.status)}</span><span class="row-arrow">${icons.arrow}</span></button>`).join('')}</div></section>`);
}

function detailPage() {
 const item = selected();
 return shell(`<button class="back-link" data-route="indicators">← 지표 목록으로</button><div class="detail-hero"><div><div class="title-line"><span class="category-label">${item.category}</span>${badge(item.status)}</div><h1>${item.name}</h1><p>${item.definition}</p></div><button class="primary" data-route="update">업데이트 검토 ${icons.arrow}</button></div><div class="detail-grid"><section class="card metric-summary"><span class="eyebrow">LATEST VALUE</span><div class="large-value">${item.value}<small>${item.unit}</small></div><div class="change-line up">↗ ${item.change}<span>이전 기간 대비</span></div><div class="summary-rule"></div><dl><div><dt>기준 시점</dt><dd>${item.period}</dd></div><div><dt>갱신 주기</dt><dd>${item.cycle}</dd></div><div><dt>최근 확인일</dt><dd>${item.updated}</dd></div></dl></section><section class="card detail-chart"><div class="card-heading"><div><span class="eyebrow">TREND</span><h2>지표 추이</h2></div><button class="select-button">최근 6개 기간⌄</button></div>${chart(item.trend)}<div class="chart-labels"><span>2024.4Q</span><span>2025.1Q</span><span>2025.2Q</span><span>2025.3Q</span><span>2025.4Q</span><span>2026.1Q</span></div></section><section class="card source-card"><span class="eyebrow">SOURCE & METADATA</span><h2>출처 및 관리 정보</h2><dl><div><dt>데이터 출처</dt><dd><a href="#">${item.source} ↗</a></dd></div><div><dt>지표 단위</dt><dd>${item.unit}</dd></div><div><dt>관리 담당자</dt><dd><span class="assignee"><i>김</i> 김연구원</span></dd></div></dl></section><section class="card history-card"><div class="card-heading"><div><span class="eyebrow">CHANGE LOG</span><h2>변경 이력</h2></div></div><div class="timeline"><div><i></i><p><b>2026년 1분기 수치 업데이트</b><span>김연구원 · ${item.updated} · ${item.source}</span></p></div><div><i></i><p><b>지표 정의 및 분모 기준 확인</b><span>박분석관 · 2026.05.16</span></p></div><div><i></i><p><b>2025년 4분기 수치 업데이트</b><span>김연구원 · 2026.02.14</span></p></div></div></section></div>`);
}

function updatePage() {
 const item = selected();
 return shell(`<div class="page-intro compact"><div><span class="section-kicker"><i></i> UPDATE REVIEW</span><h1>지표 업데이트 검토</h1><p>AI가 탐지한 신규 데이터를 검토하고 확정하세요.</p></div><div class="queue-counter"><b>01</b><span>/ 02<br/>검토 대기</span></div></div><div class="update-layout"><section class="update-main"><div class="update-item-head"><div class="metric-icon">%</div><div><h2>${item.name}</h2><p>${item.category} · ${item.source}</p></div><span class="new-badge">NEW DATA</span></div><div class="comparison"><article><span class="eyebrow">CURRENT RECORD</span><strong>45.6<small>%</small></strong><p>2025년 4분기</p><span class="record-date">확인일 2026.05.12</span></article><div class="comparison-arrow">${icons.arrow}<span>AI 감지</span></div><article class="new-record"><span class="eyebrow">DETECTED UPDATE</span><strong>46.8<small>%</small></strong><p>2026년 1분기</p><span class="increase">↗ +1.2%p</span></article></div><section class="ai-summary"><div class="ai-symbol">✦</div><div><span class="eyebrow">AI ANALYSIS</span><h3>업데이트 검토 결과</h3><p>신규 수치는 기존 지표의 <b>단위(%)와 정의가 일치</b>합니다. 갱신 주기(분기)에 맞는 최신 자료이며, 전 분기 대비 1.2%p 상승했습니다.</p><div class="checks"><span>${icons.check} 단위 일치</span><span>${icons.check} 출처 확인</span><span>${icons.check} 시점 적합</span></div></div></section><section class="source-proof"><div><span class="eyebrow">SOURCE EVIDENCE</span><b>${item.source} 「${item.period} 최신 자료」</b><span>발행일 2026.08.27 · 원문 링크 확인됨</span></div><a class="outline source-link" href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer">원문 보기 ↗</a></section></section><aside class="review-panel"><span class="eyebrow">REVIEW ACTION</span><h2>업데이트를<br/>확정할까요?</h2><p>승인하면 최신 값과 변경 이력이 즉시 반영됩니다.</p>${approved ? `<div class="approved-message">${icons.check}<b>업데이트가 반영되었습니다.</b><span>변경 이력에서 확인할 수 있습니다.</span></div>` : `<div class="review-actions"><button class="approve" data-action="approve">업데이트 승인 ${icons.check}</button><button class="outline wide" data-action="edit">값 직접 수정</button><button class="reject" data-action="reject">반려 및 사유 입력</button></div>`}<div class="reviewer"><div class="avatar">김</div><span>검토자 <b>김연구원</b></span></div></aside></div>`);
}

function render() {
  document.querySelector('#app').innerHTML = route === 'dashboard' ? dashboard() : route === 'indicators' ? indicatorsPage() : route === 'detail' ? detailPage() : updatePage();
  bind();
}

function downloadUpdatedIndicators() {
  const rows = indicators.filter((item) => item.status === 'current').map((item) => [
    item.name, item.category, `${item.value}${item.unit}`, item.period, item.source, item.updated
  ]);
  const csv = [['지표명', '분야', '최신값', '기준 시점', '데이터 출처', '최근 확인일'], ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = '최신_연구지표_목록_2026-08-28.csv';
  anchor.click();
  URL.revokeObjectURL(url);
}

function bind() {
 if (route === 'indicators') {
   const intro = document.querySelector('.page-intro');
   const addButton = intro?.querySelector('[data-action="add"]');
   if (intro && addButton && !intro.querySelector('[data-action="download"]')) {
     addButton.insertAdjacentHTML('beforebegin', `<button class="download-button" data-action="download">${icons.file} 최신 지표 다운로드</button>`);
   }
 }
 document.querySelectorAll('[data-route]').forEach(el => el.addEventListener('click', () => { route = el.dataset.route; render(); }));
 document.querySelectorAll('[data-detail]').forEach(el => el.addEventListener('click', () => { selectedId = el.dataset.detail; route = 'detail'; render(); }));
 document.querySelectorAll('[data-filter]').forEach(el => el.addEventListener('click', () => { filter = el.dataset.filter; render(); }));
 document.querySelector('#search')?.addEventListener('input', (e) => { query = e.target.value; render(); document.querySelector('#search')?.focus(); });
 document.querySelector('[data-action="approve"]')?.addEventListener('click', () => { approved = true; const target = selected(); target.status = 'current'; target.value = '46.8'; target.period = '2026년 1분기'; render(); });
 document.querySelector('[data-action="download"]')?.addEventListener('click', downloadUpdatedIndicators);
 document.querySelectorAll('[data-action="add"],[data-action="edit"],[data-action="reject"]').forEach(el => el.addEventListener('click', () => alert('데모 화면입니다. 실제 DB 연결 단계에서 이 기능을 구현할 수 있습니다.')));
}
render();
