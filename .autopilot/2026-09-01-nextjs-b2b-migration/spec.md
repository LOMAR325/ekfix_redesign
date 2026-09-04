# Спецификация: перенос EK Global на Next.js + приоритет B2B

## Задача

У владельца EK Global (ремонт бытовой техники, Charlotte NC) сейчас статический
HTML/CSS/JS-сайт из ~24 страниц. С ним пять проблем:

1. **Форма заявки на главной молча теряет каждую отправку** — в `js/main.js` она
   просто показывает «Thank you!» на клиенте и никуда не передаёт данные. Если с
   сайта «нет лидов», очень вероятно, что дело именно в этом.
2. **`sitemap.xml` покрывает 6 страниц из ~24** — 11 страниц техники, 4 из 5
   городов и `towns/index` в него не попали.
3. **Название бизнеса в JSON-LD разное** — на главной «EK Global Appliance Repair»,
   на страницах городов «EK Global Appliance Repair — Charlotte, NC» и т.д. Это
   бьёт по NAP-консистентности (ключевой local-SEO фактор).
4. **Контент захардкожен по 24 файлам** — телефон, часы, список городов (26 в
   `areaServed` при лимите GBP 20), список услуг и брендов повторяются в каждом
   файле. Любое изменение — правка десятков мест, рассинхронизация неизбежна.
5. **Сайт спроектирован под физлиц**, а бизнес-приоритет сместился на юрлиц
   (управляющие компании, рестораны/HoReCa, отели). Нужна реорганизация контента
   главной и `for-business` так, чтобы юрлица были первым приоритетом, а физлица —
   вторым, но полноценным.

## Решение

Сайт на **Next.js (App Router + TypeScript)**, визуально **попиксельно идентичный**
текущему (это не редизайн), где каждая страница, запись sitemap и блок JSON-LD
читают данные из единого слоя `data/`. Рассинхронизация NAP / sitemap / areaServed
становится структурно невозможной: один источник — много потребителей.

Форма заявки постит в реальный Route Handler `app/api/book/route.ts`, **собранный
как прототип**: принимает и валидирует заявку, логирует, возвращает успех; реальная
доставка на email/вебхук — заглушки-адаптеры за единым интерфейсом + переменные в
`.env.example`, вживую на этом этапе не подключается (решение владельца от 2026-09-01).

Блочные контентные правки из `ek-global-b2b-priority-brief.md` разделы 7–8
(новый блок «Who we serve», коммерческие карточки в сетке услуг, commercial-first
порядок брендов, блок доверия/комплаенс, FAQ на `for-business`, новое поле в форме,
расширение `for-business` до ≥4 сегментов + процесс + форматы) применяются **как
React-компоненты с теми же CSS-классами и структурой DOM**, а не переписыванием HTML.

Все страницы — SSG. Изображения — `next/image` из `public/images/`. `css/style.css`
переносится в `app/globals.css` практически дословно; единственные два расширения —
`.card-grid-4` (та же типографика/отступы, 4 колонки) и стиль нового `<select>` в
форме (идентичен существующему).

## Пользовательские истории

