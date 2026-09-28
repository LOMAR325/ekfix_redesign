# 05 — Районы: South Charlotte и Ballantyne, разведение с Charlotte

**Требования:** R58, R59, R60, R61, R62, R63, R64, R65, R66, R67, R71, R70 (рендер), R93, R03, R04, R91
**Blocked by:** 01, 02
**Зона:** `app/towns/**` · `data/towns.ts` · `components/towns/**` (если нужны)
**Волна:** 3
**Status:** ready

## Что должно заработать

`/towns/ballantyne` — главная страница захода. Она открывается фразой о коммерческом и
домашнем ремонте в Ballantyne и South Charlotte и перечнем техники, дальше идёт только
конкретика по Ballantyne: владелец живёт здесь, в новой застройке много встраиваемых
Sub-Zero, Thermador, Bosch и KitchenAid. FAQ написан так, как спрашивают ИИ-ассистента.
`/towns/south-charlotte` собрана; без фактов 3–5 она, скорее всего, останется черновиком.
Charlotte отвечает за город целиком, крошки отражают иерархию. Публикуется только то,
что проходит тест на шаблонность.

## Из брифа, дословно

> «3.2 /towns/ballantyne — главная страница этого захода. Открывается по смыслу так: «EK Global provides commercial and in-home appliance repair throughout Ballantyne and South Charlotte, including the 28277 area…» с перечнем техники из списка услуг. Дальше — только конкретика по Ballantyne: владелец живёт и работает в этом районе (уже опубликовано на сайте); … наблюдение про встраиваемые Sub-Zero / Thermador / Bosch / KitchenAid — используй его; реальные сообщества и ZIP; блок «Appliances we repair in Ballantyne»: короткие разделы по видам техники, у каждого своя конкретика, без общего шаблона.»
> «Ballantyne: … Если с этим страница проходит тест на шаблонность — публикуй, если нет — черновик.»
> «3.4 Разведи зоны … Перепиши страницу Charlotte, если в ней есть то, что теперь принадлежит Ballantyne. Хлебные крошки отражают иерархию.»
> «3.7 Никаких страниц под отдельные ZIP-коды и никаких новых городов сверх этих двух.»

## Разделы спецификации

Истории 54–61, 65; Решения §3, §10; Открытые места (факты 3, 4, 5, 11).

## Что сделать

1. `data/towns.ts` — наполнить `page` у `ballantyne` и `south-charlotte` по историям 54–59 (28277 не упоминать: факт 3 не дан; блоки `zips`/`communities`/`whoWeServe`/`coverage` (кроме «Ballantyne входит в South Charlotte») — `draft`; FAQ Ballantyne — 8 вопросов из брифа, пункты без подтверждённого ответа — `draft`; `applianceNotes` — только с опубликованной конкретикой, тексты разные; отзывы района — по `Review.area` (сейчас нет)).
2. Charlotte: переписать `page` так, чтобы она говорила про город целиком (старый/новый фонд, районы города, $75), а Ballantyne-специфика жила на Ballantyne со ссылкой; ни один опубликованный факт не теряется: если Ballantyne остаётся черновиком — наблюдение остаётся на Charlotte. `seo` трёх страниц различаются по зоне. Имя владельца — из `data/people.ts`.
3. `app/towns/[slug]` — секции района по наличию полей (из тех же `ui/*`); крошки из цепочки `parent` (черновой уровень пропускается); JSON-LD: бизнес с `areaServed` = своя зона + FAQ (опубликованные пункты) + крошки; ссылки на услуги/районы — `ChipRow` из данных/`lib/links`. `/towns` index: список опубликованных районов под Charlotte.
4. Тест на шаблонность: `npm run dev`, `npm run check:similarity -- --group areas` (Charlotte, South Charlotte, Ballantyne + 4 города). Ballantyne/South Charlotte — `published` только при максимуме ≤ 0.30 и без выдуманного. Матрица — в CONCERNS.

## Критерии приёмки

- [ ] Ballantyne открывается по смыслу брифа (без 28277); содержит владельца-в-районе и наблюдение про встраиваемые бренды; «Appliances we repair in Ballantyne» — разделы с разным текстом
- [ ] FAQ Ballantyne: 8 вопросов в формулировках брифа; ответы — только из опубликованного; 28277 и коммерция в South Charlotte — черновые пункты
- [ ] решение о публикации Ballantyne/South Charlotte — по матрице (цифры в CONCERNS); черновики → 404 в prod
- [ ] Charlotte не дублирует Ballantyne; опубликованные факты не потеряны; `<title>` трёх страниц разные
- [ ] крошки: Ballantyne — Home › Service Area › Charlotte, NC › (South Charlotte, если опубликован) › Ballantyne; JSON-LD крошек совпадает
- [ ] новых городов нет; `kind:"area"` ровно два
- [ ] `npm test`, `npx tsc --noEmit`, `npm run build` — зелёные
