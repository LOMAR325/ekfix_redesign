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

### Таск 03

- **`lib/nav.ts`** — `NavGroup` получил обязательное поле `basePath: string`
  (`type NavGroup = { label; wide?; basePath: string; children: NavLink[] }`).
  В `mainNav`: «We Repair» → `basePath: "/appliance-repair"`, «Service Area» →
  `basePath: "/towns"`. `NavLink` без изменений. Любой новый `NavGroup` теперь
  обязан задавать `basePath`.
- **`components/Header.tsx`** — добавлен хелпер
  `groupActive(basePath) = pathname === basePath || pathname.startsWith(basePath + "/")`;
  `.nav-trigger` группы рендерится как `"nav-trigger active"` при `groupActive(entry.basePath)`.
  Подсветка дочерних `<Link>` (`isActive`) не тронута; `'use client'` и логика
  меню/дропдаунов не тронуты.
- **`next.config.ts`** — добавлена `async redirects()`: 7 правил, все
  `{ source, destination, permanent: true }` (HTTP 308):
  `/index.html`→`/`, `/about.html`→`/about`, `/brands.html`→`/brands`,
  `/for-business.html`→`/for-business`, `/appliance-repair/:slug.html`→`/appliance-repair/:slug`,
  `/towns/index.html`→`/towns` (ДО параметрического), `/towns/:slug.html`→`/towns/:slug`.
  Блоки `images` + `typedRoutes` не тронуты.
- **`docs/adr/0013-redirects-so-staryh-html.md`** — новый ADR (отменяет 0012);
  в `docs/adr/0012` в конце приписка «Отменено ADR 0013 (2026-09-02)».

### Таск 01

- **`app/globals.css`** — ровно одна новая строка: `.audience-card h3 { color: var(--text-light); }`
  (после существующего правила `.audience-card h3`). Заголовки карточек «Who we serve»
  на светлой секции главной снова читаются (контраст #f4f5f2 на #131513 ≈ 17:1).
  Больше в CSS ничего. Отклонение от ADR 0002 — по брифу этого захода.
- **`data/b2b-segments.ts`** — новый экспорт
  `export const publicForBusinessSegments = forBusinessSegments.filter((s) => !s.placeholder)`.
  `forBusinessSegments` и тип `ForBusinessSegment` (с полем `placeholder?: boolean`)
  без изменений; запись `hoa` на месте с `placeholder: true` + комментарий
  «скрыт из рендера… вернуть — снять флаг». Страницы рендерят только
  `publicForBusinessSegments` — сегмент с `placeholder` физически не попадает в HTML.
- **`app/for-business/page.tsx`** — `segmentCards` строится из `publicForBusinessSegments`
  (`.map((s) => ({ ...s, linkLabel: "" }))`); константа `HOA_NOTE` и ветка
  `segment.placeholder ? …` удалены. Русский маркер `[TODO: …]` со страницы убран.
  На `/for-business` теперь 3 карточки (`#property-management`, `#horeca`, `#hotels`);
  `.card-grid-4` = `repeat(auto-fit, minmax(220px,1fr))` — 3 трека без ломки на 1440/390.
- **`data/services.ts`** — только поля `image`:
  `commercialCategories` → `Refrigerator.webp` / `dishwasher.webp` / `dryer_16.webp` /
  `ice_maker_under.webp` (у всех 4 строк комментарий «временная замена до реального
  коммерческого фото»); `range.image` → `/images/stove.webp` (делит фото со `stove`);
  `washer.image` остаётся `/images/dryer.webp` + комментарий «нужно фото стиральной машины».
  `public/images/` не тронут. Сигнатуры `services`/`commercialCategories`/`getService`/
  `serviceSlugs`/`applianceFormOptions` без изменений.
- Скан 22 отрендеренных страниц (`next build && next start`, curl + вырезка тегов):
  0 кириллицы, 0 `TODO`/`FIXME`/`заглушк` в текстовых узлах, все 200.

### Таск 02 — доставка заявки (задача 3), зона `lib/book/`

- **`EmailLeadSink.send()`** больше не no-op: реальный `POST https://api.resend.com/emails`
  через глобальный `fetch` (пакет `resend` НЕ добавлен). Заголовки `Authorization:
  Bearer ${RESEND_API_KEY}` + `content-type: application/json`; тело
  `{ from: "EK Global <onboarding@resend.dev>", to: [BOOK_NOTIFY_EMAIL],
  subject: "New lead — <appliance>", text: <name/phone/appliance/contactAs/message построчно> }`.
  `from` — плейсхолдер `onboarding@resend.dev` + TODO-коммент (нужен подтверждённый
  домен-отправитель в Resend). Не-2xx ответ Resend → `throw` внутри → ловится хелпером.
  Комментарий `// TODO: подключить Resend` удалён.
- **Единый обработчик сбоя канала** — модуль-приватный `deliver(name, run)` в `sinks.ts`:
  `try / await run() / catch → console.warn("[book] <name> sink delivery failed", error)`,
  без rethrow. `EmailLeadSink` и `WebhookLeadSink` оба идут через него — сбой канала
  логируется одинаково и никогда не роняет заявку. Не экспортируется (обработка ошибок
  канала спрятана за модулем).
- **`enabled`** по предикату не тронут: `EmailLeadSink` = `Boolean(RESEND_API_KEY) &&
  Boolean(BOOK_NOTIFY_EMAIL)`, `WebhookLeadSink` = `Boolean(BOOK_WEBHOOK_URL)`,
  `ConsoleLeadSink` = `true`. Читается в field-инициализаторе при `new`; массив `sinks`
  строится при загрузке модуля (Next.js грузит `.env` раньше — включение канала =
  вписать переменные + перезапуск, без правок кода).
- **`submitLead` / `sinks: LeadSink[]`** — сигнатуры и контракт без изменений
  (`Promise.allSettled` по `sink.enabled`).
- **Тесты:** новый `lib/book/sinks.test.ts` (7 кейсов, шов 1). Мок `fetch`
  (`vi.stubGlobal`), env (`vi.stubEnv`), `vi.resetModules()` + динамический
  `import("./submit")` — чтобы массив `sinks` пересобрался под env теста; `afterEach`
  снимает все stub. Секретов нет: только `re_test_fake` / `owner@example.com` /
  `https://crm.example.com/hook`. `lib/book/submit.test.ts` не тронут.
  `npm test` → 29 passed (было 22).
- **ADR:** `docs/adr/0010` требует приписки «EmailLeadSink реализован в прогоне
  2026-09-02 (Resend REST через `fetch`); ядро ADR — доставка за `LeadSink`,
  включение через `.env` — в силе». Делает оркестратор / таск 04.
