# 02 — Слой данных: services, towns, reviews, brands, b2b-segments

**Требования:** R09, R08, R11i, R14, R19, R20, R33, R37i, R47i, R28 (данные)
**Blocked by:** 01
**Зона:** `data/`
**Волна:** 2
**Status:** ready

## Что должно заработать

Весь контент сайта живёт в 6 типизированных модулях `data/`. Любая страница, sitemap
и JSON-LD берут списки/тексты/NAP отсюда, а не из захардкоженной вёрстки. `lib/nav.ts`
переключается с временного хардкода на `data/services` + `data/towns`.

## Из брифа, дословно

> «Собрать единый слой данных (data/business.ts, services.ts, towns.ts, reviews.ts, brands.ts, b2b-segments.ts) как источник правды для NAP, areaServed, sitemap, списков услуг/городов/брендов — вместо захардкоженного текста по файлам»
> «Название бизнеса в JSON-LD должно быть везде идентично («EK Global»)»
> «AggregateRating только для реальных отзывов»
> Дополнение: «Карточки в сетке + пункты формы» (коммерч. категории — без роутов)

## Разделы спецификации

Истории 5–8, 12–13, 14, 24, 30, 32a; Решения §Слой данных; interfaces.md §Ключевые типы.

## Что делать

Извлечь контент из существующих HTML (не выдумывать — переносить дословно):

1. **`data/services.ts`** — 12 услуг из `appliance-repair/*.html` + меню index.html.
   Порядок как в меню: refrigerator, washer, dryer, dishwasher, stove, range,
   cooktop, microwave, freezer, ice-maker, wine-cooler, garbage-disposal. Для каждой:
   `slug`, `name`, `formLabel` (значение из `<select id="appliance">` — напр. «Stove / Range»),
   `title`/`metaDescription` (из `<head>`), `hero.h1`/`hero.lede`, `problems` (6, из
   `.problem-card`), `brands` (из `.chip-row`), `faqs` (5, из `.faq-item` +
   `FAQPage` JSON-LD), `whereWeWork` (из секции «Where we work»), `alsoRepair`
   (из секции «Also repair»; у refrigerator её нет → `[]`).
   Плюс экспорт **`commercialCategories`** (4): Commercial Refrigeration (`horeca`),
   Commercial Dishwasher/Warewasher (`horeca`), Commercial Laundry Equipment (`laundry`),
   Ice Machine (high-volume) (`horeca`). `image` — временно существующие webp:
   `dishwasher.webp`, `garb_dispo.webp`, `kostia-laundry.webp`, `ice_maker_under.webp`
   (пометить `// TODO: реальные коммерческие фото`). `href` = `/for-business#<anchor>`.
   `formLabel` для формы: «Commercial Refrigeration», «Commercial Dishwasher», …
2. **`data/towns.ts`** — 6 записей. `isFullPage: true` для charlotte, rock-hill,
   fort-mill, matthews, indian-trail (перенести весь уникальный контент из
   `towns/*.html`: `hero.lede`, `prose[]` абзацы с `<strong>`, `districts[]` чипы,
   `reviewAuthors[]` — какие из 6 отзывов показаны на этой странице города,
   `nearby[]`, `hasMap` — `true` только charlotte). Индекс-страница
   (`towns/index.html`): списки «Also serving — NC» и «— SC» → отдельные экспорты
   `alsoServedNC[]`, `alsoServedSC[]` (простой список имён, без роутов).
3. **`data/reviews.ts`** — 6 отзывов из `index.html #reviews` (`author`, `detail`
   = подпись под именем, `text`). Экспорт `aggregate = { ratingValue: 5.0, reviewCount: 6 }`.
   Комментарий `// TODO: подтвердить у владельца, что все 6 отзывов — настоящие`.
4. **`data/brands.ts`** — все бренды из `brands.html` (обе секции) + `index.html #brands`.
   Поля `name`, `logo` (файл в `public/images/`), `alt`, `tier`, `wide?`.
   `tier`: `commercial` (hobart, blodget, Middleby, girbau, copeland, Beverage_Air,
   Perlick, Scotsman, Speed_Queen, True, U_line, Amana(?), …), `premium` (sub_zero,
   thermador, Wolf, Viking, bosch, JennAir, Dacor, DCS, Fisher_Paykel, Thor),
   `mass` (samsung, LG, whirlpool, kitchen_aid, electrolux, maytag, frigidare, GE,
   Haier, Hotpoint, Kenmore). Экспорт `homeBrands` = отсортировано commercial→premium→mass
   (для главной). `/brands` фильтрует по tier сам. Плюс строки `brandNote` (из
   `.brand-note` на обеих страницах).
