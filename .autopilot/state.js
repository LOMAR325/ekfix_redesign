window.STATE =
{
  "slug": "nextjs-b2b-migration",
  "dir": "2026-09-01-nextjs-b2b-migration--wip",
  "title": "Перенос сайта EK Global на Next.js + приоритет B2B",
  "mode": "semi",
  "depth": "normal",
  "polish": null,
  "tier": "T3",
  "briefFile": "2026-09-01-brief.md",
  "memoryFile": "CLAUDE.md",
  "skillDir": "/Users/User/.claude/skills/autopilot",
  "startedAt": "2026-09-01T00:51:53-04:00",
  "updatedAt": "2026-09-01T15:49:26-04:00",
  "finishedAt": null,
  "stages": [
    { "id": "preflight", "status": "done", "startedAt": "2026-09-01T00:51:53-04:00", "finishedAt": "2026-09-01T00:52:55-04:00" },
    { "id": "manifest",  "status": "done", "startedAt": "2026-09-01T00:52:55-04:00", "finishedAt": "2026-09-01T00:55:58-04:00" },
    { "id": "briefing",  "status": "done", "startedAt": "2026-09-01T00:55:58-04:00", "finishedAt": "2026-09-01T01:00:31-04:00" },
    { "id": "spec",      "status": "done", "startedAt": "2026-09-01T01:00:31-04:00", "finishedAt": "2026-09-01T01:54:19-04:00" },
    { "id": "plan",      "status": "done", "startedAt": "2026-09-01T01:54:19-04:00", "finishedAt": "2026-09-01T12:56:05-04:00", "note": "11 тасков, ярус T3" },
    { "id": "build",     "status": "active", "startedAt": "2026-09-01T12:56:05-04:00", "note": "1 из 11 тасков готов" },
    { "id": "review",    "status": "active", "startedAt": "2026-09-01T15:09:09-04:00", "note": "таск 02 — дозапрос (5 находок в data)" },
    { "id": "final",     "status": "pending" }
  ],
  "requirements": {
    "total": 53, "done": 3, "inTicket": 44, "inSpec": 0,
    "placeholder": 0, "deferred": 6, "dropped": 0
  },
  "tickets": [
    { "id": "01", "title": "Каркас проекта, layout, globals.css, Header/Footer", "requirements": ["R01","R02","R05","R34","R38i","R39i","R40i","R41"], "blockedBy": [], "wave": 1, "zone": ["корень","app/layout.tsx","app/globals.css","components/Header,Footer","lib/seo.ts","lib/nav.ts","data/business.ts","public/"], "status": "done", "startedAt": "2026-09-01T13:34:06-04:00", "finishedAt": "2026-09-01T15:15:54-04:00", "retries": 1, "retryReason": "первый запуск завис на интерактивном create-next-app; перезапуск с ручным scaffold", "repairs": 0, "handoffs": 0, "files": ["package.json","tsconfig.json","next.config.ts","vitest.config.ts",".env.example","app/layout.tsx","app/page.tsx","app/globals.css","app/icon.svg","components/Header.tsx","components/Footer.tsx","components/Analytics.tsx","lib/seo.ts","lib/nav.ts","data/types.ts","data/business.ts","public/images/"], "tests": { "passed": 0, "failed": 0, "note": "швов нет в этом таске; build+tsc зелёные" }, "commit": "63d0fcd", "concerns": 6 },
    { "id": "02", "title": "Слой данных: services, towns, reviews, brands, b2b-segments", "requirements": ["R09","R08","R11i","R14","R19","R20","R33","R37i","R47i","R28"], "blockedBy": ["01"], "wave": 2, "zone": ["data/"], "status": "repair", "startedAt": "2026-09-01T15:15:54-04:00", "retries": 0, "repairs": 1, "repairFindings": ["COI-ответ обещал срок — убрать", "laundry-абзац превышает исходную копию", "sectionHead мёртвый алиас", "AudienceCard: разбить на 2 типа", "копия /brands не в data — добавить"], "handoffs": 0, "files": ["data/services.ts","data/towns.ts","data/reviews.ts","data/brands.ts","data/b2b-segments.ts","data/business.ts","data/types.ts","lib/nav.ts"] },
    { "id": "03", "title": "SEO-инфра: JSON-LD, sitemap, robots", "requirements": ["R07","R08","R30","R32","R32a","R33","R43","R17i","R31i"], "blockedBy": ["02"], "wave": 3, "zone": ["lib/jsonld.ts","components/JsonLd.tsx","app/sitemap.ts","app/robots.ts"], "status": "pending", "retries": 0, "repairs": 0, "handoffs": 0 },
    { "id": "04", "title": "Заявка: lib/book + /api/book + BookForm (прототип)", "requirements": ["R06","R06.1","R06.2","R06.3","R06a","R42","R23"], "blockedBy": ["02"], "wave": 3, "zone": ["lib/book/","app/api/book/","components/BookForm.tsx","components/BookingProvider.tsx"], "status": "pending", "retries": 0, "repairs": 0, "handoffs": 0 },
    { "id": "05", "title": "Общие presentational-компоненты", "requirements": ["R24","R02","R34"], "blockedBy": ["02"], "wave": 3, "zone": ["components/ui/"], "status": "pending", "retries": 0, "repairs": 0, "handoffs": 0 },
    { "id": "06", "title": "Главная страница /", "requirements": ["R12","R18","R19","R21","R25","R26","R27","R28","R30","R32a","R38i"], "blockedBy": ["03","04","05"], "wave": 4, "zone": ["app/page.tsx","components/home/"], "status": "pending", "retries": 0, "repairs": 0, "handoffs": 0 },
    { "id": "07", "title": "Страницы /about и /brands", "requirements": ["R12","R20","R30","R31i"], "blockedBy": ["03","05"], "wave": 4, "zone": ["app/about/","app/brands/"], "status": "pending", "retries": 0, "repairs": 0, "handoffs": 0 },
    { "id": "08", "title": "Страница /for-business (расширение B2B)", "requirements": ["R12","R22","R26","R27","R29","R30","R31i","R36","R37i"], "blockedBy": ["03","05"], "wave": 4, "zone": ["app/for-business/","components/for-business/"], "status": "pending", "retries": 0, "repairs": 0, "handoffs": 0 },
    { "id": "09", "title": "/appliance-repair/[slug] — 12 страниц техники", "requirements": ["R13","R30","R31i","R02"], "blockedBy": ["03","05"], "wave": 4, "zone": ["app/appliance-repair/"], "status": "pending", "retries": 0, "repairs": 0, "handoffs": 0 },
    { "id": "10", "title": "/towns + /towns/[slug] (индекс + 5 городов)", "requirements": ["R15","R16","R35","R39","R47i","R30","R31i","R11i"], "blockedBy": ["03","05"], "wave": 4, "zone": ["app/towns/"], "status": "pending", "retries": 0, "repairs": 0, "handoffs": 0 },
    { "id": "11", "title": "Уборка, CWV, финальная проверка", "requirements": ["R03","R04","R41","R43","R44"], "blockedBy": ["06","07","08","09","10"], "wave": 5, "zone": ["корень (удаление)","верификация"], "status": "pending", "retries": 0, "repairs": 0, "handoffs": 0 }
  ],
  "singlePass": null,
  "tests": null,
  "debt": {
    "placeholders": ["R10 — финальный домен (siteUrl=ekfix.us заглушка)", "R37i — имя программы обслуживания (EK Maintenance Plan)", "R36 — цифры доверия B2B", "HOA/кондо вертикаль — подтвердить", "коммерческие фото для карточек #repair", "R33 — подтвердить, что 6 отзывов настоящие"],
    "assumptions": ["Next.js 16 без output:export — нужен Node-хостинг", "шрифты через <link>, не next/font", "коммерч. категории — карточки+форма, не роуты (подтверждено пользователем)", "форма = прототип без реальной доставки (подтверждено пользователем)"],
    "emptyEnv": ["RESEND_API_KEY", "BOOK_NOTIFY_EMAIL", "BOOK_WEBHOOK_URL"]
  },
  "additions": [],
  "coverage": {
    "gate": "G2",
    "findings": 12,
    "missing": ["JSON-LD knowsAbout коммерч. услуг на / (b2b §7)", "абзац типов объектов в разделе прачечной for-business (b2b §8.3)", "усиление текста финального .cta-band for-business (b2b §8.8)", "borderline: E-E-A-T на страницах услуг (seo §3)"],
    "halfCovered": ["якоря/копирайт #who-we-serve", "якоря коммерч. карточек #repair", "копирайт #business-cta", "блок 'также обслуживаем' на главной/футере"],
    "extra": ["redirects *.html (A01)", "реордер /brands", "resilience формы сверх прототипа", "data/nav.ts как 7-й модуль"],
    "actions": "missing 1-3 → добавлены истории 32a + расширены 26/28; borderline E-E-A-T → R52i deferred + отчёт. half-covered → точные якоря/копирайт вписаны в истории 8/12/23/26/28. extra: A01 снято, /brands 1:1, resilience урезана до прототипа (истории 20-21), nav → lib/nav (6 data-модулей)."
  },
  "concerns": [
    "T01 craft · Header.tsx:47 — e.stopPropagation() мёртвый код (порт из vanilla js/main.js)",
    "T01 craft · Footer.tsx:33 — hoursNote.toLowerCase() в презентационном компоненте; текст футера держать в data как есть",
    "T01 craft · Header/Footer — разный идиом каста as Route (helper r() vs инлайн); свести к одному до уборки typedRoutes-кастов",
    "T01 craft · layout.tsx:10 — root metadata дублирует pageMetadata(); layout должен звать pageMetadata() + добавлять только openGraph",
    "T01 craft · data/business.ts:40 — maintenancePlanName за код-комментарием, не видимый [TODO]-плейсхолдер; таск 06/08 обязан пометить имя неподтверждённым при рендере",
    "T01 spec · Footer.tsx:20 — вводный <p> футера захардкожен в компоненте (маркет. проза 1:1 из HTML, не NAP-поле); вынести в data позже"
  ],
  "reviewers": { "manifestSpec": "a2f72ace2a54ef8fc", "craft": "a432188c99320cba5" },
  "blind": null
}
