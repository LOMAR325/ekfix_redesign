window.STATE =
{
  "slug": "entity-commercial-geo",
  "dir": "2026-09-28-entity-commercial-geo",
  "title": "EK Global — единая сущность, коммерческий раздел, география, экспертиза",
  "mode": "semi",
  "depth": "normal",
  "polish": null,
  "tier": "T3",
  "briefFile": "2026-09-28-brief.md",
  "memoryFile": "CLAUDE.md",
  "skillDir": "/Users/User/.agents/skills/autopilot",
  "startedAt": "2026-09-28T22:44:34+03:00",
  "updatedAt": "2026-09-29T18:19:14+03:00",
  "finishedAt": "2026-09-29T18:19:14+03:00",
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
      "status": "done",
      "startedAt": "2026-09-28T23:23:00+03:00",
      "note": "10 из 11 закоммичены; финальный таск 11 — проверки и ADR",
      "finishedAt": "2026-09-29T18:00:18+03:00"
    },
    {
      "id": "review",
      "status": "done",
      "startedAt": "2026-09-28T23:37:46+03:00",
      "note": "проверено 10 из 11",
      "finishedAt": "2026-09-29T18:00:18+03:00"
    },
    {
      "id": "final",
      "status": "done",
      "startedAt": "2026-09-29T18:00:18+03:00",
      "finishedAt": "2026-09-29T18:19:14+03:00",
      "note": "приёмка вслепую: почти всё реализовано; 2 расхождения (контраст звёзд, 4 старых города) — в новом брифе"
    }
  ],
  "requirements": {
    "total": 103,
    "done": 102,
    "inTicket": 0,
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
      "status": "done",
      "retries": 0,
      "repairs": 1,
      "handoffs": 0,
      "startedAt": "2026-09-28T23:48:51+03:00",
      "repairFindings": [
        "ревью: faqNode/articleNode отбрасывают черновики; image бизнеса только на / из owner.photos.hero; тест Place + ServedArea.kind из Town; reviewCount vs reviews.length; people.test обходит все data/*.ts; articlePath в одном месте; роль и alt фото владельца на главной из owner"
      ],
      "finishedAt": "2026-09-29T08:40:42+03:00",
      "commit": "1bccf9b",
      "tests": {
        "passed": 65,
        "failed": 0
      },
      "files": [
        "data/people.ts",
        "lib/jsonld.ts",
        "components/JsonLd.tsx",
        "lib/breadcrumb.ts",
        "data/business.ts",
        "app/**/page.tsx (JsonLd)"
      ],
      "concerns": []
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
      "status": "done",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "startedAt": "2026-09-29T08:40:42+03:00",
      "finishedAt": "2026-09-29T09:49:51+03:00",
      "commit": "40b524d",
      "tests": {
        "passed": 115,
        "failed": 0
      }
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
      "status": "done",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "startedAt": "2026-09-29T08:53:02+03:00",
      "finishedAt": "2026-09-29T09:49:51+03:00",
      "commit": "bf33d79",
      "tests": {
        "passed": 115,
        "failed": 0
      }
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
      "status": "done",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "startedAt": "2026-09-29T08:40:42+03:00",
      "finishedAt": "2026-09-29T09:49:51+03:00",
      "commit": "7fefcf1",
      "tests": {
        "passed": 115,
        "failed": 0
      }
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
      "status": "done",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "startedAt": "2026-09-29T08:53:02+03:00",
      "finishedAt": "2026-09-29T09:49:51+03:00",
      "commit": "ac99275",
      "tests": {
        "passed": 115,
        "failed": 0
      }
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
      "status": "done",
      "retries": 0,
      "repairs": 1,
      "handoffs": 0,
      "startedAt": "2026-09-29T08:40:42+03:00",
      "repairFindings": [
        "ревью craft (блок.): инварианты cases/guides перебирают пустые наборы — доказать на фикстурах; разделитель « — » в repairSteps"
      ],
      "finishedAt": "2026-09-29T09:50:36+03:00",
      "commit": "8a5e31f",
      "tests": {
        "passed": 116,
        "failed": 0
      }
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
      "status": "done",
      "retries": 0,
      "repairs": 1,
      "handoffs": 0,
      "startedAt": "2026-09-29T09:49:51+03:00",
      "repairFindings": [
        "ревью manifest (блок.): «The brands we service.» — новый текст от первого лица (R91/§13)"
      ],
      "finishedAt": "2026-09-29T10:11:12+03:00",
      "commit": "6a2b041",
      "tests": {
        "passed": 196,
        "failed": 0
      }
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
      "status": "done",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "startedAt": "2026-09-29T09:49:51+03:00",
      "finishedAt": "2026-09-29T10:10:35+03:00",
      "commit": "9343ca6",
      "tests": {
        "passed": 196,
        "failed": 0
      }
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
      "status": "done",
      "retries": 0,
      "repairs": 1,
      "handoffs": 0,
      "startedAt": "2026-09-29T09:50:36+03:00",
      "repairFindings": [
        "ревью manifest: формулировка psi не следует источнику"
      ],
      "finishedAt": "2026-09-29T10:11:54+03:00",
      "commit": "039b82d",
      "tests": {
        "passed": 196,
        "failed": 0
      }
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
      "status": "done",
      "retries": 0,
      "repairs": 0,
      "handoffs": 1,
      "startedAt": "2026-09-29T10:11:54+03:00",
      "finishedAt": "2026-09-29T18:00:18+03:00",
      "commit": "92419a3",
      "tests": {
        "passed": 197,
        "failed": 0
      }
    }
  ],
  "singlePass": null,
  "tests": {
    "passed": 197,
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
    "находка для отчёта: опубликованные города по редакционной шаблонности 0.33–0.44 (> 0.30)",
    "app/sitemap.ts:23 — префикс /appliance-repair-guide/ написан вручную, хотя articlePath — единственный построитель",
    "lib/jsonld.test.ts:36-43 — нет теста graph(node, null) → один узел",
    "lib/jsonld.test.ts:117 — ratingValue сравнивается с aggregate.ratingValue (тот же источник, что код)",
    "lib/jsonld.ts:114,121 — правило «FAQ без status = опубликован» живёт в jsonld, а не в lib/publish",
    "lib/jsonld.ts:89-92 vs 120-122 — черновики двумя способами: faqNode → null, articleNode → throw",
    "волна 3 — Reinvention путей: кроме articlePath, пути строятся по месту (commercialHubPath/COMMERCIAL_HUB/pathOf в 03, hub.path в 04, townPath и /appliance-repair/${slug} в 05/06, casePath и /towns/${slug} в 07, дважды /appliance-repair-guide в 07) — все пути роутов должны идти из lib/routes",
    "волна 3 — дублирование копии: крошка «Home» в data/services, guides, cases, people, reviews + литералы в страницах 03/05; CTA «Ready when you are.»/«$75 diagnostic…» в services, guides, cases — общая копия должна жить один раз (data/site)",
    "03 app/commercial-appliance-repair/[slug]/page.tsx:93-98 — areaServed восстанавливается парсингом href/подписей чипов вместо данных",
    "03 components/commercial/booking-link.ts — разбор URL-пресета лежит в commercial/, корневой BookingProvider зависит от него; bookingPreset → string|null, не ContactAsOption; нет теста на отказ неизвестного ?as=",
    "04 data/services.test.ts:54 — тест пинит текущий status ballantyneNote (против правила 01); Service.areaServed повторяет форму ServedArea",
    "05 data/towns.ts ballantyneLive — текст Charlotte переключается по статусу Ballantyne на загрузке модуля, «ни один факт не теряется» не протестировано, два варианта дублируют абзацы",
    "05 app/towns/[slug]/page.tsx:66-69,99-109,139 — свои townLink/placeName/чипы услуг вместо lib/links",
    "05 Ballantyne: hero/meta говорят «commercial … throughout Ballantyne and South Charlotte», а FAQ «commercial in South Charlotte» — черновик (факт 5); формулировка hero — из истории 55 брифа",
    "06 data/people.ts:46-69 — списки техники выписаны вручную «из-за цикла», которого нет; тест-синхронизатор + обратный поиск в /about; data/reviews reviewsPageCopy(businessName) — второй обход цикла; people.test visibleText считает meta видимым",
    "07 app/repair-cases/[slug]/page.tsx:31,74-82 — свой casePath и ссылка на район через hasPublishedPage + /towns/${slug} вместо lib/routes/lib/links",
    "data/guides.test.ts:12-19, data/cases.test.ts:11-18, app/sitemap.test.ts — помощник withPushed скопирован в три файла (вместе со scenario — в общий тестовый модуль)",
    "09 lib/redirects.ts:55-56 — коммерческое назначение пересобирается `${commercialHubPath}/${slug}` + второй «жив ли» через publishedCommercialPages() рядом с publishedPaths()",
    "09 lib/nav.ts:13,34,46,57 + data/site.ts — GUIDE_HUB литерал, правило «хаб ⇔ ≥1 статья» повторено из lib/routes, href детей/услуг/городов пересобраны, литерал /commercial-appliance-repair в подвале",
    "09 lib/redirects.test.ts:2-3 — шов 4 зависит от приватного next/dist/shared/lib/router/utils/* (сломается при апгрейде Next) — изолировать в один хелпер с версией",
    "09 components/HeaderBar.tsx:7-8 — клиентская часть импортирует data/business (→ data/reviews: все тексты отзывов в клиентском бандле) и data/site — передавать пропсами",
    "09/QA — toggleGroup no-op при ≥861px, а бургер до 1024px: тап по группам на 861–1024 проверить (связано с дефектом шапки для таска 11)",
    "08 data/home.ts:96-102 — whoWeServeCards() повторяет правило commercialCardHref в data/ вместо lib/links",
    "08 data/home.ts:108-115 — areaServed восстанавливается парсингом href чипов (вторая копия парсинга из таска 03)",
    "08 копия главной разрезана между data/b2b-segments (homeHero, familyBusinessSentence) и data/home (heroTrust, home.family); home.family.bookLabel повторяет site.header.bookCta.label",
    "08 data/home.test.ts:53-58 — ожидаемые города areaServed вычисляются тем же парсингом, что и код; withLive — пятая копия scenario",
    "09 lib/nav.ts:48 — `${s.name} Repair` вместо serviceRepairName(s) из таска 04",
    "08 data/home.ts whoWeServeCards() — ссылки на опубликованные отраслевые страницы вне lib/links (санкционированное исключение рядом с publishedAncestors из 05)",
    "черновые блоки внутри страниц видны в dev с плашкой только на /about; районы, коммерческие и услуги фильтруют через isPublished — в dev черновые блоки не видны (spec §1: превью для владельца); записано в ADR 0015",
    "контраст: .stars (лайм на белых карточках) 1.3:1 — чинится только правкой дизайна (цвет звёзд на светлом); решение владельца",
    "--text-dark-45 поднят до 0.60 ради контраста — ступень серого слилась с --text-dark-60",
    "шаблонность: опубликованные ранее города Rock Hill 0.42 / Fort Mill 0.33 / Matthews 0.44 / Indian Trail 0.44 > 0.30 (редакционная) — решение владельца",
    "11 data/towns.ts:404-414 — townsIndexAreaServed() без теста; несовпавшая запись areaServed молча выпадает",
    "11 components/ui/section-head.tsx — флаг ratingBadge true|\"count\" в общем компоненте; подпись должна передавать страница",
    "11 data/site.ts:59 vs data/reviews.ts:112 — функция «N review(s)» в двух модулях",
    "11 data/b2b-segments.ts commercialServices — «Restaurant Appliance Repair» литералом; ручной механизм публикации рядом с lib/publish"
  ],
  "reviewers": {
    "manifestSpec": "a0198322a4ca1a633",
    "craft": "a8a31c0a2128b8bf6"
  },
  "blind": {
    "ranAt": "2026-09-29T18:18:03+03:00",
    "checker": "general-purpose, только бриф + репозиторий; prod :3200, dev :3112, Playwright",
    "commands": "npm test → 197 passed (16 файлов) · tsc 0 · build 39/39 · check:copy 35 стр., 0 ошибок",
    "verdict": "почти все пункты брифа — реализовано, проверено запуском; 3.6 перелинковка — частично (только опубликованное: South Charlotte черновик); 4.4 кейсы — только шаблон (фактов нет); 5.1 — вне периметра",
    "drift": [
      "R95 контраст ≥ 4.5: звёзды ★★★★★ (#c6f24e на белых карточках) 1.3:1 на /, /reviews, 5 городах, 2 коммерческих — стиль старше прогона; в новом брифе п. 7.1",
      "R93 шаблонность: Rock Hill 0.42, Fort Mill 0.33, Matthews 0.44, Indian Trail 0.44 > 0.30, но опубликованы (страницы старше прогона); в новом брифе п. 7.2"
    ],
    "notes": [
      "Article-разметка не видна в работе — опубликованных статей нет (ожидаемо)",
      "полноту списка старых URL ekfix.us сверить с живым сайтом не удалось (Cloudflare 403); список взят из sitemap через WebFetch",
      "/for-business/ со слешем — два перехода (D02)"
    ]
  },
  "branch": "autopilot/entity-commercial-geo",
  "priorRuns": "2026-09-01-nextjs-b2b-migration · 2026-09-02-audit-fixes · 2026-09-02-ux-polish (+ ручные ux-правки 7192550, ae8a8cb) — все сданы, PR #1 и #2 влиты в main",
  "triage": {
    "decidedAt": "2026-09-29T18:01:46+03:00",
    "fixNowMovedToNextRun": {
      "why": "повторяются в 3+ тасках → по правилу «fix now», но следующий бриф (two-branch-site) перестраивает те же места: группы маршрутов, шапки/подвалы веток, главные веток, связи между ветками «из данных». Консолидация сейчас была бы частично выброшена — перенесено первым таском следующего прогона.",
      "items": [
        "пути роутов строятся по месту, а не из lib/routes (#6, #11, #20, #22, #23, #31)",
        "ссылки/areaServed считаются вне lib/links, парсингом href (#13, #17, #27, #28, #32)",
        "тестовый помощник scenario/withPushed/withLive скопирован в 5 файлов (#0, #21, #30)",
        "дублирование общей копии: крошка Home, CTA, «N reviews», копия главной в двух модулях (#12, #29, #39)",
        "черновые блоки не видны в dev на районах/коммерческих/услугах (#33)"
      ]
    },
    "report": [
      "#34 звёзды 1.3:1 — в новом брифе п. 7.1 (aria-hidden + оценка текстом)",
      "#36 4 прежних города > 0.30 — в новом брифе п. 7.2",
      "#18 Ballantyne: коммерческая формулировка без факта 5 — в новом брифе п. 4 (перенос на коммерческую главную)",
      "#35 --text-dark-45 = 0.60 (ступень серого слилась)",
      "#40 knowsAbout хаба ведётся вручную рядом с lib/publish",
      "#24 шов редиректов зависит от приватного API Next",
      "мелкие тестовые/типовые: #1, #3, #4, #7, #8, #9, #10, #14, #15, #16, #19, #37, #38"
    ],
    "drop": [
      "#25 HeaderBar тянул data/business в клиент — исправлено в таске 11",
      "#26 тап по группам 861–1024 — исправлено в таске 11 (брейкпоинт 1025)",
      "#2 полная таблица HTML-сущностей в скрипте — безвредно, вне кода сайта"
    ]
  }
}
