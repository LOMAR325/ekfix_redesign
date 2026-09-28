# 03 — Коммерческий раздел: хаб на новом пути, 7 дочерних страниц, форма с бизнес-пресетом

**Требования:** R29, R31 (ссылки в своей зоне), R33, R34, R35, R36, R37, R38, R39, R40, R41, R42, R43, R56, R56.1, R56.2, R57, R70 (рендер), R93, R03, R04, R91
**Blocked by:** 01, 02
**Зона:** `app/commercial-appliance-repair/**` · `app/for-business/**` (удалить) · `data/commercial.ts` · `data/b2b-segments.ts` · `components/for-business/**` → `components/commercial/**` · `components/BookingProvider.tsx` · `components/BookForm.tsx` · `data/commercial.test.ts`
**Волна:** 3
**Status:** ready

## Что должно заработать

Бизнес-клиент открывает `/commercial-appliance-repair` и видит весь прежний контент
`/for-business`. Из хаба он переходит на страницу своего оборудования или отрасли. На ней
реальные бренды и оборудование, цена поломки для бизнеса, как устроен вызов, FAQ и
отзыв, если есть. Коммерческая кнопка «Request Service or a Quote» открывает форму, где
«I'm contacting you as a…» уже выбран. Страница, которая не прошла тест на шаблонность,
остаётся черновиком.

## Из брифа, дословно

> «2.1 Переименуй /for-business в /commercial-appliance-repair … Весь текущий контент страницы сохраняется — она становится хабом раздела.»
> «2.2 … Каждая — самостоятельная и неповторяющаяся: оборудование: типы и бренды — только из факта 6 и data/brands.ts; типичные неисправности и их цена для бизнеса (простой смены, порча продуктов, жалобы жильцов); как устроен вызов для бизнеса (факт 7) и форматы сотрудничества; FAQ в формулировках реальных вопросов; коммерческие отзывы, если есть; ссылки на районы и связанные статьи. Нет подтверждённых фактов об оборудовании — страница остаётся черновиком. Отели остаются разделом хаба»
> «2.7 Заявка: CTA коммерческого пути открывает ту же форму с предвыбранным бизнес-вариантом в поле «I'm contacting you as a…» (добавь в BookingProvider установку contactAs по аналогии с setAppliance). Подпись коммерческой CTA — про запрос на обслуживание или смету, а не «Save 10%».»
> Дополнение 2026-09-28: «Как с Ballantyne» — все 7 собираются из опубликованного, прошедшие тест на шаблонность публикуются, остальные — черновики.

## Разделы спецификации

Истории 28, 30 (в своей зоне), 32–40, 51–53; Решения §6, §9, §10; Открытые места (факты 6, 7).

## Что сделать

1. Перенести `app/for-business` → `app/commercial-appliance-repair/page.tsx` (хаб), контент 1:1, все якоря; копия страницы — из `data/b2b-segments.ts` (hero/лид/заголовки — туда же, если ещё в компоненте); `components/for-business/*` → `components/commercial/*`. Внутренние ссылки `/for-business…` в `data/b2b-segments.ts` → новый путь. Редиректы **не** в этом таске (таск 09).
2. Наполнить `data/commercial.ts` (7 страниц) по spec §6 и историям 32–39. Источники: текст сегментов/laundry/процесса/FAQ хаба, `data/brands.ts` (`tier:"commercial"`), `laundryObjectTypes.brandChips`, `commercialCategories`, отзыв Tony Z., фото `kostia_reast.webp` (ресторан) и `kostia-laundry.webp` (прачечная на крыше). Industry-страницы — своими словами, не копией сегмента. Неисправности и цена для бизнеса — технически, без цифр. Блоки под факты 6/7 — `draft`.
3. `app/commercial-appliance-repair/[slug]/page.tsx` из существующих `ui/*`: `PageHero` (крошки Home › Commercial Appliance Repair › страница) → оборудование и бренды (`ChipRow`/`BrandGrid`) → неисправности (`ProblemCardGrid`) → как устроен вызов (ссылка на хаб `#process`/`#formats` + опубликованный блок) → FAQ (`FaqAccordion`) → отзывы (`ReviewsGrid`, если есть) → районы и статьи (`ChipRow` из `lib/links.linksForCommercial`) → `CtaBand`. `generateStaticParams` по `routable`, `dynamicParams=false`, guard `notFound()`, `DraftBanner`. JSON-LD: бизнес + `serviceNode` + FAQ (только опубликованные пункты) + крошки.
4. Хаб: блок «Commercial services» со ссылками на опубликованные дочерние (из данных; черновики не показываются).
5. `BookingProvider`: `contactAs`, `setContactAs`; на монтировании читает `as` и `appliance` из `window.location.search`, принимает только значения из `contactAsOptions`/`applianceFormOptions`. `BookForm` пресетит `contactAs` так же, как `appliance`. Коммерческие CTA (хаб, дочерние) — `href` вида `/?as=<опция>#book` (+`&appliance=<formLabel>` на оборудовании), подпись «Request Service or a Quote» (в данных). Отрасль → опция по истории 52.
6. Тест на шаблонность: `npm run dev`, `npm run check:similarity -- --group commercial`. `status: "published"` только у страниц с максимумом ≤ 0.30 и без выдуманного; матрица и итог — в CONCERNS.

## Критерии приёмки

- [ ] `/commercial-appliance-repair` в prod-сборке — прежний контент `/for-business` целиком (все секции и якоря), HOA не виден
- [ ] 7 записей в `data/commercial.ts`; у каждой свои H1/лид/оборудование/неисправности/FAQ; `brandNames` ⊂ бренды сайта (инвариант в `data/commercial.test.ts`)
- [ ] опубликованы только страницы с максимумом сходства ≤ 0.30; черновики → 404 в prod, видны в dev с плашкой; матрица приложена
- [ ] Tony Z. — на commercial-dishwasher и restaurant (если опубликованы)
- [ ] переход по коммерческой CTA открывает `/#book` с выбранным «I'm contacting you as a…» (и appliance на странице оборудования); неизвестный `?as=` игнорируется; форма отправляется как раньше (тесты `lib/book` зелёные)
- [ ] ни одного «Save 10%» на коммерческих страницах; `grep -rn "for-business" app components data` вне `lib/redirects` — только пути, которые чинит таск 09 (Header/Footer/nav), перечислить в CONCERNS
- [ ] `npm test`, `npx tsc --noEmit`, `npm run build` — зелёные
