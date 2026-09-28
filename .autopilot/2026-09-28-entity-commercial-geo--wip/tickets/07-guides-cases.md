# 07 — Центр знаний, шаблон статьи и 6 черновиков; шаблон кейсов

**Требования:** R75, R76, R76.1, R77, R78, R80, R81, R82, R83, R84, R21 (использование), R70 (статьи/кейсы → услуга), R03, R91, R92
**Blocked by:** 01, 02
**Зона:** `app/appliance-repair-guide/**` · `data/guides.ts` · `app/repair-cases/**` · `data/cases.ts` · `components/guides/**`, `components/cases/**` (если нужны) · `data/guides.test.ts` · `data/cases.test.ts`
**Волна:** 3
**Status:** ready

## Что должно заработать

Центр знаний готов принимать статьи: хаб с 7 категориями и шаблон статьи с полями
брифа. Написаны 6 приоритетных статей: технически, по первичным источникам, у каждого
утверждения есть источник во внутреннем поле. Все они черновики до проверки владельцем,
поэтому в продакшене не видны (в `npm run dev` видны с плашкой DRAFT). Автором владелец
не указан. Шаблон кейсов тоже готов, но кейсов нет — значит, нет и роутов.

## Из брифа, дословно

> «4.2 Центр знаний /appliance-repair-guide с категориями: Refrigerator, Dishwasher, Washer, Dryer, Oven & Range, Ice Maker, Commercial. Шаблон статьи с полями: автор, техник, дата публикации, дата обновления, модель (если применимо), симптомы, диагностика, возможные причины, порядок ремонта, когда нужен мастер, ссылка на услугу EK Global.»
> «4.3 Черновики статей, в первую очередь: Refrigerator not cooling but freezer works; Samsung refrigerator ice maker problems; Bosch dishwasher E15 error; Dryer runs but doesn't heat; Oven won't heat; Range burner won't ignite. … Писать технически, не рекламно. Все статьи — черновики: публикуются только после технической проверки владельцем. Каждое утверждение о кодах ошибок и процедурах — с источником во внутреннем поле (на сайт не выводится). Не указывать владельца автором текста, который он не проверял.»
> «4.4 Кейсы /repair-cases/[slug]: шаблон — техника, модель, симптом, диагностика, вышедший компонент, ремонт, запчасти, результат, район, техник. Наполнение только из факта 10, без имён и адресов клиентов. Нет фактов — раздел не публикуется.»

## Разделы спецификации

Истории 20, 69–75; Решения §11.

## Что сделать

1. `data/guides.ts`: 6 статей по типу `GuideArticle` — «Refrigerator not cooling but freezer works» (refrigerator), «Samsung refrigerator ice maker problems» (refrigerator/ice-maker — выбери категорию по смыслу), «Bosch dishwasher E15 error» (dishwasher), «Dryer runs but doesn't heat» (dryer), «Oven won't heat» (oven-range), «Range burner won't ignite» (oven-range). Всем `status:"draft"`, `reviewedByOwner:false`, без `author`/дат. Исследование — первичные источники (сервисная документация и страницы поддержки производителей, технические руководства); каждое утверждение о коде ошибки/процедуре → запись `sources` (claim + url + title). Не можешь подтвердить — не пиши. Безличный текст, без «я/мы», без рекламы и превосходных степеней. Безопасность: где процедура требует работы с газом/высоким напряжением/хладагентом — прямо в «When to call a technician». `serviceSlug` — соответствующая услуга.
2. `app/appliance-repair-guide/page.tsx` — хаб (история 69: опубликованные статьи по категориям, пустая категория скрыта; при нуле опубликованных — сам хаб не маршрутизируется в prod, в dev показывает черновики с плашкой). `app/appliance-repair-guide/[slug]/page.tsx` — состав из истории 70b; `generateStaticParams` по `routable`, guard, `DraftBanner`; JSON-LD: бизнес + `articleNode` **только** для опубликованной (у черновика — без Article) + крошки. Ссылка на услугу — `lib/links.serviceLinkForArticle`.
3. `data/cases.ts` = `[]`; `app/repair-cases/[slug]/page.tsx` — шаблон по истории 75 (`PageHero` + поля + ссылка на услугу через `lib/links.serviceLinkForCase` + `CtaBand`), `generateStaticParams` по `routable`; сборка с пустым списком проходит.
4. Инварианты в `data/guides.test.ts` (статьи) и `data/cases.test.ts` (кейсы): опубликованная статья ⇒ `reviewedByOwner && author`; у каждой статьи ≥1 источник на каждый код ошибки, упомянутый в `title`; кейсы без полей клиента, `area` ∈ известных slug. Тест-фикстура с опубликованной проверенной статьёй проверяет, что `articleNode` отдаёт `author` → `@id` владельца.

## Критерии приёмки

- [ ] 6 статей в `data/guides.ts`, все `draft`, все поля шаблона заполнены (модель — где применимо), `sources` непусты, url — реальные страницы (проверь, что открываются)
- [ ] в prod: `/appliance-repair-guide` и все 6 статей → 404, нигде не упомянуты (sitemap, меню, ссылки, JSON-LD); в dev — открываются с плашкой
- [ ] текст: нет «I/we/our» от лица бизнеса в статьях, нет «best/#1/top»; `grep` по `data/guides.ts`
- [ ] `/repair-cases/*` — ни одного роута; сборка зелёная
- [ ] тесты инвариантов зелёные; `npm test`, `npx tsc --noEmit`, `npm run build` — зелёные
