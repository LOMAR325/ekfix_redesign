# Данные для отчёта владельцу — story 85 (R100, R28i, R25)

Состояние на 2026-09-29, ветка `autopilot/entity-commercial-geo`. Факты — по разделу «ФАКТЫ ОТ ВЛАДЕЛЬЦА» брифа (1 дан; 2–8, 12 запрошены; 9, 10, 11, 13 не даны). Нет факта — `status: "draft"`: нет роута, sitemap, меню, ссылок, JSON-LD.

*(Собрано исполнителем 11a-2; сохранено оркестратором — харнесс не дал субагенту записать файл.)*

## 1. Опубликовано (32 пути = sitemap)

| Раздел | Страницы | Источник |
|---|---|---|
| Главная | `/` | прежняя копия + «что и где» в H1, два пути (бизнес — основная кнопка), коммерция первой |
| О владельце | `/about` | опубликованное: Constantin, 10+ лет, EPA Universal, OSHA, Ballantyne, семейный бизнес, фото |
| Отзывы | `/reviews` | 6 отзывов сайта, 4 категории |
| Бренды | `/brands` | как было |
| Бытовой | `/appliance-repair` + 12 | прежние страницы услуг |
| Коммерция | `/commercial-appliance-repair` + 7 дочерних | прежний `/for-business` + опубликованное; шаблонность ≤ 0.11 |
| География | `/towns` + Charlotte, Ballantyne, Rock Hill, Fort Mill, Matthews, Indian Trail | 5 прежних + Ballantyne (сходство 0.04) |

## 2. Черновики — какого факта не хватает

| Единица | Где | Не хватает |
|---|---|---|
| `/towns/south-charlotte` | data/towns.ts | факты 3 (ZIP), 4 (сообщества), 5 (кого обслуживаем) |
| Ballantyne: ZIP, сообщества, FAQ про ZIP и коммерцию в South Charlotte | data/towns.ts | 3, 4, 5 |
| Все 7 коммерческих: «как устроен вызов для бизнеса» | data/commercial.ts callProcessDraft | 7 |
| Все 7 коммерческих: «другое оборудование» | moreEquipmentDraft | 6 |
| 7 FAQ коммерческих (по одному) | draftFaq | 7 (5 шт.), 6 (2 шт.) |
| Название программы обслуживания | business.maintenancePlanName (плейсхолдер) | 7 |
| Сегмент HOA на хабе | data/b2b-segments.ts | 5 |
| /about: бренды с большим опытом | data/people.ts aboutPage.pending | 9 |
| /about: обучение, история компании | там же | 8 |
| OSHA в разметке без курса; тип EPA 608 | owner.credentials | 8 |
| 11 статей + хаб `/appliance-repair-guide` (нет пункта «Guides» в меню) | data/guides.ts, reviewedByOwner: false | техническая вычитка владельцем |
| Кейсы `/repair-cases/*` | data/cases.ts = [] | 10 |
| Категория /reviews «South Charlotte & Ballantyne» | Review.area пусто | 11 |
| sameAs — только 3 соцсети | business.social | 12 |
| Название «EK Global»; legalName/alternateName не выводятся | data/business.ts | 2 |
| Новые фото, переименование `kostia*` (R88, вне периметра) | public/images | 13; лучше до выката |

## 3. Вопросы владельцу

1. Публичное название — как в GBP; юрназвание (факт 2).
2. ZIP South Charlotte/Ballantyne из 28277, 28226, 28210, 28270, 28134, 28105 (3).
3. Районы вызовов: Ballantyne Village, Waverly, Rea Farms, Blakeney, Piper Glen, Ardrey Kell, Providence (4).
4. Типы коммерческих клиентов, есть ли в South Charlotte/Ballantyne; обслуживаются ли HOA (5).
5. Коммерческое оборудование и бренды сверх указанных (6).
6. Диагностика для бизнеса, вызовы вне 8:00–20:00, счёт/ACH, COI и W-9, договоры и название программы (сейчас «EK Maintenance Plan») (7).
7. Стаж, тип EPA 608, курс OSHA, обучение у производителей, год основания (8).
8. Бренды с особенно большим опытом (9).
9. 3–5 реальных случаев ремонта: модель, симптом, диагностика, замена, результат, район (10).
10. Все ли 6 отзывов реальные, где опубликованы (Google?), районы; подтвердить «5.0 on Google» в hero и «Google reviews» на страницах городов (11).
11. Ссылки GBP, Yelp, BBB, Nextdoor (12).
12. Оригинальные фото; можно ли переименовать файлы `kostia*` (13, R88).
13. Вычитать 11 статей: публикация = status + reviewedByOwner: true.
14. Rock Hill 0.42, Matthews 0.44, Indian Trail 0.44, Fort Mill 0.33 > 0.30: переписать своими фактами или в черновик?
15. Звёзды ★★★★★ 1.3:1 на белых карточках: оставить, затемнить или aria-hidden?

## 4. Шаги вне кода

