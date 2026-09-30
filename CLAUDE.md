<!-- autopilot:start -->
# EK Global — сайт (Next.js)

Сайт ремонта бытовой и коммерческой техники **EK Global** (Charlotte, NC; владелец-техник Constantin),
боевой домен `https://ekfix.us`. **Сайт из двух веток (ADR 0022):** `/` — только выбор «для бизнеса / для дома»,
коммерческая ветка с корнем `/commercial-appliance-repair`, бытовая — `/appliance-repair`; у каждой свои шапка,
меню, подвал, блоки и форма; приоритет — коммерция. Все страницы SSG, динамичен только `POST /api/book`.
Визуал перенесён 1:1 со старого статического сайта (эталон — только история git) плюс точечные правки из
`docs/adr/0002`. Решения — `docs/adr/0001–0023` (отменённые/заменённые помечены в заголовке файла). Фон SEO-решений —
`ek-global-seo-strategy-2026.md`; `ek-global-site-issues.md` — аудит от 2026-09-02.

## Команды

Любой `npm`/`npx` в неинтерактивной среде — с `</dev/null`.

| Команда | Что делает |
|---------|------------|
| `npm run dev` | dev на :3000; черновики открываются с плашкой DRAFT |
| `npm run build` · `npm start` | прод-сборка (Turbopack + `tsc`) · её запуск на :3000; черновиков нет |
| `npm test` · `npm test -- <path>` | vitest: всё · один файл |
| `npx tsc --noEmit` (= `npm run typecheck`) | строгая типопроверка |
| `npm run check:copy` | после `build`: видимый текст `.next/server/app/**/*.html`; код 1 на кириллицу, `#1`, `top-rated`, `best in`, `Globall`; `best`/`most`/`leading`/`premier` — список на ручную вычитку |
| `npm run check:similarity -- --base <url> --group areas\|commercial` | шаблонность страниц группы на живом сервере (`npm run dev`): Жаккар по 3-словным шинглам, имена сущностей замаскированы; полная и **редакционная** метрики, вердикт по редакционной |

Последний прогон (2026-09-30): `npm test` → 234 passed (18 файлов) · `tsc --noEmit` → 0 · `npm run build` → зелёный.

Стек: Next.js 16.3.4 (App Router) · React 19.2.8 · TypeScript 5.9 strict · zod 4 · vitest 3 · Node 25.
Без `src/`, алиас `@/*` → корень. `next.config.ts`: `images.formats:["image/webp"]`, `typedRoutes:true`,
`redirects()` → `lib/redirects`.

## Структура

```
app/
  layout.tsx                  корневой: html/body, шрифты через <link> (ADR 0004), Analytics, дефолтная metadata — и всё
  (entry)/                    `/` — страница выбора; layout: EntryHeader + EntryFooter
  (commercial)/               layout: Header/Footer variant="commercial"
    commercial-appliance-repair/        главная коммерческой ветки + [slug]: 7 дочерних (equipment | industry)
  (residential)/              layout: Header/Footer variant="residential"
    appliance-repair/         главная бытовой ветки + [slug]: 12 услуг (статуса нет — всегда живые)
    towns/                    индекс зон + [slug]: города и районы
  (shared)/                   layout: Header/Footer variant="shared" (нейтральная шапка со ссылками на обе ветки)
    about/ reviews/ brands/ appliance-repair-guide/ repair-cases/
  sitemap.ts robots.ts icon.svg globals.css
  api/book/route.ts           POST заявки обеих форм (runtime nodejs)
components/
  Header.tsx → HeaderBar.tsx  server-половина считает меню варианта и копию, client-половина — интерактив
  EntryHeader EntryFooter EntryLink   шапка/подвал/ссылки страницы выбора
  HomeBookForm BusinessRequestForm lead-submit.ts booking-link.ts   формы, общая отправка, пресеты из URL
  JsonLd DraftBanner Footer Analytics
  ui/*                        общие презентационные блоки (+ hero, book-section, stars) + rich-text.ts, image-dimensions.ts
  residential/*               секции бытовой главной
  commercial/*                блоки коммерческой ветки
data/                         весь контент: модули + types.ts (ADR 0001, 0014)
lib/                          publish routes links nav redirects jsonld breadcrumb seo analytics · book/
scripts/                      check-copy.mjs · similarity.mjs · html-text.mjs (общий экстрактор видимого текста)
```

