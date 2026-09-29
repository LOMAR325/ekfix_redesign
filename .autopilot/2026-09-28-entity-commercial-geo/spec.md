# Спецификация: единая сущность, коммерческий раздел, география, экспертиза

## Задача

Поисковик или ИИ-ассистент, открывая сайт EK Global, сейчас видит слоган «We fix it. You
enjoy it.», одну страницу «для бизнеса» и пять городов. Из этого нельзя уверенно сказать,
что это за бизнес, где он работает, что он чинит и кто за ним стоит. Коммерческие клиенты
приносят основную прибыль, но у них нет своих страниц, а владелец назван на сайте
«Konstantin», хотя в отзывах и в TikTok он Constantin. Старый сайт на ekfix.us живёт по
другим адресам, и после замены его ссылки ведут в никуда.

Владелец ещё не прислал большую часть фактов (ZIP-коды, районы, коммерческое
оборудование, условия для бизнеса, опыт, профили). Поэтому строить нужно так, чтобы
страницу можно было собрать заранее, а включить потом, поменяв одно поле в данных, и
чтобы ни одна недоделанная страница не попала к посетителю или поисковику.

## Решение

- **У любой единицы контента есть статус draft или published.** Черновик не имеет URL в
  продакшене, не попадает в sitemap, меню, перелинковку и JSON-LD. Чтобы опубликовать
  страницу, достаточно поменять одно поле в `data/`. При локальном `npm run dev`
  черновики видны по своим адресам с плашкой «DRAFT», чтобы владелец мог их проверить.
- **Одна сущность в разметке.** Бизнес, сайт, владелец, услуги и статьи связаны стабильными
  `@id` от `https://ekfix.us`, и в разметке только то, что видно на странице. Владелец
  везде Constantin, фамилия не публикуется.
- **Боевой домен и редиректы.** `ekfix.us` подтверждён как боевой домен. Каждый из 43
  адресов старого ekfix.us, старые `*.html` и `/for-business` постоянным редиректом ведут
  на ближайшую живую страницу, без цепочек.
- **Два пути с первого экрана.** H1 главной называет, что и где. Первые две кнопки: «For
  Business» (основная) и «For Homes», рядом телефон. На главной коммерция идёт раньше
  бытовой техники.
- **Коммерческий раздел** `/commercial-appliance-repair`: хаб из прежнего `/for-business`
  и 7 дочерних страниц. Страница публикуется, если собрана из уже опубликованных фактов и
  проходит тест на шаблонность. Иначе она остаётся черновиком.
- **Бытовой хаб** `/appliance-repair` со всеми 12 услугами. H1 страниц услуг теперь
  с географией.
- **Районы.** Появляются `/towns/south-charlotte` и `/towns/ballantyne`; публикуются те,
  что проходят тест. Charlotte отвечает за город целиком, у Ballantyne своя конкретика.
- **`/about`** — живая страница о владельце-технике, расширенная опубликованным. Новые
  блоки (бренды, обучение, история компании) — черновики.
- **Центр знаний, кейсы и отзывы.** Центр знаний `/appliance-repair-guide` готов;
  6 приоритетных статей (и ещё 5 — если хватит времени) — черновики с источниками. Шаблон кейсов `/repair-cases/[slug]` пуст, пока
  нет фактов. `/reviews` — отзывы по категориям, пункт меню Reviews ведёт туда.
- **Проверки.** Отдельные скрипты проверяют запретные слова и кириллицу, попарную
  шаблонность, контраст, горизонтальный скролл, ошибки консоли, картинки на 1440/390 и
  JSON-LD.

## Пользовательские истории

Метки: `R##` — из брифа, `R##.n` — проработка, `A##` — добавлено сверх брифа
(с родителем).

### Черновики (R06–R10)

| # | Метка | История | Приёмка |
|---|-------|---------|---------|
| 1 | R06 | Как владелец, я держу у каждой страницы, статьи, кейса и блока статус `draft`/`published` | тип `PublishStatus` в `data/types.ts`; поле `status` у страниц районов, коммерческих страниц, статей, кейсов, сегментов, блоков `/about`, FAQ-пунктов и локальных блоков |
| 2 | R07 | …и черновик не открывается в продакшене | `npm run build && npm start`: каждый URL черновика → 404; в `generateStaticParams` черновиков нет, `dynamicParams=false`, в компоненте повторный guard `notFound()` |
| 3 | R08 | …и не попадает в sitemap, меню, перелинковку и JSON-LD | тесты: sitemap, `mainNav`, `lib/links` и `lib/jsonld` не содержат ни одного черновика; сборка: grep по `.next` HTML не находит slug черновика вне его собственной (несуществующей) страницы |
| 4 | R09 | …и публикую одной правкой | смена `status: "draft"` → `"published"` в одном объекте `data/` добавляет роут, пункт sitemap, пункт меню (где предусмотрен), ссылки и JSON-LD — без правок в `app/`/`components/`/`lib/` |
| 5 | R10 | …и механизм один | `placeholder?: boolean` у `ForBusinessSegment` удалён, сегмент HOA получил `status: "draft"`; `publicForBusinessSegments` = `published(forBusinessSegments)`; `grep -rn "placeholder" data lib` не находит флагов публикации |
| 6 | R10.1 | Флаг `isFullPage` у городов — тоже флаг публикации страницы; по «второй не заводи» и «у любой единицы контента (страница района…) есть статус» он сливается с тем же механизмом | у `Town` нет `isFullPage`; наличие страницы = `page` c `status: "published"` (см. Решения §3); 5 городов сохраняют страницы, 21 — без страницы |
| 7 | A01 → R81 | Как владелец, я вычитываю черновики до публикации | `next dev`: черновик открывается по своему URL, сверху видна плашка «DRAFT — not published» (инлайн-стиль, без нового класса); в `next build` плашки и черновика нет |
| 8 | R08.1, R93 | Хаб, у которого нет ни одной опубликованной дочерней единицы, сам не публикуется (пустой хаб — тонкая страница, против «Никаких шаблонных страниц») | `/appliance-repair-guide` без опубликованных статей → 404 в продакшене и отсутствует в sitemap/меню (пункт «Guides» скрыт); `/repair-cases/*` без кейсов — ни одного роута |

### Волна 1 — сущность и домен (R11–R28i)

