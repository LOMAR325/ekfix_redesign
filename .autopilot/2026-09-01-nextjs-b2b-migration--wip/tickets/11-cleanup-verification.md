# 11 — Уборка, CWV, финальная проверка

**Требования:** R03, R04, R41, R43, R44, R45 (материал для отчёта)
**Blocked by:** 06, 07, 08, 09, 10
**Зона:** корень репо (удаление старых файлов), весь `app/`/`components/` (только чтение + точечные CWV-правки)
**Волна:** 5
**Status:** ready

## Что должно заработать

Старые статические файлы удалены (перенесённое больше не дублируется). `next build`
проходит целиком. Lighthouse (mobile, локально) — зелёная зона по CWV на ключевых
страницах. Полный обход всех роутов вручную/скриптом — ничего не 404-ит, кроме
намеренных (не-isFullPage города).

## Из брифа, дословно

> «SSG для всех страниц, next/image для всех изображений»
> «next build проходит без ошибок, Lighthouse/Core Web Vitals — в зелёной зоне»

## Разделы спецификации

Истории 3, 4, 39, 41; Решения §Удаляется.

## Что делать

1. Убедиться, что ВСЕ 24 роута собираются (`next build` печатает список — сверить со
   sitemap-тестом таска 03).
2. Удалить: `index.html`, `about.html`, `brands.html`, `for-business.html`,
   `appliance-repair/*.html`, `towns/*.html`, `css/style.css` (и пустую `css/`),
   `js/main.js` (и пустую `js/`), `sitemap.xml`, `assets/images/*` (уже скопированы
   в `public/images/` таском 01 — проверить копию перед удалением оригинала).
   **Не трогать:** `.autopilot/`, `CLAUDE.md`, 4 md-документа в корне, `.git/`.
3. `npm run build && npm start` (или `next start`), прогнать локальный Lighthouse
   (mobile emulation, throttling) на `/`, `/for-business`, `/appliance-repair/refrigerator`,
   `/towns/charlotte`. Если LCP/CLS/TBT не в зелёной зоне — точечно поправить (размеры
   `next/image`, `priority` на LCP-картинке, убрать layout shift), **не трогая
   вёрстку/классы**.
4. Ручной обход: каждый URL из `app/sitemap.ts` отдаёт 200; `/towns/waxhaw` и любой
   другой не-isFullPage город → 404; `/api/book` GET → 405/404 (не страница).
5. `npm test` (весь набор — швы 1–3) и `npx tsc --noEmit` — зелёные.
6. Финальный grep: ни одного вхождения `EK Globall` (опечатка) и ни одного
   вхождения строки бизнеса, отличной от `"EK Global"`, в JSON-LD.

## Критерии приёмки

- [ ] Старые `.html`/`css/`/`js/`/`sitemap.xml`/`assets/images` удалены;
      `.autopilot/`, md-документы, `CLAUDE.md`, `.git/` нетронуты
- [ ] `npm run build` — 24 статических роута (5 базовых + `/towns` + 12 услуг + 5 городов
      + `/api/book`), без ошибок
- [ ] Lighthouse mobile: LCP < 2.5s, CLS < 0.1, TBT в зелёной зоне на 4 проверенных страницах
- [ ] Полный обход роутов: ожидаемые 200, ожидаемые 404 (не-isFullPage города)
- [ ] `npm test` и `npx tsc --noEmit` зелёные
- [ ] Ноль вхождений «EK Globall»; название бизнеса в JSON-LD везде ровно «EK Global»
