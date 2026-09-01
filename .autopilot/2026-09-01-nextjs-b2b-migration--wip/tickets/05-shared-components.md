# 05 — Общие presentational-компоненты

**Требования:** R24, R02 (компонентизация), R34
**Blocked by:** 02
**Зона:** `components/ui/`
**Волна:** 3
**Status:** ready

## Что должно заработать

Набор переиспользуемых серверных компонентов, один-в-один воспроизводящих
существующие CSS-классы. Страничные таски (06–10) только собирают из них страницы и
не воюют за одни и те же файлы.

## Из брифа, дословно

> «как компоненты, а не как переписанный вручную HTML»
> «Не менять дизайн: цвета, шрифты, отступы, структуру карточек/кнопок — только перенос существующей вёрстки в компоненты»

## Разделы спецификации

История 33; Границы `components/ui/*`; interfaces.md §Ключевые типы.

## Что делать

Каждый компонент = существующий класс из `css/style.css`, разметка 1:1, данные пропсами.
Server components (без `'use client'`), кроме тех, что явно интерактивны (нет таких здесь).

- `PageHero` — `.page-hero` (breadcrumb, h1 с `<span>`, `.lede`, `.ctas`). Проп
  `breadcrumb: {label, href?}[]`, `h1` (ReactNode для `<br><span>`), `lede`, `ctas`.
- `CtaBand` — `.cta-band` (h2 с `<br>`, p, `.ctas` 2 кнопки). Дефолтные кнопки —
  «Book Online — Save 10%» → `/#book` и «Call (980) 371-4319» → `tel:` из `data/business`.
- `SectionHead` — `.section-head` (`.on-light`/`.on-dark`, `.eyebrow`, `h2`, опц. `.lede`
  или `.rating-badge`).
- `ChipRow` — `.chip-row` + `.chip`/`.chip.on-dark`; проп: массив строк или
  `{label, href?}`.
- `BrandGrid` — `.brand-grid` + `.brand-cell`/`.brand-cell.wide`, `next/image` логотипа
  (contain, grayscale как в CSS). Проп: `Brand[]`. Опц. `.brand-note`.
- `RepairCard` + `RepairGrid` — `.repair-grid` / `.repair-card` (thumb `next/image`,
  `.body`, `.row`, `.name`, `.arrow`, `.tag`). `RepairCard` — `'use client'` только
  если нужен `onClick` для пресета прибора; иначе `<a href>` + data-атрибут, а
  пресет ловит `BookingProvider` (согласовать с таском 04 через interfaces.md —
  предпочесть: `RepairCard` принимает `onSelect?` и рендерится клиентом на главной).
  Для 06: экспортировать «тонкий» `RepairGrid` (список ссылок) — вариант с провайдером
  собирает таск 06.
- `ReviewCard` + `ReviewsGrid` — `.reviews-grid` / `.review-card` (`.stars`, p, `.who`).
- `ProblemCardGrid` — `.card-grid-3` (или `-4`) + `.problem-card` (`.num`, h3, p).
  Проп: `{title, body}[]`, вариант тёмный (инлайн-стиль как в текущем HTML для
  тёмных секций — перенести те же инлайн-стили 1:1).
- `AudienceCard` + `AudienceGrid` — `.audience-card` (`.eyebrow`, h3, p, `ul` с `✓`),
  сетка `.card-grid-4` или `.two-col`. Проп: сегмент из `data/b2b-segments`.
- `FaqAccordion` — `<details class="faq-item">` (`summary`, p), первый `open` как в
  текущем HTML. Проп: `{q,a}[]`.
- `Prose` — `.prose` (h2, p). `StatRow` — `.stat-row`. `PhotoPair` — `.photo-pair`
  (`figure`/`figcaption`, `next/image`), с прокидыванием `object-position`.
- `LocalPhoto` — `.local-photo` (обёртка + `next/image` или `<iframe>` карты).

**Изображения:** `next/image` из `public/images/`. Сохранять `object-fit`/
`object-position`/высоты из текущего CSS. Явные `width`/`height` либо `fill` в
контейнере фикс-высоты (как задают классы).

## Критерии приёмки

- [ ] Каждый компонент рендерит те же классы и структуру DOM, что в текущем HTML
- [ ] `npx tsc --noEmit` чист; компоненты типизированы под `data/` типы
- [ ] Ни один компонент не добавляет новых классов/инлайн-стилей сверх тех, что уже
      есть в текущем HTML/CSS (кроме использования `.card-grid-4`)
- [ ] `next/image` везде вместо `<img>`; lazy по умолчанию
- [ ] `interfaces.md` дописан списком компонентов и их пропсов
