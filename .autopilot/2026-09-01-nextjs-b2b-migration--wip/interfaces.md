# Interfaces — контракты между тасками

Читается каждым субагентом ПЕРВЫМ, до кода. Не выдумывай границы — они уже решены
в `spec.md`. Растёт по мере сдачи тасков: сдавший таск дописывает сюда реальные
сигнатуры того, что он выставил наружу.

## Правила проекта (не выводятся из кода)

- **Стек:** Next.js 16 (App Router) + React 19 + TypeScript **strict**. Node 25.
  `npm view next version` = 16.3.4. Проект создаётся `npx create-next-app@latest`
  (без Tailwind, App Router, TS). Менеджер пакетов — npm.
- **Команды:** `npm run dev` · `npm run build` · `npm start` · `npm test` (vitest) ·
  `npx tsc --noEmit`.
- **Тесты:** vitest. Тестируем ТОЛЬКО три шва (ниже). Не писать тесты на вёрстку
  страниц, на presentational-компоненты, на данные.
- **Визуал 1:1.** Это НЕ редизайн. Каждая страница обязана совпадать попиксельно с
  текущим `.html`. `app/globals.css` — дословная копия `css/style.css` + РОВНО два
  добавления: `.card-grid-4` (копия `.card-grid-3` на 4 колонки, тот же адаптив) и
  ничего для нового `<select>` (ловится существующим `.book-form select`).
  **globals.css замораживается после таска 01.** Нужна правка CSS в таске страницы →
  верни `BLOCKED` с объяснением, не правь молча.
- **Никакого Tailwind / CSS-in-JS / CSS-модулей.** Только глобальный CSS + те же
  классы, что в текущем HTML.
- **Данные — единственный источник.** NAP, услуги, города, бренды, отзывы, B2B —
  только из `data/*`. Хардкод текста NAP/списков в `app/`/`components/` запрещён.
- **Домен — заглушка.** `data/business.ts` → `siteUrl = "https://ekfix.us"` с
  `// TODO: подтвердить финальный публичный домен у владельца`. Больше нигде домен
  не хардкодить.
- **Не выдумывать факты о бизнесе.** Цифры доверия, адрес, тексты от лица Константина —
  если нет в текущем контенте сайта, ставить видимый плейсхолдер
  `[TODO: подтвердить у владельца — …]`, а не правдоподобное число.
- **Отсутствующая зависимость → `BLOCKED`,** не `npm install` наугад. Разрешено ставить
  то, что прямо названо в спеке/таске (next, react, vitest, zod).
- **Не трогать:** `.autopilot/`, 4 md-документа в корне, `.git/`. Старые `*.html`,
  `css/`, `js/`, `sitemap.xml` — удаляет ТОЛЬКО таск 11, не раньше (страницы сверяются
  с ними).
- **`assets/images/*` → `public/images/*`** — имена файлов не менять (ссылки в `data/`
  стабильны). Делает таск 01.
- **SSG:** ни одной страницы с `export const dynamic`/`revalidate`. Динамичен только
  `app/api/book`.
- **next/image** для всех изображений. `hero-technician.webp` — `priority`. Остальные
  — lazy по умолчанию. Сохранять текущие `object-fit`/`object-position`.
- **JSON-LD** — только через `<JsonLd>` из `lib/jsonld` (таск 03). Название бизнеса
  везде строго `"EK Global"` (НЕ `"EK Global Appliance Repair — Charlotte, NC"`).

## Границы, решённые в спецификации (копия §«Границы и швы»)

| Модуль | Владеет | Выставляет | Прячет |
|---|---|---|---|
| `data/*` (6 модулей) | контент-константы (NAP, услуги, города, отзывы, бренды, B2B) | `business`, `services`, `commercialCategories`, `towns`, `reviews`, `brands`, `b2bSegments` + типы | — (это данные) |
| `lib/nav` | структура меню | `mainNav` (из `data/services` + `data/towns` + ярлыки) | — (производная) |
| `lib/jsonld` | сериализация schema.org | `businessJsonLd()` (+`knowsAbout`), `serviceJsonLd(s)`, `faqJsonLd(items)`, `breadcrumbJsonLd(trail)`, `aggregateRatingJsonLd()` | форму объектов schema.org |
| `lib/seo` | сборка `Metadata` | `pageMetadata({title, description, path})` | `metadataBase`, canonical |
| `lib/book` | приём + валидация заявки, выбор каналов | `submitLead(input): Promise<Result>`, тип `LeadInput`, интерфейс `LeadSink` | zod-схему, список sinks, чтение env |
| `app/api/book/route.ts` | HTTP-обёртка | `POST` → `{ok:true}` \| `400 {ok:false,errors}` | — (тонкий слой) |
| `app/sitemap.ts` | карта сайта | default export `MetadataRoute.Sitemap` | перечисление роутов |
| `components/ui/*` | презентация (переиспользуемое) | React-компоненты, данные пропсами | вёрстку |
| `components/home/*`, `components/for-business/*` | презентация страницы | то же | вёрстку |

## Швы для тестов (Phase 5 тестирует ТОЛЬКО здесь)

1. **`lib/book`** — `submitLead(input)` + HTTP-контракт `POST /api/book`: валидный вход
   → `{ok:true}` + активный sink вызван; невалидный (пустое имя/телефон/тип техники)
   → `400 {ok:false, errors}`, доставка НЕ вызвана.
2. **`app/sitemap.ts`** — default export возвращает набор URL = {статические роуты:
   `/`, `/about`, `/brands`, `/for-business`, `/towns`} ∪ {12 `/appliance-repair/<slug>`}
   ∪ {5 `/towns/<slug>` где `isFullPage`} — ни больше, ни меньше.
3. **`lib/jsonld`** — `businessJsonLd().name === "EK Global"`; `telephone` и `areaServed`
   равны `data/business`; `areaServed.length <= 20`; `aggregateRatingJsonLd()` считается
   из `data/reviews` (`reviewCount === reviews.length`).

## Ключевые типы (форма, не реализация)

```ts
// data/services.ts
type Service = {
  slug: string; name: string; formLabel: string;
  title: string; metaDescription: string;
  hero: { h1: string; lede: string };           // h1 может содержать <br><span>
  problems: { title: string; body: string }[];  // ровно 6
  brands: string[];
  faqs: { q: string; a: string }[];             // 5
  whereWeWork: { name: string; href?: string }[];
  alsoRepair: { name: string; slug: string }[]; // пусто у refrigerator
};
type CommercialCategory = { label: string; formLabel: string; image: string; href: string };

// data/towns.ts
type Town = {
  slug: string; name: string; state: "NC" | "SC"; isFullPage: boolean;
  // только для isFullPage:
  hero?: { lede: string };
  prose?: string[];            // абзацы, могут содержать <strong>
  districts?: string[];
  reviewAuthors?: string[];    // какие из data/reviews показывать
  nearby?: string[];
  hasMap?: boolean;            // true только у charlotte
};

// data/reviews.ts
type Review = { author: string; detail: string; text: string };

// data/brands.ts
type Brand = { name: string; logo: string; alt: string; tier: "commercial" | "premium" | "mass"; wide?: boolean };

// lib/book
type LeadInput = { name: string; phone: string; appliance: string; contactAs: string; message?: string };
type Result = { ok: true } | { ok: false; errors: Record<string, string> };
interface LeadSink { name: string; enabled: boolean; send(lead: LeadInput): Promise<void> }
```

