# two-branch-site — рабочий план (без автопилота, по просьбе пользователя)

Ветка `autopilot/two-branch-site` от bf4aa91 (прошлая ветка не влита в main).
Бриф — сообщение пользователя 2026-09-29 («РОЛЬ И КОНТЕКСТ … РЕЗУЛЬТАТ»), факты 2–13 пусты.
Шаг 0 (закрыть entity-commercial-geo) — выполнен раньше (bf4aa91).

## 0. Контракты (фиксирую до кода, чтобы части не разошлись)

### Маршруты (URL не меняются)
```
app/layout.tsx                     html/body, шрифты, Analytics, дефолтная metadata — и всё
app/(entry)/layout.tsx             EntryHeader + EntryFooter
app/(entry)/page.tsx               «/» — страница выбора
app/(commercial)/layout.tsx        Header variant=commercial + Footer variant=commercial
app/(commercial)/commercial-appliance-repair/{page,[slug]/page}.tsx
app/(residential)/layout.tsx       Header variant=residential + Footer variant=residential
app/(residential)/appliance-repair/{page,[slug]/page}.tsx
app/(residential)/towns/{page,[slug]/page}.tsx
app/(shared)/layout.tsx            Header variant=shared + Footer variant=shared
app/(shared)/{about,reviews,brands}/page.tsx, appliance-repair-guide/**, repair-cases/**
app/api/book/route.ts, sitemap.ts, robots.ts, icon.svg, globals.css — на месте
```

### Меню (lib/nav.ts)
- `commercialNav()`: Equipment ▾ (5 equipment-страниц, опубликованные) · Industries ▾ (Restaurants → restaurant-…,
  Property Management → property-management-…, Hotels & Laundry → `/commercial-appliance-repair#hotels`) ·
  Service Area → `/commercial-appliance-repair#service-area` · About · Reviews.
  Действия: телефон + акцент «Request Service» → `/commercial-appliance-repair#request`. Переключатель «For Homes →».
- `residentialNav()`: We Repair ▾ (хаб + 12 услуг) · Service Area ▾ (опубликованные города/районы + All Service Towns) ·
  Brands · Guides (только при опубликованной статье) · About · Reviews.
  Действия: телефон + «Book a Repair» → `/appliance-repair#book`. Переключатель «For Business →».
- `sharedNav()`: For Business · For Homes · Brands · Guides? · About · Reviews. Действия: телефон. Логотип → `/`.
- Логотип ветки → корень своей ветки. `HeaderBar` получает `{nav, copy: {brandHref, cta?, switch?}}`.

### Формы и /api/book (размеченное объединение по `branch`)
- home: `{branch:"home", name, phone, appliance ∈ homeApplianceOptions, message?}`
- business: `{branch:"business", company, contactName, phone, email?(валидный, если есть), businessType ∈
  [Restaurant, Property Management, Hotel, Laundry, Other], equipment? ∈ businessEquipmentOptions,
  units?, urgency? ∈ [Emergency, Scheduled repair, Maintenance contract, Quote], message?}`
- Обязательны: home — name, phone, appliance; business — company, contactName, phone, businessType.
- Нет/неизвестный `branch` → 400 `{errors:{branch}}`. Невалидно → 400 с первым сообщением на поле. Валидно → 200, все
  включённые sinks. Тема письма: home `New home repair request — <appliance>`; business
  `[BUSINESS] Commercial service request — <company> (<businessType>)`.
- Опции — в `data/` (одни массивы для `<select>` и zod). `contactAsOptions` и `?as=` уходят.
- Пресеты из URL: `/appliance-repair?appliance=<label>#book`, `/commercial-appliance-repair?equipment=<label>&type=<type>#request`;
  ссылкостроители и парсеры — `components/booking-link.ts` (единственное место имён параметров). BookingProvider удаляется:
  форма сама читает `location.search` на монтировании.
- GA4 (`lib/analytics.ts`, `track(event, params)` — no-op без `gtag`): `branch_select {branch}` на странице выбора;
  `commercial_form_submit` / `residential_form_submit` на успешной отправке.

