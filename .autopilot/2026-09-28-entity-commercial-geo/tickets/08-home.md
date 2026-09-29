# 08 — Главная: что и где в H1, два пути, коммерция первой, «Where we work»

**Требования:** R45, R46, R47, R48, R49, R50, R51, R52, R56 (CTA на главной), R70 (home → районы), R17 (areaServed главной), R03
**Blocked by:** 03, 04, 05
**Зона:** `app/page.tsx` · `components/home/**` · `data/b2b-segments.ts` (микрокопия главной: `homeHero`, `whoWeServe`, `businessCta`, …) · `data/home.ts` (если выносишь копию секций главной — новый файл, только для главной)
**Волна:** 4
**Status:** ready

## Что должно заработать

Посетитель с первого экрана понимает, что это ремонт коммерческой и бытовой техники в
Charlotte, и выбирает свой путь: «For Business» (основная кнопка) или «For Homes», рядом
телефон. Ниже коммерция идёт раньше бытовой: сегменты, коммерческое оборудование, потом
12 бытовых. Первым стоит отзыв бизнес-клиента. Блок «Where we work» ведёт в районы.

## Из брифа, дословно

> «2.4 Главная — два пути с первого экрана. В hero две главные кнопки: «For Business» → коммерческий хаб (акцентная, основная) и «For Homes» → бытовой хаб (вторичная), плюс телефон. Ниже порядок главной — коммерция первой: коммерческие сегменты и оборудование раньше бытовой сетки, коммерческие бренды раньше бытовых, отзыв бизнес-клиента первым.»
> «2.5 … Замени в том же двухстрочном стиле с акцентной второй строкой, например: «Commercial & home appliance repair<br><span>in Charlotte.</span>». Лид: бизнес-клиенты первыми, затем дома; явно Charlotte, South Charlotte, Ballantyne и 28277 (если подтверждён фактом 3). Слоган можно сохранить второстепенно. Если H1 не помещается в 3 строки на 1440px и в 4 на 390px — сокращай текст, CSS не трогай.»
> «главная → South Charlotte → Ballantyne → услуги»

## Разделы спецификации

Истории 42–47, 43a, 51–53 (для CTA главной); Решения §7, §9.

## Что сделать

1. Hero: H1 + лид + слоган (второстепенно, напр. `.eyebrow` над H1) из данных; 28277 не упоминать. Кнопки: «For Business» (`btn-accent`) → `/commercial-appliance-repair`, «For Homes» (`btn-ghost-dark`) → `/appliance-repair`; телефон — текстовая ссылка `tel:` существующим стилем hero. «Book Online — Save 10%» из hero убрать. `hero-meta`/`hero-trust`/`hero-owner-tag` — как есть (owner-tag с Constantin).
2. Порядок: hero → #who-we-serve (карточка «Homeowners» → `/appliance-repair`; коммерческие → `commercialCardHref`/опубликованные дочерние) → новая секция коммерческого оборудования (`SectionHead` + `RepairGrid` + `RepairCard` из `commercialCategories`, `href` = `lib/links.commercialCardHref`) → #trust-b2b → #repair (только 12 бытовых) → #family (+ блок «Where we work»: `ChipRow` из `lib/links.areaLinksForHome()`) → #reviews (`homeReviews()` — commercial первым) → #brands → #business-cta (коммерческая CTA: «Request Service or a Quote» → `setContactAs("Other Business")` + скролл к #book, подпись из данных) → #book. Соседние секции разного оттенка (правило CLAUDE.md).
3. JSON-LD главной: `businessNode({ aggregateRating: true, areaServed: <ровно список «Where we work»> })` + `websiteNode()`.
4. Вся копия главной — в данных.
5. Замер Playwright: высота H1 / computed line-height ≤ 3 на 1440×900 и ≤ 4 на 390×844; не влезает — сокращать текст. Скриншоты hero на обеих ширинах — в `.autopilot/2026-09-28-entity-commercial-geo--wip/qa/`.

## Критерии приёмки

- [ ] H1 называет услугу и Charlotte, вторая строка акцентная; строк ≤ 3 @1440 и ≤ 4 @390 (цифры в CONCERNS)
- [ ] первые две кнопки hero — «For Business» (accent) и «For Homes»; телефон в hero; «Save 10%» в hero нет
- [ ] коммерческое оборудование — раньше бытовой сетки; бренды commercial → premium → mass; первый отзыв — бизнес
- [ ] «Where we work» ведёт только на опубликованные районы/города; `areaServed` = ровно этот список
- [ ] business CTA открывает форму с выбранным бизнес-вариантом
- [ ] соседние секции разного оттенка; нет горизонтального скролла @390
- [ ] `npm test`, `npx tsc --noEmit`, `npm run build` — зелёные