## Что построил каждый таск (дописывается по мере сдачи)

### Таск 01 — каркас, layout, globals.css, Header/Footer

**Команды** (все неинтерактивны):
- `npm run build` — прод-сборка (Turbopack, включает `tsc`); зелёная.
- `npx tsc --noEmit` — строгая типопроверка; зелёная.
- `npm test` — vitest run (`passWithNoTests: true`, тестов пока нет).
- `npm test -- <path>` — один файл, напр. `npm test -- lib/book/submit.test.ts`.
- `npm run dev` / `npm start` — локально (порт 3000).

**Стек факт:** next 16.3.4, react 19.2.8, react-dom 19.2.8, typescript ^5, vitest ^3
(точные версии из ticket встали без правок). Node 25.9. `tsconfig.json` — Next при
первом билде выставил `jsx: "react-jsx"` и добавил `.next/dev/types/**` в include
(это норма, не откатывать). `next.config.ts`: `images.formats: ["image/webp"]`,
`typedRoutes: true`.

**`data/types.ts`** — только типы, без рантайма:
`BusinessRating`, `Business`, `Service`, `CommercialCategory`, `Town`, `Review`
(+ optional `appliance?`, `town?`), `Brand`, `LeadInput`,
`LeadResult = {ok:true} | {ok:false, errors:Record<string,string>}`,
`interface LeadSink { name; enabled; send(lead: LeadInput): Promise<void> }`.
(Шов `lib/book` в spec зовёт тип `Result` — это `LeadResult` здесь.)

**`data/business.ts`** — `export const business: Business`:
`name："EK Global"`, `legalName："EK Global"`, `phone："(980) 371-4319"`,
`phoneHref："tel:+19803714319"`, `phoneE164："+1-980-371-4319"`,
`hours："8AM – 8PM daily"`, `hoursNote："Weekends included"`,
`openingHours：{ days:[Mon..Sun], opens:"08:00", closes:"20:00" }`,
`address：{ locality:"Charlotte", region:"NC", country:"US" }`,
`siteUrl："https://ekfix.us"` (+ TODO-домен),
`social：{ instagram, facebook, tiktok }`, `gaId："G-LFM6MSKBQ7"`,
`maintenancePlanName："EK Maintenance Plan"` (+ TODO).
**Заглушки для таска 02:** `areaServed: string[] = []`,
`rating: BusinessRating | null = null` (пометки `// TODO: финализирует таск 02`).

**`lib/seo.ts`** — `export const metadataBase = new URL(business.siteUrl)`;
`export function pageMetadata({ title, description, path }): Metadata`
(возвращает `{ metadataBase, title, description, alternates:{ canonical: path } }`).
**Дополнено таском 03:** `export function absoluteUrl(path: string): string` —
`new URL(path, business.siteUrl).toString()`, единственная точка этой конструкции
(зовут `lib/jsonld`, `app/sitemap`, `app/robots`).

**`lib/nav.ts`** — типы `NavLink {label,href}`, `NavGroup {label,wide?,children}`,
`NavEntry = NavLink | NavGroup`; `export const mainNav: NavEntry[]`
(We Repair → 12 услуг `/appliance-repair/<slug>`; Service Area → 5 городов +
`/towns`; About Us `/about`; Brands `/brands`; For Business `/for-business`;
Reviews `/#reviews`). **TODO таск 02:** заменить захардкоженные `repairServices`
и `serviceArea` на производные от `data/services` / `data/towns`.

**`components/`** (все — именованные экспорты, не default):
- `Header.tsx` (`'use client'`) — `<Header/>`, без пропсов. Рендерит `mainNav`,
  моб. toggle (`body.nav-locked`/`header.nav-open`/`.main-nav.open`), дропдауны по
  клику (`.nav-item.open`, закрытие по клику вне), закрытие меню по клику на ссылку,
  активный пункт по `usePathname()`.
- `Footer.tsx` (server) — `<Footer/>`, без пропсов. NAP из `data/business`.
- `Analytics.tsx` (server) — `<Analytics/>`, `next/script` `afterInteractive`,
  gtag из `business.gaId`.

**`app/layout.tsx`** — `<html lang="en">`, `<head>` со шрифтами (preconnect ×2 +
Google Fonts stylesheet, НЕ `next/font`), импорт `./globals.css`,
`<Header/>{children}<Footer/><Analytics/>`. `export const metadata` — дефолты из
`index.html` + `metadataBase`; страницы переопределяют через `pageMetadata`.
Favicon — файл `app/icon.svg` (авто-`<link rel="icon">`).

**`app/globals.css`** — дословная копия `css/style.css` + 2 строки `.card-grid-4`
(строки 481 и 573; `grep -v card-grid-4` даёт точный `css/style.css`).
**Заморожена** — правку CSS в тасках страниц возвращать как `BLOCKED`.

**`app/page.tsx`** — временная заглушка «Migrating…» (настоящую делает таск 06).

**`public/images/`** — все 52 файла скопированы из `assets/images/` (имена
сохранены; оригинал не тронут — удалит таск 11).

**`.env.example`** — пустые `RESEND_API_KEY`, `BOOK_NOTIFY_EMAIL`, `BOOK_WEBHOOK_URL`.

**Оговорка (typedRoutes):** пока страниц `/about`, `/brands`, `/for-business`,
`/towns`, `/appliance-repair/*` нет, их `href` в `Header`/`Footer` кастятся
`as Route` (helper `r()` в `Footer.tsx`). Когда страницы появятся — касты можно
снять, но это не обязательно.

### Таск 02 — слой данных (services, towns, reviews, brands, b2b-segments, business)

Весь контент услуг/городов/отзывов/брендов извлечён **дословно** из старых `*.html`.
Команды прежние; `npx tsc --noEmit` и `npm run build` — зелёные.

**Изменения в `data/types.ts`** (расширения, не ломающие):
- `Service` — добавлено `image: string` (thumbnail для home `#repair`, напр. `/images/Refrigerator.webp`).
- `Town` — добавлено `nearby?: string[]` (чипы «Also serving», не-charlotte) и
  `nearbyProse?: string` (charlotte — свободный абзац «also serving nearby»).
- `Brand` — добавлено `home?: boolean` (входит в переупорядоченную сетку главной `#brands`).

**`data/services.ts`**
- `export const services: Service[]` — ровно 12, порядок меню (refrigerator, washer, dryer,
  dishwasher, stove, range, cooktop, microwave, freezer, ice-maker, wine-cooler, garbage-disposal).
  У каждой: 6 `problems`, 5 `faqs`, `image`, `hero.h1` (с `<br><span>`), `whereWeWork`, `brands`,
  `alsoRepair` (`[]` у refrigerator; core-услуги — пул из 9 минус себя; ice-maker/wine-cooler/
  garbage-disposal — первые 8 пула). FAQ-тексты собираются `repairFaqs()` — вывод дословно совпадает
  с `.faq-item` страниц (refrigerator имеет override q1: en-dash + «happens»).
- `export const commercialCategories: CommercialCategory[]` — 4 (`label`, `formLabel`, `image`, `href`
  на `/for-business#horeca|#laundry`). `image` — существующие webp-заглушки + `// TODO`.
- `export const serviceSlugs: string[]`, `getService(slug)`, `applianceFormOptions: string[]`
  (11 услуг с дедупом «Stove / Range» + 4 коммерческих + «Commercial kitchen» + «Other» = 17).

