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
