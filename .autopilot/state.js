window.STATE =
{
  "slug": "ux-polish",
  "dir": "2026-09-02-ux-polish--wip",
  "title": "EK Global — UX-правки хедера и hero по фидбеку владельца",
  "mode": "semi",
  "depth": "normal",
  "polish": null,
  "tier": "T0",
  "briefFile": "2026-09-02-brief.md",
  "memoryFile": "CLAUDE.md",
  "skillDir": "/Users/User/.claude/skills/autopilot",
  "startedAt": "2026-09-02T19:41:42-04:00",
  "updatedAt": "2026-09-03T02:40:00-04:00",
  "finishedAt": null,
  "stages": [
    { "id": "preflight", "status": "done", "startedAt": "2026-09-02T19:41:42-04:00", "finishedAt": "2026-09-02T19:43:00-04:00" },
    { "id": "manifest",  "status": "done", "startedAt": "2026-09-02T19:43:00-04:00", "finishedAt": "2026-09-02T19:47:00-04:00" },
    { "id": "briefing",  "status": "done", "startedAt": "2026-09-02T19:47:00-04:00", "finishedAt": "2026-09-02T19:51:37-04:00" },
    { "id": "spec",      "status": "done", "startedAt": "2026-09-02T19:51:37-04:00", "finishedAt": "2026-09-02T20:11:45-04:00" },
    { "id": "plan",      "status": "skipped", "startedAt": "2026-09-02T20:11:45-04:00", "note": "ярус T0 — без разбивки на таски" },
    { "id": "build",     "status": "done", "startedAt": "2026-09-02T20:18:00-04:00", "finishedAt": "2026-09-03T02:16:00-04:00", "note": "1 проход T0; 1-я попытка — session limit, перезапуск 2026-09-03" },
    { "id": "review",    "status": "active", "startedAt": "2026-09-03T02:00:00-04:00", "note": "инлайн 3 оси + слепая приёмка: 2 дрейфа (R01 hero на 720px, R04 телефон) → fix-now таск 01" },
    { "id": "final",     "status": "pending" }
  ],
  "requirements": {
    "total": 11, "done": 7, "inTicket": 4, "inSpec": 0,
    "placeholder": 0, "deferred": 0, "dropped": 0
  },
  "tickets": [
    { "id": "01", "title": "fix-now: hero на 720px, телефон 16px, сигнал у 2 прозаичных ссылок",
      "requirements": ["R01", "R04", "R03"], "blockedBy": [], "wave": 1, "zone": ["app/globals.css"],
      "status": "repair", "startedAt": "2026-09-03T02:42:00-04:00", "retries": 0, "repairs": 1, "handoffs": 0,
      "repairFindings": ["лайм у .not-listed a/.brand-note a — прозаичные ссылки вне брифинг-карва + нечитаемо на светлой секции → откат к оригиналу"],
      "origin": "слепая приёмка G4 — 2 дрейфа + 1 находка" }
  ],
  "singlePass": {
    "startedAt": "2026-09-02T20:18:00-04:00",
    "finishedAt": "2026-09-03T02:16:00-04:00",
    "files": [
      "app/globals.css", "app/page.tsx", "app/appliance-repair/[slug]/page.tsx",
      "components/Header.tsx", "components/home/Hero.tsx", "components/home/BrandsSection.tsx",
      "components/ui/audience-card.tsx", "components/home/SideRail.tsx (удалён)"
    ],
    "tests": { "passed": 29, "failed": 0 },
    "commit": "6f2ae17"
  },
  "tests": { "passed": 29, "failed": 0 },
  "debt": {
    "placeholders": [],
    "assumptions": [
      "hero: расчёт высот вместо рендера — headless-браузера в среде нет; нужен глаз владельца на 1280×720 и 1440×900",
      ".call-pill 15px — нижняя граница диапазона спеки; крупнее только если владелец скажет"
    ],
    "emptyEnv": []
  },
  "additions": [
    "R03: hover-осветление + focus-outline у акцентных ссылок (spec пометил как краткое решение не из брифа; родитель R03)",
    "R05-побочно: на ≤480px номер телефона теперь виден (раньше пряталась .call-text, оставалась только точка)"
  ],
  "coverage": {
    "ranAt": "2026-09-02T19:58:00-04:00",
    "checker": "general-purpose subagent, только brief + spec",
    "findings": {
      "missing": 2,
      "halfCovered": 2,
      "inSpecNotBrief": 8
    },
    "actions": [
      "missing #1 (редиректы не упомянуты в спеке) → добавил: §«Стек не меняется» + §«Швы» + история 18 R07i (7/7 редиректов 308 после сборки)",
      "missing #2 (сужение ссылок до 6 акцентных не обосновано в тексте) → ответ брифинга AskUserQuestion вписан в brief.md «Дополнения»; спека ссылается на выбор владельца",
      "half #1 (десктоп vs мобайл для hero) → §«Hero целиком»: цель по десктопу т.к. фидбек+скриншот десктопные; мобайл — «не хуже»; в brief.md «Дополнения» зафиксировано",
      "half #2 (нет конкретных px уплотнения hero) → оставлено исполнителю: контракт спеки = критерий (100svh на ~700px, баланс на 900px+), точные значения подбираются; истории 1–3 задают приёмку",
      "inSpecNotBrief: 6 из 8 — это R##.n углубление (клав-доступность, hover-отклик, баланс на большом мониторе, guard-проверки) с родителем R01/R03/R04/R06, норма для depth=normal; hover-отклик помечен как краткое решение (не из брифа) в спеке и пойдёт в отчёт; ADR 0014 — приписка к 0002 остаётся основной, отдельный ADR только если фаза памяти сочтёт нужным"
    ]
  },
  "concerns": [
    "R04 — .call-pill 15px на нижней границе «заметно крупнее»; ждём глаз владельца",
    "R01/R06 — визуал не отрендерен (нет headless-браузера); проверено расчётом + инспекцией HTML",
    "R06 — aria-expanded у .nav-trigger на десктопе остаётся false при hover-раскрытии (как на старом hover-only сайте); :focus-within работает",
    "R03 — hover/focus инлайн-ссылок через селектор a[style*=\"--accent\"] — работает, но чуть хрупкий (ловит любой <a> с --accent в style)"
  ],
  "reviewers": { "manifestSpec": "инлайн (T0)", "craft": "инлайн (T0)" },
  "blind": {
    "ranAt": "2026-09-03T02:38:00-04:00",
    "checker": "general-purpose, только brief + repo; Playwright 1.62.1 из npx-кэша",
    "drift": [
      "R01 hero: manifest done → blind частично. На 1440×900 hero+полоса доверия влезают; на 1280×720 .hero-trust за сгибом (top 737/bottom 792 при vpH 720), .hero-meta подрезана. Порог полной видимости ≳812px. Уплотнение реальное (~50px), но недостаточное для 720/768. → fix-now таск 01",
      "R04 телефон: manifest done → blind частично. 14→15px (+1px) против жалобы «маловат» почти незаметно на десктопе. Мобайл ≤480 — там номер вернулся, весомо. → fix-now таск 01"
    ],
    "findings": [
      "R03: .not-listed a / .brand-note a — тёмные прозаичные ссылки (не лаймовые, без →); сняли подчёркивание → без hover визуального сигнала ссылки не осталось. → fix-now таск 01: дать им color:var(--accent)",
      "memory/ADR правки (CLAUDE.md, docs/adr/0002) на момент приёмки не закоммичены — уйдут в финальный коммит (ожидаемо, ждали G4)"
    ],
    "framChecks": "форма 200/400 · JSON-LD 2 скрипта · sitemap 22 loc · редиректы 7/7 308 · SSG 28 · тесты 29 · tsc 0 · нет гор.скролла · data/* / siteUrl / AggregateRating / next.config.ts не тронуты — всё OK"
  },
  "priorRuns": "2026-09-01-nextjs-b2b-migration (миграция) · 2026-09-02-audit-fixes (дефекты аудита) — оба сданы"
}
