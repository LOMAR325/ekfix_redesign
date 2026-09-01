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