| # | Метка | История | Приёмка |
|---|-------|---------|---------|
| 1 | R01, R41 | Как владелец, я получаю сайт на Next.js (App Router + TS), который собирается и запускается | `npm run build` и `npm run dev` проходят без ошибок; TypeScript strict без ошибок |
| 2 | R02, R05, R34 | Как владелец, я вижу, что каждая перенесённая страница визуально не отличается от текущей | попиксельное сравнение каждого роута с текущим `.html`; расхождений нет, кроме `.card-grid-4` и нового `<select>` |
| 3 | R03 | Как поисковый бот, я получаю полностью отрендеренный HTML каждой страницы без клиентского рендера | все роуты, кроме `/api/*`, статические (SSG); в HTML-ответе есть весь контент |
| 4 | R04, R38i | Как посетитель на мобильном, я получаю оптимизированные изображения с ленивой загрузкой ниже первого экрана | все `<img>` из `assets/images` → `next/image`; hero-фото с `priority`, остальные lazy; CLS не растёт |
| 5 | R09, R32, R08 | Как владелец, я меняю телефон/часы/город в одном месте и это отражается везде | правка `data/business.ts` меняет header, footer, все JSON-LD, sitemap; grep по хардкоду NAP в `app/`/`components/` пуст |
| 6 | R09 | Как разработчик, я беру список услуг/городов/брендов/отзывов/сегментов из типизированных модулей `data/` | существуют `data/business.ts, services.ts, towns.ts, reviews.ts, brands.ts, b2b-segments.ts`; вёрстка и sitemap читают их, не хардкод |
| 7 | R10, R31i | Как владелец, я вижу домен в одной помеченной переменной, а не размазанным по файлам | `data/business.ts` → `siteUrl` со значением `https://ekfix.us` и комментарием `// TODO: подтвердить финальный публичный домен`; `metadataBase`, canonical, JSON-LD `url`, sitemap — все от неё |
| 8 | R11i | Как владелец GBP, я вижу в `areaServed` не более 20 зон, синхронно с sitemap | `data/business.ts` → `areaServed` ≤ 20 записей; тот же список в JSON-LD; полный список городов (в т.ч. сверх 20) — текстом на `/towns` (NC/SC-списки «также обслуживаем», как сейчас) + ссылка «Service Area» в футере (как сейчас). Новый блок городов на главной НЕ добавляется — держим 1:1 (website-brief §4 «на главной/в футере» закрыт существующей ссылкой в футере) |
| 9 | R12 | Как посетитель, я открываю `/`, `/about`, `/brands`, `/for-business` | 4 роута отдают перенесённый контент соответствующих `.html` |
| 10 | R13 | Как посетитель, я открываю `/appliance-repair/<slug>` для 12 видов техники | `generateStaticParams` из `data/services.ts` даёт ровно 12 страниц; контент каждой перенесён 1:1 (hero, 6 «частых проблем», бренды, 5 FAQ, «где работаем», «также ремонтируем») |
| 11 | R13 | Как посетитель страницы техники, я вижу валидный `Service` + `FAQPage` JSON-LD | оба блока рендерятся из данных услуги; проходят Rich Results Test |
| 12 | R14, R19 | Как посетитель главной, я вижу в сетке `#repair` карточки коммерческого оборудования | в конец `.repair-grid` добавлены 4 карточки `.repair-card`: Commercial Refrigeration → `/for-business#horeca`, Commercial Dishwasher/Warewasher → `/for-business#horeca`, Commercial Laundry Equipment → `/for-business#laundry`, Ice Machine (high-volume) → `/for-business#horeca`; **без отдельных роутов**; фон/фото — существующие webp как временная заглушка (`data/services.ts` `commercialCategories[].image`) |
| 13 | R14, R23 | Как посетитель, я вижу те же коммерческие пункты в `<select>` формы | опции формы генерируются из `data/services.ts`; коммерческие пункты присутствуют |
| 14 | R15, R47i | Как посетитель, я открываю `/towns/<slug>` для 5 городов с уникальным контентом | `generateStaticParams` из `towns.filter(t => t.isFullPage)` = Charlotte, Rock Hill, Fort Mill, Matthews, Indian Trail; контент каждой перенесён 1:1 (включая карту у Charlotte, у остальных — как в оригинале) |
| 15 | R16, R39, R35 | Как SEO-аудитор, я не могу достучаться до города без `isFullPage: true` | любой другой slug на `/towns/[slug]` → `notFound()` (404); в `generateStaticParams` его нет |
| 16 | R17i | Как поисковый бот, я получаю `/robots.txt` и `/sitemap.xml`, сгенерированные из данных | `app/robots.ts` + `app/sitemap.ts`; статический `sitemap.xml` удалён |
| 17 | R07, R43 | Как владелец, я уверен, что sitemap покрывает ровно существующие роуты | `app/sitemap.ts` строит URL из статических роутов + `data/services.ts` + `towns.filter(isFullPage)`; тест сверяет вывод с фактическим набором роутов — ничего не пропущено, ничего лишнего |
| 18 | R06, R42 | Как посетитель, я отправляю форму заявки и получаю подтверждение | POST `/api/book` с валидными полями → 200 `{ok:true}`, форма показывает блок «Thank you!»; событие залогировано на сервере |
| 19 | R06.1 | Как посетитель, я вижу понятную ошибку, если заполнил форму неверно | POST с пустым именем/телефоном/типом техники → 400 `{ok:false, errors}`; форма показывает текст ошибки у поля, введённое не пропадает; клиентская валидация `required` остаётся |
| 20 | R06.2 | Как посетитель, я вижу понятное сообщение, если запрос не прошёл (не белый экран) | fetch к `/api/book` бросил исключение / вернул не-2xx → форма показывает «Не удалось отправить — позвоните (980) 371-4319», форма остаётся с введёнными данными (минимум, без кнопки retry — «прототип») |
| 21 | R06.3 | Как посетитель, я не отправляю одну заявку дважды двойным кликом | пока запрос в полёте — кнопка `disabled`, текст «Sending…»; повторный submit игнорируется (одна строка, стандартная защита) |
| 22 | R06.4, R06a | Как владелец, я позже подключаю реальную доставку, не трогая роут | `lib/book` содержит интерфейс `LeadSink` и заглушки `ConsoleLeadSink` (активна), `EmailLeadSink`/`WebhookLeadSink` (no-op, включаются переменными `.env`); `.env.example` содержит пустые `RESEND_API_KEY`, `BOOK_NOTIFY_EMAIL`, `BOOK_WEBHOOK_URL` |
| 23 | R18, R21, R27 | Как посетитель главной, я вижу новую секцию «Who we serve» сразу после hero, до `#repair` | секция `#who-we-serve` (`.section .section-light`, `.card-grid-4`); `.section-head`: eyebrow = «01a / Who we serve», h2 = «Homes, kitchens, and everything you manage.»; 4 карточки `.audience-card` в порядке: 1) Property Management & Multifamily → «See property management services →» `/for-business#property-management`, 2) Restaurants & Commercial Kitchens → `/for-business#horeca`, 3) Hotels & Multifamily Laundry → `/for-business#laundry`, 4) Homeowners → `/#repair`; тексты 30–45 слов, написаны заново (не скопированы с `for-business`); **`.side-rail` остаётся ровно 6 пунктами как сейчас (без дота для новой секции); нумерация существующих eyebrow'ов (`02 / What we repair` … `06 / Book`) не меняется** |
| 24 | R20, R27 | Как посетитель главной, я вижу бренды в порядке commercial-first | на **главной** `#brands`: ячейки в порядке коммерч./проф. → премиальные встраиваемые → массовые бытовые; `.lede` = «Commercial and residential — from Hobart and Girbau to Sub-Zero and Thermador.». **`/brands` переносится 1:1** (две свои секции «Residential & premium kitchen» и «Commercial & specialty refrigeration» — порядок не трогаем; b2b §5 IA: «brands.html — без изменений на этом этапе»). `data/brands.ts` держит бренды с полем `tier`; главная рендерит отсортированный список, `/brands` — свои две группы фильтром по `tier` |
| 25 | R21 | Как управляющая компания, я вижу блок доверия/онбординга на главной | новая секция `#trust-b2b` (`.section .section-dark-2`), заголовок «Built for vendor onboarding.», `.chip-row` из чипов: Licensed & Insured · EPA 608 & OSHA Certified · COI Available on Request · Invoice / ACH Billing for Businesses · Same Technician, Every Visit |
| 26 | R25, R26 | Как посетитель, я вижу B2B-акценты в hero и остальных блоках главной | hero: «We fix it. You enjoy it.» в `<h1>` остаётся; `.lede` первым упоминает бизнес-аудиторию (property managers, restaurants), вторым — homeowners; `.hero-meta` small → «5.0 on Google · property managers, restaurants & homeowners»; текстовая ссылка (существующая типографика, без нового компонента) рядом с `.hero-ctas`: «Managing a property or restaurant? See commercial services →» → `/for-business`. `#family`: +1 предложение в `.family-copy` про бизнес-клиентов («…whether it's a homeowner's kitchen or a restaurant walk-in — same technician, same standard.»). Новая секция `#business-cta` (второй экземпляр `.cta-band`) между `#brands` и `#book`: h2 = «Managing a property, restaurant, or hotel?», текст = «See commercial appliance repair, preventive maintenance plans, and portfolio pricing.», кнопки `.btn.btn-accent` «See Commercial Services» → `/for-business` и `.btn.btn-ghost-dark` → звонок |
| 27 | R23, R34 | Как посетитель, я выбираю в форме, от чьего лица обращаюсь | новый `<select>` «I'm contacting you as a…» перед «Describe the issue»: Homeowner / Property Manager / Restaurant or Café / Hotel or Hospitality / Other Business; стиль идентичен существующему `<select>`; значение уходит в `/api/book` |
| 28 | R22, R26 | Как управляющая компания на `/for-business`, я вижу расширенную страницу | **Сегменты:** ≥4 `.audience-card` с якорями-id `#property-management`, `#horeca`, `#laundry` (на существующем разделе прачечной) + новые `#hotels`, `#hoa`: Property Management & Multifamily (расширить текст: «across single properties or a full portfolio»), Restaurants & Cafés (HoReCa), Hotels & Hospitality (новая), HOA / Condo Associations (новая, с placeholder-оговоркой — см. «Открытые места»). **`.page-hero .lede`:** +3-е предложение про форматы («Whether it's a single emergency call, a standing maintenance contract, or service across a whole portfolio — we work the way your business already operates.»). **Раздел коммерческой прачечной:** +1 абзац с перечнем типов объектов (отели, лондроматы, здравоохранение, многоквартирные дома) и явной связкой со списком брендов-чипов; сам раздел получает `id="laundry"`. **Новый блок `#process`** (`.section .section-light`, `.card-grid-3`/`.card-grid-4`, нумерованные `.problem-card` с `.num`): 1) Request 2) Access & Scheduling 3) Diagnosis & Written Estimate 4) Repair, Photo Report & Invoice — между разделом прачечной и «Why … call us». **Новый блок `#formats`** (`.section .section-dark`, `.chip-row`): Single Service Call · Standing Maintenance Contract · Multi-Property Portfolio Agreement · Invoice / ACH Billing. **«Why … call us»:** +2 карточки `.problem-card` (Documented, not just done; Vendor-ready paperwork). **Финальный `.cta-band`:** вёрстку не менять, текст усилить упоминанием форматов из `#formats` |
| 29 | R22, R30 | Как посетитель `/for-business`, я вижу FAQ с ≥6 B2B-вопросами и валидной разметкой | секция `#faq-business` на `.faq-item` (тот же компонент `FaqAccordion`, что на страницах техники) с 6 вопросами из b2b §8 блок 7; рядом `<JsonLd type="FAQPage">` |
| 30 | R28 | Как физлицо, я по-прежнему нахожу на главной всё для себя | карточка Homeowners в `#who-we-serve`; полная сетка `#repair` (12 бытовых + 4 коммерч.); секция отзывов; секция `#family`; форма — ничего не урезано |
| 31 | R27 | Как аудитор контента, я вижу юрлиц раньше физлиц в каждом блоке с обоими сегментами | hero `.lede` и `.hero-meta`, `#who-we-serve` (порядок карточек), `#brands` (`.lede` и порядок ячеек), форма (`<select>` — Property Manager/Restaurant/Hotel перед Other) |
| 32 | R29, R33 | Как посетитель любой страницы, я получаю единообразный валидный JSON-LD | `<JsonLd>` компонент из `lib/jsonld`, читает `data/business.ts`; `HomeAndConstructionBusiness` на `/` (+ через layout metadata), `Service` на каждой странице техники, `FAQPage` везде, где `FaqAccordion`, `BreadcrumbList` на внутренних страницах; `AggregateRating` — только из `data/reviews.ts` (реальные отзывы, показанные на странице), не из «5.0 on Google» |
| 32a | R30 → b2b §7 | Как поисковый бот, я вижу в JSON-LD главной перечень коммерческих услуг | к `HomeAndConstructionBusiness` на `/` добавлено поле `knowsAbout: ["Commercial Appliance Repair", "Preventive Maintenance for Property Managers", "Commercial Kitchen Equipment Repair", "Commercial Laundry Equipment Repair"]` из `data/b2b-segments.ts` (`commercialServices`); проходит Rich Results Test |
| 33 | R24 | Как разработчик, я вижу контентные правки как компоненты, а не как переписанный HTML | новые блоки — компоненты (`WhoWeServeGrid`, `TrustBand`, `ProcessSteps`, `ServiceFormats`, `FaqAccordion`, `BusinessCtaBand`), данные из `data/` |
| 34 | R29 | Как SEO-аудитор, я не нахожу дословных дублей текста между `/` и `/for-business` | тексты новых блоков написаны заново под каждую страницу; ни один абзац не совпадает дословно |
| 35 | R31i | Как поисковый бот, я вижу корректные `<title>`/`<meta>`/canonical на каждом роуте | Next.js Metadata API на каждом роуте; `metadataBase` из `siteUrl`; canonical = абсолютный URL роута; `<title>`/`description` перенесены из текущих `.html` (для новых секций — не меняются на этом этапе, см. b2b §9) |
| 36 | R36, R38 | Как владелец, я не вижу на сайте выдуманных цифр доверия | ни одной новой числовой характеристики (годы с юрлицами, число B2B-клиентов и т.п.); где такой блок напрашивается — видимый плейсхолдер `[TODO: подтвердить у владельца]`; существующие реальные факты («10+ yrs», «EPA 608 & OSHA», «EPA Universal», «5.0») сохраняются как есть |
| 37 | R37i | Как посетитель, я вижу рабочее имя программы обслуживания | «EK Maintenance Plan» с пометкой `{/* TODO: имя утверждает владелец */}` в местах упоминания |
| 38 | R39i, R40i | Как посетитель, я вижу перенесённые 1:1 header/footer и клиентское поведение | `Header`/`Footer` в `layout.tsx`; мобильное меню, дропдауны, side-rail scroll-tracking, пресет прибора в форме перенесены как клиентские компоненты; GA4 `gtag` (`G-LFM6MSKBQ7`) через `next/script` |
| 39 | R44 | Как владелец, я вижу зелёные Core Web Vitals | локальный Lighthouse (mobile) по `npm run build && npm start`: Performance ≥ 90 на `/`, `/for-business`, одной странице техники, одном городе; LCP < 2.5s, CLS < 0.1, TBT в зелёной зоне |
| 40 | R45 | Как владелец, я получаю краткий отчёт | `.autopilot/<dir>/` + финальное сообщение: что сделано, самостоятельные решения и почему, открытые вопросы к владельцу (список b2b §11 + находки) |
| 41 | R46 | Как владелец, я вижу подтверждение, что 4 документа и вся кодовая база изучены до кода | в отчёте — перечень изученного; спецификация опирается на конкретные разделы 4 документов |

## Решения по реализации

- **Стек: Next.js 16 (App Router) + React 19 + TypeScript strict.** Node 25 в среде;
  `npm view next version` = 16.3.4 на дату. *Почему:* прямо задано брифом; актуальная
  стабильная линейка. Ставить `create-next-app` без Tailwind, без ESLint-строгого
  оверрайда сверх дефолта, с `src/`-каталогом на усмотрение исполнителя (в спеке пути
  без `src/` для краткости).
- **Без `output: 'export'`.** Route Handler `/api/book` требует серверный рантайм,
  `next/image` оптимизация — тоже. Все страницы всё равно SSG (статический рендер +
  `generateStaticParams`, никаких `dynamic`/`revalidate`); динамичен только `/api/book`.
  *Почему:* совместить требование «SSG для всех страниц» с «реальный Route Handler» и
  «next/image». *Следствие для владельца (в отчёт):* сайту теперь нужен Node-хостинг,
  не чисто статический — текущий staging на `zholudz.com/...` статический.
- **CSS: `app/globals.css` — дословная копия `css/style.css`** + два блока:
  `.card-grid-4 { … repeat(4, 1fr) … }` (копия `.card-grid-3` с 4 колонками и тем же
  адаптивом) и — ничего для нового `<select>`, он ловится существующим правилом
  `.book-form select`. Импорт один раз в `app/layout.tsx`. *Почему:* единственный
  способ гарантировать 1:1 буквально.
- **Шрифты: точные теги `<link>` на Google Fonts** (Manrope + JetBrains Mono,
  `display=optional`) + `preconnect` — как сейчас, в `app/layout.tsx`. *Почему:*
  максимальная визуальная точность; `next/font` даёт риск отличий в метриках.
- **Favicon: `app/icon.svg`** с тем же SVG, что в текущем data-URI.
- **Изображения:** `assets/images/*` → `public/images/*` (имена не менять — ссылки в
  `data/` стабильны). `next/image` с явными `width`/`height` либо `fill` в
  контейнере фикс-размера; сохранить текущие `object-fit`/`object-position`.
  `hero-technician.webp` — `priority`; остальные — по умолчанию lazy.
- **Слой данных `data/`:**
  - `business.ts` — `name: "EK Global"`, `legalName`, `phone`, `phoneHref`, `hours`,
    `address` (city/region/country, без улицы — SAB), `siteUrl` (заглушка + TODO),
    `areaServed` (≤20), `social`, `gaId`, `rating` (из reviews), `maintenancePlanName`
    (placeholder).
  - `services.ts` — 12 услуг: `slug`, `name`, `formLabel`, `title`, `metaDescription`,
    `hero` (h1, lede), `problems[6]` ({title, body}), `brands[]`, `faqs[]` ({q,a}),
    `whereWeWork[]`, `alsoRepair[]`. Плюс `commercialCategories[]` (4 шт: `label`,
    `formLabel`, `image`, `href` на `/for-business#…`) — **без slug/роута**.
  - `towns.ts` — города: `slug`, `name`, `state`, `isFullPage`, и для полных —
    весь уникальный контент (hero lede, prose-абзацы, districts[], reviews ref,
    nearby[], hasMap). Не-полные — только `name`/`state` для текстовых списков.
  - `reviews.ts` — 6 отзывов ({author, detail, text, appliance?, town?}); из них
    считается `AggregateRating` (ratingValue, reviewCount).
  - `brands.ts` — бренды: `name`, `logo`, `alt`, `tier` (`commercial`|`premium`|`mass`),
    `wide?`; экспорт уже отсортирован commercial-first. Отдельно `brandNote` строки.
  - `b2b-segments.ts` — сегменты для `#who-we-serve` (4, каждый с `href` на
    `/for-business#…`, заголовок секции) и для `/for-business` (4, каждый с `id`-якорем),
    каждый со своим текстом; `processSteps[4]`, `serviceFormats[]`, `trustChips[]`,
    `businessFaqs[6]`, `whyCallUs[]`, `commercialServices[]` (для JSON-LD `knowsAbout`),
    `businessCta` ({heading, text, ...}).

  Ровно 6 `data/`-модулей, как в брифе. Структура меню — не 7-й модуль данных, а
  производная: `lib/nav.ts` собирает её из `data/services` + `data/towns` + статических
  ярлыков.
- **`lib/jsonld.ts`** — чистые функции-билдеры: `businessJsonLd()` (включает
  `knowsAbout` из `data/b2b-segments.commercialServices`), `serviceJsonLd(s)`,
  `faqJsonLd(items)`, `breadcrumbJsonLd(trail)`, `aggregateRatingJsonLd()`. Все NAP —
  из `data/business.ts`. Компонент `<JsonLd data={…}/>` рендерит
  `<script type="application/ld+json">`.
- **`lib/seo.ts`** — `pageMetadata({title, description, path})` → объект `Metadata`
  с `alternates.canonical` = `new URL(path, siteUrl)`.
- **`lib/book/`** — `schema.ts` (zod: name, phone, appliance, contactAs, message?),
  `sinks.ts` (`LeadSink` интерфейс + `ConsoleLeadSink`, `EmailLeadSink`(stub),
  `WebhookLeadSink`(stub)), `submit.ts` (`submitLead(input)` — валидирует, шлёт во
  все активные sinks, возвращает `{ok}`/`{ok:false,errors}`). `app/api/book/route.ts`
  — тонкий `POST` вокруг `submitLead`. *Почему:* владелец подключает доставку позже,
  не трогая роут и форму.
- **`next.config.ts`** — `images` (formats webp), `typedRoutes`. **Без `redirects()`
  со старых `*.html`** — сайт на staging не проиндексирован на боевом домене, а бриф
  просит «ничего не додумывать»; при желании владельца добавляется тривиально позже.
- **Клиентское поведение** (`js/main.js` порт):
  - `Header.tsx` (`'use client'`) — мобильный toggle + дропдауны (useState), DOM 1:1.
  - `SideRail.tsx` (`'use client'`, только на `/`) — IntersectionObserver, active-класс.
  - `BookForm.tsx` (`'use client'`) — поля, submit → `fetch('/api/book')`, состояния
    thanks/error/loading, чтение выбранного прибора.
  - `BookingProvider` (`'use client'`, оборачивает секции `/`) — контекст
    `{appliance, setAppliance}`; `RepairCard` при клике на `href="#book"` вызывает
    `setAppliance(name)`. *Почему:* повторяет текущий `data-appliance` пресет без
    глобального DOM-поиска.
  - `Analytics.tsx` — `next/script` `afterInteractive`, тот же `gtag`/`G-LFM6MSKBQ7`.
- **Метаданные страниц** — из текущих `.html` дословно; для страниц с новыми
  секциями `<title>`/`description` не меняются (b2b §9). `for-business` description
  можно расширить упоминанием отелей (b2b §9) — craft, по месту.
- **Удаляется:** `sitemap.xml`, `index.html` и прочие `.html` (после переноса),
  `css/`, `js/` (после переноса). `assets/` → `public/`. 4 md-документа и
  `.autopilot/` остаются в репозитории.

## Границы и швы

| Модуль | Владеет | Выставляет | Прячет |
|---|---|---|---|
| `data/*` (6 модулей) | всем контентом-константами (NAP, услуги, города, отзывы, бренды, B2B-сегменты) | типизированные экспорты: `business`, `services`, `commercialCategories`, `towns`, `reviews`, `brands`, `b2bSegments` | — (это данные; смысл — единственный источник) |
| `lib/nav` | сборкой структуры меню | `mainNav` (из `data/services` + `data/towns` + ярлыки) | — (производная, не источник) |
| `lib/jsonld` | сериализацией в schema.org JSON-LD | `businessJsonLd()`, `serviceJsonLd(s)`, `faqJsonLd(items)`, `breadcrumbJsonLd(trail)`, `aggregateRatingJsonLd()` | форму объектов schema.org, чтение `data/business` |
| `lib/seo` | сборкой `Metadata` | `pageMetadata({title, description, path})` | `metadataBase`, вычисление canonical |
| `lib/book` | приёмом и валидацией заявки, выбором каналов доставки | `submitLead(input): Promise<Result>`, тип `LeadInput`, интерфейс `LeadSink` | zod-схему, список активных sinks, чтение env |
| `app/api/book/route.ts` | HTTP-обёрткой | `POST` → `{ok:true}` \| `400 {ok:false, errors}` | — (тонкий слой над `lib/book`) |
| `app/sitemap.ts` | сборкой карты сайта | default export `() => MetadataRoute.Sitemap` | перечисление роутов (берёт из `data` + статический список) |
| `components/*` | презентацией | React-компоненты, принимают данные пропсами | вёрстку; состояния не держат, кроме явных `'use client'` островов |

**Швы для тестов (Phase 5 тестирует только здесь):**

1. **`lib/book`** — `submitLead(input)` и HTTP-контракт `POST /api/book`: валидный
   вход → `{ok:true}` + sink вызван; невалидный → `{ok:false, errors}` без вызова
   доставки. Главный шов — единственное место с реальной логикой.
2. **`app/sitemap.ts`** — default export возвращает набор URL, который точно равен
   {статические роуты} ∪ {12 услуг} ∪ {5 isFullPage-городов} — ни больше, ни меньше
   (закрывает R43).
3. **`lib/jsonld`** — `businessJsonLd()` и `serviceJsonLd()`: `name === "EK Global"`
   (не «…Appliance Repair — Charlotte»), `telephone`/`areaServed` совпадают с
   `data/business.ts`; `aggregateRatingJsonLd()` считается из `data/reviews.ts`
   (закрывает R08/R32/R33).

## Вне рамок

| Требование | Почему не сейчас |
|---|---|
| R06a — реальная доставка заявки на email/вебхук | решение владельца 2026-09-01: «пока что это работать не будет, сделай просто как прототип»; интерфейс и `.env.example` готовы |
| R48 — скролл-анимация hero | бриф: «не трогать, зафиксировать как открытый вопрос»; отдельное усиление, не блокирует SEO/B2B |
| R49 — онлайн-запись с реальными слотами (Housecall Pro/Jobber) | бриф: вне периметра; нужно решение владельца по системе |
| R50 — страницы городов сверх топ-5 | анти-doorway правило (website-brief §4, seo §3); уникального контента под другие города нет |
| R51 — офлайн-шаги (GBP-профиль, каталоги, сбор отзывов/фото) | не задача кода; в отчёт как открытые вопросы |
| website-brief IA: `/блог`, `/отзывы`, `/контакты`, страницы брендов, комбо услуга×город | нет в текущем сайте; master-brief §3 их не включает; НЕ создавать сверх согласованного (R35) |
| R52i — E-E-A-T-слой на страницах услуг (первое лицо Константина + ссылки на сертификаты) — seo §3 | master-brief §4: страницы услуг на этом этапе «просто переносятся» 1:1; текст от первого лица от реального человека нельзя выдумывать (R36) — нужен текст от владельца. В отчёт как открытый вопрос |
| A01 — redirects `*.html` → чистые URL | бриф: «ничего не додумывать»; сайт не проиндексирован на боевом домене; тривиально добавить позже |
| Пересортировка `/brands` commercial-first | b2b §5 IA: «brands.html — без изменений на этом этапе». Реордер только на главной `#brands` |

## Открытые места

| Плейсхолдер | Где в коде | Что нужно от владельца |
|---|---|---|
| `siteUrl` | `data/business.ts` → `siteUrl = "https://ekfix.us"` + `// TODO` | подтвердить финальный публичный домен |
| Имя программы обслуживания | `data/business.ts` → `maintenancePlanName = "EK Maintenance Plan"` + TODO; используется в `#who-we-serve`/`for-business` | утвердить финальное имя |
| Числа доверия B2B | если блок напрашивается — `[TODO: подтвердить у владельца — годы работы с юрлицами / число B2B-объектов]` вместо цифры | реальные показатели |
| Карточка «HOA / Condo Associations» на `/for-business` | `data/b2b-segments.ts` — карточка с оговоркой `{/* TODO: подтвердить, что вертикаль реально обслуживается */}` | подтвердить список B2B-вертикалей |
| COI / W-9 / ACH формулировки | чипы «COI Available on Request», «Invoice / ACH Billing» в `#trust-b2b`/`#formats` | подтвердить готовность (страховой брокер / бухгалтерия) |
| B2B-отзывы | `data/reviews.ts` — только имеющиеся 6 (Tony Z. первым); порядок B2B-first, если владелец даст ещё | тексты доп. отзывов от УК/ресторанов |
| Коммерческие фото для 4 карточек `#repair` | `data/services.ts` `commercialCategories[].image` — временно существующие фото (`dishwasher.webp`, `kostia-laundry.webp` и т.п.) | реальные коммерческие фото |
| `BOOK_NOTIFY_EMAIL`, `RESEND_API_KEY`, `BOOK_WEBHOOK_URL` | `.env.example` (пустые) | вписать при подключении доставки |

## Покрытие манифеста

| Требование | Раздел спецификации |
|---|---|
| R01 | История 1; Решения §Стек |
| R02 | История 2; Решения §CSS, §Шрифты, §Изображения |
| R03 | История 3; Решения §Без export |
| R04 | История 4; Решения §Изображения |
| R05 | История 2; Решения §CSS |
| R06 | Истории 18–22; Границы `lib/book`; шов 1 |
| R06a | Истории 22; Вне рамок |
| R07 | Истории 16–17; шов 2 |
| R08 | Истории 5, 32; шов 3 |
| R09 | Истории 5–6; Решения §Слой данных; Границы `data/*` |
| R10 | История 7; Открытые места |
| R11i | История 8 |
| R12 | История 9 |
| R13 | Истории 10–11 |
| R14 | Истории 12–13; Решения §Слой данных |
| R15 | История 14 |
| R16 | История 15 |
| R17i | История 16 |
| R18 | Истории 23, 26, 31 |
| R19 | История 12 |
| R20 | История 24 |
| R21 | История 25 |
| R22 | Истории 28–29 |
| R23 | Истории 13, 27, 31 |
| R24 | История 33 |
| R25 | История 26 |
| R26 | Истории 26, 28 |
| R27 | Истории 23–24, 26, 31 |
| R28 | История 30 |
| R29 | Истории 33–34 |
| R30 | Истории 32, 32a |
| R31i | Истории 7, 35 |
| R32 | Истории 5, 32; шов 3 |
| R33 | История 32; шов 3 |
| R34 | Истории 2, 27; Решения §CSS |
| R35 | Вне рамок |
| R36 | История 36; Открытые места |
| R37i | История 37; Открытые места |
| R38i | История 38; Решения §Клиентское поведение |
| R39i | История 38 |
| R40i | История 38 |
| R41 | Истории 1, 39 |
| R42 | Истории 18–21; шов 1 |
| R43 | История 17; шов 2 |
| R44 | История 39 |
| R45 | История 40 |
| R46 | История 41; выполнено в Phase 0–2 (прочитаны 4 документа + вся кодовая база); подтверждается в отчёте |
| R47i | История 14 |
| R48 | Вне рамок |
| R49 | Вне рамок |
| R50 | Вне рамок |
| R51 | Вне рамок |
| R52i | Вне рамок; отчёт |
| A01 | Вне рамок (снято) |
