// node capture.mjs  — captura telas REAIS do app (vite em :3000) com a API simulada.
// Regra do estúdio: nunca redesenhar a UI de imaginação; recortar e animar a coisa real.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const OUT = 'assets';
mkdirSync(OUT, { recursive: true });

const user = {
  id: 1, email: 'camila@studioforma.com.br', nome: 'Camila Rodrigues', tokens: 999,
  role: 'user', plan: { id: 'elite', name: 'Elite', slug: 'elite', hasA3Export: true },
  generationsThisMonth: 12, totalProjects: 4,
};

const doc = {
  title: 'Clínica Lumière',
  subtitle: 'Autoridade silenciosa em estética natural',
  positionPhrase: 'Rejuvenescer sem parecer outra pessoa.',
  architecture: {
    feeling: 'Confiança tranquila — a paciente sente que está nas mãos de quem domina a ciência.',
    pain: 'Medo de resultados artificiais e de procedimentos que “entregam” que algo foi feito.',
    authority: 'Protocolo autoral Lumière + 12 anos de dermatologia baseada em evidência.',
  },
  sessions: [
    {
      session: 'Sessão 01', format: 'Carrossel', theme: 'O mito do rosto “congelado”',
      strategicIntent: 'Quebrar a principal objeção e posicionar a clínica como anti-exagero.',
      creativeDirection: 'Tipografia serifada grande, fotos em close com luz natural, paleta creme.',
      carouselSlides: [
        { slideNumber: 1, visualDescription: 'Close em pele com luz lateral', imageSuggestion: 'Retrato natural', textOnCard: 'Você não precisa parecer “feita”.' },
        { slideNumber: 2, visualDescription: 'Tipografia sobre fundo creme', imageSuggestion: '-', textOnCard: 'O exagero é falta de técnica, não de produto.' },
        { slideNumber: 3, visualDescription: 'Antes/depois sutil', imageSuggestion: 'Caso real', textOnCard: 'Resultado bom é o que ninguém percebe.' },
      ],
      visualElements: { cards: 'Serifa + creme' },
      caption: 'Se o resultado aparece mais do que você, algo deu errado. Aqui, a técnica é invisível — o que aparece é a sua melhor versão. Salve para lembrar.',
      viewerPsychology: 'Alívio: “existe um jeito de fazer sem exagerar”.',
      approachStrategy: 'Gancho de contradição no slide 1.',
      storySuggestions: ['Enquete: você tem medo de ficar artificial?', 'Bastidor do protocolo', 'Depoimento em áudio'],
    },
    {
      session: 'Sessão 02', format: 'Reels', theme: '3 sinais de um procedimento bem feito',
      strategicIntent: 'Educar e gerar desejo de avaliação.',
      creativeDirection: 'Câmera na mão, cortes a cada 2s, legenda grande.',
      reelsScript: {
        hook: 'Ninguém vai perceber. E esse é o ponto.',
        scenes: [
          { sceneNumber: 1, visualAction: 'Dra. olhando para a câmera', audioSpeech: 'O primeiro sinal é…' },
          { sceneNumber: 2, visualAction: 'Close na pele', audioSpeech: 'Expressão preservada.' },
        ],
        cta: 'Agende sua avaliação pelo link da bio.',
      },
      visualElements: { reels: 'Cortes secos' },
      caption: 'Três sinais de que o seu procedimento foi feito por quem entende. O terceiro quase ninguém fala.',
      viewerPsychology: 'Curiosidade + identificação.', approachStrategy: 'Lista numerada.',
      storySuggestions: ['Caixa de perguntas', 'Antes/depois', 'CTA agenda'],
    },
    {
      session: 'Sessão 03', format: 'Post Estático', theme: 'Manifesto Lumière',
      strategicIntent: 'Consolidar posicionamento.', creativeDirection: 'Uma frase, muito respiro.',
      staticPostInfo: { visualComposition: 'Frase central', imageSuggestion: '-', headlineOnCard: 'Beleza que não pede licença para aparecer.' },
      visualElements: {}, caption: 'Nosso manifesto.', viewerPsychology: 'Pertencimento.', approachStrategy: 'Frase de efeito.',
      storySuggestions: ['Repost do manifesto'],
    },
    {
      session: 'Sessão 04', format: 'Stories', theme: 'Um dia no protocolo',
      strategicIntent: 'Humanizar e mostrar processo.', creativeDirection: 'Bastidores reais.',
      visualElements: { stories: 'Sequência 5 telas' }, caption: '—', viewerPsychology: 'Proximidade.',
      approachStrategy: 'Narrativa de bastidor.', storySuggestions: ['Chegada', 'Avaliação', 'Procedimento', 'Resultado', 'CTA'],
    },
  ],
  observation: 'Manter frequência de 4 publicações por semana. Priorizar carrossel educativo às terças.',
};

