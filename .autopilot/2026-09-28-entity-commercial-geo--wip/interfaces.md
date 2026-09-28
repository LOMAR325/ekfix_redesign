# Интерфейсы прогона `entity-commercial-geo`

Читать **до** того, как писать код. Это решённые границы; не изобретай свои версии.
Спецификация — `spec.md` рядом (истории и Решения §1–§13).

## Правила проекта (не выводятся из кода)

- **Стек:** Next.js 16.3.4 (App Router, Turbopack), React 19.2.8, TypeScript strict, zod 4,
  vitest 3, Node 25. Без `src/`, без Tailwind/CSS-модулей/CSS-in-JS. `next.config.ts`:
  `images.formats:["image/webp"]`, `typedRoutes:true`, `redirects()`.
- **Команды** (любой `npm`/`npx` — с `</dev/null`): `npm test` · `npm test -- <path>` ·
  `npx tsc --noEmit` · `npm run build` (≈ SSG + `/api/book` ƒ) · `npm start` (порт 3000) ·
  `npm run dev`.
- **Зависимости не ставить.** Нужна новая — вернуть `BLOCKED`, не `npm install`.
  Playwright для визуальных проверок есть в системном npx-кэше (не зависимость проекта):
  `find ~/.npm/_npx -path "*node_modules/playwright/package.json"` → `require` по абсолютному
  пути из скрипта в `.autopilot/…/qa/`, не из кода проекта.
- **Дизайн не менять.** Новые страницы — из `components/ui/*` и существующих классов
  `app/globals.css`. Новое CSS-правило — только если без него невозможно: вернуть в
  контракте `CONCERNS` с обоснованием, точечно, приписка в `docs/adr/0002`.
- **Контент — только в `data/*`.** В `app/**` и `components/**` нет JSX-литералов с
  пользовательским текстом (исключение — плейсхолдеры полей и сообщения валидации формы).
  Контент сайта — на английском, без кириллицы в видимом тексте.
