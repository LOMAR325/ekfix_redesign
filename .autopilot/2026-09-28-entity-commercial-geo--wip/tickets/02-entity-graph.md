# 02 — Единая сущность: Constantin, боевой домен, граф JSON-LD на всех страницах

**Требования:** R11, R12, R13, R14, R15, R16, R17, R18, R19, R20, R21, R22, R23, R27i
**Blocked by:** 01
**Зона:** `lib/jsonld.ts` + тест · `components/JsonLd.tsx` · `lib/breadcrumb.ts` · `data/people.ts` · `data/business.ts` · тексты с «Konstantin» во всех `data/*` и `components/*` · строки `<JsonLd …>` во всех существующих `app/**/page.tsx`
**Волна:** 2
**Status:** ready

## Что должно заработать

Поисковик на любой странице видит один граф: бизнес с одним `@id` от `https://ekfix.us`,
сайт, который на него ссылается, владельца Constantin (полностью — на `/about`), услуги с
`provider` → бизнес. Владелец везде называется Constantin. Домен больше не заглушка.

## Из брифа, дословно

> «1.1 Имя владельца — по факту 1 во всём сайте: тексты, alt, JSON-LD, метаданные. Сейчас на сайте «Konstantin», а в отзывах и в TikTok (constantin_ekfix) — «Constantin». Цитаты отзывов не править.»
> «Фамилию не публиковать.»
> «1.3 Граф JSON-LD со стабильными @id, построенными от data/business.siteUrl … Разметка описывает только то, что видно на странице.»
> «sameAs — из соцсетей, уже указанных на сайте.»
> «На ekfix.us сейчас работает старая версия сайта … новый сайт её заменит.»

## Разделы спецификации

Истории 9–22; Решения §4; шов 3 и инварианты (Konstantin) шва 6.

## Что сделать

1. `data/people.ts` — `owner`: `name: "Constantin"`, `role: "Owner & Lead Technician"`, `yearsExperience` («10+», опубликовано), `credentials` (EPA Section 608 Universal — «EPA Universal»; OSHA — без курса), `basedIn: "Ballantyne"`, фото (пути существующих файлов + alt с Constantin). Блоки `/about` здесь не нужны — их добавит таск 06.
2. Все «Konstantin» → из `owner.name` (в `data/*` — `${owner.name}` или отдельная строка с Constantin; в компонентах — из данных). Отзывы (`text`) не трогать. Alt фото, `<title>`/description `/about` — с Constantin. Имена файлов фото не менять.
3. `data/business.ts`: `siteUrl` без TODO-комментария (боевой домен); удалить `legalName` (и из типа).
4. `lib/jsonld.ts` — API из spec §4 (`ids`, `graph`, `businessNode(opts)`, `websiteNode`, `ownerNode`, `serviceNode`, `articleNode`, `faqNode`, `breadcrumbNode`); `priceRange` убрать; `aggregateRatingJsonLd` — внутрь опции `aggregateRating`. `articleNode` бросает, если `!reviewedByOwner`. `lib/breadcrumb.breadcrumbTrail` возвращает узел для `graph`. `components/JsonLd.tsx` — один `<script>` с `@graph`, эскейп `< > &` сохранить.
5. Перевести все существующие страницы на `graph(...)`: `/` (`businessNode({aggregateRating:true, areaServed:<пока пусто — список появится в таске 08>})` + `websiteNode()`), `/about` (+`ownerNode()`), `/brands`, `/towns` (`areaServed: business.areaServed` — список виден на странице), `/towns/[slug]` (бизнес + крошки; `areaServed` = своя зона), `/appliance-repair/[slug]` (+`serviceNode` с `areaServed` = зона из H1; пока H1 без географии — Charlotte), `/for-business` (+`knowsAbout`, FAQ). Узел бизнеса — на каждой странице с базовыми полями (spec история 17).
6. `lib/jsonld.test.ts` — шов 3 полностью; `data/people.test.ts` — нет «Konstantin» нигде в `data/*`, кроме `reviews[].text`.

## Критерии приёмки

- [ ] `grep -rn "Konstantin" app components data lib` — только внутри `reviews[].text` (там его и нет — отзыв Tony Z. уже «Constantin»); ноль
- [ ] каждая страница `npm run build` отдаёт ровно один `application/ld+json` с `@graph`; `@id` бизнеса одинаковый на всех; `WebSite` только на `/`; `Person` полностью только на `/about`, `name === "Constantin"`, фамилии нет
- [ ] `Service.provider` → `{ "@id": "https://ekfix.us/#business" }` на всех 12 страницах услуг
- [ ] `priceRange` нигде нет; `aggregateRating` только на `/`; `areaServed` только там, где список виден (`/towns`, страницы городов)
- [ ] `siteUrl` без TODO, `legalName` удалён
- [ ] тест шва 3 зелёный; `npm test`, `npx tsc --noEmit`, `npm run build` — зелёные
