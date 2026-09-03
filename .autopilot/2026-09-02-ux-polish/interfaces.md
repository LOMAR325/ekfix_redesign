# Границы и правила — заход `ux-polish`

Ярус **T0**: тасков нет, сборка одним проходом одного субагента прямо по `spec.md`.
Этот файл — то, что субагент не выведет из репозитория сам.

## Что это за заход

Шесть визуально-UX правок по фидбеку владельца сайта (см. `spec.md` → «Задача»):
hero целиком в первый экран, удаление левой колонки-навигации, снятие подчёркивания
у акцентных ссылок, крупнее телефон в шапке, удаление зелёной точки у телефона,
hover-раскрытие дропдаунов шапки на десктопе. Плюс приписка к ADR.

## САНКЦИЯ на правку CSS — важно

`CLAUDE.md` и `docs/adr/0002` говорят: `app/globals.css` заморожен, правка CSS → верни
`BLOCKED`. **Для этого захода запрет снят владельцем** (бриф, п. про пересмотр принципа
«не трогать дизайн»; требование R09i). Править `app/globals.css` в рамках `spec.md` —
это и есть задача, `BLOCKED` возвращать не нужно. Ограничение: трогать **только** блоки,
перечисленные в `spec.md` → «Решения по реализации» (`.hero-content`/`.hero-ctas`/
`.hero-meta`, блок `.side-rail*` — удалить, `.not-listed a`, `.brand-note a`, `.call-pill`,
`.call-dot` — удалить, `.nav-dropdown` в `@media (min-width:861px)`). Остальной CSS — не касаться.

## Стек и команды

- Next.js 16.3.4 · React 19.2.8 · TypeScript strict · zod 4 · vitest 3 · Node 25.
  App Router, без `src/`, без Tailwind. `next.config.ts`: `images.formats:["image/webp"]`,
  `typedRoutes:true`, `redirects()` (7 правил 308).
- `npm install` — зависимости на месте, ставить ничего не нужно.
- `npm run dev` — порт 3000. `npm run build` — прод-сборка (гоняет `tsc`).
- `npm test` — `vitest run`. **Базовая линия: 29 passed, 5 файлов.** Должно остаться
  ≥ 29 и 0 failed.
- `npx tsc --noEmit` — строгая типопроверка, базовая линия 0 ошибок.
- Любой `npm`/`npx` в неинтерактивной среде — с `</dev/null`.
- Нет зависимости → верни `BLOCKED` с объяснением, не ставь сам. (К CSS не относится — см. выше.)

## Что не трогать

- `data/*` — контент, включая `data/business.siteUrl` (помеченная заглушка домена).
- `AggregateRating` / `aggregateRatingJsonLd` — разметку не трогаем (вопрос уже в отчёте audit-fixes).
- `next.config.ts` — в т.ч. блок `redirects()`.
- `lib/jsonld.ts`, `lib/seo.ts`, `lib/book/*`, `app/sitemap.ts`, `app/robots.ts` — вне периметра.
- Любые новые CSS-классы, утилиты, Tailwind, CSS-in-JS, CSS-модули — запрещены.
  Только правка существующих правил / удаление ненужных.
- Ни одной страницы с `export const dynamic` / `revalidate`.
- `next/image` для картинок (не `<img>`), размеры из `components/ui/image-dimensions.ts`.

## Швы (тестовые границы) — этот заход их НЕ трогает

Три существующих шва, проверяются существующими тестами, менять их поведение нельзя:

| Шов | Файлы теста | Что гарантирует |
|---|---|---|
| доставка заявки | `lib/book/submit.test.ts`, `app/api/book/route.test.ts`, `lib/book/sinks.test.ts` | валидный вход → `{ok:true}` + активный sink; битый → `400`, доставка не вызвана |
| sitemap | `app/sitemap.test.ts` | default export = 5 статических ∪ 12 услуг ∪ 5 `isFullPage` городов |
| JSON-LD | `lib/jsonld.test.ts` | `businessJsonLd().name === "EK Global"`, `areaServed`/`telephone` из `data/business`, `areaServed.length ≤ 20`, `reviewCount === reviews.length` |

Новых швов не вводим. Вёрстку и презентационные компоненты не тестируем (соглашение проекта).

## Файлы в периметре правок (из `spec.md`)

- `app/globals.css` — блоки перечислены выше в «САНКЦИЯ».
- `components/Header.tsx` — убрать `<span className="call-dot" />`; при необходимости
  развести click-toggle и hover на десктопе (внутреннее решение, вёрстку не менять).
- `components/home/Hero.tsx` — снять `borderBottom` из `TEXT_LINK`.
- `components/home/SideRail.tsx` — **удалить файл.**
- `app/page.tsx` — убрать `import { SideRail }` (стр. 7) и `<SideRail />` (стр. 34).
- `components/ui/audience-card.tsx` — снять `borderBottom` из `CARD_LINK` (стр. 20).
- `components/home/BrandsSection.tsx` — снять инлайн `borderBottom` (стр. 37).
- `app/appliance-repair/[slug]/page.tsx` — снять инлайн `borderBottom` (стр. 161).
- `docs/adr/0002-globals-css-doslovnaya-kopiya.md` — приписка (или отдельный ADR 0014 —
  решает фаза памяти; приписка к 0002 в любом случае).

## Проверка перед сдачей

`npm test` (≥29, 0 failed) · `npx tsc --noEmit` (0) · `npm run build` (зелёный) ·
после сборки 7/7 редиректов 308 со старых `*.html` · ручная визуальная проверка hero и
шапки на десктопе (≥1280×720 и 1440×900) и мобиле (~390px): hero+полоса доверия в экране,
левой колонки нет, ссылки без подчёркивания, телефон крупнее, точки нет, дропдауны по hover.
