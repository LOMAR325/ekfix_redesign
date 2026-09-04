<!-- autopilot:start -->
# EK Global — сайт (Next.js)

Сайт ремонта бытовой техники **EK Global** (Charlotte, NC). Перенос статического
HTML/CSS/JS-сайта на Next.js (App Router + TypeScript strict) с приоритетом контента
на юрлиц (B2B). Визуально — **1:1 с прежним сайтом, это не редизайн**; исключение — 6 точечных
UX-правок захода `ux-polish` 2026-09-03 (коммит `6f2ae17`) по фидбеку владельца (`docs/adr/0002`).
Миграция сдана; заход 2026-09-02 закрыл дефекты аудита — актуальная карта состояния
`ek-global-site-issues.md` в корне. Старый сайт (`*.html`, `css/`, `js/`, `assets/`,
`sitemap.xml`) удалён — эталон визуала теперь только в истории git.

## Команды

| Команда | Что делает |
|---------|------------|
| `npm install` | Установить зависимости (node_modules на месте) |
| `npm run dev` | Локально, порт 3000 |
| `npm run build` | Продакшен-сборка (Turbopack, гоняет `tsc`); ~28 SSG-роутов + `/api/book` (ƒ) |
| `npm start` | Поднять прод-сборку |
| `npm test` | Тесты (`vitest run`) · один файл: `npm test -- <path>` |
| `npm run typecheck` / `npx tsc --noEmit` | Строгая типопроверка |

Последний прогон (заход `ux-polish`, 2026-09-03): `npm test` → 29 passed (5 файлов) ·
`tsc --noEmit` → 0 · `npm run build` → зелёный (28 SSG + `/api/book`) · редиректы 7/7 → 308.
Любой `npm`/`npx` в неинтерактивной среде — с `</dev/null`.

Стек: Next.js 16.3.4 · React 19.2.8 · TypeScript strict · zod 4 · vitest 3 · Node 25.
App Router, без `src/`, без Tailwind. `next.config.ts`: `images.formats:["image/webp"]`,
`typedRoutes:true`.

## Структура

```
app/
  layout.tsx              единственный layout: <html lang=en>, Google Fonts (не next/font),
                          <Header/>{children}<Footer/><Analytics/>, дефолтная metadata
  page.tsx                главная / (SSG) — 9 секций из components/home/*
  globals.css             старый css/style.css + .card-grid-4 + .audience-card h3 + правки ux-polish
                          (2026-09-03) — не заморожен, правится точечно с записью в ADR
  icon.svg                favicon (авто <link rel=icon>)
  robots.ts               /robots.txt · sitemap.ts  /sitemap.xml (22 URL)
  about/ brands/ for-business/ towns/   page.tsx — по одной SSG-странице
  towns/[slug]/page.tsx            5 городов (SSG, dynamicParams=false)
  appliance-repair/[slug]/page.tsx 12 страниц техники (SSG, dynamicParams=false)
  api/book/route.ts       POST заявки — единственный динамический роут (runtime nodejs)
components/
  Header Footer Analytics JsonLd BookForm BookingProvider   корневые
  ui/*        17 презентационных + 2 хелпера (rich-text.ts, image-dimensions.ts) — 1:1 с классами старого CSS
  home/*      9 секций главной (Hero, WhoWeServeGrid, RepairSection, FamilySection, ReviewsSection,
              TrustBand, BrandsSection, BusinessCtaBand, BookSection); SideRail удалён — рейла и
              его scroll-spy (бывш. js/main.js) больше нет
  for-business/*   ProcessSteps, ServiceFormats
data/          ЕДИНСТВЕННЫЙ источник контента, извлечён дословно из старых *.html
  business.ts       NAP + siteUrl-заглушка + areaServed (20) + rating
  services.ts       12 услуг + commercialCategories (4) + serviceSlugs/getService + applianceFormOptions
  towns.ts          26 городов (5 isFullPage) + fullPageTowns/townSlugs/getTown + alsoServedNC/SC + townsIndex
  reviews.ts        6 отзывов + aggregate + reviewsByAuthors()
  brands.ts         33 бренда + homeBrands/residentialBrands/commercialBrands + brandNote + brandsPage
  b2b-segments.ts   контент /for-business (+ publicForBusinessSegments = без placeholder) + микрокопия главной (homeHero, …)
  types.ts          все типы слоя данных, без рантайма
lib/
  seo.ts        metadataBase · absoluteUrl(path) · pageMetadata({title,description,path})
  jsonld.ts     билдеры schema.org (см. Архитектура)
  breadcrumb.ts breadcrumbTrail(steps) → {crumbs, jsonLd}
  nav.ts        mainNav — производная от data/services + data/towns
  book/         options.ts · schema.ts (zod) · sinks.ts (Console/Email/Webhook) · submit.ts (submitLead)
```

