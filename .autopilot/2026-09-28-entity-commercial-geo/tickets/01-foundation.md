# 01 — Фундамент: статусы публикации, схема данных, реестр путей, перелинковка

**Требования:** R01, R03, R06, R07, R08, R09, R10, R10.1, A01→R81, R08.1, R70 (модуль), R89, R26 (скрипт), R93 (скрипт)
**Blocked by:** —
**Зона:** `data/types.ts` · `lib/publish.ts` · `lib/routes.ts` · `lib/links.ts` · `app/sitemap.ts` · `data/towns.ts` (структура) · `data/b2b-segments.ts` (статусы) · `data/commercial.ts` (каркас) · `data/guides.ts` (каркас) · `data/cases.ts` · `data/reviews.ts` (поля) · `data/site.ts` · `app/towns/[slug]/page.tsx` + `lib/nav.ts` (только переход с `isFullPage` на `page.status`) · `components/DraftBanner.tsx` · `scripts/` · `package.json` (scripts)
**Волна:** 1
**Status:** ready

## Что должно заработать

Один механизм «черновик/опубликовано» для любой единицы контента и всё, на что опираются
остальные таски: полная схема типов, каркасы новых модулей данных, единый список живых
URL (из него строится sitemap), модуль перелинковки и два скрипта проверки. После этого
тасксы волны 3 только наполняют данные и рисуют страницы — схему никто не изобретает.

## Из брифа, дословно

> «Введи единый механизм публикации: у любой единицы контента (страница района, коммерческая страница, статья, кейс, блок) есть статус draft/published. Черновик не получает роут в продакшен-сборке, не попадает в sitemap, навигацию, перелинковку и JSON-LD. Публикация — смена одного поля в data/. Это развитие уже существующего флага placeholder в data/b2b-segments.ts — объедини их в один механизм, второй не заводи.»
> «Тексты и константы живут в data/, компоненты контент не хардкодят.»
> «Перелинковка — системой, из данных, а не вручную»

## Разделы спецификации

Истории 1–8, 79; Решения §1, §2, §3, §5 (реестр), §6 (тип), §10, §11 (типы); Границы и швы 2, 5, 6.

## Что сделать