| # | Метка | История | Приёмка |
|---|-------|---------|---------|
| 9 | R11 | Как посетитель и поисковик, я везде вижу владельца как Constantin | ни одного «Konstantin» в `app/ components/ data/ lib/` вне цитат отзывов; имя берётся из одного места (`data/people.ts` `owner.name`) — тексты, alt, JSON-LD, `<title>`/description |
| 10 | R12 | …а цитаты отзывов не тронуты | `data/reviews.ts` поле `text` — байт-в-байт как было |
| 11 | R13 | …и фамилии нигде нет | в `owner` нет поля фамилии; `Person.name` = «Constantin» |
| 12 | R11.1 | Имена файлов фото с «konstantin»/«kostia» не меняются в этом прогоне | переименование фото — R88, отложено (Вне рамок); alt у этих фото уже с «Constantin» |
| 13 | R14 | Как бизнес, я называюсь одним значением | `business.name` = «EK Global» (опубликованное; факт 2 не дан) — единственный источник имени в текстах и разметке |
| 14 | R15 | …и в разметке нет непроверенных `legalName`/`alternateName` | поле `legalName` удалено из `Business` (сейчас это копия `name`, не факт); `alternateName` не выводится; вопрос о юрназвании — в отчёт |
| 15 | R27i | Как поисковик, я знаю боевой домен | `business.siteUrl = "https://ekfix.us"` без `TODO`; ADR 0005 пересмотрен новым ADR |
| 16 | R16–R18 | Как ИИ-ассистент, я вижу один граф: бизнес ← сайт | `@id`: `https://ekfix.us/#business`, `…/#website`; каждая страница отдаёт один `<script type="application/ld+json">` с `@graph`; `WebSite.publisher` → `{ "@id": …#business }` |
| 17 | R17 | …с полями бизнеса, видимыми на странице | узел `HomeAndConstructionBusiness` (один `@id` на весь сайт): `name`, `url`, `logo` (`/icon.svg`), `image`, `telephone`, `address` (город — виден в подвале), `openingHoursSpecification`, `sameAs` = 3 соцсети из `business.social` (видны в подвале каждой страницы); `areaServed` — на каждой странице, где виден список мест, и ровно этот список: главная (блок «Where we work», история 43a), `/towns` (все 20 из `business.areaServed`), страницы городов и районов (своя зона); `aggregateRating` — только на страницах, где показаны отзывы (`/`, `/reviews`), по отзывам из `data/reviews.ts`: по правилу пользователя «уже опубликованный на сайте контент — тоже факт» отзывы, опубликованные на сайте, считаются реальными (так же ADR 0007 и прежнее решение «AggregateRating не трогать»); подтверждение подлинности и источников (факт 11) — вопрос в отчёт; `knowsAbout` — только на коммерческом хабе; `priceRange` убран (нигде не виден — R23); `image`/`address` — уже были в узле и видны на странице |
| 18 | R19 | …и владелец — Person | узел `Person` с `@id` `https://ekfix.us/about#owner` — полностью только на `/about`: `name`, `jobTitle: "Owner & Lead Technician"`, `worksFor` → бизнес, `image`, `knowsAbout` (категории техники, видимые на `/about`), `hasCredential` — ровно два: EPA Section 608 Universal, OSHA (без названия курса) |
| 19 | R20 | Как поисковик, на каждой странице услуги я вижу Service | `/appliance-repair/[slug]` и каждая опубликованная коммерческая дочерняя: `Service` с `@id` `<url>#service`, `provider` → `{ "@id": …#business }`, `areaServed` — то, что написано в H1 страницы |
| 20 | R21 | …на статье — Article | билдер `articleJsonLd` с `author` → `{ "@id": …/about#owner }`; публикуется только со статьёй; опубликованная статья без `reviewedByOwner: true` — ошибка теста (R83) |
| 21 | R22 | FAQPage и BreadcrumbList — как сейчас | те же билдеры, получают `@id` (`#faq`, `#breadcrumb`) и живут в том же `@graph` |
| 22 | R23 | Разметка — только о видимом | тест: каждый `@id`-референс указывает на узел бизнеса/сайта/владельца; `areaServed`/`aggregateRating`/`knowsAbout` — только на страницах из истории 17; FAQ-узел только там, где показан FAQ |
| 23 | R24 | Как посетитель со старой ссылки ekfix.us, я попадаю на ближайшую живую страницу | 43 URL из `old-ekfix-urls.txt` → таблица в `lib/redirects.ts`: совпадающие пути (`/`, 10 услуг, 5 городов с дефисами, `/brands`) не редиректятся; `garbage_disposal`→`garbage-disposal`, `ice_maker`→`ice-maker`; `rock_hill`/`fort_mill`/`indian_trail` → дефисные страницы; остальные 21 город → `/towns`; `property_management`→ PM-страница (или хаб `#property-management`, если черновик), `property_management_cafe` → restaurant-страница (или хаб `#horeca`), `laundry_equipment_repair` → laundry-страница (или хаб `#laundry`). Ни один не ведёт на `/`, кроме самого `/` |
| 24 | R24.1 | …даже при другом регистре и слеше в конце | `towns/Lesslie` (заглавная L) обрабатывается; путь со слешем в конце тоже редиректится (проверка `curl -I`) |
| 25 | R25 | Адреса старого сайта вне sitemap | в отчёте: где владельцу выгрузить остальные (Search Console → «Страницы» / «Ссылки»), и формат добавления строки в таблицу `lib/redirects.ts` |
| 26 | R26 | Как проверяющий, я получаю пустой отчёт по запретным словам | `npm run check:copy` (после build) по видимому тексту всех опубликованных HTML: 0 вхождений «Globall», «#1», «top-rated», «best in», кириллицы; `\bbest\b` и «most … outfits»-подобные сравнения — ручной разбор каждого вхождения |
| 27 | R28i | Выкат на ekfix.us | не выполняется агентом (действие вовне); в отчёт — шаги владельца |

### Волна 2 — два пути и коммерческий раздел (R29–R57)