## Ключевые файлы

- **`app/layout.tsx`** — единственный layout; шрифты, Header/Footer/Analytics, дефолтная
  `metadata` (страницы переопределяют через `pageMetadata`).
- **`data/business.ts`** — NAP + `siteUrl: "https://ekfix.us"` (**заглушка** + TODO-домен) +
  `areaServed` (20, лимит GBP) + `rating` (из `reviews.aggregate`). Хардкод NAP где-либо ещё запрещён.
- **`data/*.ts`** — единственный источник контента. Правки текста/списков — только здесь.
- **`lib/jsonld.ts`** — `businessJsonLd()`, `serviceJsonLd(s)`, `faqJsonLd(items)`,
  `breadcrumbJsonLd(trail)`, `aggregateRatingJsonLd()`. Чистые функции, NAP из `data/business`.
- **`lib/seo.ts`** — `pageMetadata({title,description,path})` (canonical = `path`), `absoluteUrl(path)`
  (единственная точка `new URL(path, siteUrl)`), `metadataBase`.
- **`lib/breadcrumb.ts`** — `breadcrumbTrail(steps)` → видимые крошки для `PageHero` + JSON-LD из одного трейла.
- **`lib/nav.ts`** — `mainNav`, целиком выведен из `data/services` + `data/towns.fullPageTowns`.
  `NavGroup` несёт обязательный `basePath` (`/appliance-repair`, `/towns`); `Header` красит
  `.nav-trigger` активным при `pathname` под `basePath`.
- **`lib/book/`** — `submitLead(input: unknown)` точка входа; `schema.ts` zod-валидация;
  `sinks.ts` каналы доставки (общий `deliver(name, run)` — `try/catch` + `console.warn` для Email и
  Webhook); `options.ts` реэкспорт опций формы из `data/`. `EmailLeadSink` — реальный `POST` на
  Resend REST API через `fetch` (пакет `resend` не ставится), включается `RESEND_API_KEY` +
  `BOOK_NOTIFY_EMAIL` в `.env`; `from` = `onboarding@resend.dev` (плейсхолдер + TODO-домен).
- **`app/sitemap.ts`** — 22 URL, собирается из `data/services` (12) + `data/towns.fullPageTowns` (5) + 5 статических.
- **`components/ui/*`** — презентационные server-компоненты (кроме `RepairCard` — `'use client'`),
  данные пропсами, разметка и классы 1:1 со старым HTML.

## Архитектура

- **Поток:** `data/*` (контент-константы) → `components/ui/*` (презентация, классы из
  `globals.css`, данные пропсами) → страницы `app/**` (server components, SSG). `components/home/*`
  и `components/for-business/*` — сборка секций конкретных страниц из тех же `ui/*`.
- **JSON-LD:** `<JsonLd data={…}>` (`components/JsonLd.tsx`) сериализует каждый объект в
  отдельный `<script type="application/ld+json">` с эскейпом `< > &`. Билдеры `lib/jsonld`
  тянут NAP из `data/business`, рейтинг из `data/reviews.aggregate`, `knowsAbout` из
  `data/b2b-segments.commercialServices`. Имя бизнеса всегда `business.name` = `"EK Global"`.