const project = (id, name, d = doc) => ({
  id, userId: 1, name, shortDescription: d.subtitle, content: { doc: d, settings: {} },
  createdAt: '2026-09-28T12:00:00Z', updatedAt: `2026-10-0${id}T15:${10 + id}:00Z`,
});
const projects = [project(1, 'Clínica Lumière'), project(2, 'Arq. Nobre Studio'), project(3, 'Mentoria Mastermind')];

async function mockApi(page, { generateDelay = 0 } = {}) {
  await page.route(/\/api\//, async (route) => {
    const url = route.request().url();
    const m = route.request().method();
    const json = (b) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(b) });
    if (url.includes('/auth/verify')) return json({ user });
    if (url.includes('/auth/login')) return json({ message: 'ok', token: 'demo', user });
    if (url.includes('/ai/generate')) { if (generateDelay) await new Promise(r => setTimeout(r, generateDelay)); return json(doc); }
    if (url.includes('/dashboard')) return json({ totalProjects: 4, lastUpdatedProject: projects[0] });
    if (url.match(/\/projects\/\d+/)) return json(projects[0]);
    if (url.includes('/projects')) return m === 'GET' ? json(projects) : json(projects[0]);
    return json({});
  });
}

const browser = await chromium.launch();
const shot = async (page, name, opts = {}) => {
  await page.waitForTimeout(opts.wait ?? 700);
  await page.screenshot({ path: `${OUT}/${name}.png`, ...opts.ss });
  console.log('✓', name);
};

// ─── Landing page (light) ───
{
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await mockApi(page);
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await shot(page, 'landing_hero', { wait: 1800 });
  for (const id of ['solucao', 'presets', 'recursos', 'planos']) {
    await page.evaluate((i) => document.getElementById(i)?.scrollIntoView(), id);
    await page.mouse.wheel(0, 1); await page.waitForTimeout(300);
    // força o reveal de todos os blocos visíveis
    await page.evaluate(() => window.scrollBy(0, 200));
    await shot(page, `landing_${id}`, { wait: 1400 });
  }
  await ctx.close();
}