- **Факты.** Любой факт о бизнесе — из уже опубликованного на сайте или из фактов в брифе
  (дан только факт 1: Constantin, без фамилии). Нет факта — блок `status: "draft"`, в
  `CONCERNS` — какого факта не хватает. Никаких выдуманных цифр, отзывов, кейсов, районов,
  ZIP, сертификатов, фото, **нового текста от первого лица**, превосходных степеней
  («#1», «best», «top-rated», «leading», «most … »).
- **Не трогать:** `data/business.areaServed` (ADR 0006), тексты отзывов `data/reviews.ts`
  (`text` байт-в-байт), `AggregateRating` по опубликованным отзывам, `lib/book/*` кроме
  явно указанного, `.env*`, `docs/adr/0001–0013` (новые решения — новыми ADR, пишет таск 11),
  `app/globals.css` (см. выше), `CLAUDE.md`, `.autopilot/**` кроме своей папки `qa/`.
- **SSG-only.** Ни одной страницы с `dynamic`/`revalidate`; динамичен только `app/api/book`.
  Параметры URL (`?as=`) читаются на клиенте, не через `searchParams` страницы.
- **Владение файлами.** `data/types.ts`, `lib/publish.ts`, `lib/routes.ts`, `lib/links.ts`
  после таска 01 — только чтение для остальных тасков; `lib/jsonld.ts`,
  `components/JsonLd.tsx`, `lib/breadcrumb.ts` после таска 02 — только чтение.
  `components/ui/*` в параллельных волнах **не редактируется**: новый компонент — в
  `components/<своя-область>/`. Нужна правка общего файла — `BLOCKED` с описанием.
- **Не коммитить.** Коммитит оркестратор после ревью.

## Границы, решённые в спецификации

| Модуль | Владеет | Выставляет | Прячет |
|---|---|---|---|
| `lib/publish` | правило видимости | `isPublished(x)`, `published(xs)`, `routable(x)`, `isDraftPreview(x)` | проверку `NODE_ENV` |
| `data/*` | весь контент и факты | типизированные константы (spec §2); `getTown(slug)`, `getService(slug)`, `getCommercialPage(slug)`, `getArticle(slug)`, `homeReviews()`, `reviewCategories()` | — |
| `lib/routes` | список живых URL | `publishedPaths(): string[]` | как собирается из данных |
| `lib/links` | перелинковку | `areaLinksForHome()`, `areaLinksForService(slug)`, `linksForCommercial(slug)`, `serviceLinkForArticle(a)`, `serviceLinkForCase(c)`, `commercialCardHref(category)` → `ChipItem[]`/`string` | выбор ближайшего опубликованного района, якорь-запасной |
| `lib/nav` | меню | `mainNav: NavEntry[]` | фильтрацию черновиков, условие «Guides» |
| `lib/jsonld` | разметку schema.org | `ids`, `graph()`, `businessNode()`, `websiteNode()`, `ownerNode()`, `serviceNode()`, `articleNode()`, `faqNode()`, `breadcrumbNode()` | форму узлов |
| `lib/breadcrumb` | трейл крошек | `breadcrumbTrail(steps)` → `{ crumbs, jsonLd }` (jsonLd = узел для `graph`) | — |
| `lib/redirects` | таблицу редиректов | `redirectRules()` | таблицу старого ekfix.us |
| `lib/book` + `BookingProvider` | заявку | `submitLead` (без изменений); контекст `{appliance,setAppliance,contactAs,setContactAs}` | разбор URL-параметров |
| `scripts/` | проверки | `check:copy`, `check:similarity` (npm scripts) | — |

**Швы для тестов** (vitest, только публичные функции):

1. `lib/book` — как сейчас.
2. `lib/routes` + `app/sitemap.ts` — sitemap = `publishedPaths()`; ни одного черновика; при
   переключении статуса в фикстуре путь появляется/исчезает.
3. `lib/jsonld` — `@id`, ссылки на бизнес, Person без фамилии, `articleNode` бросает на
   непроверенной статье, `businessNode()` без опций не содержит `areaServed`/`aggregateRating`/`priceRange`.
4. `lib/redirects` — все 43 старых URL покрыты или совпадают с живым путём; назначения ∈
   `publishedPaths()`; нет цепочек; не-корневые не ведут на `/`.
5. `lib/links` + `lib/nav` — не отдают черновиков; «Guides» нет при нуле опубликованных статей.
6. Инварианты данных — по файлу на модуль (чтобы параллельные таски не делили файл):
   `data/people.test.ts` (нет «Konstantin» вне `reviews.text` — таск 02), `data/commercial.test.ts`
   (`brandNames` ⊂ бренды сайта — таск 03), `data/guides.test.ts` (опубликованная ⇒
   `reviewedByOwner` и `author`; источники на коды — таски 07/10), `data/cases.test.ts` (нет полей
   клиента, `area` ∈ известных slug — таск 07).

## Ключевые типы (из spec §1, §3, §6, §11 — таск 01 вносит их в `data/types.ts` дословно по смыслу)

```ts
export type PublishStatus = "draft" | "published";
export type Publishable = { status: PublishStatus };
```

`Town`/`TownPage` — spec §3 (с `coverage`), `CommercialPage` — spec §6, `GuideArticle`/
`GuideCategory` — spec §11, `RepairCase` — история 75 (без полей клиента),
`Review.segment?: "commercial"`, `Review.area?: string`.

## Что построили таски

*(дописывается по мере приёмки тасков: реальные сигнатуры, файлы, отклонения)*

## Из таска 01 — фундамент

- `lib/publish`: `isPublished(x)`, `published<T>(xs): T[]`, `routable(x)` (published || `NODE_ENV==="development"`), `isDraftPreview(x)`. Компонент `<DraftBanner item={…}/>` (`components/DraftBanner.tsx`) — плашка DRAFT только в dev.
- `lib/routes`: `publishedPaths(): string[]` — уже включает `/appliance-repair`, `/commercial-appliance-repair`, `/reviews` (роуты появятся в тасках 03/04/06) и не включает `/for-business`. `app/sitemap.ts` = `publishedPaths()`.
- `lib/links`: `areaLinksForHome()`, `areaLinksForService(slug)`, `linksForCommercial(slug)`, `serviceLinkForArticle(a)`, `serviceLinkForCase(c)` → `ChipItem[]`; `commercialCardHref(c: CommercialCategory): string`. Только опубликованное.
- Типы (`data/types.ts`): `PublishStatus`, `Publishable`, `PublishableFaq`, `TownPage`, `Town{kind,parent?,page?}`, `ForBusinessSegment` (со `status`), `CommercialPage` (+ поле `name` — короткое имя для чипов/маскировки), `GuideCategory`, `GuideArticle`, `RepairCase` (+ `slug`, `title`, `serviceSlug`; без полей клиента), `Review.segment?`/`area?`, `ReviewCategory`.
- Данные: `data/towns` — `hasPublishedPage(t)` (единственный предикат), `townsWithPublishedPage()` (в момент вызова), `townSlugs` (routable; пока константа), `getTown`; 5 городов с `page` (published), `south-charlotte`/`ballantyne` — `page.status:"draft"` (каркас). `data/commercial` — `commercialPages` (7, draft), `publishedCommercialPages()`, `commercialSlugs()`, `getCommercialPage`. `data/guides` — `guideCategories`, `articles` (пусто), `publishedArticles()`, `articleSlugs()`, `getArticle`. `data/cases` — `cases` (пусто), `publishedCases()`, `caseSlugs()`, `getCase`. `data/reviews` — `homeReviews()`, `reviewCategories()`; Tony Z. `segment:"commercial"`. `data/site` — `site.{brandBadge,header,footer,links,draftBanner}` (`links.allServiceTowns` — «All Service Towns →»). Типы `SegmentId`, `ContactAsOption` (`CommercialPage.contactAs`, `segmentId`, `ForBusinessSegment.id`). **Одна точка входа к опубликованному:** `publishedCommercialPages()`, `publishedArticles()`, `publishedCases()`, `townsWithPublishedPage()` — вне модулей данных `published(<сырой массив>)` не вызывать. Тестовый помощник `scenario(live[], run)` (в `app/sitemap.test.ts`/`lib/links.test.ts`) выставляет статусы сам — новые тесты не должны зависеть от текущих статусов в data.
- Скрипты: `npm run check:copy` (после build; жёсткий список → код ≠0), `npm run check:similarity -- --base <url> --group areas|commercial` — печатает полную и **редакционную** метрику (D01), вердикт по редакционной ≤ 0.30. Общий экстрактор `scripts/html-text.mjs`. Уже опубликованные города по редакционной: Charlotte 0.23, Fort Mill 0.33, Rock Hill 0.42, Matthews 0.44, Indian Trail 0.44 (общие отзывы и абзац про $75) — находка для отчёта, не повод менять порог. В layout нет `<main>` — скрипт берёт текст между `</header>` и `<footer>` минус `.cta-band`.
- **Правки к правилам для волны 3:** `data/types.ts` в волне 3 может менять **только таск 04 и только тип `Service`** (поле `ballantyneNote` и т.п.). Остальным таскам нужен новый тип — объявлять локально в своём модуле данных.
- **`contactAs` в `data/commercial.ts` уже по истории 52** (оборудование → «Other Business», restaurant → «Restaurant or Café», property-management → «Property Manager»). У `commercial-oven-range-repair` нет `applianceFormLabel` (нет категории в `commercialCategories`) — пресет appliance не ставится.
