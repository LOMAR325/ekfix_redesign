# 03 — Активный пункт меню + редиректы со старых URL (задачи 6, 7)

**Требования:** R18, R18.1, R19, R20, R29; вклад в R32 (ADR 0013)
**Blocked by:** —
**Зона:** `lib/nav.ts` · `components/Header.tsx` · `next.config.ts` · `docs/adr/`
**Волна:** 1
**Status:** ready

## Что должно заработать

На странице техники в шапке подсвечен пункт «We Repair», на странице города —
«Service Area» (как на старом сайте). Старый адрес `/about.html` (и другие `*.html`)
отдаёт постоянный редирект на `/about`.

## Из брифа, дословно

> «пункт верхнего меню («We Repair» / «Service Area») больше не подсвечивается
> активным — в старой вёрстке у кнопки был класс .nav-trigger.active. Восстанови
> поведение как на старом сайте.»
> «Добавь редиректы со старых URL вида /index.html, /about.html, /brands.html,
> /for-business.html, /appliance-repair/*.html, /towns/*.html и /towns/index.html …
> постоянные редиректы, через next.config. Это отменяет решение docs/adr/0012 —
> оформи новый ADR с обоснованием.»

## Разделы спецификации

Истории 18–21; Решения §Задача 6, §Задача 7; Границы `lib/nav`.

## Критерии приёмки

### Задача 6 — активный пункт меню

- [ ] `lib/nav.ts`: тип `NavGroup` получает поле `basePath: string`;
      в `mainNav` «We Repair» → `basePath: "/appliance-repair"`, «Service Area» → `basePath: "/towns"`
- [ ] `components/Header.tsx`: `.nav-trigger` группы получает класс `active`, когда
      `pathname === group.basePath || pathname.startsWith(group.basePath + "/")`
- [ ] существующая подсветка дочерних `<Link>` (`isActive(child.href)`) не трогается
- [ ] проверка: `/appliance-repair/refrigerator` → активна «We Repair»;
      `/towns/charlotte` и `/towns` → активна «Service Area»; `/about` → ни одна группа не активна

### Задача 7 — редиректы

- [ ] `next.config.ts`: `async redirects()` возвращает 7 правил, все `permanent: true` (308):
  - `/index.html` → `/`
  - `/about.html` → `/about`
  - `/brands.html` → `/brands`
  - `/for-business.html` → `/for-business`
  - `/appliance-repair/:slug.html` → `/appliance-repair/:slug`
  - `/towns/index.html` → `/towns`
  - `/towns/:slug.html` → `/towns/:slug`
- [ ] `curl -I http://localhost:3000/about.html` → `308` + `location: /about` (проверить 3-4 разных)
- [ ] `docs/adr/0013-redirects-so-staryh-html.md` — 4 раздела (Контекст / Решение /
      Почему — что изменилось с ADR 0012: владелец решил подстраховаться перед боевым
      запуском, риск 404 по внешним ссылкам/каталогам / Последствия — 7 правил в конфиге,
      тривиально проверяются `curl -I`, редирект-циклов нет т.к. цели — существующие роуты)
- [ ] в `docs/adr/0012-otkaz-ot-redirects-so-staryh-html.md` — приписка в конце:
      «**Отменено ADR 0013 (2026-09-02):** редиректы добавлены как страховка перед боевым запуском.»

### Общее

- [ ] `npx tsc --noEmit`, `npm run build`, `npm test` — зелёные (тестов не добавляем)
- [ ] `Header.tsx` остаётся `'use client'`, логика меню/дропдаунов не сломана
- [ ] дописать `interfaces.md` раздел «### Таск 03»