1. Хостинг с Node.js, не GitHub Pages: без `output: export` (ADR 0003) — `/api/book` и `redirects()` требуют сервер. По умолчанию Vercel; или любой `npm run build && npm start` (Node 25).
2. Env на хостинге: `RESEND_API_KEY` + `BOOK_NOTIFY_EMAIL` (письма), `BOOK_WEBHOOK_URL`; после домена в Resend заменить `from` `onboarding@resend.dev`.
3. DNS ekfix.us → хостинг (Vercel: A 76.76.21.21 для apex, CNAME cname.vercel-dns.com для www); основной — без www (siteUrl `https://ekfix.us`), второй → редирект; HTTPS.
4. После выката: `curl -sI https://ekfix.us/towns/rock_hill` → 308 на `/towns/rock-hill`; так же `*.html`, `/for-business` (51 адрес — qa/redirects-report.md).
5. Search Console: подтвердить домен, отправить `/sitemap.xml` (32 URL). Выгрузить старые адреса вне старого sitemap: «Индексирование → Страницы» (в т.ч. «Не найдено 404») и «Ссылки → самые популярные страницы». Каждый путь с 404 на новом сайте добавить строкой в `OLD_EKFIX_PATHS` (`lib/redirects.ts`). Назначение вычисляется само; если совпадения нет — в `OLD_COMMERCIAL`, иначе сборка падает с именем пути. Повторять 2–4 недели.
6. GBP: название как на сайте («EK Global», пока нет факта 2); сайт https://ekfix.us; категории (Appliance repair service + коммерческая); зона — 20 мест `business.areaServed`; часы и телефон как в подвале; ссылка на `/commercial-appliance-repair`.
7. Отзывы: просить отзыв в GBP после каждого ремонта (коммерция, Ballantyne/South Charlotte — с районом). На сайт — только реальные, дословно, в data/reviews.ts.
8. Каталоги: Yelp, BBB, Nextdoor, Angi, Thumbtack, Apple Business Connect, Bing Places — одинаковые NAP (EK Global, (980) 371-4319, Charlotte, NC) + ekfix.us. Ссылки → sameAs (факт 12).

## 5. Шаблонность (Jaccard, 3-word shingles; решение по редакционной ≤ 0.30; против dev)

| Страница | Статус | Полная max | Ред. max | Вердикт |
|---|---|---|---|---|
| Charlotte | опубл. | 0.28 | 0.24 | ок |
| South Charlotte | черновик | 0.12 | 0.04 | ок; черновик из-за фактов 3–5 |
| Ballantyne | опубл. в прогоне | 0.07 | 0.04 | ок |
| Rock Hill | опубл. до прогона | 0.45 | 0.42 | выше порога |
| Fort Mill | опубл. до прогона | 0.38 | 0.33 | выше порога |
| Matthews | опубл. до прогона | 0.47 | 0.44 | выше порога |
| Indian Trail | опубл. до прогона | 0.47 | 0.44 | выше порога |

Коммерческие (7): полная max 0.10–0.15, редакционная 0.07–0.11 (dishwasher↔restaurant 0.11/0.15). Все ≤ 0.30, все опубликованы. Матрицы — qa/similarity-report.md.

## 6. Итоги QA

| Отчёт | Итог |
|---|---|
| pages-report.md | 64 прогона: скролл 0, консоль 0, картинки не загрузились 0, ≥400 0. H1 главной — 3 строки @1440 / 2 @390. Кнопки: «For Business →» (btn-accent, основная), «For Homes». Контраст: 60 — все .stars. Прежние 39 картинок — артефакт скрипта (исправлен) |
| jsonld-report.md | 32 стр.: один @graph, все @id разрешаются, один #business, Person = Constantin, 0 расхождений (было 19) |
| copy-report.md | check:copy 0 ошибок; 46 «most» — кванторы/идиомы; best/leading 0 |
| similarity-report.md | §5 |
| drafts-report.md | 13 черновых URL → 404 prod, нет в sitemap/ссылках/JSON-LD; 29 блоков — 0 утечек |
| redirects-report.md | 51 адрес: 37 → 308 (на живую страницу, один прыжок), 14 отвечают 200 на своём пути; дефектов 0 |
| 11-header-output.txt | ≥1025 одна строка 81px, ховер-выпадашки; ≤1024 бургер 69px |
| Сборка | test 197 · tsc 0 · build зелёный |

Исправлено в JSON-LD. /towns: 15 мест названы как на странице, штат — containedInPlace. Хаб: knowsAbout только из видимых формулировок. / и /reviews: бейдж «5.0 ★★★★★ 6 reviews».

## 7. Оставшиеся находки

1. `.stars` — 1.3:1 (#c6f24e на белом, 13px): /, /reviews, города, 2 коммерческие. Дизайн 1:1 — решает владелец (в. 15).
2. 4 прежних города > 0.30 (общие отзывы + абзац $75/same-day). ADR 0008, spec D01 — решает владелец (в. 14).
3. `--text-dark-45` / `--text-light-45` = 0.6 / 0.5 (ADR 0002): имя не совпадает со значением, `-dark-45` == `-dark-60`. Переименование — рефактор, не делался.
4. Бейдж главной: «6 reviews» вместо «Google reviews»; «5.0 on Google» осталось в hero. При подтверждении факта 11 можно вернуть «6 Google reviews».
5. `maintenancePlanName` — плейсхолдер до факта 7. `knowsAbout` хаба называет restaurant/laundry: если страница уйдёт в черновик — убрать строку.
