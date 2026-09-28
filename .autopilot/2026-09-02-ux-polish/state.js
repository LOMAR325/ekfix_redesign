window.STATE =
{
  "slug": "ux-polish",
  "dir": "2026-09-02-ux-polish",
  "title": "EK Global — UX-правки хедера и hero по фидбеку владельца",
  "mode": "semi",
  "depth": "normal",
  "polish": null,
  "tier": "T0",
  "briefFile": "2026-09-02-brief.md",
  "memoryFile": "CLAUDE.md",
  "skillDir": "/Users/User/.claude/skills/autopilot",
  "startedAt": "2026-09-02T19:41:42-04:00",
  "updatedAt": "2026-09-03T03:12:00-04:00",
  "finishedAt": "2026-09-03T03:12:00-04:00",
  "stages": [
    { "id": "preflight", "status": "done", "startedAt": "2026-09-02T19:41:42-04:00", "finishedAt": "2026-09-02T19:43:00-04:00" },
    { "id": "manifest",  "status": "done", "startedAt": "2026-09-02T19:43:00-04:00", "finishedAt": "2026-09-02T19:47:00-04:00" },
    { "id": "briefing",  "status": "done", "startedAt": "2026-09-02T19:47:00-04:00", "finishedAt": "2026-09-02T19:51:37-04:00" },
    { "id": "spec",      "status": "done", "startedAt": "2026-09-02T19:51:37-04:00", "finishedAt": "2026-09-02T20:11:45-04:00" },
    { "id": "plan",      "status": "skipped", "startedAt": "2026-09-02T20:11:45-04:00", "note": "ярус T0 — без разбивки на таски" },
    { "id": "build",     "status": "done", "startedAt": "2026-09-02T20:18:00-04:00", "finishedAt": "2026-09-03T02:16:00-04:00", "note": "1 проход T0; 1-я попытка — session limit, перезапуск 2026-09-03" },
    { "id": "review",    "status": "done", "startedAt": "2026-09-03T02:00:00-04:00", "finishedAt": "2026-09-03T03:05:00-04:00", "note": "инлайн 3 оси + слепая приёмка: 2 дрейфа → fix-now таск 01 (1 дозапрос), закрыто" },
    { "id": "final",     "status": "done", "startedAt": "2026-09-03T03:05:00-04:00", "finishedAt": "2026-09-03T03:12:00-04:00" }
  ],
  "requirements": {
    "total": 11, "done": 11, "inTicket": 0, "inSpec": 0,
    "placeholder": 0, "deferred": 0, "dropped": 0
  },
  "tickets": [
    { "id": "01", "title": "fix-now: hero на 720px, телефон 16px",
      "requirements": ["R01", "R04"], "blockedBy": [], "wave": 1, "zone": ["app/globals.css"],
      "status": "done", "startedAt": "2026-09-03T02:42:00-04:00", "finishedAt": "2026-09-03T03:05:00-04:00",
      "retries": 0, "repairs": 1, "handoffs": 0,
      "repairFindings": ["лайм у .not-listed a/.brand-note a — прозаичные ссылки вне брифинг-карва + нечитаемо на светлой секции → откат к оригиналу"],
      "tests": { "passed": 29, "failed": 0 }, "commit": "7ed0bf8",
      "origin": "слепая приёмка G4 — 2 дрейфа" }
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
      "hero влезает на 1280×720 / 1366×768 с нулевым запасом снизу (min-height:100svh + .hero-trust absolute bottom:0 — обе заморожены); полностью виден, ничего не режется",
      "визуал верифицирован Playwright/Chromium из системного кэша (не зависимость проекта) — при следующем заходе браузер может быть недоступен"
    ],
    "emptyEnv": []
  },
  "additions": [
    "R03: у 4 акцентных ссылок добавлены hover-осветление + :focus-visible outline (spec пометил как краткое решение не из брифа; родитель R03)",
    "R05-побочно: на ≤480px номер телефона теперь виден (раньше пряталась .call-text, оставалась только зелёная точка)"
  ],
  "coverage": {
    "ranAt": "2026-09-02T19:58:00-04:00",
    "checker": "general-purpose subagent, только brief + spec",
    "findings": { "missing": 2, "halfCovered": 2, "inSpecNotBrief": 8 },
    "actions": [
      "missing #1 (редиректы не упомянуты в спеке) → добавил: §«Стек не меняется» + §«Швы» + история 18 R07i",
      "missing #2 (сужение ссылок до 6 акцентных не обосновано) → ответ брифинга вписан в brief.md «Дополнения»",
      "half #1 (десктоп vs мобайл для hero) → §«Hero целиком»: цель по десктопу, мобайл — «не хуже»",
      "half #2 (нет конкретных px уплотнения hero) → оставлено исполнителю, критерий в историях 1–3",
      "inSpecNotBrief: 6 из 8 — R##.n углубление с родителем; hover-отклик помечен как краткое решение и в отчёте"
    ]
  },
  "concerns": [
    "РЕШЕНО таском 01: R04 телефон (14→16px/700), R01 hero (влезает на 1280×720 и 1366×768, замер Playwright)",
    "УНАСЛЕДОВАНО (не чинилось, вне периметра): .site-header переносится на 2 строки на 861–1080px — было и до захода, порог ≈1090px не сдвинулся от +16px телефона",
    "R06 — aria-expanded у .nav-trigger на десктопе остаётся false при hover-раскрытии (как на старом hover-only сайте); :focus-within работает — в отчёт как мелкая a11y-заметка",
    "R03 — hover/focus 4 инлайн-ссылок через селектор a[style*=\"--accent\"] (без нового класса) — работает, чуть хрупкий; заметка для следующего захода",
    "hero на 1280×720/1366×768 — полоса доверия ровно на линии сгиба, запаса ноль (следствие min-height:100svh + absolute bottom:0)"
  ],
  "reviewers": { "manifestSpec": "инлайн (T0)", "craft": "инлайн (T0)" },
  "blind": {
    "ranAt": "2026-09-03T02:38:00-04:00",
    "checker": "general-purpose, только brief + repo; Playwright 1.62.1 из системного кэша",
    "drift": [
      "R01 hero: manifest done → blind частично (на 1280×720 полоса доверия за сгибом). → fix-now таск 01 → ЗАКРЫТО: Playwright-замер .hero-trust bottom = 720 @1280×720 и 768 @1366×768, .hero-meta с запасом",
      "R04 телефон: manifest done → blind частично (14→15px почти незаметно). → fix-now таск 01 → ЗАКРЫТО: 16px/700"
    ],
    "findings": [
      "R03: .not-listed a / .brand-note a — прозаичные ссылки, приёмка сочла их вне периметра брифа. → таск 01 оставил их с оригинальным подчёркиванием (снято только у 4 акцентных со стрелкой)",
      "memory/ADR правки на момент приёмки не закоммичены — ушли в финальный коммит (ожидаемо, ждали G4)"
    ],
    "framChecks": "форма 200/400 · JSON-LD 2 скрипта · sitemap 22 loc · редиректы 7/7 308 · SSG 28 · тесты 29 · tsc 0 · нет гор.скролла · data/* / siteUrl / AggregateRating / next.config.ts не тронуты — всё OK"
  },
  "priorRuns": "2026-09-01-nextjs-b2b-migration (миграция) · 2026-09-02-audit-fixes (дефекты аудита) — оба сданы"
}
