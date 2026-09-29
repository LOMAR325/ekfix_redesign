# Редиректы — story 84 (R99)

Прогон: 2026-09-29T14:03 · `node --no-warnings qa/redirects.mjs http://localhost:3111` против prod (`npm start`), запросы без следования за редиректом (эквивалент `curl -sI`).
Норма: 308 → назначение ∈ `publishedPaths()` отвечает 200 без второго редиректа; не-корневой источник не ведёт на `/`; либо старый путь совпадает с живым и сам отвечает 200.

| # | Источник | Откуда | Ответ | Назначение | Ответ назначения | Итог |
|---|---|---|---|---|---|---|
| 1 | `/index.html` | старый *.html | 308 | `/` | 200 | ок |
| 2 | `/about.html` | старый *.html | 308 | `/about` | 200 | ок |
| 3 | `/brands.html` | старый *.html | 308 | `/brands` | 200 | ок |
| 4 | `/for-business.html` | старый *.html | 308 | `/commercial-appliance-repair` | 200 | ок |
| 5 | `/appliance-repair/refrigerator.html` | старый *.html | 308 | `/appliance-repair/refrigerator` | 200 | ок |
| 6 | `/towns/index.html` | старый *.html | 308 | `/towns` | 200 | ок |
| 7 | `/towns/charlotte.html` | старый *.html | 308 | `/towns/charlotte` | 200 | ок |
| 8 | `/for-business` | снятый роут | 308 | `/commercial-appliance-repair` | 200 | ок |
| 9 | `/` | старый ekfix.us | 200 | — | — | ок |
| 10 | `/appliance-repair/stove` | старый ekfix.us | 200 | — | — | ок |
| 11 | `/appliance-repair/wine-cooler` | старый ekfix.us | 200 | — | — | ок |
| 12 | `/appliance-repair/refrigerator` | старый ekfix.us | 200 | — | — | ок |
| 13 | `/appliance-repair/washer` | старый ekfix.us | 200 | — | — | ок |
| 14 | `/appliance-repair/range` | старый ekfix.us | 200 | — | — | ок |
| 15 | `/appliance-repair/garbage_disposal` | старый ekfix.us | 308 | `/appliance-repair/garbage-disposal` | 200 | ок |
| 16 | `/appliance-repair/cooktop` | старый ekfix.us | 200 | — | — | ок |
| 17 | `/appliance-repair/freezer` | старый ekfix.us | 200 | — | — | ок |
| 18 | `/appliance-repair/ice_maker` | старый ekfix.us | 308 | `/appliance-repair/ice-maker` | 200 | ок |
| 19 | `/appliance-repair/dryer` | старый ekfix.us | 200 | — | — | ок |
| 20 | `/appliance-repair/microwave` | старый ekfix.us | 200 | — | — | ок |
| 21 | `/appliance-repair/dishwasher` | старый ekfix.us | 200 | — | — | ок |
| 22 | `/towns/charlotte` | старый ekfix.us | 200 | — | — | ок |
| 23 | `/towns/stallings` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 24 | `/towns/newell` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 25 | `/towns/harrisburg` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 26 | `/towns/allen` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 27 | `/towns/mint_hill` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 28 | `/towns/indian_trail` | старый ekfix.us | 308 | `/towns/indian-trail` | 200 | ок |
| 29 | `/towns/wesley_chapel` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 30 | `/towns/monroe` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 31 | `/towns/unionville` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 32 | `/towns/mineral_springs` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 33 | `/towns/pineville` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 34 | `/towns/waxhaw` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 35 | `/towns/belmont` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 36 | `/towns/matthews` | старый ekfix.us | 200 | — | — | ок |
| 37 | `/towns/marvin` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 38 | `/towns/weddington` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 39 | `/towns/indian_hook` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 40 | `/towns/indian_land` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 41 | `/towns/catawba` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 42 | `/towns/fort_mill` | старый ekfix.us | 308 | `/towns/fort-mill` | 200 | ок |
| 43 | `/towns/Lesslie` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 44 | `/towns/lake_wylie` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 45 | `/towns/spring_valley` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 46 | `/towns/rock_hill` | старый ekfix.us | 308 | `/towns/rock-hill` | 200 | ок |
| 47 | `/towns/tega_cay` | старый ekfix.us | 308 | `/towns` | 200 | ок |
| 48 | `/brands` | старый ekfix.us | 200 | — | — | ок |
| 49 | `/property_management` | старый ekfix.us | 308 | `/commercial-appliance-repair/property-management-appliance-repair` | 200 | ок |
| 50 | `/property_management_cafe` | старый ekfix.us | 308 | `/commercial-appliance-repair/restaurant-appliance-repair` | 200 | ок |
| 51 | `/laundry_equipment_repair` | старый ekfix.us | 308 | `/commercial-appliance-repair/commercial-laundry-equipment-repair` | 200 | ок |

**Итого:** 51 адресов — 37 × 308, 14 × 200 (совпадают с живыми), дефектов 0.