// ─── App (1920x1080; formulário em 1920x1440 para caber o botão) ───
// Também grava as coordenadas reais dos elementos em assets/layout.json,
// para o cursor do filme clicar exatamente onde a UI está.
const layout = {};
const box = async (state, name, loc) => {
  const b = await loc.first().boundingBox({ timeout: 4000 }).catch(() => null);
  if (!b) return console.log('· sem box', state, name);
  (layout[state] ||= {})[name] = { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
};
for (const theme of ['dark', 'light']) {
  const D = theme === 'dark';
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, colorScheme: theme });
  await ctx.addInitScript((t) => {
    localStorage.setItem('auth_token', 'demo');
    localStorage.setItem('themeMode', t); localStorage.setItem('theme', t);
  }, theme);
  const page = await ctx.newPage();
  await mockApi(page, { generateDelay: 2500 });
  await page.goto(BASE + '/elite/home', { waitUntil: 'networkidle' });
  await shot(page, `app_${theme}_home`, { wait: 1500 });
  if (D) await box('home', 'criar', page.getByText('CRIAR', { exact: true }));

  await page.goto(BASE + '/elite/criar', { waitUntil: 'networkidle' });
  await shot(page, `app_${theme}_criar_inicio`, { wait: 1200 });
  if (D) {
    await box('inicio', 'formCard', page.locator('button', { hasText: 'FORMULÁRIO ESTRATÉGICO' }));
    await box('inicio', 'livreCard', page.locator('button', { hasText: 'GERAR COM TEXTO LIVRE' }));
  }

  await page.setViewportSize({ width: 1920, height: 1440 });
  await page.getByText('FORMULÁRIO ESTRATÉGICO', { exact: true }).click();
  await shot(page, `app_${theme}_form_vazio`, { wait: 900 });

  const ph = {
    nicho: 'Ex: Arquitetura de Luxo', publico: 'Ex: Empresários de 30 a 50', objetivo: 'Ex: Agendar consultas',
    dores: 'Ex: Medo de resultados artificiais', desejos: 'Ex: Status social', tom: 'Ex: Sofisticado, provocativo',
    diferencial: 'Ex: Protocolo exclusivo',
  };
  if (D) {
    for (const [k, p] of Object.entries(ph)) await box('form', k, page.getByPlaceholder(p));
    await box('form', 'chipNicho', page.getByText('+ Dermatologia Estética'));
    await box('form', 'chipObjetivo', page.getByText('+ Vender Consultoria'));
    await box('form', 'chipTom', page.getByText('+ Sofisticado & Minimalista'));
    await box('form', 'gerar', page.getByText('ARQUITETAR PLANO ESTRATÉGICO'));
    await box('form', 'panel', page.locator('aside'));
  }
  const fill = async (k, v) => page.getByPlaceholder(ph[k]).fill(v);
  await page.getByText('+ Dermatologia Estética').click();
  await fill('publico', 'Mulheres de 35 a 55 anos, alto padrão, buscando naturalidade');
  await page.getByText('+ Vender Consultoria').click();
  await fill('dores', 'Medo de ficar artificial, já teve experiência ruim');
  await fill('desejos', 'Parecer descansada, autoestima discreta');
  await page.getByText('+ Sofisticado & Minimalista').click();
  await fill('diferencial', 'Protocolo autoral Lumière');
  await shot(page, `app_${theme}_form_cheio`, { wait: 600 });
  await page.setViewportSize({ width: 1920, height: 1080 });

  await page.getByText('ARQUITETAR PLANO ESTRATÉGICO').click();
  await shot(page, `app_${theme}_gerando`, { wait: 600 });
  await page.waitForTimeout(3500);
  await shot(page, `app_${theme}_studio`, { wait: 1500 });
  if (D) {
    await box('studio', 'doc', page.locator('#editorial-doc'));
    await box('studio', 'tabConteudo', page.getByText('1. CONTEÚDO'));
    await box('studio', 'tabEstilo', page.getByText('2. PERSONALIZAÇÃO'));
    await box('studio', 'exportar', page.locator('button', { hasText: /^exportar/i }));
    await box('studio', 'salvar', page.locator('button', { hasText: /^salvar$/i }));
    await box('studio', 'titulo', page.locator('input').first());
  }

  // Documento inteiro (para animar o "scroll" pelo plano) — viewport alto, sem header sticky
  const docEl = page.locator('#editorial-doc');
  const fullDoc = async (name) => {
    if (!D) return;
    await page.setViewportSize({ width: 1920, height: 9000 });
    const tag = await page.addStyleTag({ content: '.sticky,[class*="sticky"]{position:static!important}' });
    await page.waitForTimeout(800);
    await docEl.screenshot({ path: `${OUT}/${name}.png` });
    await tag.evaluate((n) => n.remove());
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(300);
  };
  await fullDoc('doc_standard_full');

  // Presets ficam na aba "2. Personalização"
  await page.getByText('2. PERSONALIZAÇÃO').click();
  await shot(page, `app_${theme}_personalizacao`, { wait: 700 });
  const presetBtn = (key) => page.locator('button', { hasText: new RegExp('^' + key.replace('_', ' ') + '$', 'i') }).first();
  if (D) for (const k of ['standard', 'classic_gold', 'dark_onyx', 'minimal_sand']) await box('estilo', k, presetBtn(k));
  for (const key of ['classic_gold', 'dark_onyx', 'minimal_sand']) {
    await presetBtn(key).click();
    await shot(page, `app_${theme}_preset_${key}`, { wait: 900 });
    await fullDoc(`doc_${key}_full`);
  }
  await ctx.close();
}

writeFileSync(`${OUT}/layout.json`, JSON.stringify(layout, null, 1));
writeFileSync(`${OUT}/layout.js`, `window.LAYOUT_DATA = ${JSON.stringify(layout, null, 1)};
`);
await browser.close();
