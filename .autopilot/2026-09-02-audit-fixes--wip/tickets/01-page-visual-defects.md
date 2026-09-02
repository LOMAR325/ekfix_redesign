# 01 — Визуальные дефекты страниц (задачи 1, 2, 4, 5)

**Требования:** R01, R02, R03, R04, R05, R06, R07, R15, R16, R17, R33i; вклад в R21, R22, R32
**Blocked by:** —
**Зона:** `app/globals.css` · `components/ui/audience-card.tsx` · `app/for-business/page.tsx` · `data/b2b-segments.ts` · `data/services.ts`
**Волна:** 1
**Status:** ready

## Что должно заработать

Посетитель читает названия всех 4 карточек «Who we serve» на главной. На
`/for-business` карточки сегментов выглядят ровно как раньше, кроме исчезнувшей
карточки HOA. Нигде на сайте нет русского текста и служебных маркеров. Карточки
коммерческой техники в сетке `#repair` показывают технику, а не что попало;
«Range» и «Cooktop» не делят одно фото.

## Из брифа, дословно

> «задай явный светлый цвет заголовку … так, чтобы .audience-card одинаково
> корректно выглядела и в светлой, и в тёмной секции»
> «убери карточку [HOA] из выдачи … любой сегмент с placeholder: true физически
> не рендерился … данные оставь в файле с комментарием»
> «убедись, что … не осталось русского текста и слов TODO/FIXME/заглушка в
> пользовательской части»
> «Переставь заглушки … на максимально близкие по смыслу … у каждой оставь
> комментарий, что это временная замена … Ничего не удаляй … новых картинок не генерируй»

## Разделы спецификации

Истории 1–6, 15–17; Решения §Задача 1, §Задача 2, §Задача 4/5; Границы `data/b2b-segments`.

## Критерии приёмки

- [ ] `app/globals.css`: добавлена **одна** строка `.audience-card h3 { color: var(--text-light); }`
      (рядом с `.audience-card .eyebrow/p/li`); больше в CSS ничего не менялось
- [ ] `#who-we-serve` на `/`: контраст заголовков карточек ≥ 4.5:1 на 1440px и 390px
- [ ] `/for-business`: DOM/классы/цвета `.audience-card` не изменились (кроме удаления HOA);
      ссылка `CARD_LINK` внутри карточки читаема (проверить на светлой секции тоже)
- [ ] `data/b2b-segments.ts`: новый `export const publicForBusinessSegments = forBusinessSegments.filter((s) => !s.placeholder)`;
      запись `hoa` на месте с `placeholder: true` + поясняющий комментарий
- [ ] `app/for-business/page.tsx`: `segmentCards` строится из `publicForBusinessSegments`;
      константа `HOA_NOTE` и ветка `segment.placeholder ? …` удалены
- [ ] сетка из 3 карточек на `/for-business` не «разъезжается» на 1440/390
      (`.card-grid-4` = `auto-fit minmax` → 3 колонки; если сломается — `BLOCKED`/`D##`)
- [ ] `data/services.ts` `commercialCategories`: Commercial Refrigeration → `/images/Refrigerator.webp`,
      Commercial Dishwasher/Warewasher → `/images/dishwasher.webp`,
      Commercial Laundry Equipment → `/images/dryer_16.webp`,
      Ice Machine → `/images/ice_maker_under.webp` (оставить — единственное фото льдогенератора);
      у каждой строки комментарий «временная замена до реального коммерческого фото»
- [ ] `data/services.ts:216` range → `/images/stove.webp` (+ комментарий: range ≈ stove,
      идеально — отдельное фото плиты; stove и range теперь делят фото)
- [ ] `data/services.ts:116` washer остаётся `/images/dryer.webp` + комментарий
      «TODO: нужно фото стиральной машины — в public/images его нет» (в отчёт)
- [ ] `public/images/` не тронут; новых картинок нет
- [ ] разовый скан: `npm run build && npm start`, `curl` каждой из 22 страниц, вырезать
      текстовые узлы, грепнуть `[А-Яа-яЁё]` и `/(TODO|FIXME|заглушк)/i` → **пусто**
- [ ] `npx tsc --noEmit`, `npm run build`, `npm test` — зелёные (тестов этот тикет не добавляет)
- [ ] дописать `interfaces.md` раздел «### Таск 01»
