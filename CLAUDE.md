<!-- autopilot:start -->
# EK Global — сайт (Next.js)

Сайт ремонта бытовой техники EK Global (Charlotte, NC) — перенос статического
HTML/CSS/JS-сайта на Next.js (App Router + TypeScript) с приоритетом контента на
юрлиц (B2B). Визуально — 1:1 с текущим сайтом, это не редизайн.

## Команды

| Команда | Что делает |
|---------|------------|
| `npm install` | Установить зависимости |
| `npm run dev` | Запустить локально (порт 3000) |
| `npm run build` | Продакшен-сборка (Turbopack, включает `tsc`) |
| `npm start` | Поднять прод-сборку |
| `npm test` | Тесты (vitest run) · один файл: `npm test -- <path>` |
| `npx tsc --noEmit` | Строгая типопроверка |

Стек: Next.js 16.3.4 · React 19.2.8 · TypeScript strict · vitest 3 · Node 25. App Router,
без `src/`, без Tailwind. `next.config.ts`: `images.formats:["image/webp"]`, `typedRoutes:true`.

## Подводные камни

- **`create-next-app` интерактивен и зависает в неинтерактивной среде.** Каркас собран
  вручную (`package.json` + `npm install` + конфиги). Любой `npm`/`npx` запускать с `</dev/null`.
- `app/globals.css` — дословная копия `css/style.css` + один блок `.card-grid-4`. НЕ трогать
  без явного согласования: весь сайт держит визуал 1:1 через него.
- `typedRoutes:true` — ссылки на ещё не созданные роуты требуют `as Route`; касты снимутся
  по мере появления страниц.
- Тесты только на трёх швах: `lib/book`, `app/sitemap.ts`, `lib/jsonld`. Не тестировать
  вёрстку/данные/presentational-компоненты.

## Как здесь работает Autopilot

Сборка ведётся навыком `/autopilot`. Требования, спецификация и таски — в `.autopilot/`.
Прогресс — `.autopilot/dashboard.html`. Правило: требование из `manifest.md`
может снять только пользователь.

Если работа продолжается — скажи «продолжи автопилот»: состояние поднимется
из `.autopilot/state.js`, переспрашивать ничего не нужно.

## Источники правды по контенту

- `ek-global-website-brief.md` — бизнес-контекст, ИА, анти-doorway правило, шаблоны страниц.
- `ek-global-b2b-priority-brief.md` — блочный промт по главной и for-business (B2B-приоритет).
- `ek-global-seo-strategy-2026.md` — local SEO 2026 (GBP, schema, CWV, 90-дневный план).
- `ek-global-nextjs-master-brief.md` — как всё это реализуется в Next.js (главный тех-документ).
<!-- autopilot:end -->