- **Крошки:** `lib/breadcrumb.breadcrumbTrail(steps)` — один трейл даёт и `crumbs` (в `PageHero`),
  и `jsonLd` (в `<JsonLd>`); `unlinked`-флаг для quirk charlotte («Service Area» без ссылки).
- **Метаданные:** `lib/seo.pageMetadata` на каждой странице; `metadataBase` из `business.siteUrl`.
- **Редиректы:** `next.config.ts` `redirects()` — 7 правил `permanent: true` (308) со старых `*.html`
  на чистые роуты (`docs/adr/0013`).
- **Форма:** `BookForm` (`'use client'`, uncontrolled) → `POST /api/book` (Route Handler) →
  `submitLead(unknown)` → zod `leadSchema` → `Promise.allSettled` по `sinks.filter(s=>s.enabled)`.
  Ошибка валидации → `400 {ok:false,errors}`, sinks не трогаются; успех → `{ok:true}` даже если
  sink бросил. `BookingProvider`/`useBooking` пресетят `<select appliance>` по клику на карточку главной.
- **Города:** `/towns/[slug]` генерит только 5 `fullPageTowns` (`generateStaticParams` +
  `dynamicParams=false`); компонент дублирует guard `if (!town || !town.isFullPage) notFound()`.
  `/appliance-repair/[slug]` — 12 из `serviceSlugs`, тот же паттерн + guard на `SECTION_H2[slug]`.

## Соглашения кода

- `app/globals.css` — старый `css/style.css` + `.card-grid-4` (копия `.card-grid-3` на 4 колонки) +
  `.audience-card h3 { color: var(--text-light) }` (фикс контраста) + правки захода `ux-polish`
  (2026-09-03, коммит `6f2ae17`): уплотнение `.hero-content`/`.hero-ctas`/`.hero-meta`, удаление
  блока `.side-rail*`, снятие `border-bottom` у акцентных ссылок (`.not-listed a`, `.brand-note a`,
  `a[style*="--accent"]`) + их hover/`:focus-visible`, `.call-pill` 15px, удаление `.call-dot`,
  мост `.nav-dropdown::before`. Плюс заход `ux-polish-2` (2026-09-03): секции больше НЕ
  разделяются волосяной линией — сняты все `border-top` у `.section-dark`/`.section-dark-2`/
  `.cta-band`; разделение держится на шаге фона + отступах. Добавлен класс `.section-light-2`
  (`--bg-light-2`); тёмные оттенки разведены сильнее (`--bg-dark-2` `#141613`, `--bg-dark-3`
  `#1b1d18`, `--bg-dark-4` `#212320`). Правило: соседние секции никогда не одного оттенка
  (компоненты страниц чередуют light / light-2 / dark / dark-2). `.family-stats` и `.stat-row`
  из «квадратной 1px-сетки» переделаны в скруглённые карточки (`.family-stats` — 4 мини-карточки
  `.fstat` с лаймовой иконкой). Все правки — приписками в `docs/adr/0002`. **Больше не заморожен**:
  точечная UX-правка допустима, но каждая — записью в ADR. Спонтанный рефактор / чистка мёртвых
  правил / утилиты / Tailwind — по-прежнему `BLOCKED`.
- Никаких новых CSS-классов / Tailwind / CSS-in-JS / CSS-модулей — исключения только с записью
  в ADR (`.card-grid-4`, `.section-light-2`, `.fstat*`); в остальном — те же классы, что были
  в старом HTML (правка и удаление существующих правил допустимы). Ошибки полей формы
  рисуются инлайн-стилем (класса под ошибку нет).
