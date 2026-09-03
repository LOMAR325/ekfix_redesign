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
  "updatedAt": "2026-09-03T02:18:00-04:00",
  "finishedAt": null,
  "stages": [
    { "id": "preflight", "status": "done", "startedAt": "2026-09-02T19:41:42-04:00", "finishedAt": "2026-09-02T19:43:00-04:00" },
    { "id": "manifest",  "status": "done", "startedAt": "2026-09-02T19:43:00-04:00", "finishedAt": "2026-09-02T19:47:00-04:00" },
    { "id": "briefing",  "status": "done", "startedAt": "2026-09-02T19:47:00-04:00", "finishedAt": "2026-09-02T19:51:37-04:00" },
    { "id": "spec",      "status": "done", "startedAt": "2026-09-02T19:51:37-04:00", "finishedAt": "2026-09-02T20:11:45-04:00" },
    { "id": "plan",      "status": "skipped", "startedAt": "2026-09-02T20:11:45-04:00", "note": "ярус T0 — без разбивки на таски" },
    { "id": "build",     "status": "done", "startedAt": "2026-09-02T20:18:00-04:00", "finishedAt": "2026-09-03T02:16:00-04:00", "note": "1 проход T0; 1-я попытка — session limit, перезапуск 2026-09-03" },
    { "id": "review",    "status": "done", "startedAt": "2026-09-03T02:00:00-04:00", "finishedAt": "2026-09-03T02:18:00-04:00", "note": "инлайн, 3 оси; 0 блокеров, 3 concern" },
    { "id": "final",     "status": "active", "startedAt": "2026-09-03T02:18:00-04:00" }
  ],
  "requirements": {
    "total": 11, "done": 9, "inTicket": 2, "inSpec": 0,
    "placeholder": 0, "deferred": 0, "dropped": 0
  },
  "tickets": [],
  "singlePass": {
    "startedAt": "2026-09-02T20:18:00-04:00",
    "finishedAt": "2026-09-03T02:16:00-04:00",
    "files": [
      "app/globals.css", "app/page.tsx", "app/appliance-repair/[slug]/page.tsx",
      "components/Header.tsx", "components/home/Hero.tsx", "components/home/BrandsSection.tsx",
      "components/ui/audience-card.tsx", "components/home/SideRail.tsx (удалён)"
    ],
    "tests": { "passed": 29, "failed": 0 },
    "commit": null
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
  "blind": null,
  "priorRuns": "2026-09-01-nextjs-b2b-migration (миграция) · 2026-09-02-audit-fixes (дефекты аудита) — оба сданы"
}
