# Черновики — недоступность

Прогон: 2026-09-30T05:57 · `node --no-warnings qa/drafts.mjs http://localhost:3111 http://localhost:3112`. Черновые единицы берутся из `data/*` (статус `draft`), проверка — против prod (`npm start`); dev-статус — для контроля превью.

## Единицы с URL (13)

| Тип | Путь | prod | dev | в sitemap | ссылки с опубл. страниц | в JSON-LD | итог |
|---|---|---|---|---|---|---|---|
| район/город | /towns/south-charlotte | 404 | 200 | нет | нет | нет | ок |
| статья | /appliance-repair-guide/refrigerator-not-cooling-freezer-works | 404 | 200 | нет | нет | нет | ок |
| статья | /appliance-repair-guide/samsung-refrigerator-ice-maker-problems | 404 | 200 | нет | нет | нет | ок |
| статья | /appliance-repair-guide/bosch-dishwasher-e15-error | 404 | 200 | нет | нет | нет | ок |
| статья | /appliance-repair-guide/dryer-runs-but-does-not-heat | 404 | 200 | нет | нет | нет | ок |
| статья | /appliance-repair-guide/oven-wont-heat | 404 | 200 | нет | нет | нет | ок |
| статья | /appliance-repair-guide/range-burner-wont-ignite | 404 | 200 | нет | нет | нет | ок |
| статья | /appliance-repair-guide/kitchenaid-ice-maker-not-making-ice | 404 | 200 | нет | нет | нет | ок |
| статья | /appliance-repair-guide/thermador-dishwasher-e15-error | 404 | 200 | нет | нет | нет | ок |
| статья | /appliance-repair-guide/miele-dishwasher-error-codes | 404 | 200 | нет | нет | нет | ок |
| статья | /appliance-repair-guide/lg-washer-oe-error | 404 | 200 | нет | нет | нет | ок |
| статья | /appliance-repair-guide/samsung-washer-error-codes | 404 | 200 | нет | нет | нет | ок |
| хаб гайдов (0 опубликованных статей) | /appliance-repair-guide | 404 | 200 | нет | нет | нет | ок |

## Черновые блоки без URL (28)

Каждый объект со `status: "draft"` в `data/*` (кроме единиц выше): его строки ≥30 символов ищутся в видимом тексте всех 32 опубликованных страниц prod.

| Блок | строк | найдено в prod |
|---|---|---|
| `towns.towns.1.page` | 6 | 0 |
| `towns.towns.2.page.zips` | 0 | 0 |
| `towns.towns.2.page.communities` | 0 | 0 |
| `towns.towns.2.page.faqs.1` | 2 | 0 |
| `commercial.commercialPages.0.equipment.moreEquipment` | 0 | 0 |
| `commercial.commercialPages.0.callProcess` | 1 | 0 |
| `commercial.commercialPages.0.faqs.4` | 1 | 0 |
| `commercial.commercialPages.1.faqs.3` | 1 | 0 |
| `commercial.commercialPages.2.faqs.4` | 1 | 0 |
| `commercial.commercialPages.3.faqs.4` | 1 | 0 |
| `commercial.commercialPages.4.faqs.4` | 1 | 0 |
| `commercial.commercialPages.5.faqs.3` | 1 | 0 |
| `commercial.commercialPages.6.faqs.5` | 1 | 0 |
| `guides.articles.0` | 23 | 0 |
| `guides.articles.1` | 49 | 0 |
| `guides.articles.2` | 26 | 0 |
| `guides.articles.3` | 45 | 0 |
| `guides.articles.4` | 39 | 0 |
| `guides.articles.5` | 46 | 0 |
| `guides.articles.6` | 58 | 0 |
| `guides.articles.7` | 29 | 0 |
| `guides.articles.8` | 54 | 0 |
| `guides.articles.9` | 36 | 0 |
| `guides.articles.10` | 55 | 0 |
| `people.aboutPage.pending.blocks.0` | 1 | 0 |
| `people.aboutPage.pending.blocks.1` | 1 | 0 |
| `people.aboutPage.pending.blocks.2` | 1 | 0 |
| `b2b-segments.forBusinessSegments.3` | 7 | 0 |