**`data/towns.ts`**
- `export const towns: Town[]` — 26 записей: 5 `isFullPage` (charlotte, rock-hill, fort-mill,
  matthews, indian-trail; весь уникальный контент — `hero.lede`, `prose[]` с `<strong>`, `districts[]`,
  `reviewAuthors[]`, `nearby[]`/`nearbyProse`, `hasMap` только charlotte) + 21 не-полных (только
  `name`/`state`/`slug`, `isFullPage:false`). **Тикет просил «6 записей»** — держим все 26 в одном
  массиве, чтобы не плодить второй источник правды (spec §Слой данных: «Не-полные — только name/state»);
  `fullPageTowns` = 5, что и требует sitemap-шов.
- `export const fullPageTowns: Town[]` (5), `townSlugs: string[]`, `getTown(slug)` (только среди full).
- `export const alsoServedNC: string[]` (14), `alsoServedSC: string[]` (7) — **производные** от
  не-полных `towns` (не отдельные литералы).
- `export const townsIndex` — hero/section-копия `towns/index.html` (title, metaDescription, heroH1,
  heroLede, activeHead, лейблы списков).

**`data/reviews.ts`**
- `export const reviews: Review[]` — 6 (author/detail/text + `appliance?`), дословно из `#reviews`.
- `export const aggregate = { ratingValue: 5.0, reviewCount: reviews.length }` (=6). `// TODO` о проверке.
- `export function reviewsByAuthors(authors: string[]): Review[]` — для town-страниц.

**`data/brands.ts`**
- `export const brands: Brand[]` — 33, в порядке `brands.html` (сначала residential/premium-секция 22,
  затем commercial-секция 11). Поля `name`, `logo` (`/images/…`), `alt` (текст `brands.html`), `tier`
  (`commercial`|`premium`|`mass`), `wide?`, `home?`. Amana → `mass` (снят «?» тикета).
- `export const homeBrands: Brand[]` — 16 (`home:true`), отсортировано `commercial → premium → mass`
  (порядок внутри tier = порядок `brands.html`).
- `export const residentialBrands` (tier≠commercial, 22), `commercialBrands` (tier=commercial, 11) —
  для двух секций `/brands` (порядок = `brands`).
- `export const brandNote` (`{ home, brandsPage }` — `{tag,text,cta}`) — строка `.brand-note` под обеими сетками.
- `export const homeBrandsLede: string` — lede главной `#brands` (commercial-first, story 24).
- `export const brandsPage` — вся копия `/brands` дословно из `brands.html` (как `townsIndex` для `/towns`):
  `title`, `metaDescription`, `breadcrumb`, `hero {h1,lede}`, `residentialSection {eyebrow,h2}`,
  `commercialSection {eyebrow,h2,lede}`, `dontSeeYourBrand {h2,body}`, `ctaBand {h2,body}`.

**`data/b2b-segments.ts`** (типы `WhoWeServeCard`, `ForBusinessSegment`, `NumberedCard` — там же):
- `whoWeServeHead` (`{eyebrow:"01a / Who we serve", h2:"Homes, kitchens, and everything you manage."}`).
- `whoWeServe: WhoWeServeCard[]` (4; `{title,eyebrow,text,href,linkLabel}`; тексты 30–45 слов, написаны заново).
- `forBusinessSegments: ForBusinessSegment[]` (4; `{id,title,eyebrow,heading,text,href,linkLabel,bullets,placeholder?}`;
  `id`: `property-management`/`horeca`/`hotels`/`hoa`; `hoa.placeholder=true` + `// TODO`).
  Тексты НЕ совпадают дословно с `whoWeServe`. Два раздельных типа — страница не прочитает
  всегда-undefined поле не из того списка.
