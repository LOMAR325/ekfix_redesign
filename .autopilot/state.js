window.STATE =
{
  "slug": "entity-commercial-geo",
  "dir": "2026-09-28-entity-commercial-geo--wip",
  "title": "EK Global — единая сущность, коммерческий раздел, география, экспертиза",
  "mode": "semi",
  "depth": "normal",
  "polish": null,
  "tier": "T3",
  "briefFile": "2026-09-28-brief.md",
  "memoryFile": "CLAUDE.md",
  "skillDir": "/Users/User/.agents/skills/autopilot",
  "startedAt": "2026-09-28T22:44:34+03:00",
  "updatedAt": "2026-09-29T08:33:32+03:00",
  "finishedAt": null,
  "stages": [
    {
      "id": "preflight",
      "status": "done",
      "startedAt": "2026-09-28T22:44:34+03:00",
      "finishedAt": "2026-09-28T22:45:13+03:00"
    },
    {
      "id": "manifest",
      "status": "done",
      "startedAt": "2026-09-28T22:45:13+03:00",
      "finishedAt": "2026-09-28T22:48:29+03:00"
    },
    {
      "id": "briefing",
      "status": "done",
      "startedAt": "2026-09-28T22:48:29+03:00",
      "note": "1 вопрос (R42 — публикация коммерческих дочерних): «Как с Ballantyne»",
      "finishedAt": "2026-09-28T23:00:26+03:00"
    },
    {
      "id": "spec",
      "status": "done",
      "startedAt": "2026-09-28T23:00:26+03:00",
      "note": "85 историй; G2: 24 находки → закрыты",
      "finishedAt": "2026-09-28T23:17:51+03:00"
    },
    {
      "id": "plan",
      "status": "done",
      "startedAt": "2026-09-28T23:17:51+03:00",
      "note": "11 тасков, ярус T3, 5 волн (W3 — 5 тасков параллельно)",
      "finishedAt": "2026-09-28T23:23:00+03:00"
    },
    {
      "id": "build",
      "status": "active",
      "startedAt": "2026-09-28T23:23:00+03:00",
      "note": "1 из 11 тасков готов; волна 2: единая сущность"
    },
    {
      "id": "review",
      "status": "active",
      "startedAt": "2026-09-28T23:37:46+03:00",
      "note": "проверено 1 из 11 (1 дозапрос)"
    },
    {
      "id": "final",
      "status": "pending"
    }
  ],
  "requirements": {
    "total": 102,
    "done": 7,
    "inTicket": 94,
    "inSpec": 0,
    "placeholder": 0,
    "deferred": 1,
    "dropped": 0
  },
  "tickets": [
    {
      "id": "01",
      "title": "Фундамент: статусы публикации, схема данных, реестр путей, перелинковка",
      "requirements": [
        "R01",
        "R03",
        "R06",
        "R07",
        "R08",
        "R09",
        "R10",
        "R26",
        "R70",
        "R81",
        "R89",
        "R93"
      ],
      "blockedBy": [],
      "wave": 1,
      "zone": [
        "data/types.ts",
        "lib/publish.ts",
        "lib/routes.ts",
        "lib/links.ts",
        "app/sitemap.ts",
        "data/towns.ts",
        "data/b2b-segments.ts",
        "data/commercial.ts",
        "data/guides.ts",
        "data/cases.ts",
        "data/reviews.ts",
        "data/site.ts",
        "scripts/"
      ],
      "status": "done",
      "retries": 0,
      "repairs": 1,
      "handoffs": 0,
      "startedAt": "2026-09-28T23:23:00+03:00",
      "repairFindings": [
        "ревью: одна точка входа к опубликованному; тесты швов 2/5 не зависят от статусов в data; очистка фикстур; предикат городов один и на момент вызова; общий экстрактор + D01 редакционная метрика + маски отраслей; типизация contactAs/segmentId, equipment → Other Business; priority в шве 2; ярлыки из data/site"
      ],
      "finishedAt": "2026-09-28T23:48:51+03:00",
      "commit": "6d8c1f0",
      "tests": {
        "passed": 47,
        "failed": 0
      },
      "files": [
        "data/types.ts",
        "lib/publish.ts",
        "lib/routes.ts",
        "lib/links.ts",
        "app/sitemap.ts",
        "data/towns.ts",
        "data/commercial.ts",
        "data/guides.ts",
        "data/cases.ts",
        "data/site.ts",
        "scripts/"
      ],
      "concerns": [
        "check:similarity: опубликованные города по редакционной метрике 0.33–0.44 (Fort Mill, Rock Hill, Matthews, Indian Trail) — общие отзывы и абзац про $75"
      ]
    },
    {
      "id": "02",
      "title": "Единая сущность: Constantin, боевой домен, граф JSON-LD",
      "requirements": [
        "R11",
        "R12",
        "R13",
        "R14",
        "R15",
        "R16",
        "R17",
        "R18",
        "R19",
        "R20",
        "R21",
        "R22",
        "R23",
        "R27i"
      ],
      "blockedBy": [
        "01"
      ],
      "wave": 2,
      "zone": [
        "lib/jsonld.ts",
        "components/JsonLd.tsx",
        "lib/breadcrumb.ts",
        "data/people.ts",
        "data/business.ts"
      ],
      "status": "repair",
      "retries": 0,
      "repairs": 1,
      "handoffs": 0,
      "startedAt": "2026-09-28T23:48:51+03:00",
      "repairFindings": [
        "ревью: faqNode/articleNode отбрасывают черновики; image бизнеса только на / из owner.photos.hero; тест Place + ServedArea.kind из Town; reviewCount vs reviews.length; people.test обходит все data/*.ts; articlePath в одном месте; роль и alt фото владельца на главной из owner"
      ]
    },
    {
      "id": "03",
      "title": "Коммерческий раздел: хаб на новом пути, 7 дочерних, форма с бизнес-пресетом",
      "requirements": [
        "R29",
        "R31",
        "R33",
        "R34",
        "R35",
        "R36",
        "R37",
        "R38",
        "R39",
        "R40",
        "R41",
        "R42",
        "R43",
        "R56",
        "R57",
        "R70",
        "R93",
        "R03",
        "R04",
        "R91"
      ],
      "blockedBy": [
        "01",
        "02"
      ],
      "wave": 3,
      "zone": [
        "app/commercial-appliance-repair/",
        "app/for-business/",
        "data/commercial.ts",
        "data/b2b-segments.ts",
        "components/commercial/",
        "components/BookingProvider.tsx",
        "components/BookForm.tsx"
      ],
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0
    },
    {
      "id": "04",
      "title": "Бытовой хаб /appliance-repair и услуги с географией",
      "requirements": [
        "R44",
        "R68",
        "R69",
        "R70",
        "R20",
        "R03",
        "R04"
      ],
      "blockedBy": [
        "01",
        "02"
      ],
      "wave": 3,
      "zone": [
        "app/appliance-repair/",
        "data/services.ts"
      ],
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0
    },
    {
      "id": "05",
      "title": "Районы: South Charlotte и Ballantyne, разведение с Charlotte",
      "requirements": [
        "R58",
        "R59",
        "R60",
        "R61",
        "R62",
        "R63",
        "R64",
        "R65",
        "R66",
        "R67",
        "R71",
        "R70",
        "R93",
        "R03",
        "R04",
        "R91"
      ],
      "blockedBy": [
        "01",
        "02"
      ],
      "wave": 3,
      "zone": [
        "app/towns/",
        "data/towns.ts"
      ],
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0
    },
    {
      "id": "06",
      "title": "/about владельца-техника и /reviews по категориям",
      "requirements": [
        "R72",
        "R73",
        "R74",
        "R85",
        "R86",
        "R03",
        "R04",
        "R91",
        "R92"
      ],
      "blockedBy": [
        "01",
        "02"
      ],
      "wave": 3,
      "zone": [
        "app/about/",
        "data/people.ts",
        "app/reviews/",
        "data/reviews.ts"
      ],
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0
    },
    {
      "id": "07",
      "title": "Центр знаний, шаблон статьи, 6 черновиков; шаблон кейсов",
      "requirements": [
        "R75",
        "R76",
        "R77",
        "R78",
        "R80",
        "R81",
        "R82",
        "R83",
        "R84",
        "R21",
        "R70",
        "R03",
        "R91",
        "R92"
      ],
      "blockedBy": [
        "01",
        "02"
      ],
      "wave": 3,
      "zone": [
        "app/appliance-repair-guide/",
        "data/guides.ts",
        "app/repair-cases/",
        "data/cases.ts"
      ],
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0
    },
    {
      "id": "08",
      "title": "Главная: H1 «что и где», два пути, коммерция первой",
      "requirements": [
        "R45",
        "R46",
        "R47",
        "R48",
        "R49",
        "R50",
        "R51",
        "R52",
        "R56",
        "R70",
        "R17",
        "R03"
      ],
      "blockedBy": [
        "03",
        "04",
        "05"
      ],
      "wave": 4,
      "zone": [
        "app/page.tsx",
        "components/home/",
        "data/b2b-segments.ts"
      ],
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0
    },
    {
      "id": "09",
      "title": "Меню, подвал и все редиректы",
      "requirements": [
        "R24",
        "R25",
        "R30",
        "R31",
        "R53",
        "R54",
        "R55",
        "R87",
        "R99"
      ],
      "blockedBy": [
        "03",
        "04",
        "05",
        "06",
        "07"
      ],
      "wave": 4,
      "zone": [
        "lib/nav.ts",
        "components/Header.tsx",
        "components/Footer.tsx",
        "data/site.ts",
        "lib/redirects.ts",
        "next.config.ts"
      ],
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0
    },
    {
      "id": "10",
      "title": "Пять дополнительных черновиков статей",
      "requirements": [
        "R79",
        "R80",
        "R81",
        "R82",
        "R83"
      ],
      "blockedBy": [
        "07"
      ],
      "wave": 4,
      "zone": [
        "data/guides.ts"
      ],
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0
    },
    {
      "id": "11",
      "title": "Проверки перед сдачей, цифры для отчёта, ADR",
      "requirements": [
        "R02",
        "R05",
        "R26",
        "R28i",
        "R32",
        "R77",
        "R89",
        "R90",
        "R92",
        "R93",
        "R94",
        "R95",
        "R96",
        "R97",
        "R98",
        "R99",
        "R100"
      ],
      "blockedBy": [
        "08",
        "09",
        "10"
      ],
      "wave": 5,
      "zone": [
        "(все — точечные исправления)",
        "docs/adr/",
        ".autopilot/…/qa/"
      ],
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0
    }
  ],
  "singlePass": null,
  "tests": {
    "passed": 47,
    "failed": 0
  },
  "debt": {
    "placeholders": [],
    "assumptions": [],
    "emptyEnv": []
  },
  "additions": [
    "A01 → R81: превью черновиков в `next dev` с плашкой DRAFT — чтобы владелец мог вычитать черновики до публикации"
  ],
  "coverage": {
    "ranAt": "2026-09-28T23:15:44+03:00",
    "findings": 24,
    "missing": 2,
    "half": 10,
    "extra": 12,
    "actions": "missing: +coverage-блок South Charlotte, +запрет имён/адресов в кейсах; half: правило категорий /reviews, 11 названий статей, состав страницы статьи, areaServed = видимый список на каждой странице + блок «Where we work» на главной, AggregateRating по опубликованным отзывам (правило пользователя), сверка всех полей JSON-LD с видимым текстом, отзывы района через Review.area, запрет первого лица везде, вся копия в data/ (+data/site.ts); extra: dev-превью помечено A01→R81, остальное привязано к родителям (R10.1, R08.1/R93, R23, R45, R44, R31/R87, R56.2, R93.1), 5 доп. статей переведены в самый низкий приоритет (R79 «если останется время»)"
  },
  "concerns": [
    "app/sitemap.test.ts:48-68 и lib/links.test.ts:33-53 — помощник scenario/фикстуры скопирован в два теста; должен жить в одном общем тестовом модуле",
    "data/towns.ts — townSlugs вычисляется на загрузке, соседи (commercialSlugs/articleSlugs/caseSlugs) — функции; lib/nav строит serviceArea на загрузке (зона таска 09)",
    "scripts/html-text.mjs:4-23 — полная таблица сущностей HTML 4 + самопроверка, хотя React отдаёт только &amp;/&lt;/&gt;/&quot;/&#x27; (избыточная общность)",
    "scripts/similarity.mjs:43-46 — INDUSTRY_VARIANTS — второй рукописный список при комментарии «no second list»",
    "data/types.ts:114 + data/b2b-segments.ts:240 — ContactAsOption и contactAsOptions — два списка; тип не выведен из массива",
    "находка для отчёта: опубликованные города по редакционной шаблонности 0.33–0.44 (> 0.30)"
  ],
  "reviewers": {
    "manifestSpec": "a0198322a4ca1a633",
    "craft": "a8a31c0a2128b8bf6"
  },
  "blind": null,
  "branch": "autopilot/entity-commercial-geo",
  "priorRuns": "2026-09-01-nextjs-b2b-migration · 2026-09-02-audit-fixes · 2026-09-02-ux-polish (+ ручные ux-правки 7192550, ae8a8cb) — все сданы, PR #1 и #2 влиты в main"
}
