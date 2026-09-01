# 07 — Страницы `/about` и `/brands`

**Требования:** R12, R30 (Breadcrumb), R31i, R02, R20 (brands 1:1)
**Blocked by:** 03, 05
**Зона:** `app/about/`, `app/brands/`
**Волна:** 4
**Status:** ready

## Что должно заработать

`/about` = перенесённый `about.html` 1:1. `/brands` = перенесённый `brands.html` 1:1
(две свои секции по tier — порядок НЕ менять, b2b §5: «brands.html — без изменений»).
Обе страницы — с корректной Metadata, canonical и `BreadcrumbList` JSON-LD.

## Из брифа, дословно

> «Реализовать роуты: / , /about, /brands, /for-business»
> «визуальный результат должен быть идентичен текущему сайту»
> b2b §5: «/brands.html — без изменений на этом этапе»

## Разделы спецификации

Истории 9, 24, 35; b2b §5 (IA).

## Что делать

1. `app/about/page.tsx` — из `about.html`: `PageHero` (breadcrumb Home / Our Story,
   h1 «A family business,<br><span>not a franchise.</span>»), секция «Meet Konstantin»
   (`Prose` + `StatRow` «10+ yrs / EPA Universal / OSHA» — реальные факты, оставить +
   `LocalPhoto` `konstantin_thermador.webp`), секция «What that means» (`ProblemCardGrid`
   тёмная, 3 карточки), секция «Homes, restaurants…» (`PhotoPair`, 280px),
   `CtaBand`. Тексты дословно из `about.html`.
2. `app/brands/page.tsx` — из `brands.html`: `PageHero`, секция «Residential & premium
   kitchen» (`SectionHead on-light` + `BrandGrid` = `brands.filter(tier !== 'commercial')`
   в **текущем порядке `brands.html`** — не пересортировывать), секция «Commercial &
   specialty refrigeration» (`section-dark-2` + `SectionHead` + `BrandGrid` =
   `brands.filter(tier === 'commercial')` в текущем порядке + `.brand-note`),
   секция «Don't see your brand?» (`Prose`), `CtaBand`.
   **Важно:** порядок ячеек и разбивка на две секции — ровно как в `brands.html`
   сейчас. `data/brands` даёт исходный порядок; фильтр по tier сохраняет его.
3. Metadata: `pageMetadata` с `<title>`/`description` из текущих `<head>`.
4. `<JsonLd data={[breadcrumbJsonLd([...])]}/>` на обеих.

## Критерии приёмки

- [ ] `/about` попиксельно совпадает с `about.html`; тексты дословно
- [ ] `/brands` попиксельно совпадает с `brands.html`; обе секции, порядок логотипов
      как сейчас (НЕ commercial-first)
- [ ] `<title>`/`description`/canonical корректны на обеих
- [ ] `BreadcrumbList` JSON-LD присутствует, парсится
- [ ] обе страницы SSG; `npm run build` проходит
