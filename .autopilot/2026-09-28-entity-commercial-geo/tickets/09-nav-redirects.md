# 09 — Меню, подвал и все редиректы (старый ekfix.us, *.html, /for-business)

**Требования:** R24, R24.1, R25, R30, R31, R53, R54, R55, R87, R99
**Blocked by:** 03, 04, 05, 06, 07
**Зона:** `lib/nav.ts` + тест · `components/Header.tsx` · `components/Footer.tsx` · `data/site.ts` · `lib/redirects.ts` + тест · `next.config.ts`
**Волна:** 4
**Status:** ready

## Что должно заработать

Меню идёт в порядке приоритета: Commercial ⌄, Home Appliances ⌄, Service Area ⌄, Guides
(появится с первой статьёй), About, Reviews. Каждый адрес старого ekfix.us, старые `*.html`
и `/for-business` постоянным редиректом ведут на ближайшую живую страницу, без цепочек и
без свалки на главную.

## Из брифа, дословно

> «2.6 Навигация: «Commercial» первым пунктом (выпадающее меню: хаб и дочерние страницы), затем бытовой ремонт (решить и обосновать название пункта), Service Area, Guides (появляется с первой опубликованной статьёй), About, Reviews. Используй существующий компонент выпадающего меню.»
> «1.4 … добавь постоянный редирект каждого на ближайший по смыслу новый роут: город без своей страницы → /towns, услуга → соответствующая услуга и т.д. Не сваливай всё на главную.»
> «Все старые URL (zholudz *.html, /for-business, адреса старого ekfix.us) отдают постоянный редирект на живую страницу.»
> «Пункт меню Reviews ведёт на эту страницу.»

## Разделы спецификации

Истории 23–25, 29–30, 48–50, 78, 84; Решения §5, §8. Старые URL — `../old-ekfix-urls.txt` (43 шт.).

## Что сделать

1. `lib/nav.ts`: Commercial (`basePath` `/commercial-appliance-repair`; дети: хаб + опубликованные дочерние из `data/commercial`) · Home Appliances (`/appliance-repair`; хаб + 12 услуг) · Service Area (`/towns`; города со страницей, опубликованные районы под Charlotte, All Service Towns →) · Guides (`/appliance-repair-guide`, только при ≥1 опубликованной статье) · About (`/about`) · Reviews (`/reviews`). Тест шва 5 (nav). Ярлыки — из `data/site.ts`.
2. `Header`/`Footer`: существующий дропдаун; шапка в одну строку на ≥1025px и ≤1024px (бургер) — проверить Playwright 1024/1100/1280/1440/390 (высота шапки); подвал: For Business → «Commercial» (новый путь), добавить Reviews.
3. `lib/redirects.ts` → `redirectRules()`: 7 `.html`-правил ADR 0013 (`/for-business.html` → сразу `/commercial-appliance-repair`), `/for-business` → хаб, 43 URL старого ekfix.us по истории 23 (совпадающие — без правила; коммерческие — на опубликованную дочернюю, иначе хаб с якорем; проверь, что Next отдаёт `#` в `Location`, иначе без якоря — и запиши, что выбрал). `next.config.ts` импортирует `redirectRules()` относительным путём. Регистр `towns/Lesslie` — как в sitemap.
4. Тест шва 4: каждое место назначения (без `#`) ∈ `publishedPaths()`; нет цепочек; не-корневые не ведут на `/`; все 43 URL либо в правилах, либо совпадают с живым путём.
5. Проверка в prod-сборке: `curl -sI` по 43 старым путям, 7 `.html`, `/for-business`, `/for-business/`, `towns/lesslie` (строчными) — таблица «код → Location» в CONCERNS; ожидаемо 308 или 200 (совпадающие пути).

## Критерии приёмки

- [ ] порядок меню ровно как в брифе; Guides скрыт при нуле опубликованных статей; Reviews → `/reviews`; Commercial-дропдаун без черновиков
- [ ] шапка — одна строка на всех проверенных ширинах (цифры в CONCERNS); мобильное меню работает
- [ ] `grep -rn "/for-business" app components data lib` — только в `lib/redirects.ts`
- [ ] тест шва 4 зелёный; curl-таблица: все старые URL → 308 на живую страницу (или 200, если путь совпадает)
- [ ] `npm test`, `npx tsc --noEmit`, `npm run build` — зелёные