## Ключевые файлы

- **`lib/publish.ts`** — `isPublished(x)`, `published(xs)`, `routable(x)`, `isDraftPreview(x)`; единственное место,
  где читается `NODE_ENV` (в момент вызова).
- **`lib/routes.ts`** — `publishedPaths(): string[]`; `articlePath(slug)` — единственное написание `/appliance-repair-guide/<slug>`.
- **`lib/links.ts`** — `areaLinksForHome()`, `areaLinksForService(slug)`, `linksForCommercial(slug)`,
  `serviceLinkForArticle(a)`, `serviceLinkForCase(c)` → `ChipItem[]` для `ChipRow`; кросс-ссылки веток
  `businessLinkForService(slug): ChipItem | null`, `homeLinksForCommercial(slug): ChipItem[]`; `commercialCardHref(category)`.
- **`lib/nav.ts`** — `commercialNav()`, `residentialNav()`, `sharedNav()`, `navFor(variant)` → `NavEntry[]`
  (`NavLink | NavGroup{label, basePath?, children, wide?}`; группа без `basePath` активна только на своей странице).
- **`lib/analytics.ts`** — `track(event)`: GA4 `branch_select`, `commercial_form_submit`, `residential_form_submit`
  (no-op без `gtag`).
- **`lib/jsonld.ts`** — `ids`, `graph(...nodes)`, `businessNode(opts?)`, `websiteNode()`, `ownerNode()`,
  `serviceNode({url, name, areaServed})`, `articleNode(a)`, `faqNode(url, items)`, `breadcrumbNode(url, trail)`;
  `ServedArea` = строка (→ City) | `{name, kind, containedIn?}` (→ City/Place).
- **`lib/breadcrumb.ts`** — `breadcrumbTrail(steps)` → `{crumbs, jsonLd}`: видимые крошки для `PageHero` + узел для `graph`;
  `unlinked` — шаг без ссылки только в видимом трейле.
- **`lib/redirects.ts`** — `redirectRules(): RedirectRule[]`; старый URL добавляется строкой в `OLD_EKFIX_PATHS`,
  путь без автоматического соответствия — в `OLD_COMMERCIAL`.
- **`lib/seo.ts`** — `pageMetadata({title, description, path})` (canonical = `path`); `absoluteUrl(path)` — единственный
  `new URL(path, siteUrl)`; `metadataBase`.
- **`lib/book/`** — `submitLead(input: unknown): Promise<LeadResult>`; `schema.ts` (zod `leadSchema` =
  `discriminatedUnion("branch", [home, business])`, ADR 0023); `sinks.ts` — `ConsoleLeadSink` (всегда), `EmailLeadSink`
  (Resend REST; тема коммерческой заявки начинается с `[BUSINESS]`), `WebhookLeadSink`, общий `deliver()` логирует и
  глотает сбой канала; `options.ts` — реэкспорт опций из `data/forms`.
- **`components/booking-link.ts`** — `homeBookingHref({appliance?})`, `businessRequestHref({businessType?, equipment?})`,
  `readHomePreset(search)`, `readBusinessPreset(search)`; имена URL-параметров `appliance`/`type`/`equipment` живут только здесь.
- **`components/DraftBanner.tsx`** — `<DraftBanner item={x}/>`, рендерится только при `isDraftPreview(x)`.
- **`data/business.ts`** — NAP, `siteUrl` (боевой домен, ADR 0020), `areaServed` (20 зон, ADR 0006), `social`, `gaId`.
- **`data/people.ts`** — `owner` (`name: "Constantin"`, без фамилии; `role`, `credentials`, `knowsAbout`, `photos`),
  `aboutPage`, `aboutPendingBlocks()`.
