# JSON-LD — story 82 (R96, R23)

Прогон: 2026-09-30T19:10 · `node --no-warnings qa/jsonld.mjs http://localhost:3111` по prod-HTML (`npm start`), 32 опубликованных путей.
Проверки: JSON парсится; ровно один `<script type=application/ld+json>` с `@graph`; каждая ссылка `{"@id"}` разрешается внутри графа; один узел `https://ekfix.us/#business`; `Person.name === "Constantin"`; каждое строковое значение (name, alternateName, telephone, jobTitle, serviceType, headline, text, description, knowsAbout, addressLocality, addressRegion, ratingValue, reviewCount, areaServed, email) есть в видимом тексте страницы (регистр/пробелы/тире нормализованы, телефон — по цифрам, reviewCount — рядом со словом review); URL-поля (url, logo, image, sameAs, item) — ресурс есть на странице (ссылка, картинка или сама страница).

| Путь | Узлов | Типы | @id-ссылок | строк сверено | URL сверено |
|---|---|---|---|---|---|
| / | 2 | HomeAndConstructionBusiness, WebSite | 1 | 5 | 8 |
| /about | 3 | HomeAndConstructionBusiness, Person, BreadcrumbList | 1 | 26 | 10 |
| /brands | 2 | HomeAndConstructionBusiness, BreadcrumbList | 0 | 6 | 8 |
| /towns | 2 | HomeAndConstructionBusiness, BreadcrumbList | 0 | 41 | 8 |
| /reviews | 2 | HomeAndConstructionBusiness, BreadcrumbList | 0 | 6 | 8 |
| /appliance-repair | 2 | HomeAndConstructionBusiness, FAQPage | 0 | 20 | 7 |
| /commercial-appliance-repair | 2 | HomeAndConstructionBusiness, FAQPage | 0 | 42 | 6 |
| /appliance-repair/refrigerator | 4 | HomeAndConstructionBusiness, Service, FAQPage, BreadcrumbList | 1 | 21 | 10 |
| /appliance-repair/washer | 4 | HomeAndConstructionBusiness, Service, FAQPage, BreadcrumbList | 1 | 21 | 10 |
| /appliance-repair/dryer | 4 | HomeAndConstructionBusiness, Service, FAQPage, BreadcrumbList | 1 | 21 | 10 |
| /appliance-repair/dishwasher | 4 | HomeAndConstructionBusiness, Service, FAQPage, BreadcrumbList | 1 | 21 | 10 |
| /appliance-repair/stove | 4 | HomeAndConstructionBusiness, Service, FAQPage, BreadcrumbList | 1 | 21 | 10 |
| /appliance-repair/range | 4 | HomeAndConstructionBusiness, Service, FAQPage, BreadcrumbList | 1 | 21 | 10 |
| /appliance-repair/cooktop | 4 | HomeAndConstructionBusiness, Service, FAQPage, BreadcrumbList | 1 | 21 | 10 |
| /appliance-repair/microwave | 4 | HomeAndConstructionBusiness, Service, FAQPage, BreadcrumbList | 1 | 21 | 10 |
| /appliance-repair/freezer | 4 | HomeAndConstructionBusiness, Service, FAQPage, BreadcrumbList | 1 | 21 | 10 |
| /appliance-repair/ice-maker | 4 | HomeAndConstructionBusiness, Service, FAQPage, BreadcrumbList | 1 | 21 | 10 |
| /appliance-repair/wine-cooler | 4 | HomeAndConstructionBusiness, Service, FAQPage, BreadcrumbList | 1 | 21 | 10 |
| /appliance-repair/garbage-disposal | 4 | HomeAndConstructionBusiness, Service, FAQPage, BreadcrumbList | 1 | 21 | 10 |
| /commercial-appliance-repair/commercial-refrigerator-repair | 4 | HomeAndConstructionBusiness, Service, FAQPage, BreadcrumbList | 1 | 19 | 10 |
| /commercial-appliance-repair/commercial-dishwasher-repair | 4 | HomeAndConstructionBusiness, Service, FAQPage, BreadcrumbList | 1 | 17 | 10 |
| /commercial-appliance-repair/commercial-ice-machine-repair | 4 | HomeAndConstructionBusiness, Service, FAQPage, BreadcrumbList | 1 | 19 | 10 |
| /commercial-appliance-repair/commercial-laundry-equipment-repair | 4 | HomeAndConstructionBusiness, Service, FAQPage, BreadcrumbList | 1 | 19 | 10 |
| /commercial-appliance-repair/commercial-oven-range-repair | 4 | HomeAndConstructionBusiness, Service, FAQPage, BreadcrumbList | 1 | 19 | 10 |
| /commercial-appliance-repair/restaurant-appliance-repair | 4 | HomeAndConstructionBusiness, Service, FAQPage, BreadcrumbList | 1 | 17 | 10 |
| /commercial-appliance-repair/property-management-appliance-repair | 4 | HomeAndConstructionBusiness, Service, FAQPage, BreadcrumbList | 1 | 21 | 10 |
| /towns/charlotte | 2 | HomeAndConstructionBusiness, BreadcrumbList | 0 | 8 | 9 |
| /towns/ballantyne | 3 | HomeAndConstructionBusiness, FAQPage, BreadcrumbList | 0 | 21 | 10 |
| /towns/rock-hill | 2 | HomeAndConstructionBusiness, BreadcrumbList | 0 | 8 | 9 |
| /towns/fort-mill | 2 | HomeAndConstructionBusiness, BreadcrumbList | 0 | 8 | 9 |
| /towns/matthews | 2 | HomeAndConstructionBusiness, BreadcrumbList | 0 | 8 | 9 |
| /towns/indian-trail | 2 | HomeAndConstructionBusiness, BreadcrumbList | 0 | 8 | 9 |

## Расхождения (0)

Нет.
