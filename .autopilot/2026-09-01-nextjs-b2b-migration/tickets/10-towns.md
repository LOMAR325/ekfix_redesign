# 10 — `/towns` + `/towns/[slug]` (индекс + 5 городов)

**Требования:** R15, R16, R35, R39, R47i, R30 (Business + Breadcrumb JSON-LD), R31i, R02, R11i (текстовые списки)
**Blocked by:** 03, 05
**Зона:** `app/towns/`
**Волна:** 4
**Status:** ready

## Что должно заработать

`/towns` = перенесённый `towns/index.html` 1:1. `/towns/<slug>` только для 5 городов
с `isFullPage:true` (Charlotte, Rock Hill, Fort Mill, Matthews, Indian Trail),
каждый 1:1 из `towns/*.html`. Любой другой город технически недостижим (404).
JSON-LD `HomeAndConstructionBusiness` с **единым** `name:"EK Global"` (не
«EK Global Appliance Repair — Charlotte, NC», как сейчас).

## Из брифа, дословно

> «/towns и /towns/[slug] — ТОЛЬКО для городов с флагом isFullPage (топ 5-8 по правилу анти-дублирования), остальные города НЕ получают роут»
> «Название бизнеса в JSON-LD должно быть везде идентично («EK Global») — на страницах городов сейчас отличается»
> «Ни одна городская страница технически недостижима вне data/towns.ts со флагом isFullPage: true»

## Разделы спецификации

Истории 8, 14, 15; Решения §Слой данных.

## Что делать

1. `app/towns/page.tsx` — из `towns/index.html`: `PageHero` (breadcrumb Home /
   Service Area, h1 «Charlotte, NC<br><span>& the towns around it.</span>»), секция
   «Full local pages» (`SectionHead` + сетка `.repair-card`-ссылок на 5 isFullPage
   городов, `data/towns.filter(isFullPage)`), секция «Also serving — North Carolina»
   (`section-dark` + абзац из `data/towns.alsoServedNC`), секция «— South Carolina»
   (`section-light` + `data/towns.alsoServedSC`), `CtaBand`.
2. `app/towns/[slug]/page.tsx`:
   - `generateStaticParams` → `data/towns.filter(isFullPage).map(...)` (5).
   - `generateMetadata` из данных города.
   - **не-isFullPage slug или неизвестный → `notFound()`** (и его нет в
     `generateStaticParams`).
   - Разметка 1:1 из `towns/*.html`: `PageHero` (breadcrumb, h1 «Appliance repair<br>
     <span>in <name>.</span>», `town.hero.lede`), секция «Local, not a dispatch center»
     (`.two-col`: `Prose` из `town.prose[]` с `<strong>` + `.chip-row` `town.districts`
     + `LocalPhoto` — `charlotte.webp` у Charlotte, `town.webp` у остальных), секция
     «What we repair in <name>» (`section-dark` + `ChipRow` 11–12 услуг ссылками),
     секция «Local customers / Charlotte customers» (`section-light` + `SectionHead`
     с `.rating-badge` + `ReviewsGrid` — только отзывы из `town.reviewAuthors`),
     **карта** (`section-dark-2` + `LocalPhoto` с `<iframe>` Google Maps) — **только
     у Charlotte** (`town.hasMap`); у остальных вместо неё секция «Nearby / Also
     serving» (`section-dark-2` + `ChipRow` `town.nearby`); у Charlotte секция
     «Also serving nearby» (`section-light` + `Prose`) — как в оригинале, `CtaBand`.
   - **Внимательно:** структура секций у Charlotte и у 4 остальных немного разная —
     сверять с конкретным `towns/<slug>.html` пофайлово.
3. JSON-LD: `<JsonLd data={[businessJsonLd({areaServedCity: town.name}), breadcrumbJsonLd([...])]}/>`
   — `businessJsonLd` с `name:"EK Global"` из `data/business` (НЕ суффикс города в
   названии). Опционально сузить `areaServed` до города страницы — но `name` строго един.

## Критерии приёмки

- [ ] `/towns` попиксельно совпадает с `towns/index.html`
- [ ] `/towns/<slug>` рендерится ровно для 5 городов; каждый 1:1 со своим `.html`
      (Charlotte с картой, остальные без)
- [ ] `/towns/waxhaw` (и любой не-isFullPage) → 404; нет в `generateStaticParams`
- [ ] JSON-LD каждого города: `name === "EK Global"` (сверить — сейчас в HTML суффикс)
- [ ] полные текстовые списки NC/SC городов на `/towns` присутствуют
- [ ] все SSG; `npm run build` проходит
