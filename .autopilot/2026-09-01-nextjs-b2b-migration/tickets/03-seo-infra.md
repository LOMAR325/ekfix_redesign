# 03 — SEO-инфраструктура: JSON-LD, sitemap, robots

**Требования:** R07, R08, R30, R32, R33, R43, R17i, R31i (JSON-LD часть), R32a
**Blocked by:** 02
**Зона:** `lib/jsonld.ts`, `components/JsonLd.tsx`, `app/sitemap.ts`, `app/robots.ts`
**Волна:** 3
**Status:** ready

## Что должно заработать

Единый компонент `<JsonLd>` рендерит валидный schema.org на любой странице, всегда с
названием бизнеса `"EK Global"` и NAP из `data/business.ts`. `/sitemap.xml` и
`/robots.txt` генерируются из тех же данных, что роутинг — рассинхронизация
структурно невозможна.

## Из брифа, дословно

> «sitemap должен генерироваться автоматически (app/sitemap.ts) из тех же данных, что роутинг, чтобы рассинхронизация была структурно невозможна»
> «Название бизнеса в JSON-LD должно быть везде идентично («EK Global»)»
> «Реализовать JSON-LD (HomeAndConstructionBusiness, Service, FAQPage, AggregateRating только для реальных отзывов) через общий компонент, читающий data/business.ts — единообразно на всех страницах»
> «sitemap.ts на выходе покрывает 100% реально существующих роутов, ни одной страницы не пропущено и не добавлено сверх реально существующих»

## Разделы спецификации

Истории 16, 17, 32, 32a; Границы `lib/jsonld` / `app/sitemap.ts`; Швы 2 и 3.

## Что делать

1. `lib/jsonld.ts` — чистые функции:
   - `businessJsonLd()` → `HomeAndConstructionBusiness` из `data/business`
     (`name: "EK Global"`, `image`, `telephone`, `priceRange: "$$"`, `url` = siteUrl,
     `address`, `openingHoursSpecification`, `areaServed` (City[] из `data/business.areaServed`),
     `sameAs` (social), `knowsAbout` = `b2bSegments.commercialServices`,
     `aggregateRating` = из `aggregateRatingJsonLd()`).
   - `serviceJsonLd(service)` → `Service` (`serviceType`, `provider` = сокращённый
     business, `areaServed` = City "Charlotte, NC"). Форма как в текущем
     `appliance-repair/*.html`.
   - `faqJsonLd(items)` → `FAQPage` из `{q,a}[]`.
   - `breadcrumbJsonLd(trail)` → `BreadcrumbList` из `[{name, url}]`.
   - `aggregateRatingJsonLd()` → `{ "@type":"AggregateRating", ratingValue, reviewCount }`
     строго из `data/reviews.aggregate`.
2. `components/JsonLd.tsx` — принимает объект(ы), рендерит
   `<script type="application/ld+json" dangerouslySetInnerHTML>`. Server component.
3. `app/sitemap.ts` — default export: статические (`/`, `/about`, `/brands`,
   `/for-business`, `/towns`) + `data/services` → `/appliance-repair/<slug>` (12) +
   `data/towns.filter(isFullPage)` → `/towns/<slug>` (5). URL абсолютные от
   `business.siteUrl`. `priority`/`changeFrequency` — разумные (главная 1.0,
   услуги 0.9, города 0.9, остальное 0.7). **Не добавлять** `/api/*`, несуществующие
   комбо-страницы, не-isFullPage города.
4. `app/robots.ts` — `allow: "/"`, `disallow: ["/api/"]`, `sitemap: <siteUrl>/sitemap.xml`.

## Тесты (швы 2 и 3)

- `lib/jsonld.test.ts`:
  - `businessJsonLd().name === "EK Global"`
  - `businessJsonLd().telephone` === `business.phoneE164`
  - `businessJsonLd().areaServed.length <= 20` и совпадает с `data/business.areaServed`
  - `aggregateRatingJsonLd().reviewCount === reviews.length` (6)
- `app/sitemap.test.ts`:
  - множество путей === {`/`,`/about`,`/brands`,`/for-business`,`/towns`}
    ∪ {`/appliance-repair/<slug>` для всех 12 из `data/services`}
    ∪ {`/towns/<slug>` для 5 `isFullPage`}
  - ни одного пути с `.html`, ни одного не-isFullPage города, ни одного `/api`

## Критерии приёмки

- [ ] `<JsonLd>` рендерит валидный JSON (парсится), `businessJsonLd` содержит
      `knowsAbout` с 4 коммерческими услугами
- [ ] `businessJsonLd().name` строго `"EK Global"` — не «EK Global Appliance Repair — …»
- [ ] `AggregateRating` берётся только из `data/reviews`, не из «5.0 on Google»
- [ ] тест шва 2 зелёный: sitemap = ровно {5 статических} ∪ {12} ∪ {5}
- [ ] тест шва 3 зелёный
- [ ] `/robots.txt` указывает на `<siteUrl>/sitemap.xml`
- [ ] `interfaces.md` дописан сигнатурами `lib/jsonld` и `<JsonLd>`