- `processSteps: NumberedCard[]` (4), `serviceFormats: string[]` (4), `trustHeading: string`,
  `trustChips: string[]` (5), `businessFaqs: {q,a}[]` (6), `whyCallUs: NumberedCard[]` (5 = 3 текущих + 2 новых),
  `commercialServices: string[]` (4 — для JSON-LD `knowsAbout`), `businessCta` (`{heading,text,primary:{label,href}}`),
  `laundryObjectTypes` (`{paragraph, types[4], brandChips[8]}` — абзац/типы не утверждают сверх
  `for-business.html`: hotels/laundromats/healthcare/multi-housing, без «stock parts»),
  `contactAsOptions: string[]` (5 — для формы «I'm contacting you as a…»).
- Санкционированная новая микрокопия (чтобы страницы её не хардкодили): `homeHero`
  (`{lede, metaSmall, businessLink}`), `familyBusinessSentence: string`, `forBusinessHeroLedeExtra: string`.

**`data/business.ts`** — финализировано:
- `areaServed: string[]` — 20 записей («City, ST»), срез 26→20 из старого JSON-LD по приоритету
  (5 full-town + близость к Ballantyne). Отброшенные 6: Allen NC, Unionville NC, Mineral Springs NC,
  Indian Hook SC, Lesslie SC, Spring Valley SC (остаются в `alsoServed*`).
- `rating: { value: 5, count: 6 }` — из `reviews.aggregate` (импорт `data/reviews`).

**`lib/nav.ts`** — больше не хардкодит списки: `repairServices` = `services.map` (12,
label `${s.name} Repair`), `serviceArea` = `fullPageTowns.map` (label `${t.name}, ${t.state}`) +
`{label:"All Service Towns →", href:"/towns"}`. Публичные типы/`mainNav` без изменений формы.

### Таск 03 — SEO-инфра: JSON-LD, sitemap, robots

Команды прежние; `npx tsc --noEmit`, `npm run build`, `npm test` — зелёные
(21 passed после таска 04; вклад таска 03 — швы 2 и 3, 14 тестов).

Абсолютизация URL вынесена в `lib/seo.absoluteUrl(path)` (см. «### Таск 01» → `lib/seo`) —
`lib/jsonld`, `app/sitemap`, `app/robots` импортируют её, локальных `new URL(path, siteUrl)` нет.

**`lib/jsonld.ts`** — чистые билдеры, все NAP из `data/business`; имя бизнеса всегда
`business.name` (= `"EK Global"`, БЕЗ суффикса города). Возвращают plain-объекты
schema.org (тип выводится, не аннотирован):
- `businessJsonLd()` → `HomeAndConstructionBusiness`. Поля: `@context`, `@type`, `name`,
  `image` (абс. `/images/hero-technician.webp`), `telephone` (`business.phoneE164`),
  `priceRange:"$$"`, `url` (абс. `/`), `address` (`PostalAddress`),
  `openingHoursSpecification`, `areaServed: {"@type":"City",name}[]` (из
  `business.areaServed`, ≤20 — срез держит слой данных, билдер НЕ обрезает), `sameAs`
  (3 соц-ссылки), `knowsAbout` (= `b2bSegments.commercialServices`, 4),
  `aggregateRating` (= `aggregateRatingJsonLd()`).
- `serviceJsonLd(service: Service)` → `Service`. `serviceType: ` `${service.name} Repair`,
  `provider: {"@type":"HomeAndConstructionBusiness", name: "EK Global", telephone}`,
  `areaServed: {"@type":"City", name:"Charlotte, NC"}`.
- `faqJsonLd(items: readonly {q,a}[])` → `FAQPage` c `mainEntity: Question[]`.
- `breadcrumbJsonLd(trail: readonly {name,url}[])` → `BreadcrumbList`; `url` может быть
  относительным или абсолютным — билдер абсолютизирует от `business.siteUrl`.
- `aggregateRatingJsonLd()` → `{"@type":"AggregateRating", ratingValue, reviewCount}`
  строго из `data/reviews.aggregate` (reviewCount = 6).

**`components/JsonLd.tsx`** — server-компонент, именованный экспорт `JsonLd`.
Проп `data: Record<string,unknown> | Record<string,unknown>[]`. Рендерит по одному
`<script type="application/ld+json">` на каждый объект; `__html` — `JSON.stringify(block)`
через `serialize()`, который заменяет `<` `>` `&` на их JSON unicode-эскейпы
(u003c / u003e / u0026 с ведущим бэкслешем). Данные не могут выйти из `<script>`;
`</script>` в контенте безопасен.
Импорт: `import { JsonLd } from "@/components/JsonLd"`.
Использование: `<JsonLd data={businessJsonLd()} />` или `data={[serviceJsonLd(s), faqJsonLd(s.faqs)]}`.

**`app/sitemap.ts`** — default export `sitemap(): MetadataRoute.Sitemap`. 22 записи:
5 статических (`/`, `/about`, `/brands`, `/for-business`, `/towns`) + `services` →
`/appliance-repair/<slug>` (12) + `fullPageTowns` → `/towns/<slug>` (5). URL абсолютные
от `business.siteUrl`, чистые (без `.html`), без `/api`, без не-isFullPage городов.
`priority`: главная 1.0, услуги/города 0.9, остальное 0.7.

**`app/robots.ts`** — default export `robots(): MetadataRoute.Robots`.
`rules: {userAgent:"*", allow:"/", disallow:"/api/"}`, `sitemap: <business.siteUrl>/sitemap.xml`.

### Таск 04 — заявка: lib/book + /api/book + BookForm (прототип)

`zod@4.5.4` добавлен в deps. Команды прежние; `npx tsc --noEmit`, `npm run build`,
`npm test` — зелёные (**22 passed**, было 14; +7 на шов 1, +1 ревью: битый JSON → 400).

**`lib/book/options.ts`** — единственная точка импорта списков опций формы, реэкспорт:
`applianceFormOptions` (из `data/services`, 17) и `contactAsOptions` (из `data/b2b-segments`, 5).
`schema.ts` и `BookForm.tsx` берут опции ТОЛЬКО отсюда — литералы не дублируются.

**`lib/book/schema.ts`** — `export const leadSchema` (zod object) + `export type LeadParsed = z.infer<...>`.
Поля: `name` trim+non-empty, `phone` trim+non-empty + нормализация пробелов (`\s+`→` `, без
формата), `appliance` — один из `applianceFormOptions`, `contactAs` — один из `contactAsOptions`,
`message` — `string` optional. Сообщения об ошибках — англ., дружелюбные.

**`lib/book/sinks.ts`** — классы `ConsoleLeadSink` (`name:"console"`, `enabled:true`,
`console.info("[book] new lead", {...})`), `EmailLeadSink` (`name:"email"`, `enabled` =
`RESEND_API_KEY && BOOK_NOTIFY_EMAIL`, `send()` — no-op заглушка, `// TODO: подключить Resend`),
`WebhookLeadSink` (`name:"webhook"`, `enabled` = `BOOK_WEBHOOK_URL`, `send()` — `fetch(POST)`
в try/catch). `export const sinks: LeadSink[]` — по одному инстансу каждого (Email/Webhook по
умолчанию `enabled:false`). `send` — метод прототипа (шпионится через `vi.spyOn(Sink.prototype,"send")`).

**`lib/book/submit.ts`** — `export async function submitLead(input: unknown): Promise<LeadResult>`.
zod-ошибка → `{ok:false, errors}` (map первого issue на поле → сообщение, sinks НЕ трогаются);
успех → `Promise.allSettled` по `sinks.filter(s=>s.enabled)` → `{ok:true}` даже если sink бросил.

**`app/api/book/route.ts`** — `export const runtime = "nodejs"`;
`export async function POST(req: Request): Promise<NextResponse>` → `submitLead(await req.json())`
→ `NextResponse.json(result, {status: result.ok ? 200 : 400})`. Битый JSON → 400
`{ok:false, errors:{form}}`.

**`components/BookingProvider.tsx`** (`'use client'`) — `export function BookingProvider({children})`
+ `export function useBooking(): { appliance: string|null; setAppliance(a: string|null): void }`.
Контекст с дефолтным значением (не бросает вне провайдера). Таск 06 оборачивает секции главной;
`RepairCard` зовёт `setAppliance(name)` при клике на карточку с `href="#book"`.

**`components/BookForm.tsx`** (`'use client'`) — `export function BookForm()`, без пропсов.
DOM 1:1 из `#book .book-card`/`form#book-form` + НОВЫЙ `<select id="contact-as" name="contactAs">`
(«I'm contacting you as a…») ПЕРЕД `<textarea>` — ловится `.book-form select`, нового CSS нет.
Состояния `idle → submitting (кнопка disabled, «Sending…», повторный submit игнор) → success
(форма получает `.hidden`, показан `#book-thanks`) | fieldErrors (текст под полем, inline-стиль,
значения сохранены — инпуты uncontrolled, `required` на месте) | netError (`role="alert"`,
«Couldn't send your request — please call {business.phone}.»)`. Читает `appliance` из `useBooking()`,
пресетит `<select id="appliance">` через ref+effect.
Модель ошибок ответа: только ключи из `FIELD_ERROR_KEYS` (`name`/`phone`/`appliance`/`contactAs`)
идут в `fieldErrors` и рендерятся под полем; всё прочее из ответного `errors` (ключ `form`,
битый JSON, неожиданное поле) склеивается в строку `formError` и показывается тем же inline-стилем
`<span role="alert">` рядом с кнопкой (иначе форма-левел 400 не виден — находка ревью).

**Решения:** (1) netError-текст на английском (весь сайт англ.; в спеке рус. формулировка —
описание намерения), телефон из `data/business.phone`. (2) `contactAs` — с disabled-плейсхолдером
`<option value="">` + `required`, как у `appliance`; пустой → 400 `errors.contactAs`. (3) ошибки
полей — inline-стиль на `<span>`/`<div>` (globals.css заморожен, класса под ошибку нет);
мягкий красный `#ff9b9b`. (4) `useBooking` вне провайдера не бросает — дефолтный контекст.

### Таск 05 — общие presentational-компоненты (`components/ui/*`)

Все — именованные экспорты, server components, кроме `RepairCard` (`'use client'`).
Данные пропсами, разметка 1:1 с текущими `*.html`, ни одного нового CSS-класса
(кроме `.card-grid-4`, он уже в globals). `npx tsc --noEmit` и `npm run build` — зелёные.
`next/image` везде вместо `<img>`; размеры берутся из `image-dimensions.ts`
(`imageDims(src)`), кроме `PhotoPair` — там `fill` + `sizes` (`figure` уже
`position:relative` в globals).

**Хелперы (внутренние, не «компоненты»):**
- `rich-text.ts` — `richProps(value: ReactNode)` → `{dangerouslySetInnerHTML}` если
  `value` строка (доверенный HTML из `data/*`, напр. `hero.h1` с `<br><span>`), иначе
  `{children}`. Спредится на хост-элемент: `<h1 {...richProps(h1)} />`.
- `anchor.tsx` — `<Anchor href={string} …>`: `href` c `/` → `next/link` (каст `as Route`),
  иначе (`tel:`, `http`, `#hash`) → `<a>`. Прокидывает `className/style/onClick/…`.
- `ctas.tsx` — `<BookCallCtas />`: пара кнопок «Book Online — Save 10%» (`/#book`) +
  «Call {business.phone}» (`business.phoneHref`). Дефолт для `PageHero`/`CtaBand`.

**Компоненты:**
- `<PageHero breadcrumb={{label,href?}[]} h1={ReactNode} lede?={ReactNode}
  ctas?={ReactNode} style?={CSSProperties} />` — `.page-hero`. `h1`/`lede` через
  `richProps`. Дефолтные `ctas` = `<BookCallCtas/>`.
- `<CtaBand h2={ReactNode} body?={ReactNode} ctas?={ReactNode} />` — `.cta-band`.
- `<SectionHead tone="light"|"dark" eyebrow={ReactNode} h2={ReactNode} lede?={ReactNode}
  ratingBadge?={boolean} style?={CSSProperties} h2Style?={CSSProperties} />` —
  `.section-head.on-light|on-dark`. `ratingBadge` рендерит стандартный `.rating-badge`
  (`business.rating.value.toFixed(1)` / ★★★★★ / «Google reviews»).
- `<ChipRow items={(string | {label,href?})[]} tone?="light"|"dark" style?={CSSProperties} />`
  — `.chip-row` + `.chip`/`.chip.on-dark`; элемент с `href` → ссылка.
- `<BrandGrid brands={Brand[]} note?={{tag,text,cta}} />` — `.brand-grid` +
  `.brand-cell`/`.wide`; опц. `.brand-note` (cta-ссылка на `business.phoneHref`).
- `<RepairCard label href tag image? imageAlt? onSelect?={(label)=>void}
  style? bodyStyle? />` (`'use client'`) — `.repair-card`. `onSelect` → `onClick`
  до перехода по ссылке (пресет формы через `useBooking` на главной, таск 06); без
  `onSelect` — обычная ссылка, ок из server-компонента. `image` опущен → без `.thumb`
  (текстовые карточки `/towns`).
- `<RepairGrid items?={Omit<RepairCardProps,"onSelect">[]} children? style? />` —
  `.repair-grid`. Тонкий: либо список ссылок-карточек, либо свои карточки детьми.
- `<ReviewCard review={Review} />`, `<ReviewsGrid reviews={Review[]} />` —
  `.review-card` / `.reviews-grid`.
- `<ProblemCardGrid items={{num?,title,body}[]} variant="light"|"dark" columns?={3|4}
  style? />` — `.card-grid-3`/`-4` + `.problem-card`. `num` по умолчанию = индекс
  (`"01"`…). `dark` воспроизводит инлайн-стили текущего HTML 1:1 (карточка
  `background:var(--bg-dark-3);border-color:rgba(255,255,255,0.09)`, h3
  `color:var(--text-light)`, p `color:var(--text-light-60)`).
- `<AudienceCard item={WhoWeServeCard | ForBusinessSegment} children? />`,
  `<AudienceGrid items={AudienceItem[]} layout?="two-col"|"card-grid-4" children? />` —
  `.audience-card` (`.eyebrow`, h3, p, `ul` c `✓` только у сегмента) + сетка.
  Сегмент: `id`-якорь + `bullets`. Ссылка `linkLabel` рендерится всегда, когда задана
  (у обоих типов — задана), инлайн-стилем accent-подчёркивания, который уже есть в
  текущем HTML («See all brands →»).
- `<FaqAccordion items={{q,a}[]} style?={CSSProperties} />` — нативные
  `<details class="faq-item">`, первый `open`. `style` → обёртка `<div>` (сервисные
  страницы: `{maxWidth:760}`).
- `<Prose heading?={ReactNode} paragraphs?={ReactNode[]} children? style? />` —
  `.prose`; `paragraphs` через `richProps` (town-проза с `<strong>`).
- `<StatRow stats={{k,v}[]} style?={CSSProperties} />` — `.stat-row`.
- `<PhotoPair photos={{src,alt,caption,objectPosition?,figureStyle?}[]} style? />` —
  `.photo-pair`, `next/image fill`, `objectPosition` прокидывается в `img`.
- `<LocalPhoto src? alt? imgStyle? style? children? />` — `.local-photo`; `children`
  (iframe карты) вместо `next/image`, если задан.

### Таск 06 — главная страница `/`

`npx tsc --noEmit` и `npm run build` — зелёные; `/` = `○ (Static)` (SSG). Тестов нет
(страница из компонентов). `app/page.tsx` заменил заглушку.

**`app/page.tsx`** — server component. `export const metadata = pageMetadata({title,description,path:"/"})`
(title/description дословно из `index.html`; og наследуется от layout). Рендерит
`<JsonLd data={[businessJsonLd()]}/>` + `<SideRail/>` + `<BookingProvider>` вокруг 9 секций
в порядке тикета: `#home` → `#who-we-serve` → `#repair` → `#family` → `#reviews` →
`#trust-b2b` → `#brands` → `#business-cta` → `#book`.

**`components/home/*`** (все — именованные экспорты; server, кроме двух помеченных):
- `Hero` — `<Hero/>`, `#home` 1:1 из `index.html`. `hero-technician.webp` через
  `next/image fill priority sizes="100vw"` (класс `hero-photo`). `.lede` =
  `b2bSegments.homeHero.lede`, `.hero-meta small` = `homeHero.metaSmall`, текст-ссылка на
  `/for-business` (`homeHero.businessLink`) после `.hero-ctas` инлайн-стилем accent-underline
  (без нового класса). `<h1>` не тронут.
- `SideRail` (**`'use client'`**) — `<SideRail/>`. `.side-rail` с 6 фикс. пунктами
  (`#home…#book`); `IntersectionObserver` (`rootMargin:"-45% 0px -45% 0px"`) трекает только
  эти 6 секций (список зашит в `RAIL`), `#who-we-serve` исключён. Дефолтный active — `home`.
- `WhoWeServeGrid` — `<WhoWeServeGrid/>`, `#who-we-serve` (`.section .section-light`).
  `<SectionHead tone="light">` из `whoWeServeHead` + `<AudienceGrid layout="card-grid-4"
  items={whoWeServe}>`.
- `RepairSection` (**`'use client'`**) — `<RepairSection/>`, `#repair`. `<SectionHead>` (eyebrow
  `02 / What we repair`, h2 `We get to<br>the core problem.`), `<RepairGrid>` c 12 `<RepairCard>`
  из `services` (`href="#book"`, `onSelect={() => setAppliance(service.formLabel)}` через
  `useBooking()`) + 4 `<RepairCard>` из `commercialCategories` (`href` на `/for-business#…`,
  tag `Commercial · See services`, без `onSelect`). `.not-listed` 1:1.
- `FamilySection` — `<FamilySection/>`, `#family` 1:1 + доп. `<p>{familyBusinessSentence}</p>`
  в `.family-copy`. `.quote-card` + `<PhotoPair>` (kostia_reast / kostia-laundry, у второй
  `objectPosition:"30% 75%"`).
- `ReviewsSection` — `<ReviewsSection/>`, `#reviews`. `<SectionHead ratingBadge>` +
  `<ReviewsGrid reviews={reviews}>` (Tony Z. первым).
- `TrustBand` — `<TrustBand/>`, `#trust-b2b` (`.section .section-dark-2`). `.section-head.on-dark`
  с одним `<h2>{trustHeading}</h2>` (без eyebrow — нумерация 02…06 не тронута) +
  `<ChipRow tone="dark" items={trustChips}>`.
- `BrandsSection` — `<BrandsSection/>`, `#brands` (`.section .section-dark-2`). `.section-head`
  инлайн 1:1 (`marginBottom:50`, h2 `clamp(30px,3.2vw,44px)/-1.8px`, `.lede` `maxWidth:300` =
  `homeBrandsLede`), `<BrandGrid brands={homeBrands} note={brandNote.home}>`, ссылка
  «See all brands we service →» на `/brands`.
- `BusinessCtaBand` — `<BusinessCtaBand/>`, `<section id="business-cta">` вокруг
  `<CtaBand>` из `businessCta` (кнопки: `.btn.btn-accent`→`/for-business`,
  `.btn.btn-ghost-dark`→`tel:`).
- `BookSection` — `<BookSection/>`, `#book`. `.book-grid` c `.book-copy` 1:1 из `index.html`
  + `<BookForm/>` (таск 04).

**Оговорки:** (1) `#who-we-serve` = `.section-light`, но `.audience-card` в globals имеет
тёмный фон (`--bg-dark-3`) — тёмные карточки на светлой секции; это прямо предписано
spec story 23 + тикетом, CSS заморожен. (2) alt брендов на главной теперь из
`data/brands` («Hobart repair»), а не из `index.html` («Hobart appliance repair») —
следствие единого источника (таск 02), не регрессия этого таска.

### Таск 07 — страницы `/about` и `/brands`

Команды прежние; `npx tsc --noEmit` и `npm run build` — зелёные. Обе страницы —
`○ (Static)` / SSG. Тестов нет (вёрстка страниц не тестируется).

**`app/about/page.tsx`** — server-компонент, `export const metadata` через
`pageMetadata` (`title`/`description` дословно из `about.html <head>`,
`path:"/about"` → canonical `https://ekfix.us/about`). `<JsonLd data={breadcrumbJsonLd([
{name:"Home",url:"/"},{name:"Our Story",url:"/about"}])} />`. Разметка 1:1 с
`about.html`: `PageHero` (кастомные `ctas` — «Book a Repair» + «Call …», не дефолтная
пара) → `<section class="section section-light">` c `.two-col` (`Prose` heading
«Meet Konstantin» + 3 абзаца + `StatRow` детьми / `LocalPhoto`
`konstantin_thermador.webp`) → `<section class="section section-dark">` (`SectionHead`
tone="dark" + `ProblemCardGrid` variant="dark" 3 карточки) → `<section class="section
section-light">` (`SectionHead` tone="light" `style={{marginBottom:30}}` + `PhotoPair`
`style={{marginTop:0}}`, обе `figure` `height:280`) → `CtaBand` (дефолтные ctas).
**Редакторская копия страницы (3 абзаца + карточки + заголовки) захардкожена в
файле** — модуля `data/about` нет, зона таска запрещает `data/`, тикет прямо
предписывает передавать эти тексты пропсами. NAP по-прежнему только из
`data/business` (через компоненты).

**`app/brands/page.tsx`** — server-компонент, `export const metadata` через
`pageMetadata` из `data/brands.brandsPage.title`/`.metaDescription`, `path:"/brands"`.
`<JsonLd data={breadcrumbJsonLd([{name:"Home",url:"/"},{name:"Brands",url:"/brands"}])} />`.
Вся копия — из `data/brands`: `brandsPage` (hero/секции/dontSeeYourBrand/ctaBand),
`residentialBrands` (22) и `commercialBrands` (11) — **в порядке `brands.html`**
(фильтр по tier сохраняет исходный порядок массива `brands`, НЕ commercial-first),
`brandNote.brandsPage` — строка `.brand-note` под коммерческой сеткой. Структура 1:1:
`PageHero` (дефолтные ctas) → `<section class="section section-light">` (`SectionHead`
tone="light" + `BrandGrid residentialBrands`) → `<section class="section
section-dark-2">` (`SectionHead` tone="dark" c `lede` и `h2Style={{fontSize:"clamp(30px,
3.2vw, 44px)",letterSpacing:"-1.8px"}}` + `BrandGrid commercialBrands note={brandNote.brandsPage}`)
→ `<section class="section section-light">` (`Prose` dontSeeYourBrand) → `CtaBand`.

Обе страницы — фрагмент секций без `<main>` (layout вставляет `{children}` прямо в
`<body>`, как в исходном HTML). Обёртки `<section class="section section-*">` рендерит
страница; `PageHero`/`CtaBand` несут свои обёртки сами.

**Расхождение (минор):** `brands.html` даёт коммерческому `.lede` инлайн
`style="max-width:320px"`; `SectionHead` (таск 05) не принимает `ledeStyle`, поэтому
lede берёт дефолт globals.css `.section-head .lede { max-width: 330px }` — разница
10px. Правка невозможна в зоне таска (`components/` заморожен). Чинится добавлением
`ledeStyle?: CSSProperties` в `SectionHead`.

### Таск 08 — страница `/for-business` (расширение B2B-хаба)

Команды прежние; `npx tsc --noEmit` и `npm run build` — зелёные. `/for-business` —
`○ (Static)`, SSG. Тестов в таске нет.

**`app/for-business/page.tsx`** — server-компонент. `export const metadata` через
`pageMetadata` (`lib/seo`): `title` расширен «…for Property Managers, Restaurants &
Hotels» (b2b §9), `description` — с упоминанием отелей и standing contracts, `path:
"/for-business"` → canonical `https://ekfix.us/for-business`. Один `<JsonLd
data={[breadcrumbJsonLd([Home→For Business]), faqJsonLd(businessFaqs)]} />` в начале
фрагмента (НЕ дублируется рядом с FAQ — иначе два `FAQPage` блока). Структура —
фрагмент секций без `<main>`:
`PageHero` (breadcrumb Home/For Business, h1 «Commercial appliance<br>repair,
<span>done right.</span>», lede = ДОСЛОВНЫЙ первый абзац `for-business.html` +
`forBusinessHeroLedeExtra`, `ctas` переопределены на «Request a Quote» / «Call …»
как в `for-business.html`) →
`<section class="section section-dark">` (`AudienceGrid layout="card-grid-4"` из
`forBusinessSegments`; якоря `#property-management`/`#horeca`/`#hotels`/`#hoa`
рендерит `AudienceCard` на самих `.audience-card`) →
`<section class="section section-light" id="laundry">` (`.two-col` + `Prose`
[ДОСЛОВНЫЙ абзац `for-business.html`] + caption-`<p>` «Across {типы}, these are the
equipment brands we service:» (типы = `laundryObjectTypes.types`, lowercased/joined)
+ `ChipRow` `laundryObjectTypes.brandChips` `style={{marginTop:12}}` + `LocalPhoto`
`kostia-laundry.webp`) →
`<ProcessSteps items={processSteps} />` →
`<section class="section section-dark-2">` (`SectionHead` tone="dark"
`style={{marginBottom:30}}` `h2Style={{fontSize:"clamp(30px, 3.2vw, 44px)",
letterSpacing:"-1.8px"}}` + `ProblemCardGrid items={whyCallUs}` variant="dark"
columns={3} — 5 карточек) →
`<ServiceFormats items={serviceFormats} />` →
`<section class="section section-light" id="faq-business">` (`SectionHead`
tone="light" eyebrow «FAQ» + `FaqAccordion items={businessFaqs}
style={{maxWidth:760}}`) →
`<CtaBand>` (h2 «Let's talk about<br>your properties.» ДОСЛОВНО, body усилен
упоминанием форматов без цифр, `ctas` = «Request a Quote» / «Call …»).

**`components/for-business/ProcessSteps.tsx`** — `export function ProcessSteps({
items }: { items: ProblemItem[] })`. `<section class="section section-light"
id="process">` + `SectionHead` tone="light" (eyebrow «How we work», h2 «From the
first call<br>to a photo report.») + `ProblemCardGrid variant="light" columns={4}`.

**`components/for-business/ServiceFormats.tsx`** — `export function ServiceFormats({
items }: { items: string[] })`. `<section class="section section-dark" id="formats">`
+ `SectionHead` tone="dark" (eyebrow «Service formats», h2 «Ways to work<br>with
us.») + `ChipRow tone="dark"`.

**Решения:**
1. **Внутрикарточные ссылки сегментов сняты** (`linkLabel: ""` при маппинге перед
   `AudienceGrid`). b2b §8 их не требует; `for-business.html` ссылок в
   `.audience-card` не имеет; `href` в данных (`/for-business#horeca` и т.п.) —
   само-ссылка на текущую страницу, клик прокручивал бы к себе же. `data/` не тронут.
2. **Якорь сегмента = id на `.audience-card`** (ставит `AudienceCard`), а не на
   `<section>`: `card-grid-4` кладёт 4 карточки в одну секцию, 4 id на секцию
   невозможны. Все 5 якорей с главной резолвятся (`#laundry` — на секции).
3. **HOA-оговорка**: `data` несёт только `placeholder: true` без видимого текста —
   страница дописывает `[TODO: подтвердить у владельца — реально ли обслуживается
   вертикаль HOA / кондо-ассоциаций.]` в конец `text` карточки (по `segment.placeholder`).
4. **База hero-lede и первый абзац прачечной** захардкожены в `page.tsx` (ДОСЛОВНО
   из `for-business.html`) — в `data/b2b-segments` их нет (таск 02 вынес только
   `forBusinessHeroLedeExtra` и `laundryObjectTypes`), зона таска запрещает `data/`.
5. Заголовки/eyebrow новых секций `#process`/`#formats` и body финального `CtaBand` —
   редакторская микрокопия по месту (spec §Метаданные «craft, по месту»); без
   числовых характеристик; не совпадает с `/`.

**`#laundry` (после ревью):** `laundryObjectTypes.paragraph` НЕ рендерится — он
дублировал мысль перенесённого абзаца (та же фраза, тот же список, тот же контраст
«on-premise vs individual unit»). Вместо него — короткий caption-`<p>` из
`laundryObjectTypes.types`, который явно связывает типы объектов со списком
брендов-чипов (b2b §8 блок 3). Поле `laundryObjectTypes.paragraph` в
`data/b2b-segments.ts` теперь не используется нигде — можно удалить (вне зоны 08).

### Таск 09 — `/appliance-repair/[slug]` (12 страниц техники)

Команды прежние; `npx tsc --noEmit` и `npm run build` — зелёные. Все 12 роутов —
`● (SSG)` (`generateStaticParams`). Тестов в таске нет.

**`app/appliance-repair/[slug]/page.tsx`** — ОДИН динамический server-роут для всех 12.
- `export const dynamicParams = false` — любой slug вне `serviceSlugs` → 404 (проверено
  рантаймом: `/appliance-repair/toaster` и `/oven` → 404, `/refrigerator` → 200).
- `export function generateStaticParams()` → `serviceSlugs.map((slug) => ({ slug }))` (ровно 12).
- `export async function generateMetadata({ params })` — `params: Promise<{slug}>`;
  `await params` → `getService(slug)` → `notFound()` если нет → `pageMetadata({ title:
  service.title, description: service.metaDescription, path: "/appliance-repair/<slug>" })`.
  Canonical теперь чистый (`…/appliance-repair/refrigerator`, без `.html`).
- Компонент: `await params` → `const service = getService(slug); if (!service) notFound();`
- Разметка 1:1 с `appliance-repair/*.html` (эталон — `refrigerator.html`; структура
  `washer.html` для 11 с «Also repair»): `<JsonLd data={[serviceJsonLd(service),
  faqJsonLd(service.faqs), breadcrumbJsonLd([Home→/, We Repair→/#repair,
  «<name> Repair»→/appliance-repair/<slug>])]} />` (все 3 блока на каждой странице;
  `Service.provider.name === "EK Global"`) → `PageHero` (breadcrumb те же 3 крошки,
  `h1={service.hero.h1}`, `lede={service.hero.lede}`, дефолтные `BookCallCtas`) →
  `section-light` «Common problems» (`SectionHead` eyebrow «Common problems we fix» +
  h2 из `SECTION_H2[slug].problems` + `.lede` «Every diagnostic includes…» +
  `ProblemCardGrid items={service.problems} variant="light" columns={3}` — `.num`
  «01»…«06» авто) → `section-dark` «Brands» (`SectionHead` h2 «Standard to premium.»
  `h2Style` clamp + `ChipRow tone="dark" items={service.brands}` + `<p style={{marginTop:24}}>`
  с инлайн-`<Anchor href="/brands">` «See every brand we service →») → `section-light`
  «FAQ» (`SectionHead` eyebrow «FAQ» + h2 `SECTION_H2[slug].faq` + `FaqAccordion
  items={service.faqs} style={{maxWidth:760}}` — первый `open`) → `section-dark-2`
  «Where we work» (`SectionHead` h2 «Charlotte &amp; nearby towns.» `style={{marginBottom:30}}`
  + `ChipRow tone="dark"` из `service.whereWeWork` → `{label:name, href}`) → «Also repair»
  **только `service.alsoRepair.length > 0`** (`section-light`, `SectionHead` h2 «Other
  appliances.» + `ChipRow` (tone light) из `alsoRepair` → `href="/appliance-repair/<slug>"`)
  → `CtaBand h2="Ready when you are." body="$75 diagnostic — waived completely once you
  book the repair."` (дефолтные ctas). refrigerator рендерится БЕЗ «Also repair»
  (`alsoRepair: []`), остальные 11 — с ней.

**Решение:** два h2 («Six <X> faults<br>we see most often.» и «<Name> repair,<br>answered
honestly.») меняются по прибору и в `data/services` отсутствуют (зона таска запрещает
`data/`). Захардкожены в `page.tsx` как `SECTION_H2: Record<slug, {problems, faq}>` —
дословная транскрипция из 12 `*.html`, keyed by slug для тривиального diff. `stove`
единственный нерегулярный: «Six stove &amp; oven faults», не «Six stove faults».
Остальные заголовки/eyebrow'ы идентичны во всех 12 файлах и заданы литералами по месту.

### Таск 10 — страницы `/towns` и `/towns/[slug]` (индекс + 5 городов)

Команды прежние; `npx tsc --noEmit` и `npm run build` — зелёные. `/towns` — `○ (Static)`,
`/towns/[slug]` — 5 `● (SSG)` (charlotte, rock-hill, fort-mill, matthews, indian-trail).
Тестов в таске нет.

**`app/towns/page.tsx`** — server-компонент. `export const metadata` = `pageMetadata({
title: townsIndex.title, description: townsIndex.metaDescription, path: "/towns" })`.
`<JsonLd data={breadcrumbJsonLd([Home→/, Service Area→/towns])} />` (как на `/about`,
`/brands`). Разметка 1:1 с `towns/index.html`:
`PageHero` (breadcrumb `Home`(→/) / `Service Area` — БЕЗ ссылки; `h1={townsIndex.heroH1}`
«Charlotte, NC<br><span>&amp; …</span>»; `lede={townsIndex.heroLede}`; дефолтные ctas) →
`section-light` (`SectionHead` eyebrow «Full local pages» + `h2={townsIndex.activeHead.h2}`
+ `lede={townsIndex.activeHead.lede}` + `RepairGrid style={{gridTemplateColumns:"repeat(
auto-fit, minmax(220px, 1fr))"}}` `items` из `fullPageTowns` → `{label:"<name>, <ST>",
href:"/towns/<slug>", tag:"Full local page", style:{minHeight:"auto"}, bodyStyle:{padding:
22, marginTop:0}}`) → `section-dark` (`SectionHead` eyebrow «Also serving — North Carolina»
+ h2 `townsIndex.alsoServingNCLabel` «We also cover:» + `h2Style` clamp(28px,3vw,40px)/-1.6px
+ `<p style={{maxWidth:820,fontSize:16,lineHeight:1.8,color:"var(--text-light-60)"}}>` =
`${alsoServedNC.join(", ")}, and the towns between them.`) → `section-light` (то же для SC:
eyebrow «Also serving — South Carolina», h2 `alsoServingSCLabel` «Just across the state
line:», `<p>` `color:"var(--text-dark-60)"`, `alsoServedSC`) → `CtaBand h2="Not sure if
you're<br>in range?" body="Just call — we'll tell you straight away."`.

**`app/towns/[slug]/page.tsx`** — ОДИН динамический server-роут для 5 городов.
- `export const dynamicParams = false` — любой slug вне `townSlugs` → 404 (проверено:
  `/towns/waxhaw` не сгенерён, нет в `generateStaticParams`).
- `export function generateStaticParams()` → `townSlugs.map((slug) => ({ slug }))` (ровно 5).
- `generateMetadata` — `await params` → `getTown(slug)`; `if (!town || !town.isFullPage)
  notFound()` → `pageMetadata({ title: TOWN_SEO[slug].title, description: …, path:
  "/towns/<slug>" })`. Canonical чистый.
- Компонент: `const town = getTown(slug); if (!town || !town.isFullPage) notFound();`
  — двойная защита (R16); `getTown` ищет только среди `fullPageTowns`.
- `<JsonLd data={[businessJsonLd(), breadcrumbJsonLd([Home→/, Service Area→/towns,
  «<name>, <ST>»→/towns/<slug>])]} />`. `businessJsonLd()` даёт `name:"EK Global"` на
  ВСЕХ 5 (унифицировано — в старом HTML был суффикс «— <город>»; проверено рантаймом).
  `businessJsonLd()` не принимает аргументов → `areaServed` НЕ сужается до города
  (интерфейс `lib/jsonld` заморожен; критично только единое `name`).
- Разметка 1:1 из `towns/<slug>.html`. `charlotte` — особый (`isCharlotte = slug ===
  "charlotte"`, `town.hasMap`): PageHero (breadcrumb `Service Area` БЕЗ ссылки у charlotte,
  СО ссылкой `/towns` у остальных 4; `h1` всегда «Appliance repair<br><span>in <name>,
  <ST>.</span>»; `lede={town.hero.lede}`) → `section-light` `.two-col` (`Prose`
  heading «Local, not a dispatch center» + `paragraphs={town.prose}` (с `<strong>`) +
  дочерний `ChipRow items={town.districts} style={{marginTop:24}}` (light) / `LocalPhoto`
  src `charlotte.webp`+alt «Charlotte, NC skyline» у charlotte, `town.webp`+alt «<name>,
  <ST>» у остальных) → `section-dark` (`SectionHead` tone dark eyebrow «What we repair in
  <name>» + h2 «The full lineup.» + `h2Style` clamp(30px,3.2vw,44px)/-1.8px + `ChipRow
  tone="dark"`: **charlotte** — 11 чипов, `CHARLOTTE_REPAIR_CHIPS` (только Refrigerator →
  `/appliance-repair/refrigerator`, остальные → `/#repair`, «Stove / Range» одним чипом);
  **остальные 4** — 12 чипов `services.map(s => ({label:s.name, href:"/appliance-repair/"
  +s.slug}))`) → `section-light` (`SectionHead` tone light eyebrow «Charlotte customers»
  (charlotte) / «Local customers» (остальные) + h2 «What they say.» + `ratingBadge` +
  `ReviewsGrid reviews={reviewsByAuthors(town.reviewAuthors)}`) → **если `town.hasMap`**
  (только charlotte): `section-dark-2` (`SectionHead` eyebrow «Find us» + h2 «Charlotte,
  NC.» + `style={{marginBottom:24}}` + clamp + `LocalPhoto style={{borderColor:"rgba(255,
  255,255,0.09)"}}` с `<iframe title="Charlotte, NC map" src="https://www.google.com/maps
  ?q=Charlotte,NC&output=embed" width="100%" height="360" style={{border:0,display:"block"}}
  loading="lazy" referrerPolicy="no-referrer-when-downgrade">`) + `section-light` (`Prose`
  heading «Also serving nearby» + `paragraphs={[town.nearbyProse]}`) — **иначе** (4 города):
  `section-dark-2` (`SectionHead` eyebrow «Nearby» + h2 «Also serving.» + `style={{
  marginBottom:24}}` + clamp + `ChipRow tone="dark" items={town.nearby}`) → `CtaBand
  h2="Same-day repair,<br>right here in <name>." body="$75 diagnostic, waived if you book
  the repair."` (дефолтные ctas).

**Решения:**
1. `TOWN_SEO: Record<slug, {title, description}>` захардкожен в `page.tsx` — `data/towns`
   не несёт per-town `title`/`metaDescription` (только `townsIndex` для индекса), зона
   таска запрещает `data/`. Дословная транскрипция из 5 `*.html`; 4 не-charlotte делят
   один шаблон описания, у charlotte — уникальное (районы Ballantyne/Dilworth/…).
2. `CHARLOTTE_REPAIR_CHIPS` захардкожен: charlotte.html отличается от остальных 4
   (11 чипов vs 12, `/#repair` vs `/appliance-repair/<slug>`, «Stove / Range» слитно) —
   это реальное расхождение оригиналов, сохранено 1:1. h1 у всех 5 с состоянием
   («in <name>, <ST>.») — как в HTML, хотя тикет писал «in <name>.».
3. Breadcrumb «Service Area» без ссылки у charlotte, со ссылкой у 4 остальных — quirk
   `charlotte.html`, сохранён (`isCharlotte`).
4. `/towns` индекс получил `breadcrumbJsonLd` (в оригинале JSON-LD не было) — для
   консистентности с `/about` и `/brands`; невидимо, 1:1 визуала не нарушает.