5. **`data/b2b-segments.ts`**:
   - `whoWeServe` (4, для главной `#who-we-serve`): Property Management & Multifamily
     (`href: /for-business#property-management`, label ссылки «See property management services →»),
     Restaurants & Commercial Kitchens (`/for-business#horeca`), Hotels & Multifamily
     Laundry (`/for-business#laundry`), Homeowners (`/#repair`). Тексты 30–45 слов,
     **написать заново** (не копировать из for-business). `sectionHead: { eyebrow: "01a / Who we serve", h2: "Homes, kitchens, and everything you manage." }`.
   - `forBusinessSegments` (4): Property Management & Multifamily (`id: property-management`,
     расширить текущий текст for-business + «across single properties or a full portfolio»),
     Restaurants & Cafés (`id: horeca`, текущий текст + перечень оборудования),
     Hotels & Hospitality (`id: hotels`, НОВЫЙ), HOA / Condo Associations (`id: hoa`,
     НОВЫЙ, `placeholder: true` + `// TODO: подтвердить, что вертикаль реально обслуживается`).
   - `processSteps` (4): Request / Access & Scheduling / Diagnosis & Written Estimate /
     Repair, Photo Report & Invoice — с текстами по b2b §8 блок 4.
   - `serviceFormats`: ["Single Service Call", "Standing Maintenance Contract",
     "Multi-Property Portfolio Agreement", "Invoice / ACH Billing"].
   - `trustChips`: ["Licensed & Insured", "EPA 608 & OSHA Certified",
     "COI Available on Request", "Invoice / ACH Billing for Businesses",
     "Same Technician, Every Visit"].
   - `businessFaqs` (6): вопросы из b2b §8 блок 7, ответы написать по контексту сайта
     (без выдуманных цифр; COI/W-9/ACH — формулировки «available on request» /
     «we can», не обещания конкретики).
   - `whyCallUs`: 3 текущие карточки for-business + 2 новые (Documented, not just done;
     Vendor-ready paperwork).
   - `commercialServices`: ["Commercial Appliance Repair", "Preventive Maintenance for
     Property Managers", "Commercial Kitchen Equipment Repair", "Commercial Laundry
     Equipment Repair"] — для JSON-LD `knowsAbout`.
   - `businessCta: { heading: "Managing a property, restaurant, or hotel?", text: "See commercial appliance repair, preventive maintenance plans, and portfolio pricing.", primary: {label:"See Commercial Services", href:"/for-business"} }`.
   - `laundryObjectTypes` — абзац/список типов объектов для раздела прачечной
     (отели, лондроматы, здравоохранение, многоквартирные дома).
6. **`data/business.ts`** — финализировать: `areaServed` (**≤ 20** записей — взять из
   текущего JSON-LD 26 городов, отсортировать по близости к Ballantyne/приоритету,
   срезать до 20; полный список остаётся в `data/towns` alsoServed*). `rating` — из
   `data/reviews` `aggregate`.
7. **`lib/nav.ts`** — заменить временный хардкод на `data/services` (12) + 5 isFullPage
   городов из `data/towns`.

## Критерии приёмки

- [ ] 6 модулей `data/` + типы; `npx tsc --noEmit` чист
- [ ] `data/services` — ровно 12 услуг, у каждой 6 `problems` и 5 `faqs`; тексты
      дословно из `appliance-repair/*.html`
- [ ] `commercialCategories` — 4, каждая с `href` на `/for-business#…` и `formLabel`
- [ ] `data/towns` — 6; 5 с `isFullPage:true` и полным уникальным контентом; `hasMap`
      только у charlotte
- [ ] `data/business.areaServed.length <= 20`; `data/reviews` — 6; `aggregate.reviewCount === 6`
- [ ] `data/brands.homeBrands` отсортирован commercial → premium → mass
- [ ] `b2b-segments` содержит все перечисленные экспорты; тексты `whoWeServe` не
      совпадают дословно с `forBusinessSegments`
- [ ] нигде в `data/` нет выдуманных числовых характеристик доверия
- [ ] `lib/nav.ts` больше не хардкодит списки — читает `data/`
- [ ] `interfaces.md` дописан реальными экспортами всех 6 модулей