- **Разделение секций:** без линий. Каждая `<section className="section …">` несёт оттенок
  (`section-light` `#f4f5f2` / `section-light-2` `#e7e9e2` / `section-dark` `#0b0c0b` /
  `section-dark-2` `#141613`); две соседние секции обязаны отличаться оттенком. Добавляя/меняя
  секцию — проверь соседей (в т.ч. `PageHero` = тёмный и `CtaBand` = `#0b0c0b`).
- Акцентные текстовые ссылки — без подчёркивания (сигнал: цвет `--accent` + стрелка `→`); hover
  осветляет цвет, `:focus-visible` даёт outline. Инлайн-ссылки ловит `a[style*="--accent"]`, класса нет.
- `Header`: `.call-dot` удалён; на десктопе (≥861px) дропдауны раскрываются по hover/`focus-within`
  (CSS + мост `.nav-dropdown::before`), `toggleGroup` там no-op; клик-тап работает только <861px.
- `next/image` для всех изображений (не `<img>`); размеры из
  `components/ui/image-dimensions.ts` (`imageDims(src)`); `hero-technician.webp` — `priority`;
  сохранять текущие `object-fit`/`object-position`.
- Контент только из `data/*`; хардкод NAP/списков в `app/`/`components/` запрещён. Имя бизнеса
  строго `"EK Global"` (НЕ `"EK Global Appliance Repair — Charlotte, NC"`).
- `/for-business` рендерит `data/b2b-segments.publicForBusinessSegments`
  (= `forBusinessSegments.filter(s => !s.placeholder)`), НЕ `forBusinessSegments`: сегменты с
  `placeholder: true` не попадают в HTML. Сейчас так скрыт `hoa` — вернуть снятием флага.
- SSG-only: ни одной страницы с `export const dynamic`/`revalidate`. Динамичен только `app/api/book`.
- `typedRoutes: true` — `Anchor` кастует `href` как `Route`; все роуты созданы.
- JSON-LD — только через `<JsonLd>` + билдеры `lib/jsonld`.
- Не выдумывать факты о бизнесе: если нет в прежнем контенте — видимый плейсхолдер
  `[TODO: подтвердить у владельца — …]`, а не правдоподобное число.
- Единоразовая редакционная копия страниц (заголовки секций, проза `/about`) **захардкожена
  в page-компонентах** — модуля `data/` под неё нет (зона тасков запрещала трогать `data/`):
  проза/заголовки `/about`; `SECTION_H2: Record<slug,{problems,faq}>` в `/appliance-repair/[slug]`;
  `TOWN_SEO` + `CHARLOTTE_REPAIR_CHIPS` в `/towns/[slug]`.
- Тесты — только на 3 швах (ниже).

## Окружение

`.env.example` (все значения пустые → доставка заявки выключена, форма работает как
**прототип**: принимает + валидирует zod + логирует через `ConsoleLeadSink`):

- `RESEND_API_KEY` — ключ Resend (вместе с `BOOK_NOTIFY_EMAIL` включает `EmailLeadSink` —
  реальный `POST` на Resend REST API через `fetch`, без правок кода).
- `BOOK_NOTIFY_EMAIL` — адрес получателя уведомлений о заявке.
- `BOOK_WEBHOOK_URL` — URL, куда `WebhookLeadSink` шлёт `POST` с заявкой (реальный `fetch`; off без переменной).

Секреты никогда не коммитить (`.gitignore`: `.env`, `.env.*`, кроме `.env.example`).

## Тесты

vitest. `npm test` (всё) · `npm test -- <path>` (один файл). 5 файлов, 29 passed:

- `lib/book/submit.test.ts` + `lib/book/sinks.test.ts` + `app/api/book/route.test.ts` — шов 1
  (доставка `lib/book`): валидный вход → `{ok:true}` + каждый `enabled` sink получил лид; невалидный /
  битый JSON → `400 {ok:false,errors}`, доставка не вызвана; sink бросил → всё равно `{ok:true}`;
  `Email`/`Webhook` `.enabled` следуют за `process.env` (мок `fetch` + `vi.stubEnv`).