### Кросс-ссылки (данные)
- `CommercialPage.homeCounterparts: string[]` (slug'и услуг): refrigerator→[refrigerator, freezer? нет — только по брифу],
  dishwasher→[dishwasher], ice-machine→[ice-maker], laundry→[washer, dryer], oven-range→[stove, range, cooktop].
- `lib/links`: `businessLinkForService(slug): ChipItem | null` (только опубликованная коммерческая),
  `homeLinksForCommercial(slug): ChipItem[]`. Подписи — `data/site.crossBranch`.
- Ballantyne → одна ссылка «Commercial service in this area →» на `/commercial-appliance-repair#service-area`.

## 1. Страница выбора «/»
- H1 «Appliance repair in Charlotte, NC» (над панелями), H2 в панелях. Панели: фото + скрим, eyebrow, H2, 1–2 фразы,
  кнопка, 3–5 ссылок. Бизнес — фото кухни ресторана, `.btn-accent`; дом — фото у стиральной машины, `.btn-ghost-dark`.
- Мобильный: стопкой, бизнес сверху, кнопка бизнеса видна без прокрутки на 390×844 (кнопка до списка ссылок).
- Два варианта: A — 50/50, B — 60/40 в пользу бизнеса. Скриншоты 1440/390 → вопрос владельцу → выбранный остаётся.
- Без JS работает (обычные `<a>`), трекинг — `onClick` в клиентском островке, без preventDefault.
- metadata: оба направления + город. JSON-LD: businessNode({image}) + websiteNode. В sitemap (уже есть «/»).
- Стили — новый блок `/* two-branch */` с префиксом `.branch-` только из токенов, ADR 0022 + приписка в ADR 0002.

## 2. Коммерческая главная `/commercial-appliance-repair` (из хаба и прежней главной)
Тона: hero D · trust L2 · industries(#property-management/#horeca/#hotels) L · equipment D2 · #laundry L · #process L2 ·
#formats D (форматы + договор) · why D2? → проверить соседей · brands · reviews · #service-area · #faq-business · #request D2.
- hero `.hero` + фото кухни, H1 «Commercial appliance repair<br><span>in Charlotte.</span>», лид, «Request Service» + звонок,
  hero-meta (часы, рейтинг текстом), hero-trust (3 пункта процесса).
- Сегменты: карточки → опубликованная отраслевая страница, иначе к форме с пресетом типа.
- Оборудование: карточки 5 equipment-страниц (изображение — поле `cardImage` в data/commercial).
- Зона: текст с коммерческими формулировками Ballantyne + чипы мест (без ссылок на бытовые страницы) → areaServed.
- Отзывы: segment=commercial. Форма: `CommercialForm` в `.book-grid`.
- ~~Боковая навигация~~ — нет: владелец запретил её везде (2026-09-29).

## 3. Бытовая главная `/appliance-repair`
hero (фото у стиральной машины) · #repair 12 карточек → страницы услуг · #family (без коммерческих фото/фраз) ·
#pricing ($75, 10%, оценка до работ) · #reviews (домашние) · #brands (бытовые+премиум) · #areas (чипы районов/городов) ·
#guides (если есть опубликованные) · #faq · #book (HomeForm).
- Ballantyne: seo/лид/FAQ без «commercial», одна ссылка на коммерческую зону.

## 4. Хвосты
- 7.1 `.stars` → компонент `Stars` (aria-hidden + текст оценки рядом).
- 7.2 4 города: убрать абзац про $75 (→ ссылка «Pricing & terms →» на `/appliance-repair#pricing`), `reviewAuthors: []`;
  пересчитать check:similarity; выше 0.30 → вопрос владельцу.
- 7.3 «on Google»/«Google reviews» → «5.0 · 6 reviews».
- 7.4 Переименовать kostia*, konstantin*, SreetFair?, dryer_16, garb_dispo, new_microwave, freezer_new, ice_maker_under,
  wine_coolers → описательные; ссылки, alt, image-dimensions.
- 7.5 Черновики не трогать.
- Все `/#book`, `/#repair`, `/?as=` → новые адреса веток.

## 5. Проверки
tsc · vitest · build · check:copy · check:similarity (areas, commercial) · сходство двух главных (скрипт) ·
Playwright: страница выбора 1440/1024/768/390 + без JS; все опубликованные 1440/390 (контраст, скролл, консоль,
картинки, растяжение), вид шапки по группе, переключатель; формы 400/200; JSON-LD; редиректы; черновики.

## 6. Документы
ADR 0022 (две ветки: группы маршрутов, шапки/подвалы, вход), 0023 (две формы + GA4), 0024 (стили `.branch-`),
приписка к 0002 и 0016/0021 (частично заменены); CLAUDE.md; отчёт.