- **`data/site.ts`** — `branchPaths` (корни веток и якоря форм — единственное написание), `SiteVariant`, копия трёх
  шапок (`site.header[variant]`: подзаголовок, куда логотип, кнопка, переключатель) и подвалов, подписи меню `site.nav`,
  `crossBranch`, `branchCtas`, `ratingText`, `draftBanner`.
- **`data/entry.ts`** — `entryPage` (seo, H1), `entryPanels()` (бизнес первым; коммерческие ссылки — только опубликованные).
- **`data/residential.ts`** — `residentialHome` (копия бытовой главной + seo), `homeWhereWeWork()` → `{chips, areaServed}`.
- **`data/forms.ts`** — опции обеих форм; **`data/booking.ts`** — копия форм.
- **`data/towns.ts`** — `towns` (28: 26 городов + 2 района), `hasPublishedPage(t)` (единственный предикат),
  `townsWithPublishedPage()`, `townSlugs`, `getTown`, `publishedAncestors/Descendants`, `alsoServedNC/SC`,
  `townsIndexAreaServed()`, копия `townsIndex`/`townPageCopy`/`areaCopy`.
- **`data/commercial.ts`** — `commercialPages` (7; equipment несут `applianceFormLabel`, `homeCounterparts`, `cardImage`,
  industry — `businessType`), `publishedCommercialPages()`, `commercialSlugs()`, `getCommercialPage`, `commercialHubPath`,
  `commercialHub` (копия коммерческой главной), `commercialPageCopy`, `commercialCta`, `segmentBusinessType`.
- **`data/guides.ts`**, **`data/cases.ts`** — `articles`/`cases`, `publishedArticles()`/`publishedCases()`,
  `articleSlugs()`/`caseSlugs()`, `getArticle`/`getCase`, `guideHubGroups()`, копия шаблонов (ADR 0019).
- **`data/services.ts`** — 12 `services`, `commercialCategories`, `applianceRepairHub` (`path`, `name`), `servicePage`.
- **`data/b2b-segments.ts`** — имя историческое: сегменты (`forBusinessSegments`, `publicForBusinessSegments`),
  `processSteps`, `serviceFormats`, `trustChips`, `businessFaqs`, `whyCallUs`, `commercialServices`, `laundryObjectTypes`.
- **`data/reviews.ts`** — 6 `reviews`, `aggregate`, `homeReviews()`, `reviewCategories()`, `reviewsByAuthors()`.

## Архитектура

- **Поток:** `data/*` (контент + у каждого модуля одна точка входа к опубликованному) → `lib/*` (производное: пути,
  ссылки, меню, редиректы, разметка) → server-страницы `app/**` собирают секции из `components/{ui,home,commercial}` → SSG.
  Client-острова: `HeaderBar`, `HomeBookForm`, `BusinessRequestForm`, `EntryLink`, `RepairCard`.
- **Публикация (ADR 0015):** `Publishable = {status: "draft" | "published"}` несут страницы городов/районов (`town.page`)
  и их подблоки, коммерческие страницы и их FAQ/подблоки, статьи, кейсы, сегменты хаба, блоки `/about`.
  Поисковые слои (sitemap, меню, ссылки, JSON-LD, редиректы) берут только `published`/`isPublished` — черновика там нет
  даже в dev. Роуты берут `routable` (published или `next dev`): в dev черновик открывается под `<DraftBanner>`,
  `next build` роута ему не даёт. Опубликовать = сменить один `status` в `data/` и пересобрать — всё остальное подтянется.
- **Черновые подблоки** опубликованной страницы: города/районы и коммерция фильтруют `isPublished` (не видны и в dev),
  `/about` — `routable` (видны в dev-превью).
- **Динамический роут:** `dynamicParams = false` + `generateStaticParams` из `*Slugs()` + guard
  `if (!x || !routable(x)) notFound()` и в `generateMetadata`, и в странице + `<DraftBanner item={x}/>`.
- **Ветки (ADR 0022):** страница — в группе своей ветки; шапка и подвал — из layout группы, не со страницы. Новая
  страница одной ветки — в её группу, общая для обеих — в `(shared)`. Ссылка из ветки в ветку — только через
  `lib/links` (кросс-ссылки из `homeCounterparts`) или `branchPaths`; `/` — без редиректов и JS-шлюза.
