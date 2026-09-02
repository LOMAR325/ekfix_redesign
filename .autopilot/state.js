window.STATE =
{
  "slug": "audit-fixes",
  "dir": "2026-09-02-audit-fixes--wip",
  "title": "EK Global — закрытие дефектов после аудита 2026-09-02",
  "mode": "semi",
  "depth": "normal",
  "polish": null,
  "tier": "T2",
  "briefFile": "2026-09-02-brief.md",
  "memoryFile": "CLAUDE.md",
  "skillDir": "/Users/User/.claude/skills/autopilot",
  "startedAt": "2026-09-02T16:45:28-04:00",
  "updatedAt": "2026-09-02T17:12:00-04:00",
  "finishedAt": null,
  "stages": [
    { "id": "preflight", "status": "done", "startedAt": "2026-09-02T16:45:28-04:00", "finishedAt": "2026-09-02T16:47:00-04:00" },
    { "id": "manifest",  "status": "done", "startedAt": "2026-09-02T16:47:00-04:00", "finishedAt": "2026-09-02T16:50:00-04:00" },
    { "id": "briefing",  "status": "skipped", "note": "semi — вопросов не потребовалось: бриф задаёт точные файлы/строки/фиксы и явно решает спорные точки (HOA → убрать, канал → оба через .env, точечный CSS разрешён)" },
    { "id": "spec",      "status": "done", "startedAt": "2026-09-02T16:50:00-04:00", "finishedAt": "2026-09-02T17:05:00-04:00", "note": "G2: 9 находок независимой проверки, все отработаны" },
    { "id": "plan",      "status": "done", "startedAt": "2026-09-02T17:05:00-04:00", "finishedAt": "2026-09-02T17:12:00-04:00", "note": "4 таска, ярус T2" },
    { "id": "build",     "status": "active", "startedAt": "2026-09-02T17:12:00-04:00" },
    { "id": "review",    "status": "pending" },
    { "id": "final",     "status": "pending" }
  ],
  "requirements": {
    "total": 33, "done": 0, "inTicket": 33, "inSpec": 0,
    "placeholder": 0, "deferred": 0, "dropped": 0
  },
  "tickets": [
    { "id": "01", "title": "Визуальные дефекты страниц (задачи 1,2,4,5)", "requirements": ["R01","R02","R03","R04","R05","R06","R07","R15","R16","R17","R33i","R21","R22","R32"], "blockedBy": [], "wave": 1, "zone": ["app/globals.css","components/ui/audience-card.tsx","app/for-business/page.tsx","data/b2b-segments.ts","data/services.ts"], "status": "pending", "retries": 0, "repairs": 0, "handoffs": 0 },
    { "id": "02", "title": "Доставка заявки: EmailLeadSink + тесты (задача 3)", "requirements": ["R08","R09","R10","R11","R12","R13","R14","R28","R32"], "blockedBy": [], "wave": 1, "zone": ["lib/book/"], "status": "pending", "retries": 0, "repairs": 0, "handoffs": 0 },
    { "id": "03", "title": "Активный пункт меню + редиректы (задачи 6,7)", "requirements": ["R18","R19","R20","R29","R32"], "blockedBy": [], "wave": 1, "zone": ["lib/nav.ts","components/Header.tsx","next.config.ts","docs/adr/"], "status": "pending", "retries": 0, "repairs": 0, "handoffs": 0 },
    { "id": "04", "title": "Финальная проверка (ПРОВЕРКА ПЕРЕД СДАЧЕЙ)", "requirements": ["R23","R24","R25","R26","R27","R28","R30"], "blockedBy": ["01","02","03"], "wave": 2, "zone": ["верификация","финальный коммит"], "status": "pending", "retries": 0, "repairs": 0, "handoffs": 0 }
  ],
  "singlePass": null,
  "tests": null,
  "debt": { "placeholders": [], "assumptions": [], "emptyEnv": [] },
  "additions": [],
  "coverage": {
    "gate": "G2",
    "findings": 9,
    "missing": ["issues §2.11 side-rail низкий контраст vs History 27 QA-проверка контраста — конфликт", "issues §5 owner-вопросы №5/6/9/10 не в spec Открытые места", "ADR 0010 (форма-прототип / no-op EmailLeadSink) — ревизия не отражена"],
    "halfCovered": ["task 1 'чини компонент' — spec правит globals.css не tsx (по issues §2.1, но допускает др. чтение)", "История 4 — нет fallback если 3-карточная сетка сломается (CSS заморожен)", "task 2 фильтр всегда vs 'в продакшене'", "e2e форма — мульти-канал только на уровне submitLead"],
    "extra": ["basePath в NavGroup — spec-введённое структурное поле (task 6 просит лишь 'как на старом сайте')"],
    "actions": "§2.11 → Вне рамок + History 27 явный carve-out (унаследованный контраст ≠ провал). §5 → spec Открытые места ссылается на полный список в manifest. ADR 0010 → приписка (не новый ADR), задача = предвиденный шаг. task1 CSS → оставлено (трактовка issues §2.1), в отчёт обе. История 4 → auto-fit minmax держит 3 карточки, путь эскалации D##. task2 always-filter → оставлено как строже. e2e → History 28 уточнена (мульти-канал = юнит шов 1). basePath → оставлено как R18.1 (соответствие конвенции 'без хардкода в компонентах')."
  },
  "concerns": [],
  "reviewers": { "manifestSpec": null, "craft": null },
  "blind": null,
  "priorRun": "2026-09-01-nextjs-b2b-migration (сдан 2026-09-02; state.js архивирован в его папку)"
}