- `app/sitemap.test.ts` — шов 2: default export = {5 статических} ∪ {12 услуг} ∪ {5 `isFullPage` городов}, ни больше ни меньше.
- `lib/jsonld.test.ts` — шов 3: `businessJsonLd().name === "EK Global"`, `telephone`/`areaServed` = `data/business`,
  `areaServed.length <= 20`, `aggregateRatingJsonLd().reviewCount === reviews.length`.

Вёрстку страниц, presentational-компоненты и данные не тестируем.

## Подводные камни

- **`create-next-app` интерактивен и зависает в неинтерактивной среде** — каркас собран
  вручную (`package.json` + `npm install` + конфиги).
- **Домен — заглушка.** `data/business.siteUrl = "https://ekfix.us"` + `// TODO: подтвердить
  финальный публичный домен`. Нигде больше домен не хардкодить.
- `data/towns.ts` = **26 записей** в одном массиве: 5 `isFullPage` (полный контент —
  `hero.lede`, `prose[]`, `districts[]`, `reviewAuthors[]`, `nearby`/`nearbyProse`, `hasMap`
  только у charlotte) + 21 не-полных (только `name`/`state`/`slug`). `alsoServedNC`/`alsoServedSC` —
  производные от не-полных, не отдельные литералы.
- `data/business.areaServed` = **20** (лимит GBP; срез с 26 по приоритету). Отброшенные 6
  остаются на `/towns` через `alsoServedNC`/`alsoServedSC`.
- `data/business.maintenancePlanName` (`"EK Maintenance Plan"`) — **плейсхолдер** + TODO.
- HOA-сегмент `/for-business` скрыт `placeholder: true` в `data/b2b-segments.ts` (владелец не
  подтвердил вертикаль); видимого `[TODO: …]` на странице больше нет — вернуть снятием флага.
- `data/b2b-segments.laundryObjectTypes.types` сейчас кодом не читается (оставлено как контент-данные).
- `#who-we-serve` — светлая секция (`section-light-2`), но `.audience-card` в `globals.css` тёмная:
  тёмные карточки на светлом фоне — так предписано spec (заголовки `h3` перекрашены в светлый —
  фикс контраста, `docs/adr/0002` приписка).
- Секции на главной: hero(D) · who-we-serve(L2) · repair(L) · family(D) · reviews(L) · trust-b2b(D) ·
  brands(D2) · business-cta(cta-band D) · book(D2). На `/for-business`: hero(D) · segments(L2) ·
  laundry(L) · process(L2) · why-call-us(D2) · formats(D) · faq(L) · cta(D). Чередование оттенков —
  замена снятым линиям-разделителям (`ux-polish` 2026-09-03).
- `docs/adr/0013` отменяет `0012` (редиректы всё-таки добавлены); `0002` и `0010` получили
  приписки от захода 2026-09-02; `0002` — ещё две от `ux-polish` 2026-09-03 (разморозка `globals.css`;
  разделение секций без линий + скругление `.family-stats`/`.stat-row`).

## Как здесь работает Autopilot

Сборка ведётся навыком `/autopilot`. Требования, спецификация и таски — в `.autopilot/`.
Прогресс — `.autopilot/dashboard.html`. Правило: требование из `manifest.md`
может снять только пользователь.

Если работа продолжается — скажи «продолжи автопилот»: состояние поднимется
из `.autopilot/state.js`, переспрашивать ничего не нужно.

## Источники правды по контенту

- `ek-global-seo-strategy-2026.md` — local SEO 2026 (GBP, schema, CWV, 90-дневный план).
- `ek-global-site-issues.md` — карта состояния после аудита (что закрыто, что унаследовано).

Три брифа (`website`, `b2b-priority`, `nextjs-master`) удалены — их след в `.autopilot/` и `docs/adr/`.
<!-- autopilot:end -->
