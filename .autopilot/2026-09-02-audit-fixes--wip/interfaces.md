# Interfaces — контракты между тасками (заход «audit-fixes» 2026-09-02)

Читается каждым субагентом ПЕРВЫМ, до кода. Границы уже решены в `spec.md`, не выдумывай.
Растёт по мере сдачи тасков.

## Правила проекта (не выводятся из кода)

- **Стек:** Next.js 16.3.4 (App Router) + React 19 + TypeScript strict. Node 25. Менеджер — npm.
- **Команды:** `npm run dev` · `npm run build` · `npm start` · `npm test` (vitest) ·
  `npm run typecheck` (= `tsc --noEmit`). Любой `npm`/`npx` в неинтерактивной среде — с `</dev/null`.
- **Это заход по закрытию дефектов, не миграция.** Сайт уже работает (пред. прогон
  `2026-09-01-nextjs-b2b-migration`, сдан). Правки — ТОЧЕЧНЫЕ, только под 7 задач брифа.
- **Дизайн не трогать.** `app/globals.css` — побайтовая копия старого `css/style.css` +
  правило `.card-grid-4`. Разрешена **ровно одна** новая строка — `.audience-card h3 { color: var(--text-light); }`
  (задача 1). Больше никаких правок CSS: ни новых цветов/шрифтов/отступов, ни рефакторинга.
  Нужна ещё правка CSS → верни `BLOCKED`.
- **Данные — единственный источник.** NAP, услуги, города, отзывы, бренды, B2B-сегменты —
  только из `data/*`. Текст/константы в компонентах не хардкодить.
- **Ничего не выдумывать:** цифры, отзывы, текст от первого лица, фото. Нужны данные
  владельца → комментарий-`TODO` в коде (НЕ в пользовательском тексте) + в отчёт.
- **`data/business.siteUrl`** — помеченная заглушка `"https://ekfix.us"`, домен НЕ менять.
- **`AggregateRating`** (`lib/jsonld`) — НЕ трогать.
- **Секреты:** `.env` не создавать, значения не коммитить. `.env.example` — 3 пустых имени
  (`RESEND_API_KEY`, `BOOK_NOTIFY_EMAIL`, `BOOK_WEBHOOK_URL`), не менять. В тестах env
  мокать (`vi.stubEnv`) фейковыми значениями.
- **ADR:** не отменять молча. Отклонение от ADR 0002 (CSS) — по брифу этого захода, в отчёт.
  Задача 7 → новый `docs/adr/0013` + приписка к 0012. Задача 3 → приписка к 0010 (не новый ADR).
- **Отсутствующая зависимость → `BLOCKED`.** Пакет `resend` НЕ ставить — задача 3 идёт `fetch`-ом.
- **Не трогать:** `.autopilot/`, `ek-global-seo-strategy-2026.md`, `.git/`. Три удалённых
  `.md`-брифа не восстанавливать (удаление намеренное).
- **Вне периметра:** hero-анимация, онлайн-запись, блог, E-E-A-T-слой, города сверх 5,
  офлайн-шаги (GBP, каталоги, отзывы). Не начинать.
- **Тесты:** vitest, только шов доставки (`lib/book`). Существующие 4 тест-файла —
  не трогать (`app/sitemap.test.ts`, `lib/jsonld.test.ts`, `lib/book/submit.test.ts`,
  `app/api/book/route.test.ts` — последний может дополниться, но не ломаться).

## Границы, решённые в спецификации

| Модуль | Владеет | Выставляет | Прячет |
|---|---|---|---|
| `lib/book/sinks` | адаптерами доставки лида | `ConsoleLeadSink`/`EmailLeadSink`/`WebhookLeadSink`, `sinks: LeadSink[]` | REST-контракт Resend, чтение env, обработку ошибок канала |
| `lib/book/submit` | приёмом + валидацией + фан-аутом | `submitLead(input: unknown): Promise<LeadResult>` | zod-схему, фильтр `enabled`, `Promise.allSettled` |
| `data/b2b-segments` | контентом B2B-сегментов | `forBusinessSegments`, **`publicForBusinessSegments`** (новый: `.filter(s => !s.placeholder)`), `whoWeServe`, `whoWeServeHead`, … | флаг `placeholder` и его смысл |
| `data/services` | контентом услуг + `commercialCategories` | `services`, `commercialCategories`, `serviceSlugs`, `getService`, `applianceFormOptions` | — (данные) |
| `lib/nav` | структурой меню | `mainNav`, `NavLink`, `NavGroup` (**+`basePath: string`**) | вывод из `data/services`/`data/towns` |

## Швы для тестов (Phase 5 тестирует ТОЛЬКО здесь)

1. **`lib/book`** — `submitLead(input)`:
   - валидный → `{ok:true}` + каждый `enabled` sink получил лид;
   - невалидный → `{ok:false, errors}`, ни один sink не вызван;
   - sink бросил → всё равно `{ok:true}`, остальные вызваны;
   - ни одного `enabled` канала → `{ok:true}`, 0 сетевых вызовов (`fetch` не вызван);
   - `EmailLeadSink.enabled` / `WebhookLeadSink.enabled` следуют за `process.env` (мок).
   Существующие швы (`sitemap`, `jsonld`, `api/book/route`) — не трогать.

## Что построил каждый таск (дописывается по мере сдачи)

<!-- пусто; таски дописывают сюда -->