- **Живые URL:** `lib/routes.publishedPaths()` — единственный список: 7 статических + 12 услуг + опубликованные коммерческие
  и города/районы + хаб гайдов при ≥1 статье + статьи + кейсы. `app/sitemap.ts` = этот список (+ priority/changeFrequency).
- **Перелинковка:** `lib/links` отдаёт только опубликованные цели. Районы: на главной — от общего к частному перед городами,
  на услуге — от частного к общему. Статья/кейс → своя бытовая услуга или коммерческая страница (пока та черновик — хаб).
  `commercialCardHref` — дочерняя страница с тем же `applianceFormLabel`, иначе якорь хаба.
- **Меню (ADR 0022, группы — ADR 0021):** строится в момент вызова. Коммерческое: Equipment ⌄ · Industries ⌄
  (+ Hotels & Laundry → `#hotels`) · Service Area → `#service-area` · About · Reviews; кнопка «Request Service»,
  переключатель «For Homes →». Бытовое: We Repair ⌄ (12 услуг) · Service Area ⌄ · Brands · Guides (только при
  опубликованной статье) · About · Reviews; «Book a Repair», переключатель «For Business →». Нейтральное: For Business ·
  For Homes · Brands · Guides? · About · Reviews. `Header` (server) считает меню и копию и отдаёт пропсами `HeaderBar`
  (client) — модули `data/` в клиентский бандл шапки не попадают. Логотип → корень своей ветки.
- **JSON-LD (ADR 0018):** на странице ровно один `<JsonLd data={graph(...)}/>` (`graph` отбрасывает `null`). Узлы ссылаются
  друг на друга через `{"@id"}`; `ids` от `business.siteUrl`: `/#business`, `/#website`, `/about#owner`; узлы страницы —
  `<url>#service|#faq|#breadcrumb|#article`. Разметка = только видимое на странице:
  - `businessNode()` на каждой странице (NAP, часы, соцсети — они в шапке/подвале, у `/` — в тонком подвале); опции:
    `image` — `/` и обе главные веток (фото владельца), `aggregateRating` — обе главные (hero: «5.0 · 6 reviews») и
    `/reviews`, `areaServed` — места, перечисленные на этой странице (бытовая главная — `homeWhereWeWork().areaServed`,
    коммерческая — чипы `#service-area`, `/towns` — `townsIndexAreaServed()`, город/район — он сам), `knowsAbout` —
    только коммерческая главная. `priceRange` нигде. У главных веток нет BreadcrumbList (крошек на них не видно).
  - `websiteNode` — только `/`; полный `ownerNode` — только `/about`; `serviceNode` — услуги и коммерческие дочерние.
  - `faqNode` выкидывает черновые пункты (`null` при нуле); `articleNode` бросает на черновике и на `!reviewedByOwner`.
- **Крошки:** `breadcrumbTrail(steps)` — один трейл на видимые крошки и узел; у районов цепочка по `parent`,
  черновой уровень пропускается (`publishedAncestors`).
- **Города и районы (ADR 0008, 0017):** `Town{kind: "city" | "area", parent?, page?}`; без `page` роута нет (только списки
  «Also serving» на `/towns`). Районы живут под `/towns/<slug>`: ballantyne → south-charlotte → charlotte.
- **Редиректы (ADR 0013, 0020):** `next.config.ts` `redirects()` = `redirectRules()`: 7 правил старых `*.html` +
  `/for-business` → хаб + старый sitemap ekfix.us (`OLD_EKFIX_PATHS`, 43). Назначение считается: путь жив — правила нет;
  иначе `_`→`-` и нижний регистр; иначе индекс раздела; коммерческие — через `OLD_COMMERCIAL` (дочерняя страница, а пока она
  черновик — якорь хаба). Всё 308, один хоп; назначения ∈ `publishedPaths()` на момент сборки.
