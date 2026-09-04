# 06 — Главная страница `/`

**Требования:** R12, R18, R19, R21, R25, R26, R27, R28, R30, R32, R32a, R33, R38i, R44 (частично)
**Blocked by:** 03, 04, 05
**Зона:** `app/page.tsx`, `components/home/`
**Волна:** 4
**Status:** ready

## Что должно заработать

`/` = перенесённый `index.html` 1:1 ПЛЮС блочные B2B-правки: hero с бизнес-аудиторией
первой + ссылка-переключатель, новая секция `#who-we-serve` (4 карточки, юрлица
первыми тремя), коммерческие карточки в `#repair`, усиленный `#family`, новая секция
`#trust-b2b`, бренды commercial-first, новая секция `#business-cta`, форма с новым
полем. JSON-LD `HomeAndConstructionBusiness` + `knowsAbout` + `AggregateRating`.

## Из брифа, дословно

> «новый блок «Who we serve», реорганизация сетки услуг/брендов, блок доверия … новое поле в форме заявки — как компоненты»
> «юрлица упоминаются/показываются раньше физлиц в каждом блоке, где встречаются оба сегмента (hero, #who-we-serve, #brands, форма)»
> «Физлица по-прежнему присутствуют на главной как полноценный, не урезанный сегмент»
> «визуальный результат должен быть идентичен текущему сайту»

## Разделы спецификации

Истории 23, 24, 25, 26, 30, 31, 32, 32a; b2b §7 блоки 1–9.

## Что делать

Порядок секций (всё, что не B2B-правка — переносится из `index.html` 1:1):

1. `<Hero>` (`components/home/Hero.tsx`, `'use client'` не нужен, кроме если LCP-картинка
   через `next/image priority`): фото `hero-technician.webp` (`priority`), скримы,
   `<h1>We fix it.<br><span>You enjoy it.</span></h1>` (не менять), `.lede` —
   **B2B первым**: «Same-day appliance repair for property managers, restaurants, and
   homeowners across Charlotte — EPA 608 & OSHA certified technicians, original parts,
   warranty on every job.» `.hero-ctas` — как есть + рядом текстовая ссылка (обычная
   типографика, без нового класса): «Managing a property or restaurant? See commercial
   services →» → `/for-business`. `.hero-meta` small: «5.0 on Google · property
   managers, restaurants & homeowners». `.hero-owner-tag`, `.hero-trust` — как есть.
2. **`<WhoWeServeGrid>` (`components/home/`) — НОВАЯ секция `#who-we-serve`**, сразу
   после hero, ДО `#repair`. `.section .section-light`, `.section-head` (eyebrow
   «01a / Who we serve», h2 «Homes, kitchens, and everything you manage.»),
   `.card-grid-4` из 4 `.audience-card` из `data/b2b-segments.whoWeServe` — порядок
   массива = порядок карточек (Property Management, Restaurants & Commercial Kitchens,
   Hotels & Multifamily Laundry, Homeowners). `.side-rail` НЕ трогать (остаётся 6).
3. `#repair` — сетка 12 услуг из `data/services` (карточки-ссылки на `/#book` с
   пресетом прибора через `BookingProvider`) + **4 карточки `commercialCategories`**
   в конце (ссылки на `/for-business#…`). `.not-listed` — как есть.
4. `#family` — 1:1 + одно доп. предложение в `.family-copy`: «That's true whether
   it's a homeowner's kitchen or a restaurant walk-in — same technician, same standard.»
5. `#reviews` — 6 отзывов из `data/reviews` (Tony Z. первым — как сейчас). `.rating-badge`.
6. **`<TrustBand>` — НОВАЯ секция `#trust-b2b`**, между `#reviews` и `#brands`.
   `.section .section-dark-2`, `.section-head` (h2 «Built for vendor onboarding.»),
   `.chip-row` из `data/b2b-segments.trustChips` (5 чипов, `.chip.on-dark`).
7. `#brands` — `<BrandGrid brands={brands.homeBrands}>` (commercial → premium → mass),
   `.lede` = «Commercial and residential — from Hobart and Girbau to Sub-Zero and
   Thermador.», `.brand-note` + ссылка «See all brands →» `/brands` — как есть.
8. **`<BusinessCtaBand>` — НОВАЯ секция `#business-cta`**, между `#brands` и `#book`.
   Второй экземпляр `.cta-band` из `data/b2b-segments.businessCta` (h2 «Managing a
   property, restaurant, or hotel?», текст, `.btn.btn-accent` «See Commercial Services»
   → `/for-business`, `.btn.btn-ghost-dark` → звонок).
9. `#book` — `.book-grid` (`.book-copy` 1:1) + `<BookForm>` (из таска 04).
10. Обернуть интерактивные секции в `<BookingProvider>`.
11. JSON-LD: `<JsonLd data={[businessJsonLd()]}/>` (уже включает `knowsAbout` +
    `aggregateRating`). Metadata через `pageMetadata` — `<title>`/`description` из
    текущего `index.html` (не менять; можно добавить предложение в `og:description`
    про оба сегмента — по желанию).
12. Клиентское: `SideRail` (`components/home/SideRail.tsx`, `'use client'`,
    IntersectionObserver active-tracking по 6 существующим секциям — новая секция
    `#who-we-serve` в rail НЕ добавляется).

## Критерии приёмки

- [ ] `/` визуально совпадает с `index.html` во всём, кроме согласованных B2B-правок
- [ ] hero `.lede` и `.hero-meta` называют бизнес-аудиторию раньше homeowners
- [ ] `#who-we-serve` присутствует, 4 карточки, первые три — юрлица, `.card-grid-4`
- [ ] `#repair` = 12 бытовых + 4 коммерческих карточки; пресет прибора в форме работает
- [ ] `#trust-b2b` и `#business-cta` присутствуют с точным копирайтом из data
- [ ] бренды в порядке commercial-first; `.lede` обновлён
- [ ] форма: новый `<select>` присутствует; отправка работает (таск 04)
- [ ] физлица не урезаны: карточка Homeowners, полная сетка `#repair`, отзывы, `#family`
- [ ] JSON-LD главной содержит `HomeAndConstructionBusiness` c `name:"EK Global"`,
      `knowsAbout`, `aggregateRating`; проходит парсинг
- [ ] SideRail остаётся 6 пунктов; scroll-tracking работает
- [ ] `npm run build` проходит; страница SSG (не dynamic)
- [ ] тексты новых блоков не совпадают дословно с `/for-business`
