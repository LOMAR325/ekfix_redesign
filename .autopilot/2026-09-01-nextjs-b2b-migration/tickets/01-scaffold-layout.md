# 01 — Каркас проекта, layout, globals.css, Header/Footer

**Требования:** R01, R02, R05, R34, R38i, R39i, R40i, R31i (частично), R10 (частично), R41
**Blocked by:** —
**Зона:** корень репо (`package.json`, `tsconfig.json`, `next.config.ts`), `app/layout.tsx`, `app/globals.css`, `app/icon.svg`, `components/Header.tsx`, `components/Footer.tsx`, `components/Analytics.tsx`, `lib/seo.ts`, `lib/nav.ts`, `data/business.ts`, `data/types.ts`, `public/`, `.env.example`
**Волна:** 1
**Status:** ready

## Что должно заработать

`npm run dev` поднимает Next.js 16, `npm run build` проходит. На любом роуте виден
перенесённый 1:1 header (лого EK, меню «We Repair» с 12 услугами, «Service Area» с
5 городами + «All Service Towns», About/Brands/For Business/Reviews, телефонная
пилюля, кнопка «Book a Repair») и footer (4 колонки, © 2026). Мобильное меню
открывается/закрывается, дропдауны раскрываются по тапу — как сейчас. GA4 `gtag`
грузится. Шрифты Manrope + JetBrains Mono подключены. Вся палитра/типографика/отступы
идентичны текущему сайту.

## Из брифа, дословно

> «перенести сайт на Next.js (App Router + TypeScript)»
> «Это НЕ редизайн — визуальный результат должен быть идентичен текущему сайту»
> «Перенести css/style.css почти без изменений как app/globals.css — не переписывать в Tailwind или CSS-in-JS, визуальный результат должен совпадать 1:1»
> «Header + Footer переносятся 1:1»

## Разделы спецификации

Истории 1, 2, 38; Решения §Стек, §Без export, §CSS, §Шрифты, §Favicon, §Изображения,
§Клиентское поведение (Header, Analytics), §Метаданные; interfaces.md §Правила проекта.

## Что делать

1. `npx create-next-app@latest` в текущей папке (App Router, TS, npm, без Tailwind).
   Разрулить, что репо не пустой (есть `.html`, `css/`, `js/`, `assets/`, 4 md,
   `.autopilot/`) — их не удалять, это делает таск 11.
2. `next.config.ts`: `images` (formats webp), `typedRoutes`. Без `output: 'export'`.
   Без `redirects()`.
3. `app/globals.css` — **дословная копия `css/style.css`** + один новый блок
   `.card-grid-4` (копия `.card-grid-3`: `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))`
   но с целевыми 4 колонками — согласовать с `.card-grid-3` так, чтобы на широком
   экране было 4, на узком — сворачивалось так же; в `@media (max-width:640px)` —
   `1fr`, как у `.card-grid-3`). Импорт в `app/layout.tsx`.
4. Шрифты: точные теги `<link rel="preconnect">` + `<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=optional">` в `app/layout.tsx` (`<head>`).
5. `app/icon.svg` — тот же SVG, что в текущем `<link rel="icon" href="data:image/svg+xml,...">`.
6. `components/Analytics.tsx` — `next/script` `afterInteractive`, тот же `gtag`/`G-LFM6MSKBQ7`.
7. `data/types.ts` — типы из interfaces.md §«Ключевые типы» (Service, Town, Review, Brand, …).
8. `data/business.ts` — `name: "EK Global"`, `legalName: "EK Global"`, `phone: "(980) 371-4319"`,
   `phoneHref: "+19803714319"`, `phoneE164: "+1-980-371-4319"`, `hours: "8AM – 8PM daily"`,
   `hoursNote: "Weekends included"`, `openingHours` (Mon–Sun 08:00–20:00),
   `address: { locality: "Charlotte", region: "NC", country: "US" }`,
   `siteUrl: "https://ekfix.us"` + `// TODO: подтвердить финальный публичный домен у владельца`,
   `social: { instagram, facebook, tiktok }` (URL из текущего футера),
   `gaId: "G-LFM6MSKBQ7"`, `maintenancePlanName: "EK Maintenance Plan"` +
   `// TODO: имя утверждает владелец`. `areaServed` и `rating` — **оставить TODO-заглушку
   с пометкой «финализирует таск 02»** (полный список городов и отзывы там).
9. `lib/seo.ts` — `pageMetadata({title, description, path})` → `Metadata` с
   `metadataBase: new URL(business.siteUrl)` и `alternates.canonical: path`.
   (Экспортировать `metadataBase` для `app/layout.tsx`.)
10. `lib/nav.ts` — `mainNav`: структура из `data/services` (12, «We Repair») +
    статических 5 городов + ярлыков (About, Brands, For Business, Reviews). Пока
    `data/services`/`data/towns` не готовы — временно захардкодить 12 услуг и 5
    городов ЗДЕСЬ **с пометкой `// TODO таск 02: брать из data/`** и оставить строку
    в interfaces.md для таска 02. (Меню в текущем HTML идентично на всех страницах —
    можно взять оттуда 1:1.)
11. `components/Header.tsx` (`'use client'`) — разметка 1:1 из текущего `<header class="site-header">`,
    логика из `js/main.js` (toggle меню, `nav-locked`, дропдауны по клику, закрытие
    по клику вне). Активный пункт (`class="active"`) — по текущему пути.
12. `components/Footer.tsx` — разметка 1:1 из текущего `<footer class="site-footer">`,
    тексты/ссылки из `data/business.ts` где это NAP.
13. `app/layout.tsx` — `<html lang="en">`, шрифты, globals, `<Header/>`, `{children}`,
    `<Footer/>`, `<Analytics/>`. `metadata` с `metadataBase`.
14. `app/page.tsx` — временная заглушка (`return null` / «migrating»), чтобы `build`
    проходил; настоящую делает таск 06.
15. `assets/images/*.webp` + `.png` → `public/images/` (скопировать, не двигать
    оригинал — удалит таск 11). `hero-technician.webp`, `SreetFair.png` и т.д.
16. `.env.example` — пустые `RESEND_API_KEY=`, `BOOK_NOTIFY_EMAIL=`, `BOOK_WEBHOOK_URL=`.
    `.gitignore` — убедиться, что `.env*` игнорируется (уже есть).

## Критерии приёмки

- [ ] `npm run build` и `npx tsc --noEmit` проходят без ошибок
- [ ] `app/globals.css` — побайтово `css/style.css` + только блок `.card-grid-4`
      (диф показывает ровно одно добавление)
- [ ] Header/Footer в DOM совпадают с текущими по классам и структуре; мобильное
      меню и дропдауны работают как в `js/main.js`
- [ ] `data/business.ts` содержит `name: "EK Global"` (не «…Appliance Repair»),
      `siteUrl` с TODO-комментарием
- [ ] GA4 `gtag` с `G-LFM6MSKBQ7` присутствует в отрендеренной странице
- [ ] `public/images/` содержит все файлы из `assets/images/`
- [ ] `interfaces.md` дописан: экспорты `data/business`, `lib/seo`, `lib/nav`, `data/types`
