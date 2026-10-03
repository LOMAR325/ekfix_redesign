# QA страниц — story 81 (R95)

Прогон: 2026-10-03T15:03 · `node --no-warnings qa/pages.mjs http://localhost:3111` против `npm start` · 32 опубликованных путей (`publishedPaths()`) × 1440×900 и 390×844.
Контраст — WCAG 2.x по вычисленным цветам (альфа и opacity наложены на фон предков); порог 4.5:1, крупный текст (≥24px или ≥18.66px bold) 3:1. Текст на фоне-картинке/градиенте не считается автоматически (колонка «на картинке»).

| Путь | Ширина | HTTP | Текстов | <4.5 | на картинке | Гориз. скролл | Ошибки консоли | Картинки ок/всего | 4xx/5xx |
|---|---|---|---|---|---|---|---|---|---|
| / | 1440 | 200 | 26 | 0 | 10 | нет | 0 | 2/2 | 0 |
| /about | 1440 | 200 | 84 | 0 | 6 | нет | 0 | 7/7 | 0 |
| /brands | 1440 | 200 | 50 | 0 | 0 | нет | 0 | 33/33 | 0 |
| /towns | 1440 | 200 | 79 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /reviews | 1440 | 200 | 63 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair | 1440 | 200 | 193 | 0 | 2 | нет | 0 | 37/37 | 0 |
| /commercial-appliance-repair | 1440 | 200 | 261 | 0 | 0 | нет | 0 | 18/18 | 0 |
| /appliance-repair/refrigerator | 1440 | 200 | 127 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/washer | 1440 | 200 | 130 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/dryer | 1440 | 200 | 128 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/dishwasher | 1440 | 200 | 130 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/stove | 1440 | 200 | 128 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/range | 1440 | 200 | 128 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/cooktop | 1440 | 200 | 128 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/microwave | 1440 | 200 | 123 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/freezer | 1440 | 200 | 127 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/ice-maker | 1440 | 200 | 128 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/wine-cooler | 1440 | 200 | 125 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/garbage-disposal | 1440 | 200 | 117 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /commercial-appliance-repair/commercial-refrigerator-repair | 1440 | 200 | 108 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /commercial-appliance-repair/commercial-dishwasher-repair | 1440 | 200 | 102 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /commercial-appliance-repair/commercial-ice-machine-repair | 1440 | 200 | 104 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /commercial-appliance-repair/commercial-laundry-equipment-repair | 1440 | 200 | 109 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /commercial-appliance-repair/commercial-oven-range-repair | 1440 | 200 | 110 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /commercial-appliance-repair/restaurant-appliance-repair | 1440 | 200 | 108 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /commercial-appliance-repair/property-management-appliance-repair | 1440 | 200 | 108 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /towns/charlotte | 1440 | 200 | 82 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /towns/ballantyne | 1440 | 200 | 100 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /towns/rock-hill | 1440 | 200 | 96 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /towns/fort-mill | 1440 | 200 | 94 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /towns/matthews | 1440 | 200 | 94 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /towns/indian-trail | 1440 | 200 | 92 | 0 | 0 | нет | 0 | 1/1 | 0 |
| / | 390 | 200 | 26 | 0 | 10 | нет | 0 | 2/2 | 0 |
| /about | 390 | 200 | 79 | 0 | 6 | нет | 0 | 7/7 | 0 |
| /brands | 390 | 200 | 45 | 0 | 0 | нет | 0 | 33/33 | 0 |
| /towns | 390 | 200 | 65 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /reviews | 390 | 200 | 58 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair | 390 | 200 | 171 | 0 | 2 | нет | 0 | 37/37 | 0 |
| /commercial-appliance-repair | 390 | 200 | 246 | 0 | 0 | нет | 0 | 18/18 | 0 |
| /appliance-repair/refrigerator | 390 | 200 | 119 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/washer | 390 | 200 | 122 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/dryer | 390 | 200 | 120 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/dishwasher | 390 | 200 | 122 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/stove | 390 | 200 | 120 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/range | 390 | 200 | 120 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/cooktop | 390 | 200 | 120 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/microwave | 390 | 200 | 115 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/freezer | 390 | 200 | 119 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/ice-maker | 390 | 200 | 120 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/wine-cooler | 390 | 200 | 117 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/garbage-disposal | 390 | 200 | 109 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /commercial-appliance-repair/commercial-refrigerator-repair | 390 | 200 | 100 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /commercial-appliance-repair/commercial-dishwasher-repair | 390 | 200 | 94 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /commercial-appliance-repair/commercial-ice-machine-repair | 390 | 200 | 96 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /commercial-appliance-repair/commercial-laundry-equipment-repair | 390 | 200 | 101 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /commercial-appliance-repair/commercial-oven-range-repair | 390 | 200 | 102 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /commercial-appliance-repair/restaurant-appliance-repair | 390 | 200 | 100 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /commercial-appliance-repair/property-management-appliance-repair | 390 | 200 | 100 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /towns/charlotte | 390 | 200 | 74 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /towns/ballantyne | 390 | 200 | 92 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /towns/rock-hill | 390 | 200 | 88 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /towns/fort-mill | 390 | 200 | 86 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /towns/matthews | 390 | 200 | 86 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /towns/indian-trail | 390 | 200 | 84 | 0 | 0 | нет | 0 | 1/1 | 0 |

**Итого:** 64 прогонов; контраст-нарушений 0; гориз. скролл 0; ошибок консоли 0; незагруженных картинок 0; ответов ≥400 0.

## Главная: H1 и первые кнопки hero

- **1440px:** H1 «Appliance repair in Charlotte, NC» — 1 строк(и) (норма ≤3: ок). Кнопки: 1) «Commercial Service →» `btn btn-accent` фон rgb(198, 242, 78).
- **390px:** H1 «Appliance repair in Charlotte, NC» — 1 строк(и) (норма ≤4: ок). Кнопки: 1) «Commercial Service →» `btn btn-accent` фон rgb(198, 242, 78).

## Находки

Нет.