1. `data/types.ts`: `PublishStatus`, `Publishable`; `Town`/`TownPage` (spec §3, включая `kind`, `parent`, `page?`, `coverage`, `zips`, `communities`, `whoWeServe`, `applianceNotes`, `faqs`, `seo`, `repairChips`); `CommercialPage` (spec §6); `GuideCategory`, `GuideArticle` (spec §11); `RepairCase` (история 75 — без имени/адреса клиента, `area?` = slug); `Review.segment?`, `Review.area?`; `ForBusinessSegment.placeholder` → `status`. `isFullPage` удалить.
2. `lib/publish.ts` — как в spec §1, с тестом (`routable` = published || `NODE_ENV === "development"`).
3. `components/DraftBanner.tsx` — плашка «DRAFT — not published» инлайн-стилем, рендерится только при `isDraftPreview`.
4. `data/towns.ts`: 5 городов получают `page` (`status: "published"`, `kind: "city"`, контент — как сейчас, плюс перенос `TOWN_SEO` и `CHARLOTTE_REPAIR_CHIPS` из страницы в `page.seo`/`page.repairChips`); 21 город — без `page`; добавить `south-charlotte` (`kind:"area"`, `parent:"charlotte"`) и `ballantyne` (`parent:"south-charlotte"`) с минимальной `page: { status: "draft", … }` (контент наполнит таск 05). `getTown`, `townSlugs`, `fullPageTowns` → на `routable`/`published`. Страница `app/towns/[slug]` и `lib/nav` — только переход на новые поля, вёрстка без изменений.
5. `data/b2b-segments.ts`: `placeholder` → `status` у всех сегментов (hoa → `"draft"`), `publicForBusinessSegments = published(forBusinessSegments)`.
6. Каркасы: `data/commercial.ts` — 7 записей с `slug` (ровно из брифа), `kind`, `segmentId`, `contactAs`, `applianceFormLabel` (для оборудования — из `commercialCategories.formLabel`, где есть), `status: "draft"`, остальные поля пустые/минимальные (наполнит таск 03); `data/guides.ts` — 7 категорий + `articles: []` + `getArticle`; `data/cases.ts` — `cases: RepairCase[] = []`; `data/reviews.ts` — `segment: "commercial"` у Tony Z. (детали «Restaurant»), `homeReviews()` (commercial первыми), `reviewCategories()` (правило из истории 76).
7. `data/site.ts` — тексты шапки и подвала (ярлыки ссылок, CTA «Book a Repair», описание в подвале, «Discounts for veterans…»), `Header`/`Footer` читают оттуда (ссылки и порядок меню — не трогать, это таск 09).
8. `lib/routes.ts` — `publishedPaths()` (spec §5: статические, включая будущие `/appliance-repair`, `/commercial-appliance-repair`, `/reviews`; 12 услуг; опубликованные коммерческие, города/районы, гайд-хаб при ≥1 опубликованной статье, статьи, кейсы). Пока новых роутов нет — пути `/appliance-repair`, `/commercial-appliance-repair`, `/reviews` включаются, а `/for-business` — нет: **временно** sitemap и реальные роуты расходятся до тасков 03/04/06; тест шва 2 проверяет формулу, а не существование файлов. `app/sitemap.ts` = `publishedPaths()` с теми же priority/changeFrequency-правилами. Переписать `app/sitemap.test.ts`.
9. `lib/links.ts` — все функции из Границ; только `published()`-данные; `ChipItem` из `components/ui/chip-row`. `areaLinksForHome()`: опубликованные районы (South Charlotte, затем Ballantyne), затем Charlotte и 4 города со страницей, затем «All service towns →» `/towns`. `commercialCardHref(category)`: опубликованная дочерняя по соответствию категории → её URL, иначе прежний якорь хаба на **новом** пути `/commercial-appliance-repair#…`. Тест шва 5 (links).
10. `scripts/check-copy.mjs` (`npm run check:copy`): после `npm run build` читает prerender-HTML из `.next/server/app/**/*.html`, берёт видимый текст (без `<script>`/`<style>`/атрибутов), ищет «Globall», «#1», «top-rated», «best in», кириллицу — печатает страницу+фрагмент, код выхода ≠0 при находке; отдельным списком (без ошибки) — `\bbest\b`, `\bmost\b`, `leading`, `premier` для ручного разбора.
11. `scripts/similarity.mjs` (`npm run check:similarity -- --base http://localhost:3000 --group areas|commercial`): spec §10 — видимый текст `<main>`, маскировка имени сущности (набор имён задаётся по группе из `data`-slug/названий — передать JSON-списком в скрипт или прочитать из маленького JSON, который скрипт генерирует сам через `node --experimental-strip-types`… — выбери самый простой рабочий способ без зависимостей), Jaccard 3-шинглов, матрица + максимум по каждой странице.
12. `package.json`: скрипты `check:copy`, `check:similarity`.

## Критерии приёмки

- [ ] `grep -rn "isFullPage\|placeholder" app components data lib` — пусто (кроме обычных слов в тексте)
- [ ] HOA по-прежнему не рендерится на `/for-business`; 5 городов — те же страницы, та же вёрстка (дифф HTML `/towns/charlotte` до/после — только отсутствие изменений в видимом тексте)
- [ ] `/towns/ballantyne`, `/towns/south-charlotte`: в `npm run build && npm start` → 404; в `npm run dev` → открываются с плашкой DRAFT
- [ ] sitemap = `publishedPaths()`, тест шва 2 зелёный и проверяет, что черновик не попадает, а после смены статуса в фикстуре — попадает
- [ ] `lib/links` тест: ни одной ссылки на черновик; `commercialCardHref` ведёт на `/commercial-appliance-repair#…`, пока дочерние — черновики
- [ ] `npm run check:copy` работает на текущей сборке и печатает отчёт (находки текущего сайта — в CONCERNS, не чинить здесь)
- [ ] `npm run check:similarity` работает против `npm run dev` на группе `areas` (цифры — в CONCERNS)
- [ ] `npm test`, `npx tsc --noEmit`, `npm run build` — зелёные
