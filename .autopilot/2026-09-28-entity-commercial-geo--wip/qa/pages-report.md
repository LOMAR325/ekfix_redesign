# QA страниц — story 81 (R95)

Прогон: 2026-09-29T13:41 · `node --no-warnings qa/pages.mjs http://localhost:3111` против `npm start` · 32 опубликованных путей (`publishedPaths()`) × 1440×900 и 390×844.
Контраст — WCAG 2.x по вычисленным цветам (альфа и opacity наложены на фон предков); порог 4.5:1, крупный текст (≥24px или ≥18.66px bold) 3:1. Текст на фоне-картинке/градиенте не считается автоматически (колонка «на картинке»).

| Путь | Ширина | HTTP | Текстов | <4.5 | на картинке | Гориз. скролл | Ошибки консоли | Картинки ок/всего | 4xx/5xx |
|---|---|---|---|---|---|---|---|---|---|
| / | 1440 | 200 | 221 | 6 | 2 | нет | 0 | 17/35 | 0 |
| /about | 1440 | 200 | 88 | 0 | 3 | нет | 0 | 4/4 | 0 |
| /brands | 1440 | 200 | 54 | 0 | 0 | нет | 0 | 33/33 | 0 |
| /towns | 1440 | 200 | 71 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /reviews | 1440 | 200 | 80 | 7 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair | 1440 | 200 | 86 | 0 | 0 | нет | 0 | 12/12 | 0 |
| /commercial-appliance-repair | 1440 | 200 | 139 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/refrigerator | 1440 | 200 | 106 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/washer | 1440 | 200 | 110 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/dryer | 1440 | 200 | 109 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/dishwasher | 1440 | 200 | 111 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/stove | 1440 | 200 | 109 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/range | 1440 | 200 | 109 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/cooktop | 1440 | 200 | 109 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/microwave | 1440 | 200 | 107 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/freezer | 1440 | 200 | 109 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/ice-maker | 1440 | 200 | 109 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/wine-cooler | 1440 | 200 | 108 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/garbage-disposal | 1440 | 200 | 104 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /commercial-appliance-repair/commercial-refrigerator-repair | 1440 | 200 | 93 | 0 | 0 | нет | 0 | 5/5 | 0 |
| /commercial-appliance-repair/commercial-dishwasher-repair | 1440 | 200 | 95 | 1 | 0 | нет | 0 | 2/2 | 0 |
| /commercial-appliance-repair/commercial-ice-machine-repair | 1440 | 200 | 91 | 0 | 0 | нет | 0 | 2/2 | 0 |
| /commercial-appliance-repair/commercial-laundry-equipment-repair | 1440 | 200 | 99 | 0 | 0 | нет | 0 | 3/3 | 0 |
| /commercial-appliance-repair/commercial-oven-range-repair | 1440 | 200 | 93 | 0 | 0 | нет | 0 | 2/2 | 0 |
| /commercial-appliance-repair/restaurant-appliance-repair | 1440 | 200 | 99 | 1 | 0 | нет | 0 | 8/8 | 0 |
| /commercial-appliance-repair/property-management-appliance-repair | 1440 | 200 | 97 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /towns/charlotte | 1440 | 200 | 91 | 3 | 0 | нет | 0 | 1/1 | 0 |
| /towns/ballantyne | 1440 | 200 | 91 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /towns/rock-hill | 1440 | 200 | 94 | 3 | 0 | нет | 0 | 1/1 | 0 |
| /towns/fort-mill | 1440 | 200 | 93 | 3 | 0 | нет | 0 | 1/1 | 0 |
| /towns/matthews | 1440 | 200 | 93 | 3 | 0 | нет | 0 | 1/1 | 0 |
| /towns/indian-trail | 1440 | 200 | 91 | 3 | 0 | нет | 0 | 1/1 | 0 |
| / | 390 | 200 | 194 | 6 | 2 | нет | 0 | 15/35 | 0 |
| /about | 390 | 200 | 79 | 0 | 3 | нет | 0 | 3/4 | 0 |
| /brands | 390 | 200 | 45 | 0 | 0 | нет | 0 | 33/33 | 0 |
| /towns | 390 | 200 | 56 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /reviews | 390 | 200 | 71 | 7 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair | 390 | 200 | 65 | 0 | 0 | нет | 0 | 12/12 | 0 |
| /commercial-appliance-repair | 390 | 200 | 130 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /appliance-repair/refrigerator | 390 | 200 | 97 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/washer | 390 | 200 | 101 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/dryer | 390 | 200 | 100 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/dishwasher | 390 | 200 | 102 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/stove | 390 | 200 | 100 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/range | 390 | 200 | 100 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/cooktop | 390 | 200 | 100 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/microwave | 390 | 200 | 98 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/freezer | 390 | 200 | 100 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/ice-maker | 390 | 200 | 100 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/wine-cooler | 390 | 200 | 99 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /appliance-repair/garbage-disposal | 390 | 200 | 95 | 0 | 0 | нет | 0 | 0/0 | 0 |
| /commercial-appliance-repair/commercial-refrigerator-repair | 390 | 200 | 84 | 0 | 0 | нет | 0 | 5/5 | 0 |
| /commercial-appliance-repair/commercial-dishwasher-repair | 390 | 200 | 86 | 1 | 0 | нет | 0 | 2/2 | 0 |
| /commercial-appliance-repair/commercial-ice-machine-repair | 390 | 200 | 82 | 0 | 0 | нет | 0 | 2/2 | 0 |
| /commercial-appliance-repair/commercial-laundry-equipment-repair | 390 | 200 | 90 | 0 | 0 | нет | 0 | 3/3 | 0 |
| /commercial-appliance-repair/commercial-oven-range-repair | 390 | 200 | 84 | 0 | 0 | нет | 0 | 2/2 | 0 |
| /commercial-appliance-repair/restaurant-appliance-repair | 390 | 200 | 90 | 1 | 0 | нет | 0 | 8/8 | 0 |
| /commercial-appliance-repair/property-management-appliance-repair | 390 | 200 | 88 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /towns/charlotte | 390 | 200 | 82 | 3 | 0 | нет | 0 | 1/1 | 0 |
| /towns/ballantyne | 390 | 200 | 82 | 0 | 0 | нет | 0 | 1/1 | 0 |
| /towns/rock-hill | 390 | 200 | 85 | 3 | 0 | нет | 0 | 1/1 | 0 |
| /towns/fort-mill | 390 | 200 | 84 | 3 | 0 | нет | 0 | 1/1 | 0 |
| /towns/matthews | 390 | 200 | 84 | 3 | 0 | нет | 0 | 1/1 | 0 |
| /towns/indian-trail | 390 | 200 | 82 | 3 | 0 | нет | 0 | 1/1 | 0 |