- **Формы (ADR 0010, 0023):** `HomeBookForm` (в `#book` бытовой главной: имя, телефон, прибор, описание) и
  `BusinessRequestForm` (в `#request` коммерческой: компания, контакт, телефон, email, тип бизнеса, оборудование,
  объекты/юниты, срочность, описание) — client, uncontrolled → `POST /api/book` с `branch` → `submitLead(unknown)` →
  zod-объединение → `Promise.allSettled` по включённым sinks. Невалидно, не JSON, нет `branch` → `400 {ok:false, errors}`,
  доставки нет; валидно → `{ok:true}`, даже если sink упал. `<select>` и схема читают одни массивы (`data/forms`).
- **Пресет формы:** со страниц без формы — ссылка из `components/booking-link` (`/appliance-repair?appliance=…#book`,
  `/commercial-appliance-repair?type=…&equipment=…#request`); форма разбирает `location.search` на монтировании и берёт
  только реальные опции. Услуга и город → бытовая форма; дочерняя коммерческая → её `businessType`/оборудование;
  `/about`, `/reviews`, `/brands` → обе кнопки (`BranchCtas`, бизнес первым).

## Соглашения кода

- **Контент — только в `data/*`** (ADR 0014): в `app/**` и `components/**` видимый текст приходит из данных; исключения —
  `placeholder` полей формы и сообщения валидации. Язык сайта — английский; кириллица в видимом тексте роняет `check:copy`.
- Строки `data/` могут нести доверенный HTML (`<br><span>`, `<strong>`, `&amp;`) — рендер через `richProps()`
  (`components/ui/rich-text.ts`).
- Имя бизнеса — только `business.name` (`"EK Global"`), имя владельца — только `owner.name` (`"Constantin"`, без фамилии);
  NAP и домен — только из `data/business`.
- **Только подтверждённые факты:** факт о бизнесе берётся из уже опубликованного на сайте. Нет факта — блок
  `status: "draft"` (заглушка `[TODO: confirm with the owner — …]` видна только в dev). Цифры, отзывы, кейсы, районы, ZIP,
  сертификаты, фото — только подтверждённые; тон без превосходных степеней (`#1`, `best`, `top-rated`, `leading`, `most …`).
- **Новая копия — от третьего лица или безлично**; прежняя копия от первого лица сохраняется как есть.
  `reviews[].text` — байт-в-байт; `business.areaServed` не трогать (ADR 0006).
- **Шаблонность ≤ 0.30 перед публикацией:** город/район или коммерческая страница переводится в `published`, только если
  редакционная метрика `check:similarity` ≤ 0.30 против каждой страницы своей группы (сервер — `npm run dev`).
- Опубликованное вне модуля данных берётся через его точку входа (`publishedCommercialPages()`, `publishedArticles()`,
  `publishedCases()`, `townsWithPublishedPage()`/`hasPublishedPage`); `published(<сырой массив>)` вызывают только сами `data/*`.
- SSG-only: страницы без `dynamic`/`revalidate`; параметры URL читаются на клиенте, не через `searchParams`.
- **Дизайн не меняется** (ADR 0002): новые страницы — из `components/ui/*` и существующих классов `app/globals.css`,
  разовая мелочь — инлайн-`style`. Новое CSS-правило/класс — только если без него никак, точечно, с припиской в
  `docs/adr/0002` (так появились `.card-grid-4`, `.section-light-2`, `.fstat*`). Tailwind, CSS-модули, CSS-in-JS,
  утилиты и спонтанная чистка правил — `BLOCKED`.
- **Боковой навигации (`.side-rail`) нет нигде** — решение владельца, даже если бриф её просит.
- **Стили сайта из двух веток** — блок `Two-branch site` в конце `globals.css`, классы `branch-*`, только токены (ADR 0002, 0022).
- **Звёзды `.stars`** — только через `components/ui/stars` (`aria-hidden`, рядом всегда оценка текстом); слов «Google»
  в подписях рейтинга нет, пока владелец не подтвердит, где опубликованы отзывы.