| # | Метка | История | Приёмка |
|---|-------|---------|---------|
| 28 | R29, R33 | Как бизнес-клиент, я попадаю на хаб `/commercial-appliance-repair` с прежним содержимым | весь текущий контент `/for-business` (hero, 3 сегмента, laundry, процесс, why-call-us, форматы, FAQ, CTA) рендерится на новом пути; якоря `#property-management`, `#horeca`, `#hotels`, `#laundry`, `#faq-business`, `#process`, `#formats` сохранены |
| 29 | R30 | Старые пути ведут туда же | `/for-business` → 308 → `/commercial-appliance-repair`; `/for-business.html` → 308 → `/commercial-appliance-repair` напрямую (без цепочки) |
| 30 | R31 | Все ссылки, sitemap, меню обновлены | `grep -rn "/for-business" app components data lib` — только в `lib/redirects.ts`; sitemap содержит новый путь |
| 31 | R32 | Переименование записано | новый ADR (см. Решения §12) |
| 32 | R34, R35 | Как ресторан/управляющая компания, я нахожу страницу именно под своё оборудование или отрасль | 7 записей в `data/commercial.ts`, роут `/commercial-appliance-repair/[slug]`; у каждой свой H1, лид, набор оборудования, неисправности, FAQ — без общего абзаца с подставленным названием |
| 33 | R36 | …и вижу только реальное оборудование и бренды | типы оборудования — из опубликованного текста хаба (`forBusinessSegments`, `laundryObjectTypes`, `commercialCategories`); бренды — только записи `data/brands.ts` (`tier: "commercial"`) и `laundryObjectTypes.brandChips`, по ссылке на имя, не копией строки; блок «ещё оборудование» под факт 6 — черновой |
| 34 | R37 | …и понимаю цену поломки для бизнеса | 3–5 типичных неисправностей на страницу, у каждой — что ломается и чем это оборачивается для бизнеса (простой смены, порча продуктов, жалобы жильцов, санитарные требования) — технически, без выдуманных цифр и статистики |
| 35 | R38 | …и как устроен вызов | ссылка/краткая версия опубликованных `processSteps` и `serviceFormats`; блок про стоимость диагностики для бизнеса и вызовы вне 8:00–20:00 — черновой (факт 7) |
| 36 | R39 | …и нахожу ответы на свои вопросы | 3–6 FAQ в формулировках реальных вопросов, ответы только из опубликованного (COI/W-9, ACH, lockbox, same-day priority, фото-отчёт, EPA Universal для хладагента); вопрос без подтверждённого ответа → FAQ-пункт `draft` |
| 37 | R40 | …и вижу отзыв бизнеса, если он есть | Tony Z. (ресторан, посудомойка) — на commercial-dishwasher и restaurant; на остальных блока нет |
| 38 | R41 | …и перехожу на районы и статьи | `lib/links`: опубликованные районы + опубликованные статьи категории `commercial`/по оборудованию; пусто → блок не рендерится |
| 39 | R42, R35.1 | Страница публикуется, только если это честная и уникальная страница | для каждой из 7: `status: "published"` только если (а) собрана из опубликованных фактов и (б) `npm run check:similarity` даёт максимум попарного сходства с другими коммерческими страницами ≤ 0.30 (Решения §10); иначе `draft`; итоговая матрица — в отчёт |
| 40 | R43 | Отели — раздел хаба | отдельной hotel-страницы нет; `#hotels` на хабе |
| 41 | R44 | Как домовладелец, я вижу все 12 бытовых услуг на `/appliance-repair` | новая страница: `PageHero` + `RepairGrid` из 12 `RepairCard` (ссылки на `/appliance-repair/[slug]`), тот же дизайн, копия в `data/services.ts`; в sitemap; breadcrumb Home › Home Appliance Repair |
| 42 | R45 | Как посетитель главной, я сразу выбираю путь (кнопка «Book Online — Save 10%» из hero уходит: бриф называет две главные кнопки и телефон; форма остаётся в #book и в бытовых CTA) | в hero первые две кнопки: «For Business» (`btn-accent`) → `/commercial-appliance-repair`, «For Homes» (`btn-ghost-dark`) → `/appliance-repair`; телефон виден в hero (текстовая ссылка `tel:` в существующем стиле) |
| 43 | R46 | …и ниже вижу коммерцию раньше бытовой сетки | порядок: hero → #who-we-serve (сегменты) → новая секция коммерческого оборудования (карточки `RepairCard` → опубликованные дочерние, иначе якоря хаба) → trust-b2b → #repair (12 бытовых) → … ; соседние секции разного оттенка |
| 43a | R70, R17 | Как посетитель главной, я вижу, где работает бизнес, и перехожу в районы | в секции #family (семейный бизнес, живёт в Ballantyne) — блок «Where we work»: `ChipRow` из `areaLinksForHome()` — опубликованные South Charlotte/Ballantyne первыми, затем Charlotte и 4 города со страницей, затем «All service towns →»; этот же список — `areaServed` узла бизнеса на главной |
| 44 | R47 | …коммерческие бренды раньше бытовых | `homeBrands` уже отсортирован commercial → premium → mass — сохранить |
| 45 | R48 | …и первым отзыв бизнес-клиента | отзывы на главной отсортированы: `segment: "commercial"` первыми (из данных, не ручным порядком) |
| 46 | R49, R50, R51 | H1 и лид называют что и где | H1 в двухстрочном стиле с акцентной второй строкой, пример брифа — «Commercial & home appliance repair<br><span>in Charlotte.</span>»; лид: сначала бизнес (управляющие, рестораны, отели), потом дома; названы Charlotte, South Charlotte, Ballantyne; **28277 не упоминается** (факт 3 не дан); слоган «We fix it. You enjoy it.» остаётся второстепенно (надзаголовок `.eyebrow` или ниже) |
| 47 | R52 | H1 укладывается | Playwright: высота H1 / line-height ≤ 3 строк на 1440×900 и ≤ 4 строк на 390×844; не влезает → сокращать текст, CSS не трогать |
| 48 | R53 | Как посетитель, я вижу меню в порядке приоритета | `mainNav`: Commercial ⌄ (хаб + опубликованные дочерние) · Home Appliances ⌄ (хаб + 12 услуг) · Service Area ⌄ (города + опубликованные районы + All Service Towns) · Guides (если есть опубликованная статья) · About · Reviews; существующий компонент дропдауна; на ≤1024px — то же в бургере, шапка в одну строку |
| 49 | R54 | Пункт бытового ремонта назван и обоснован | «Home Appliances» — обоснование в Решения §8 и в ADR |
| 50 | R55 | «Guides» появляется сам | пункт выводится из `published(articles).length > 0`; сейчас скрыт |
| 51 | R56 | Как бизнес-клиент, я жму коммерческую CTA и попадаю в форму с уже выбранным «I'm contacting you as a…» | `BookingProvider` получает `contactAs`/`setContactAs` (по аналогии с `setAppliance`); коммерческие CTA ведут на `/?as=<опция>#book` (и на дочерних оборудования — `&appliance=<formLabel>`); провайдер на клиенте читает параметры, валидирует по `contactAsOptions`/`applianceFormOptions`, неизвестные игнорирует; на главной — `setContactAs` без перехода |
| 52 | R56.1, R56.2 | …и выбор разумный | PM-страница → «Property Manager»; restaurant → «Restaurant or Café»; хаб `#hotels` → «Hotel or Hospitality»; хаб в целом и оборудование без отрасли → «Other Business»; пользователь может сменить выбор; валидация формы не меняется |
| 53 | R57 | Подпись коммерческой CTA | «Request Service or a Quote» (не «Save 10%»); «Book Online — Save 10%» остаётся только в бытовых CTA |

### Волна 3 — география (R58–R71)

| # | Метка | История | Приёмка |
|---|-------|---------|---------|
| 54 | R58 | `/towns/south-charlotte` собрана | запись в `data/towns.ts` (`kind: "area"`, `parent: "charlotte"`): блок «что входит в район» (`coverage` — из опубликованного только «Ballantyne входит в South Charlotte»; остальное — факты 3–4, блок `draft`), ZIP (факт 3), сообщества (факт 4), кого обслуживаем — сначала бизнес, затем дома (факт 5) — черновые; отзывы района — `reviews.filter(r => r.area === slug)` (факт 11; сейчас пусто — блока нет); услуги и ссылки на Ballantyne/Charlotte — из данных; статус страницы — по тесту (Решения §10); без фактов 3–5 ожидаемо `draft` |
| 55 | R59, R60, R61 | `/towns/ballantyne` открывается по смыслу брифа | первый абзац: «EK Global provides commercial and in-home appliance repair throughout Ballantyne and South Charlotte…» + перечень техники из `data/services` (без «28277» до факта 3); владелец живёт и работает здесь (опубликовано); наблюдение про встраиваемые Sub-Zero/Thermador/Bosch/KitchenAid в новой застройке — перенесено сюда как ballantyne-специфика |
| 56 | R62 | Сообщества и ZIP | блок черновой (факты 3, 4), не выводится |
| 57 | R63 | «Appliances we repair in Ballantyne» | короткие разделы только по видам техники, где есть своя опубликованная конкретика (напр. встраиваемые холодильники Sub-Zero/Thermador, panel-ready посудомойки Bosch); каждый со своим текстом; без конкретики — раздела нет |
| 58 | R64, R93 | Ballantyne публикуется только если не шаблон | `check:similarity`: попарное сходство Ballantyne ↔ Charlotte, ↔ South Charlotte, ↔ 4 другим городам ≤ 0.30 → `published`, иначе `draft`; число — в отчёт |
| 59 | R65 | FAQ Ballantyne — 8 вопросов в формулировках брифа | ответы из опубликованного: кто чинит (EK Global, владелец живёт в Ballantyne), same-day, $75 диагностика, списывается с ремонта, бренды (`data/brands.ts`), Sub-Zero/Thermador/Bosch — да (записи брендов), Miele — только как указан в `brandNote`; вопросы про 28277 и коммерцию в South Charlotte — FAQ-пункты `draft` (факты 3, 5); FAQPage — только опубликованные пункты |
| 60 | R66 | Зоны не конкурируют | Charlotte — город целиком (старый/новый фонд, районы города, $75), Ballantyne-специфика уходит на Ballantyne со ссылкой; ни один опубликованный факт не теряется: если Ballantyne остаётся черновиком — Charlotte сохраняет наблюдение; мета/`<title>` трёх страниц различаются по зоне |
| 61 | R67 | Крошки отражают иерархию | Ballantyne: Home › Service Area › Charlotte, NC › South Charlotte › Ballantyne (черновой уровень пропускается); South Charlotte: Home › Service Area › Charlotte, NC › South Charlotte; строится из `parent` в данных |
| 62 | R68 | Как домовладелец, я вижу на странице услуги что и где | H1 12 страниц в стиле «Refrigerator repair<br><span>in Charlotte & South Charlotte.</span>»; `<title>` и description называют услугу + Charlotte/South Charlotte; копия в `data/services.ts` |
| 63 | R69 | Локальный блок про Ballantyne — только с конкретикой | блок есть только у услуг с опубликованной местной конкретикой (ожидаемо refrigerator и dishwasher — встраиваемые/panel-ready), тексты разные; у остальных — `ChipRow` ссылок на опубликованные South Charlotte/Ballantyne |
| 64 | R70 | Перелинковка — системой | `lib/links.ts`: home → South Charlotte (или ближайший опубликованный район) → Ballantyne → услуги; каждая услуга → Ballantyne, South Charlotte; коммерческие → районы и статьи; статьи и кейсы → своя услуга; всё через `ChipRow`, только опубликованное |
| 65 | R71 | Ни ZIP-страниц, ни новых городов | новых `Town` с `kind: "city"` нет; `kind: "area"` — ровно 2 |

### Волна 4 — экспертиза и доказательства (R72–R87)

| # | Метка | История | Приёмка |
|---|-------|---------|---------|
| 66 | R72 | Как клиент, я на `/about` понимаю, кто придёт чинить | живая страница: Constantin, Owner & Lead Technician; 10+ лет; EPA Universal и OSHA; живёт в Ballantyne; семейный бизнес; бытовой и коммерческий опыт; категории техники (из `data/services` + коммерческих); подход (три пункта); существующие фото (`konstantin_thermador`, `kostia_reast`, `kostia-laundry`, `hero-technician`) с alt на Constantin; копия — в `data/people.ts` |
| 67 | R73 | …а неподтверждённое не показано | блоки «Brands he knows best» (факт 9), «Training» (факт 8), «Company history» (факт 8) — `status: "draft"`, не рендерятся в продакшене |
| 68 | R74 | Person в разметке | см. историю 18 |
| 69 | R75, R76, R77 | Центр знаний готов принимать статьи | `data/guides.ts`: 7 категорий (Refrigerator, Dishwasher, Washer, Dryer, Oven & Range, Ice Maker, Commercial); шаблон статьи с полями брифа; хаб `/appliance-repair-guide` группирует опубликованные статьи по категориям (пустая категория не выводится); статья `/appliance-repair-guide/[slug]`; формат хранения — `data/guides.ts` (ADR) |
| 70 | R78 | 6 приоритетных черновиков | «Refrigerator not cooling but freezer works», «Samsung refrigerator ice maker problems», «Bosch dishwasher E15 error», «Dryer runs but doesn't heat», «Oven won't heat», «Range burner won't ignite» — все `status: "draft"` |
| 70a | R79 | Дополнительные — если хватит времени | «KitchenAid ice maker not making ice», «Thermador dishwasher E15», «Miele dishwasher error codes», «LG washer OE error», «Samsung washer error codes» — самый низкий приоритет прогона: пишутся последним таском после всего остального; не написанные — строка в отчёте |
| 70b | R76.1 | Страница статьи собрана из существующих компонентов | `/appliance-repair-guide/[slug]`: `PageHero` (крошки Home › Appliance Repair Guide › категория-текст › статья; H1 = `title`; лид = `metaDescription`) → строка метаданных (модель, если есть; автор/техник и даты публикации/обновления — только у опубликованной, проверенной статьи; в dev-превью — «Pending technical review») → «Symptoms» (`ChipRow`/`Prose`) → «Diagnosis» (`Prose`) → «Possible causes» (`ProblemCardGrid`) → «Repair steps» (`ProblemCardGrid`, нумерация) → «When to call a technician» (`Prose` + ссылка на услугу EK Global) → `CtaBand`; `sources` не рендерится |
| 71 | R80 | Статьи — технические | структура: симптомы → диагностика → возможные причины → порядок ремонта → когда нужен мастер → ссылка на услугу; без рекламных оборотов и превосходных степеней |
| 72 | R81 | Публикация — только после проверки владельцем | поле `reviewedByOwner: false`; тест: `status === "published"` ⇒ `reviewedByOwner === true` |
| 73 | R82 | Каждое утверждение с источником | поле `sources: { claim: string; url: string; title: string }[]` (не рендерится); каждое утверждение о коде ошибки или процедуре в статье ссылается на запись `sources`; тест: у статьи ≥1 источник на каждый код ошибки из заголовка/текста |
| 74 | R83 | Владелец не автор непроверенного | `author` у статьи — отсутствует, пока `reviewedByOwner` не `true`; при публикации автор/техник — `owner` |
| 75 | R84 | Кейсы — шаблон | тип `RepairCase` (техника, модель, симптом, диагностика, вышедший компонент, ремонт, запчасти, результат, район, техник, `status`) — **без полей имени и адреса клиента**; `area` — только slug района/города из `data/towns`; тест инвариантов: ни у одного кейса нет полей вне типа и `area` ∈ известных slug; `data/cases.ts` = `[]`; роут `/repair-cases/[slug]`; без опубликованных кейсов — ни одного роута, в меню/sitemap нет |
| 76 | R85 | Как клиент, я читаю отзывы по своей теме на `/reviews` | категории и правило попадания (из данных, `reviewCategories()`): Refrigerators & Freezers — `appliance` ∈ {Refrigerator, Freezer}; Dishwashers — `appliance === "Dishwasher"`; Washers & Dryers — `appliance` ∈ {Washer, Dryer}; Commercial — `segment === "commercial"`; South Charlotte & Ballantyne — `area` ∈ {south-charlotte, ballantyne}; отзыв может быть в нескольких; пустая категория не выводится (сейчас последняя пуста); страница — `PageHero` + по секции `SectionHead` + `ReviewsGrid` на категорию |
| 77 | R86 | Поля района и сегмента | `Review.segment?: "commercial"`, `Review.area?: string` (slug района); заполнено только известное: Tony Z. → `segment: "commercial"` («Restaurant»); `area` — ни у кого (факт 11) |
| 78 | R87 | «Reviews» в меню ведёт на `/reviews` | `mainNav` → `/reviews`; страница в sitemap |

### Проверки и отчёт (R89–R100)

| # | Метка | История | Приёмка |
|---|-------|---------|---------|
| 79 | R89, R98 | Навигационные слои покрывают опубликованное и только его | единый источник живых путей `lib/routes.ts` → sitemap, тест редиректов, QA-скрипт; тест: sitemap = `publishedPaths()`, в нём нет ни одного slug-черновика; robots без изменений |
| 80 | R94 | Сборка зелёная | `npm run build`, `npx tsc --noEmit`, `npm test` — без ошибок |
| 81 | R95 | Каждая опубликованная страница проходит QA | Playwright-скрипт по `publishedPaths()` на 1440×900 и 390×844: контраст текста ≥ 4.5:1, `scrollWidth ≤ innerWidth`, 0 ошибок консоли, все `<img>` загружены (`naturalWidth > 0`) |
| 82 | R96, R23 | JSON-LD валиден и не говорит больше, чем страница | скрипт по всем опубликованным HTML: JSON парсится, один `@graph`, все `@id`-ссылки разрешаются, бизнес один (`…/#business`), `Person.name === "Constantin"`; **сверка с видимым текстом**: каждое строковое значение узлов (name, telephone, jobTitle, названия сертификатов, serviceType/name услуги, areaServed-места, вопросы и ответы FAQ, headline статьи, ratingValue/reviewCount) находится в видимом тексте той же страницы (нормализация пробелов/регистра; телефон — по цифрам); URL-поля (`url`, `logo`, `image`, `sameAs`) — ресурс присутствует на странице (ссылка/изображение); расхождения — список в отчёт и исправление до сдачи |
| 83 | R97 | Шаблонность — цифрами | `check:similarity` печатает матрицы для групп «районы/города» и «коммерческие страницы»; в отчёт |
| 84 | R99 | Все старые URL → 308 на живую страницу | тест `lib/redirects`: каждое место назначения ∈ `publishedPaths()` (якорь отбрасывается при проверке), нет цепочек (назначение ≠ источник другого правила), не `/` для не-корневых; в продакшен-сборке `curl -I` по 43 + 7 `.html` + `/for-business` |
| 85 | R100 | Отчёт владельцу | волны; опубликовано/черновик + недостающий факт; решения со ссылками на ADR; вопросы владельцу; шаги вне кода |

## Решения по реализации

### §1. Статус публикации — один тип, одна функция видимости

```ts
// data/types.ts
export type PublishStatus = "draft" | "published";
export type Publishable = { status: PublishStatus };
```

`lib/publish.ts` — единственное место, где решается «виден ли объект»:

```ts
export function isPublished(x: Publishable): boolean;
export function published<T extends Publishable>(xs: readonly T[]): T[];
/** Для generateStaticParams и guard в страницах: в `next dev` черновики тоже рендерятся (превью для владельца). */
export function routable(x: Publishable): boolean; // published || NODE_ENV === "development"
export const isDraftPreview: (x: Publishable) => boolean; // для плашки DRAFT
```

- sitemap, `mainNav`, `lib/links`, `lib/jsonld`, `lib/redirects`, `lib/routes` используют
  **только** `published()`/`isPublished()`: там черновиков нет даже в dev. Флаг `routable`
  имеют только роуты. *Почему:* роут в dev нужен владельцу для вычитки, но утечка в
  поисковые слои — это ровно то, что запрещает бриф.
- Блок внутри страницы (FAQ-пункт, раздел «Appliances in Ballantyne», блок `/about`)
  фильтруется через `published()` в продакшене; в dev черновой блок показывается с той же
  плашкой. *Почему:* владелец вычитывает и страницы, и блоки.
- `placeholder` и `isFullPage` удаляются. *Почему:* бриф требует один механизм, «второй не
  заводи».

### §2. Данные — всё содержимое в `data/`

Бриф: «Тексты и константы живут в data/, компоненты контент не хардкодят». Это
противоречит ADR 0011 (редакционная копия в компонентах) и расширяет ADR 0001 (шесть
модулей). Решение: **новый ADR отменяет 0011 и дополняет 0001.** Вся видимая копия всех роутов
переезжает в `data/` — не только страниц, которые меняются: `/about`, `TOWN_SEO` и
`CHARLOTTE_REPAIR_CHIPS` из `towns/[slug]`, `SECTION_H2` из `appliance-repair/[slug]`,
копия хаба `/for-business`, заголовки и абзацы секций главной, `/brands` и `/towns`
(что ещё не в данных), тексты шапки/подвала (`data/site.ts`). Исключение — поведенческие
строки формы: плейсхолдеры полей и сообщения валидации живут с `lib/book/schema.ts` и
`BookForm` (это не контент страницы, а поведение формы). Проверка: в `app/**/page.tsx` и
`components/**` нет JSX-литералов с пользовательским текстом, кроме этого исключения
(ревью по grep). Модули:

| Модуль | Что держит |
|---|---|
| `data/business.ts` | NAP, `siteUrl` (боевой), соцсети; без `legalName` |
| `data/site.ts` *(новый)* | тексты шапки и подвала (ярлыки, CTA, описание в подвале) |
| `data/people.ts` *(новый)* | `owner`: имя, роль, годы, сертификаты, базирование, фото + блоки `/about` (со статусами) |
| `data/services.ts` | 12 услуг (+ H1 с географией, title/meta, заголовки секций, локальный Ballantyne-блок со статусом) + копия бытового хаба + `commercialCategories` |
| `data/b2b-segments.ts` | копия коммерческого хаба (как сейчас) + сегменты со `status` |
| `data/commercial.ts` *(новый)* | 7 дочерних коммерческих страниц |
| `data/towns.ts` | города и районы (`kind`, `parent`, `page?`), SEO-строки страниц |
| `data/reviews.ts` | отзывы + `segment?`, `area?` + определение категорий `/reviews` |
| `data/brands.ts` | без изменений по составу |
| `data/guides.ts` *(новый)* | категории + статьи |
| `data/cases.ts` *(новый)* | `RepairCase[]` (пусто) |

Разметка страниц `/brands` и `/towns` не меняется (кроме списка районов на `/towns`);
их копия переезжает в данные, если ещё не там.

### §3. Города и районы

```ts
export type TownPage = Publishable & {
  seo: { title: string; description: string };
  hero: { h1?: string; lede: string };
  prose: string[];
  districts?: string[];
  reviewAuthors?: string[];   // города — ручной список (как сейчас); районы берут отзывы по Review.area
  nearby?: string[]; nearbyProse?: string; hasMap?: boolean;
  repairChips?: { label: string; href: string }[];      // бывш. CHARLOTTE_REPAIR_CHIPS
  // только районы:
  coverage?: Publishable & { body: string };          // «что входит в район»
  zips?: Publishable & { items: string[] };            // факт 3
  communities?: Publishable & { items: string[] };     // факт 4
  whoWeServe?: Publishable & { business: string; homes: string }; // факт 5
  applianceNotes?: (Publishable & { serviceSlug: string; heading: string; body: string })[];
  faqs?: (Publishable & { q: string; a: string })[];
};
export type Town = {
  slug: string; name: string; state: "NC" | "SC";
  kind: "city" | "area";
  parent?: string;          // slug родителя: south-charlotte → charlotte, ballantyne → south-charlotte
  page?: TownPage;          // нет page — у города нет страницы (бывш. isFullPage: false)
};
```

Роут `/towns/[slug]` — тот же файл для городов и районов; разметка района собирается
из тех же `ui/*`, секции выводятся по наличию полей. `getTown(slug)` возвращает город
только если `page && routable(page)`. *Почему:* бриф требует адреса `/towns/south-charlotte`
и `/towns/ballantyne`, а второй роут для районов означал бы второй шаблон страницы.
ADR 0008 (пять городов) дополняется новым ADR: пять городов остаются, добавляются
ровно два района, новых городов нет.

### §4. Граф JSON-LD

`lib/jsonld.ts` — чистые функции-узлы без `@context`, плюс сборщик:

```ts
export const ids: { business: string; website: string; owner: string }; // от business.siteUrl
export function graph(...nodes: object[]): { "@context": "https://schema.org"; "@graph": object[] };
export function businessNode(opts?: { areaServed?: boolean; aggregateRating?: boolean; knowsAbout?: boolean }): object;
export function websiteNode(): object;                 // только на главной
export function ownerNode(): object;                   // полный — только на /about
export function serviceNode(input: { url: string; name: string; areaServed: string[] }): object;
export function articleNode(article: GuideArticle): object; // throws, если !reviewedByOwner
export function faqNode(url: string, items: readonly { q: string; a: string }[]): object;
export function breadcrumbNode(url: string, trail: readonly { name: string; url: string }[]): object;
```

Ссылка на узел — `{ "@id": ids.business }`. `<JsonLd>` принимает результат `graph()` и
рендерит один `<script>` на страницу. На каждой странице есть `businessNode()` с базовыми
полями: они видны в шапке и подвале всех страниц (телефон, часы, город, соцсети, лого).
Опции включают `areaServed`, `aggregateRating`, `knowsAbout` только там, где это видно
на странице (история 17). `priceRange` удаляется. *Почему:* бриф — «разметка описывает
только то, что видно»; ADR 0007 дополняется новым ADR (граф с `@id`).

### §5. Реестр живых путей и редиректы

- `lib/routes.ts`: `publishedPaths(): string[]` — статические страницы (`/`, `/about`,
  `/brands`, `/towns`, `/reviews`, `/appliance-repair`, `/commercial-appliance-repair`) +
  12 услуг + опубликованные коммерческие дочерние + города/районы с опубликованной
  страницей + `/appliance-repair-guide` (если есть опубликованная статья) + опубликованные
  статьи и кейсы. Этот список читают `app/sitemap.ts`, тест редиректов и QA-скрипты.
- `lib/redirects.ts`: `redirectRules(): { source; destination; permanent: true }[]` — чистая
  функция: 7 старых `.html`-правил (из ADR 0013; `/for-business.html` теперь сразу ведёт
  на новый хаб) + `/for-business` + таблица старого ekfix.us (история 23). Коммерческие
  назначения вычисляются из статуса: дочерняя опубликована — туда, иначе на якорь хаба.
  `next.config.ts` импортирует `redirectRules()` по относительному пути.
- Регистр: у Next `redirects()` совпадение пути по умолчанию регистрозависимое, поэтому
  `towns/Lesslie` — отдельное правило, записанное как в sitemap. Слеш в конце Next
  нормализует сам — проверить `curl`.

> **Поправка D02 (таск 09):** сборка показала, что сопоставление путей в `redirects()` у Next
> по умолчанию **регистронезависимое** (`caseSensitiveRoutes` выключен) — правило `/towns/Lesslie`
> ловит и `/towns/lesslie`; код защищён от петель, отличающихся только регистром. Путь со слешем
> в конце проходит два 308 (нормализация Next, затем наше правило) и заканчивается на живой странице.

### §6. Коммерческий раздел

- `app/for-business/` → `app/commercial-appliance-repair/page.tsx` (хаб, контент 1:1) +
  `app/commercial-appliance-repair/[slug]/page.tsx`.
- `CommercialPage` (в `data/commercial.ts`):

```ts
export type CommercialPage = Publishable & {
  slug: string;                         // один из 7 из брифа
  kind: "equipment" | "industry";
  segmentId?: string;                   // для industry: "horeca" | "property-management"
  contactAs: string;                    // опция формы для CTA (R56.1)
  applianceFormLabel?: string;          // для equipment — пресет appliance
  seo: { title: string; description: string };
  hero: { h1: string; lede: string };   // h1 может содержать <br><span>
  equipment: { types: string[]; brandNames: string[]; moreEquipment?: Publishable & { items: string[] } };
  failures: { title: string; body: string; businessImpact: string }[];
  callProcess?: Publishable & { body: string };  // факт 7: цена диагностики для бизнеса, вне часов
  faqs: (Publishable & { q: string; a: string })[];
  reviewAuthors: string[];
  photo?: { src: string; alt: string };
};
```

- `brandNames` — только имена, существующие в `data/brands.ts` (`tier: "commercial"`)
  или в `laundryObjectTypes.brandChips`. Тест проверяет это пересечение.
- Для industry-страниц сегмент хаба пишется своими словами, а не копируется: дословный
  повтор с хабом — это шаблонность (§10).
- Карточки коммерческого оборудования на главной и `commercialCategories.href` ведут на
  дочернюю страницу, если она опубликована, иначе на якорь хаба. Ссылка вычисляется в
  `lib/links`, а не записывается руками.

### §7. Главная

- Hero: H1/лид/слоган — `data/b2b-segments.ts` `homeHero`; кнопки «For Business»/«For Homes»;
  телефон — существующая текстовая ссылка в стиле hero. «Book Online — Save 10%» из hero
  уходит (бытовой путь ведёт на хаб, где CTA на форму остаётся).
- Порядок секций — история 43. Новая секция коммерческого оборудования использует
  `SectionHead` + `RepairGrid` + `RepairCard` (карточки из `commercialCategories` + ссылки из
  `lib/links`); `#repair` остаётся 12 бытовыми карточками.
- Оттенки: соседние секции разного оттенка (правило `CLAUDE.md`); оттенки подобрать из
  существующих `section-light`/`-light-2`/`-dark`/`-dark-2`.
- Отзывы: `homeReviews()` = отсортированные `segment: "commercial"` первыми.
- Карточка «Homeowners» в #who-we-serve → `/appliance-repair` (R44/R45: у домашнего пути теперь свой хаб).

### §8. Меню

`mainNav` (порядок — история 48). Название бытового пункта — **«Home Appliances»**.
Почему: так ищут («home appliance repair»), пункт стоит парой к «For Homes» в hero, и по
нему ясно, что внутри техника, а не общий «ремонт дома» (Home Repair) и не внутренний
жаргон (Residential). Brands и For Business выходят из главного меню: бриф даёт полный
список пунктов. `/brands` остаётся доступен из секции брендов на главной и из подвала.
Ссылки подвала обновляются (R31, R87): For Business → «Commercial» на новый путь; добавить
Reviews → `/reviews`; прочие ярлыки подвала («Our Story» и т.д.) не меняются. В главном
меню — «About» (как в списке брифа).

### §9. Форма и `contactAs`

- `BookingProvider`: `{ appliance, setAppliance, contactAs, setContactAs }`; при монтировании
  читает `URLSearchParams` (`as`, `appliance`) из `window.location.search`, принимает только
  значения из `contactAsOptions`/`applianceFormOptions`. Главная остаётся SSG: параметры
  читаются на клиенте, а не через `searchParams`.
- `BookForm` пресетит `<select name="contactAs">` так же, как `appliance`.
- Коммерческие CTA вне главной рендерят `href="/?as=…#book"` (+`&appliance=…`).

### §10. Тест на шаблонность

`scripts/similarity.mjs` (без зависимостей, `npm run check:similarity`) работает против
запущенного сервера (`next dev`, чтобы видеть и черновики):

1. берёт видимый текст `<main>` страниц группы;
2. маскирует имя сущности (название района/города, оборудования/отрасли и их варианты)
   токеном `⟨X⟩`;
3. считает Jaccard по 3-словным шинглам для каждой пары.

Группы: «районы и города» (charlotte, south-charlotte, ballantyne + 4 города) и
«коммерческие дочерние» (7). **Порог публикации — ≤ 0.30** с каждой страницей группы (R93.1: число нужно, чтобы тест брифа «заменить название — смысл не изменится» проверялся одинаково; тот же скрипт даёт цифры для R97).
Выше — страница остаётся `draft`. Матрица целиком идёт в отчёт.

*Почему 0.30:* тексты, которые реально отличаются по смыслу и делят только общие связки
(подвал, CTA, FAQ про оплату), на 3-шинглах обычно дают 0.1–0.25. Near-duplicate
начинается от ~0.5. Общие блоки (подвал, CTA) в `<main>` не входят.

> **Поправка D01 (таск 01, 2026-09-28):** на полном тексте между шапкой и подвалом уже
> опубликованные города дают 0.40–0.49 (Rock Hill, Fort Mill, Matthews, Indian Trail), Charlotte —
> 0.29. Предпосылка «разные по смыслу тексты дают 0.1–0.25» для этого сайта не держится: общие
> навигационные блоки (ряды чипов из 12 услуг и соседних городов, крошки, одинаковые заголовки
> секций) весят в раскладке страниц много. Поэтому решение о публикации принимается по
> **редакционному тексту** — абзацы, заголовки, пункты списков, FAQ (вопрос+ответ); без рядов
> чипов/ссылок, крошек и `.cta-band`. Порог прежний — ≤ 0.30. Скрипт печатает обе метрики
> (полную и редакционную), в отчёт идут обе. Если по редакционной метрике уже опубликованные
> города тоже > 0.30 — это отдельная находка для отчёта, а не повод менять порог.

### §11. Центр знаний и кейсы

- Формат — **`data/guides.ts`** (типизированные поля). MDX не берём: нужен `@next/mdx` и
  конфиг, а шаблон брифа — это структурированные поля (симптомы, причины, шаги), которые
  естественно лежат в TS-объектах; статьи проходят тот же тест черновиков. Решение
  записывается в ADR.

```ts
export type GuideCategory = "refrigerator" | "dishwasher" | "washer" | "dryer" | "oven-range" | "ice-maker" | "commercial";
export type GuideArticle = Publishable & {
  slug: string; category: GuideCategory;
  title: string; metaDescription: string;
  model?: string;                        // «если применимо»
  appliesTo?: { brand?: string };
  symptoms: string[];
  diagnosis: string[];
  causes: { cause: string; detail: string }[];
  repairSteps: string[];
  whenToCallPro: string;
  serviceSlug: string;                   // → /appliance-repair/[slug] или коммерческая
  reviewedByOwner: boolean;              // false у всех 11
  author?: "owner";                      // только при reviewedByOwner
  technician?: "owner";
  datePublished?: string; dateModified?: string; // ISO, ставятся при публикации
  sources: { claim: string; url: string; title: string }[]; // не рендерится
};
```

- Статьи пишет исполнитель, опираясь на первичные источники: сервисную документацию и
  страницы поддержки производителей (Bosch, Samsung, LG, Whirlpool/KitchenAid, Thermador,
  Miele) и технические руководства. Каждое утверждение о коде ошибки или процедуре
  привязано к записи `sources`. Всё, что нельзя подтвердить источником, не пишется.
  Текст безличный: без «я» и без «мы за 10 лет».
- Кейсы: `RepairCase` (история 75), `data/cases.ts = []`, шаблон страницы собирается из
  `PageHero` + `Prose` + `ProblemCardGrid`/`ChipRow`.

### §12. ADR этого прогона

Каждое решение, которое меняет прежний ADR, оформляется новым ADR (R02). Их пишет проход
памяти в Приёмке по готовому коду; номера — по порядку от 0014:

- копия в `data/` — отменяет 0011 и дополняет 0001;
- единый статус draft/published и dev-превью — заменяет `placeholder` и `isFullPage`;
- `/for-business` → `/commercial-appliance-repair` + дочерние страницы — отменяет 0009;
- районы South Charlotte/Ballantyne под `/towns` — дополняет 0008;
- JSON-LD как `@graph` со стабильными `@id` — дополняет 0007;
- формат центра знаний `data/guides.ts` (R77);
- боевой домен `ekfix.us` и редиректы старого ekfix.us — отменяет 0005, дополняет 0013;
- меню и название «Home Appliances».

### §13. Дизайн и тон

**Никакого нового текста от первого лица — нигде** (коммерческие страницы, районы, `/about`, услуги, статьи): новая копия пишется в третьем лице («EK Global…», «Constantin…») или безлично. Опубликованная первая-лицо цитата владельца (quote-card на главной) остаётся как есть — это опубликованный факт, а не новый текст.

Новые страницы собираются из `components/ui/*` и существующих классов. Новое CSS-правило —
только если без него нельзя. В этом случае оно точечное, с приписью в ADR 0002 и строкой
«почему» в отчёте. Плашка DRAFT — инлайн-стиль, только в dev. Существующую копию на
страницах, которые трогает прогон, проверить на превосходные и сравнительные степени без
источника («most local outfits don't bother to hold» и т.п.) и переформулировать
нейтрально.

## Границы и швы

| Модуль | Владеет | Выставляет | Прячет |
|---|---|---|---|
| `lib/publish` | правило видимости | `isPublished(x)`, `published(xs)`, `routable(x)`, `isDraftPreview(x)` | проверку `NODE_ENV` |
| `data/*` | весь контент и факты | типизированные константы (§2); `getTown(slug)`, `getService(slug)`, `getCommercialPage(slug)`, `getArticle(slug)`, `homeReviews()`, `reviewCategories()` | — |
| `lib/routes` | список живых URL | `publishedPaths(): string[]` | как собирается из данных |
| `lib/links` | перелинковку | `areaLinksForHome()`, `areaLinksForService(slug)`, `linksForCommercial(slug)`, `serviceLinkForArticle(a)`, `serviceLinkForCase(c)`, `commercialCardHref(category)` → `ChipItem[]`/`string` | выбор ближайшего опубликованного района, якорь-запасной |
| `lib/nav` | меню | `mainNav: NavEntry[]` | фильтрацию черновиков, условие «Guides» |
| `lib/jsonld` | разметку schema.org | `ids`, `graph()`, `businessNode()`, `websiteNode()`, `ownerNode()`, `serviceNode()`, `articleNode()`, `faqNode()`, `breadcrumbNode()` | форму узлов |
| `lib/breadcrumb` | трейл крошек | `breadcrumbTrail(steps)` → `{ crumbs, jsonLd }` (jsonLd = узел для `graph`) | — |
| `lib/redirects` | таблицу редиректов | `redirectRules()` | таблицу старого ekfix.us |
| `lib/book` + `BookingProvider` | заявку | `submitLead` (без изменений); контекст `{appliance,setAppliance,contactAs,setContactAs}` | разбор URL-параметров |
| `scripts/` | проверки | `check:copy`, `check:similarity` (npm scripts) | — |

**Швы для тестов** (vitest, только публичные функции):

1. `lib/book` — как сейчас.
2. `lib/routes` + `app/sitemap.ts` — sitemap = `publishedPaths()`; ни одного черновика; при
   переключении статуса в фикстуре путь появляется/исчезает.
3. `lib/jsonld` — `@id`, ссылки на бизнес, Person без фамилии, `articleNode` бросает на
   непроверенной статье, `businessNode()` без опций не содержит `areaServed`/`aggregateRating`/
   `priceRange`.
4. `lib/redirects` — все 43 старых URL покрыты или совпадают с живым путём; назначения ∈
   `publishedPaths()`; нет цепочек; не-корневые не ведут на `/`.
5. `lib/links` + `lib/nav` — не отдают черновиков; «Guides» нет при нуле опубликованных статей.
6. Инварианты данных (`data/*.test.ts`, один файл): опубликованная статья ⇒ `reviewedByOwner` и
   `author`; `brandNames` коммерческих ⊂ бренды сайта; нет «Konstantin» вне `reviews.text`.

Существующий `app/sitemap.test.ts` и `lib/jsonld.test.ts` переписываются под новую форму.
Вёрстку страниц не тестируем.

## Вне рамок

| Требование | Почему не сейчас |
|---|---|
| R88 — 5.1 переименование фото, alt по смыслу, новые фото из факта 13 | вне периметра прогона по словам пользователя («Периметр этого прогона: волны 1–2 полностью; из волн 3–4 — …»); alt у фото с владельцем обновляются в рамках R11. В отчёт: лучше сделать до выката на ekfix.us, чтобы индексировались уже новые имена |
| R28i — выкат на ekfix.us (DNS/хостинг) | действие вовне; шаги владельца в отчёте. Хостинг не на GitHub Pages (ADR 0003 — без `output: export`) |
| Наполнение блоков под факты 2–8, 12 и публикация зависящих от них страниц | пользователь: «Когда придут — будет отдельный прогон на наполнение и публикацию» |
| Факты 9, 10, 11, 13 | не даны и не запрошены; соответствующие блоки — черновики, вопросы в отчёт |

## Открытые места

| Что | Где | Что нужно от владельца |
|---|---|---|
| Публичное/юридическое название | `data/business.ts` (`name` = «EK Global» из опубликованного) | факт 2 |
| ZIP South Charlotte / Ballantyne, упоминание 28277 в лиде | `data/towns.ts` `zips` (draft); `homeHero.lede` без ZIP | факт 3 |
| Сообщества | `data/towns.ts` `communities` (draft) | факт 4 |
| Кого обслуживаем в South Charlotte | `data/towns.ts` `whoWeServe` (draft); FAQ «commercial in South Charlotte» (draft) | факт 5 |
| Коммерческое оборудование сверх опубликованного | `data/commercial.ts` `moreEquipment` (draft) | факт 6 |
| Диагностика для бизнеса, вызовы вне часов, название программы | `callProcess` (draft); `maintenancePlanName` остаётся TODO | факт 7 |
| Обучение, год основания, тип OSHA | блоки `/about` (draft); `hasCredential` OSHA без курса | факт 8 |
| Бренды с большим опытом | блок `/about` (draft) | факт 9 |
| Кейсы | `data/cases.ts` = `[]` | факт 10 |
| Подлинность и районы отзывов | `Review.area` пусто; категория South Charlotte & Ballantyne скрыта | факт 11 |
| Профили GBP/Yelp/BBB/Nextdoor для `sameAs` | `sameAs` = 3 соцсети сайта | факт 12 |
| Проверка статей владельцем | 11 статей `draft`, `reviewedByOwner: false` | техническая вычитка |

## Покрытие манифеста

| Требование | Раздел спецификации |
|---|---|
| R01 | подготовка спецификации (прочитаны CLAUDE.md, ADR 0001–0013, стратегия, аудит, код) — входит в исходные данные каждого таска |
| R02 | Решения §12 |
| R03 | Решения §2 |
| R04, R91 | Решения §2, §6, §11; Открытые места; истории 33–36, 59, 66–67 |
| R05 | Решения §13 (контент на английском; кириллица — история 26) |
| R06–R10 | истории 1–8, Решения §1 |
| R11–R13 | истории 9–12 |
| R14, R15 | истории 13–14 |
| R16–R23 | истории 16–22, Решения §4 |
| R24, R25 | истории 23–25, Решения §5 |
| R26 | история 26 |
| R27i | история 15 |
| R28i | история 27; Вне рамок |
| R29–R33 | истории 28–31, Решения §6 |
| R34–R43 | истории 32–40, Решения §6, §10 |
| R44 | история 41 |
| R45–R52 | истории 42–47, Решения §7 |
| R53–R55 | истории 48–50, Решения §8 |
| R56, R57 | истории 51–53, Решения §9 |
| R58–R65 | истории 54–59, Решения §3, §10 |
| R66, R67 | истории 60–61 |
| R68, R69 | истории 62–63 |
| R70 | история 64; Границы (`lib/links`) |
| R71 | история 65 |
| R72–R74 | истории 66–68 |
| R75–R83 | истории 69–74, Решения §11 |
| R84 | история 75 |
| R85–R87 | истории 76–78 |
| R88 | Вне рамок (deferred) |
| R89 | история 79 |
| R90 | Решения §13 |
| R92 | история 26, Решения §13 |
| R93 | истории 39, 58; Решения §10 |
| R94–R99 | истории 80–84 |
| R100 | история 85 |
| R101 | выполнено на Подготовке |
