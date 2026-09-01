# 09 — `/appliance-repair/[slug]` — 12 страниц техники

**Требования:** R13, R30 (Service + FAQPage + Breadcrumb), R31i, R02
**Blocked by:** 03, 05
**Зона:** `app/appliance-repair/`
**Волна:** 4
**Status:** ready

## Что должно заработать

12 страниц техники по `/appliance-repair/<slug>`, каждая перенесена 1:1 из
соответствующего `appliance-repair/*.html`, контент из `data/services`.
`generateStaticParams` даёт ровно 12. `Service` + `FAQPage` + `BreadcrumbList` JSON-LD.

## Из брифа, дословно

> «/appliance-repair/[slug] (12 услуг …), generateStaticParams из данных»
> «визуальный результат должен быть идентичен текущему сайту»
> Дополнение: коммерческие категории — БЕЗ роутов (только карточки/форма)

## Разделы спецификации

Истории 10, 11, 15; Решения §Слой данных.

## Что делать

1. `app/appliance-repair/[slug]/page.tsx`:
   - `generateStaticParams` → `data/services.map(s => ({slug: s.slug}))` (12).
   - `generateMetadata` → `pageMetadata` с `title`/`metaDescription` из услуги.
   - Неизвестный slug → `notFound()`.
   - Разметка 1:1 из `appliance-repair/refrigerator.html` как эталон структуры:
     `PageHero` (breadcrumb Home / We Repair / `<name> Repair`, h1 `hero.h1`,
     `hero.lede`), секция «Common problems we fix» (`SectionHead on-light` +
     `.lede` «Every diagnostic includes…» + `ProblemCardGrid` 6 из `service.problems`),
     секция «Brands we service» (`section-dark` + `SectionHead` + `ChipRow`
     `service.brands` `.chip.on-dark` + ссылка «See every brand →» `/brands`),
     секция «FAQ» (`section-light` + `SectionHead` + `FaqAccordion` 5 из `service.faqs`,
     первый `open`), секция «Where we work» (`section-dark-2` + `SectionHead` +
     `ChipRow` `service.whereWeWork` — Charlotte ссылкой на `/towns/charlotte`),
     секция «Also repair» (`section-light` + `ChipRow` `service.alsoRepair` —
     **только если непусто**; у refrigerator её нет), `CtaBand` («Ready when you are.»).
   - Точные заголовки секций/eyebrow'ы — из `data/services` (перенести из HTML).
2. `<JsonLd data={[serviceJsonLd(service), faqJsonLd(service.faqs), breadcrumbJsonLd([...])]}/>`.

## Критерии приёмки

- [ ] `generateStaticParams` → ровно 12; неизвестный slug → 404
- [ ] Каждая из 12 страниц попиксельно совпадает со своим `appliance-repair/*.html`;
      тексты (проблемы, бренды, FAQ) дословны
- [ ] refrigerator без секции «Also repair»; у остальных 11 она есть
- [ ] `Service` + `FAQPage` + `BreadcrumbList` JSON-LD на каждой, парсятся;
      `Service.provider.name === "EK Global"` (не «…Appliance Repair»)
- [ ] все 12 — SSG; `npm run build` проходит
