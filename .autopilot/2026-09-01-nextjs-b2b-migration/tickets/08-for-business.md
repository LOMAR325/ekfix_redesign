# 08 — Страница `/for-business` (расширение B2B-хаба)

**Требования:** R12, R22, R26, R27, R29, R30 (FAQPage + Breadcrumb), R31i, R36, R37i
**Blocked by:** 03, 05
**Зона:** `app/for-business/`, `components/for-business/`
**Волна:** 4
**Status:** ready

## Что должно заработать

`/for-business` = перенесённый `for-business.html` ПЛЮС расширения из b2b §8:
≥4 сегмента с якорями, третье предложение в `.lede` про форматы, абзац типов
объектов в разделе прачечной, новый блок процесса `#process`, новый блок форматов
`#formats`, +2 карточки в «Why … call us», новая секция FAQ `#faq-business` с
`FAQPage` разметкой, усиленный текст финального `.cta-band`. Всё — существующими
CSS-компонентами.

## Из брифа, дословно

> «FAQ на for-business.html — как компоненты»
> «for-business.html содержит: ≥4 сегмента, блок «как мы работаем», блок форматов сотрудничества, блок комплаенс/доверия, FAQ (≥6 вопросов) с FAQPage разметкой»
> «Ни один текстовый блок не скопирован дословно между index.html и for-business.html»
> «Не придумывать цифры/статистику доверия»

## Разделы спецификации

Истории 28, 29, 31, 34, 36, 37; b2b §8 блоки 1–8.

## Что делать

1. `PageHero` — breadcrumb Home / For Business, h1 «Commercial appliance<br>repair,
   <span>done right.</span>» (как сейчас), `.lede` = текущий текст + 3-е предложение:
   «Whether it's a single emergency call, a standing maintenance contract, or service
   across a whole portfolio — we work the way your business already operates.»
2. **Сегменты (≥4)** — `AudienceGrid` (`.card-grid-4` или два ряда `.two-col`) из
   `data/b2b-segments.forBusinessSegments`. Каждой секции-обёртке дать `id`:
   Property Management → `#property-management`, Restaurants & Cafés → `#horeca`,
   Hotels & Hospitality → `#hotels` (новая), HOA / Condo Associations → `#hoa`
   (новая, с видимой пометкой-оговоркой `[TODO: подтвердить у владельца]` в тексте
   там, где утверждается вертикаль). Property Management текст расширить
   «across single properties or a full portfolio».
3. **Раздел коммерческой прачечной** (`.two-col` + `Prose` + `.chip-row` брендов +
   `LocalPhoto` `kostia-laundry.webp`) — дать секции `id="laundry"`; добавить один
   абзац с типами объектов (`data/b2b-segments.laundryObjectTypes`: отели,
   лондроматы, здравоохранение, многоквартирные дома) и связкой со списком чипов.
4. **`#process`** (`components/for-business/ProcessSteps.tsx`) — `.section .section-light`,
   `SectionHead`, `.card-grid-3`/`-4` нумерованные `.problem-card` с `.num` из
   `data/b2b-segments.processSteps` (4 шага). Между разделом прачечной и «Why … call us».
5. **«Why property & kitchen managers call us»** — `.card-grid-3` из
   `data/b2b-segments.whyCallUs` (3 текущие + 2 новые: «Documented, not just done»,
   «Vendor-ready paperwork»). Тёмные `.problem-card` (инлайн-стили как сейчас).
6. **`#formats`** (`components/for-business/ServiceFormats.tsx`) — `.section .section-dark`,
   `SectionHead`, `.chip-row` из `data/b2b-segments.serviceFormats` (4 чипа).
7. **`#faq-business`** — `FaqAccordion` из `data/b2b-segments.businessFaqs` (6),
   ПЕРЕД финальным `.cta-band`. Рядом `<JsonLd data={[faqJsonLd(businessFaqs)]}/>`.
8. Финальный `.cta-band` — вёрстку не менять, текст усилить упоминанием форматов.
9. Metadata: `<title>` можно расширить «…for Property Managers, Restaurants & Hotels»
   (b2b §9); `description` — расширить упоминанием отелей. canonical.
10. `<JsonLd data={[breadcrumbJsonLd([...]), faqJsonLd(businessFaqs)]}/>`.

## Критерии приёмки

- [ ] Вёрстка/классы существующих секций совпадают с `for-business.html`; новые
      секции используют только существующие CSS-компоненты (+ `.card-grid-4`)
- [ ] ≥4 сегмента; секции имеют id `#property-management`, `#horeca`, `#laundry`,
      `#hotels`, `#hoa` (ссылки с главной ведут на них)
- [ ] есть `#process` (4 шага), `#formats` (4 чипа), блок комплаенс (2 новые карточки
      в «Why … call us» + чипы), `#faq-business` (≥6 вопросов) + `FAQPage` JSON-LD
- [ ] HOA-карточка помечена оговоркой; нигде нет выдуманных числовых характеристик
- [ ] ни один абзац не совпадает дословно с `/` (проверить новые блоки)
- [ ] `BreadcrumbList` + `FAQPage` JSON-LD парсятся
- [ ] SSG; `npm run build` проходит
