<!-- autopilot:start -->
# EK Global — сайт (Next.js)

Сайт ремонта бытовой техники EK Global (Charlotte, NC) — перенос статического
HTML/CSS/JS-сайта на Next.js (App Router + TypeScript) с приоритетом контента на
юрлиц (B2B). Визуально — 1:1 с текущим сайтом, это не редизайн.

## Команды

| Команда | Что делает |
|---------|------------|
| `npm install` | Установить зависимости |
| `npm run dev` | Запустить локально |
| `npm run build` | Продакшен-сборка (SSG) |

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
