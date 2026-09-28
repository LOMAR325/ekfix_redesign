# 06 — /about владельца-техника и /reviews по категориям

**Требования:** R72, R73, R74, R85, R86, R03, R04, R91, R92 (копия /about)
**Blocked by:** 01, 02
**Зона:** `app/about/**` · `data/people.ts` (блоки `/about`) · `app/reviews/**` · `data/reviews.ts` (только функции/поля, не `text`) · `components/about/**`, `components/reviews/**` (если нужны)
**Волна:** 3
**Status:** ready

## Что должно заработать

`/about` — живая страница о том, кто придёт чинить: Constantin, Owner & Lead Technician,
10+ лет, EPA Universal и OSHA, живёт в Ballantyne, семейный бизнес, бытовой и
коммерческий опыт, реальные фото, разметка Person. Бренды, обучение и история компании —
черновики до фактов. `/reviews` показывает отзывы по темам; пустые темы скрыты.

## Из брифа, дословно

> «4.1 /about — страница владельца-техника: имя (факт 1), роль Owner & Lead Technician, опыт, категории техники, бренды, бытовой и коммерческий опыт, сертификаты и обучение, подход к работе, история компании, фото. Только подтверждённое (факты 8–9 и уже опубликованное). Разметка Person.»
> «/about не уходит в черновик целиком: страница живая. Расширь её тем, что уже опубликовано (10+ лет, EPA Universal, OSHA, Ballantyne, семейный бизнес, бытовой и коммерческий опыт, существующие фото). Черновиками — только новые блоки: бренды, обучение, история компании.»
> «4.5 /reviews — отзывы по категориям: холодильники, посудомойки, стирка и сушка, коммерция, South Charlotte / Ballantyne. Пустая категория не выводится. Добавь в data/reviews.ts необязательные поля района и сегмента; заполняй только известное (отзыв ресторана = коммерция; район — только из факта 11).»

## Разделы спецификации

Истории 18, 66–68, 76–77; Решения §2, §13.

## Что сделать

1. `data/people.ts`: блоки `/about` со `status` — опубликованные (кто, опыт, сертификаты, Ballantyne/семья, бытовой и коммерческий опыт, категории техники — из `data/services` и коммерческих категорий, подход — три пункта «What that means», фото с alt) и черновые (Brands he knows best — факт 9; Training — факт 8; Company history — факт 8). Вся копия `/about` — в данных, в третьем лице; сравнительный оборот «the kind of certification most local outfits don't bother to hold» и подобные — переформулировать нейтрально.
2. `app/about/page.tsx` — из существующих `ui/*` (`PageHero`, `Prose`, `StatRow`, `LocalPhoto`, `PhotoPair`, `ProblemCardGrid`, `ChipRow`, `CtaBand`); черновые блоки — через `published()`, в dev с `DraftBanner`. JSON-LD: бизнес + `ownerNode()` (полный) + крошки. Title/description — с Constantin.
3. `app/reviews/page.tsx` — `PageHero` + по секции на непустую категорию из `reviewCategories()` (`SectionHead` + `ReviewsGrid`); JSON-LD: бизнес с `aggregateRating` + крошки; в `publishedPaths()` путь уже есть (таск 01).
4. Контраст и вёрстка на 1440/390 — без горизонтального скролла.

## Критерии приёмки

- [ ] `/about` в prod: Constantin, «Owner & Lead Technician», 10+ лет, EPA Universal, OSHA, Ballantyne, семейный бизнес, бытовой и коммерческий опыт, 3+ существующих фото с alt на Constantin; нет фамилии
- [ ] блоки Brands/Training/Company history — не в prod-HTML, видны в dev с плашкой
- [ ] `Person` на `/about`: `jobTitle`, `worksFor` → `@id` бизнеса, `hasCredential` ровно 2, `knowsAbout` = категории, видимые на странице
- [ ] `/reviews`: 4 непустые категории (Refrigerators & Freezers, Dishwashers, Washers & Dryers, Commercial), пятая скрыта; Tony Z. в двух; тексты отзывов не изменены
- [ ] в `app/about/**` и `app/reviews/**` нет захардкоженной копии
- [ ] `npm test`, `npx tsc --noEmit`, `npm run build` — зелёные
