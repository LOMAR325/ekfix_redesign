# 04 — Бытовой хаб /appliance-repair и страницы услуг с географией

**Требования:** R44, R68, R69, R70 (рендер), R20 (serviceNode areaServed по H1), R03, R04
**Blocked by:** 01, 02
**Зона:** `app/appliance-repair/**` (новый `page.tsx` + `[slug]`) · `data/services.ts` · `components/services/**` (если нужны)
**Волна:** 3
**Status:** ready

## Что должно заработать

Домовладелец открывает `/appliance-repair` и видит все 12 бытовых услуг в привычном
дизайне карточек. Каждая страница услуги говорит, что и где: H1, `<title>` и description
с Charlotte и South Charlotte. Там, где у техники есть своя местная конкретика, есть
короткий блок про Ballantyne; у остальных — ссылки на опубликованные районы.

## Из брифа, дословно

> «2.3 Бытовой хаб /appliance-repair — индекс 12 бытовых услуг (сейчас есть только страницы услуг, индекса нет), в том же дизайне.»
> «3.5 Страницы бытовых услуг: H1 в том же стиле, но с географией, например «Refrigerator repair<br><span>in Charlotte & South Charlotte.</span>»; title и description — аналогично. Локальный блок про Ballantyne — только если у этого вида техники есть своя местная конкретика. Двенадцать одинаковых абзацев с подставленным названием техники запрещены; без конкретики достаточно ссылок на страницы Ballantyne и South Charlotte.»

## Разделы спецификации

Истории 19, 41, 62–64; Решения §2 (`SECTION_H2` → данные), §7 (ссылка «Homeowners» — в таске 08).

## Что сделать

1. `data/services.ts`: копия бытового хаба (hero, лид, заголовок сетки); у каждой услуги — `hero.h1` с географией, `title`, `metaDescription` по образцу брифа; перенести `SECTION_H2` из страницы в данные; `ballantyneNote?: Publishable & { heading, body }` — только у услуг с опубликованной местной конкретикой (наблюдение про встраиваемые/panel-ready Sub-Zero/Thermador/Bosch/KitchenAid в новой застройке: ожидаемо refrigerator и dishwasher; решить честно по тексту наблюдения), тексты разные. Блок `published`, если факт опубликован; ссылки на Ballantyne работают, только когда Ballantyne опубликован (это решает `lib/links`).
2. `app/appliance-repair/page.tsx` — `PageHero` + `RepairGrid` из 12 `RepairCard` (ссылки на `/appliance-repair/[slug]`, без `onSelect`) + `CtaBand` (бытовая CTA «Book Online — Save 10%» допустима здесь); крошки Home › Home Appliance Repair; JSON-LD: бизнес + крошки.
3. `app/appliance-repair/[slug]`: H1/meta из данных; блок `ballantyneNote` (если опубликован) + `ChipRow` из `lib/links.areaLinksForService(slug)`; `serviceNode.areaServed` = зоны из H1 (Charlotte, South Charlotte); крошки Home › Home Appliance Repair › услуга (раньше «Appliance Repair» вели куда? — средний уровень теперь `/appliance-repair`).
4. Проверить на 1440/390: H1 новых страниц без переполнения и горизонтального скролла.

## Критерии приёмки

- [ ] `/appliance-repair` в prod: 12 карточек, тот же вид, что `#repair` на главной; есть в `publishedPaths()`
- [ ] 12 H1 в стиле «<Appliance> repair<br><span>in Charlotte & South Charlotte.</span>» (или короче, если не влезает); `<title>`/description называют услугу и зону
- [ ] Ballantyne-блок — только у услуг с опубликованной конкретикой; тексты попарно разные (не шаблон с подставленным названием)
- [ ] `Service.areaServed` совпадает с зонами из H1; `provider` → `@id` бизнеса
- [ ] в `app/appliance-repair/**` нет захардкоженной копии
- [ ] `npm test`, `npx tsc --noEmit`, `npm run build` — зелёные