**Итого:** 64 прогонов; контраст-нарушений 60; гориз. скролл 0; ошибок консоли 0; незагруженных картинок 39; ответов ≥400 0.

## Главная: H1 и первые кнопки hero

- **1440px:** H1 «Appliance repair,Charlotte.» — 3 строк(и) (норма ≤3: ок). Кнопки: 1) «For Business →» `btn btn-accent` фон rgb(198, 242, 78); 2) «For Homes» `btn btn-ghost-dark` фон rgba(11, 12, 11, 0.4).
- **390px:** H1 «Appliance repair,Charlotte.» — 2 строк(и) (норма ≤4: ок). Кнопки: 1) «For Business →» `btn btn-accent` фон rgb(198, 242, 78); 2) «For Homes» `btn btn-ghost-dark` фон rgba(11, 12, 11, 0.4).

## Находки

### / @1440
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fkostia_reast.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fkostia-laundry.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fhobart.webp&w=1920&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fblodget.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2FMiddleby_Corporation.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fgirbau.webp&w=2048&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fcopeland.webp&w=2048&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fsub_zero_logo.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fthermador.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fbosch.webp&w=2048&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fsamsung.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fwhirlpool.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fkitchen_aid.webp&w=1920&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Felectrolux.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fmaytag.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Ffrigidare.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2FAmana.webp&w=1920&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2FKenmore_Logo.webp&w=1920&q=75
### /reviews @1440
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
### /commercial-appliance-repair/commercial-dishwasher-repair @1440
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
### /commercial-appliance-repair/restaurant-appliance-repair @1440
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
### /towns/charlotte @1440
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
### /towns/rock-hill @1440
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
### /towns/fort-mill @1440
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
### /towns/matthews @1440
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
### /towns/indian-trail @1440
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
### / @390
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fwine_coolers.webp&w=2048&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fgarb_dispo.webp&w=1200&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fkostia_reast.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fkostia-laundry.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fhobart.webp&w=1920&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fblodget.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2FMiddleby_Corporation.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fgirbau.webp&w=2048&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fcopeland.webp&w=2048&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fsub_zero_logo.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fthermador.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fbosch.webp&w=2048&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fsamsung.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fwhirlpool.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fkitchen_aid.webp&w=1920&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Felectrolux.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fmaytag.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Ffrigidare.webp&w=3840&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2FAmana.webp&w=1920&q=75
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2FKenmore_Logo.webp&w=1920&q=75
### /about @390
- картинка не загрузилась: http://localhost:3111/_next/image?url=%2Fimages%2Fkostia-laundry.webp&w=3840&q=75
### /reviews @390
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
### /commercial-appliance-repair/commercial-dishwasher-repair @390
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
### /commercial-appliance-repair/restaurant-appliance-repair @390
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
### /towns/charlotte @390
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
### /towns/rock-hill @390
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
### /towns/fort-mill @390
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
### /towns/matthews @390
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
### /towns/indian-trail @390
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
- контраст 1.3:1 — «★★★★★» `div.stars` #c6f24e на #ffffff, 13px