- **Оттенки секций:** каждая `<section className="section …">` несёт `section-light` (#f4f5f2) / `section-light-2`
  (#e7e9e2) / `section-dark` (#0b0c0b) / `section-dark-2` (#141613); соседние секции всегда разного оттенка — линий-
  разделителей нет. `PageHero` и `CtaBand` — `--bg-dark` (#0b0c0b) и тоже считаются соседями. Секции переменного числа
  чередуют `i % 2` light / light-2.
- Акцентные ссылки без подчёркивания: цвет `--accent` + «→»; инлайн-ссылки стилизует `a[style*="--accent"]`.
- Шапка: брейкпоинт меню 1024/1025 — `@media` в `globals.css` и `matchMedia("(min-width: 1025px)")` в `HeaderBar`
  меняются вместе. ≤1024 — бургер, телефон и кнопка ветки внутри меню (`.nav-ctas`), переключатель веток — в верхней
  строке; ≥1025 — `.header-actions`, дропдауны по hover/`focus-within`, клик по группе — no-op. На 1025–1099 у шапок с
  переключателем скрыт подзаголовок логотипа — иначе вторая строка.
- `.brand-grid` — flexbox (`.brand-cell { flex: 1 1 156px }`), последняя строка растягивается на всю ширину.
- Изображения — `next/image` с размерами из `imageDims(src)` (`components/ui/image-dimensions.ts`);
  `hero-technician.webp` — `priority`.
- Внутренние href-строки из `data/` — через `Anchor` (`components/ui/anchor.tsx`, каст к `Route` для `typedRoutes`).
- Новый блок одного раздела — в `components/<раздел>/`; `components/ui/*` — только общее.

## Окружение

`.env.example` — только имена; `.env*`, кроме `.env.example`, в `.gitignore`. Все пусты → работает только
`ConsoleLeadSink` (форма — прототип, ADR 0010).

- `RESEND_API_KEY` + `BOOK_NOTIFY_EMAIL` — вместе включают `EmailLeadSink` (отправитель — плейсхолдер
  `onboarding@resend.dev`, TODO-домен).
- `BOOK_WEBHOOK_URL` — включает `WebhookLeadSink` (POST лида JSON-ом).
- `NODE_ENV` — ставит Next; `development` открывает роуты черновикам (`lib/publish`).

## Тесты

vitest (`environment: node`, алиас `@`). Только публичные функции на швах; вёрстку и презентационные компоненты не тестируем.

- Шов 1, `lib/book` — `lib/book/submit.test.ts`, `lib/book/sinks.test.ts`, `app/api/book/route.test.ts`: валидный лид
  каждой ветки → `{ok:true}` и каждый включённый sink; нет/неизвестный `branch` и невалидные поля → 400 с ключом поля;
  тема письма `[BUSINESS]` только у коммерческой; упавший sink не валит лид; `enabled` следует `process.env`.
  `components/booking-link.test.ts` — пресеты туда и обратно, чужие значения отбрасываются.
- Шов 2 — `app/sitemap.test.ts`: sitemap = `publishedPaths()`, черновиков нет, смена `status` добавляет/убирает путь.
- Шов 3 — `lib/jsonld.test.ts`: стабильные `@id`, ссылки на бизнес, Person без фамилии, `articleNode` бросает на
  непроверенной статье, `businessNode()` без опций — без `areaServed`/`aggregateRating`/`priceRange`.
- Шов 4 — `lib/redirects.test.ts`: 43 старых URL ekfix.us + 22 старых `*.html` + `/for-business` — одним 308 на путь из
  `publishedPaths()` (матчер самого Next), без цепочек, не-корневые не на `/`.
- Шов 5 — `lib/links.test.ts` (+ кросс-ссылки веток), `lib/nav.test.ts` (три меню), `data/residential.test.ts`,
  `data/entry.test.ts`: черновиков нет; Guides только при опубликованной статье; `areaServed` бытовой главной = её чипы;
  на странице выбора бизнес первым, ссылки только на опубликованное.
- Шов 6, инварианты данных (файл на модуль): `data/people.test.ts` (только «Constantin»; строки узла Person дословно
  видны на `/about`), `data/commercial.test.ts` (`brandNames` ⊂ бренды сайта), `data/guides.test.ts` (опубликованная ⇒
  `reviewedByOwner` + `author`; коды ошибок подтверждены `sources`; шаги через « — »), `data/cases.test.ts` (нет полей
  клиента, `area` ∈ slug'и `data/towns`), `data/services.test.ts` (H1 = что и где, `areaServed` = места из H1, заметки
  Ballantyne безличны), `data/towns.test.ts` (иерархия, FAQ Ballantyne, ни одного ZIP).
- `lib/publish.test.ts` — правило видимости: `published` не зависит от `NODE_ENV`, `routable` — зависит.
- Приёмы: статус-зависимый тест сам выставляет статусы через `scenario(live, run)` и восстанавливает их — от текущих
  статусов в `data/` не зависит; инвариант доказывает, что краснеет, временно вставленной фикстурой-нарушителем; ожидаемые
  значения — литералы, а не пересчёт тем же кодом.

## Подводные камни

- `npm run dev` и `npm run build` в одной папке делят `.next`: dev держит `.next/dev/lock` (второй `next dev` в той же
  папке не стартует), build перезаписывает прод-выход, который читают `npm start` и `check:copy`.
- Next матчит `source` в `redirects()` без учёта регистра: `/towns/Lesslie` ловит и `/towns/lesslie`, а правило, где
  источник и назначение отличаются только регистром, зациклится — `redirectRules()` на нём бросает. Старый путь без живого
  назначения тоже роняет сборку (с именем пути).
- `next.config.ts` грузит `lib/redirects` → `lib/routes` → `data/*`, а `scripts/similarity.mjs` грузит `data/*` через Node
  type stripping: в `data/*` и `lib/{publish,routes,links,redirects}` — относительные импорты без `@/` и только стираемый
  TS (без `enum`/`namespace`/parameter properties).
- Хаб `/appliance-repair-guide` в проде — 404, пока нет опубликованной статьи; все 11 статей — черновики (ждут технической
  вычитки владельца). `cases` пуст — роутов `/repair-cases/*` нет.
- Сейчас черновики: South Charlotte (нет фактов владельца: ZIP, сообщества, сегменты), 11 статей, HOA-сегмент хаба,
  блоки `/about` Brands/Training/Company history. `publishedPaths()` = 32 пути.
- Rock Hill, Fort Mill, Matthews, Indian Trail без общего абзаца про $75 и без общих отзывов (ни один отзыв не привязан
  к городу) — ссылка «Pricing & terms →» на `/appliance-repair#pricing`; редакционная шаблонность 0.12–0.14.
- Текст Charlotte в `data/towns.ts` ветвится по статусу Ballantyne (`ballantyneLive`, считается при импорте).
- `/for-business` удалён (308 на коммерческую главную, ADR 0016); его контент — в `data/b2b-segments.ts` под старым именем.
- Два dev/prod-сервера из прошлых сессий могут держать порты 3111/3112 и отдавать устаревший код — перед проверкой
  убедиться, что сервер запущен из текущего кода (`lsof -iTCP:<port> -sTCP:LISTEN`).
- `business.maintenancePlanName` — плейсхолдер, нигде не рендерится. Фото коммерческих категорий — бытовые webp-заглушки,
  у стиральной машины — `dryer.webp` (TODO в `data/services.ts`).
- `#who-we-serve` — светлая секция с тёмными `.audience-card` (так задумано, `h3` перекрашен). `.brand-cell` (фон
  `--bg-light`) на `section-light` сливается с фоном — на `/brands` так и задумано.
- Визуальная проверка: Playwright есть в системном npx-кэше, не в зависимостях —
  `find ~/.npm/_npx -path "*node_modules/playwright/package.json"`, `require` по абсолютному пути из скрипта вне кода
  проекта. Зависимости — только текущие из `package.json`; новая — по согласию пользователя.

## Как здесь работает Autopilot

Сборка ведётся навыком `/autopilot`. Требования, спецификация и таски — в `.autopilot/`.
Прогресс — `.autopilot/dashboard.html`. Правило: требование из `manifest.md`
может снять только пользователь.

Если работа продолжается — скажи «продолжи автопилот»: состояние поднимется
из `.autopilot/state.js`, переспрашивать ничего не нужно.
<!-- autopilot:end -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
