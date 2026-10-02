# Ветки: шапки, переключатель, страница выбора, формы

| Путь | Группа | Шапка | Переключатель | Логотип → | итог |
|---|---|---|---|---|---|
| / | entry | entry | — | / | ок |
| /about | shared | shared | — | / | ок |
| /brands | shared | shared | — | / | ок |
| /towns | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |
| /reviews | shared | shared | — | / | ок |
| /appliance-repair | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |
| /commercial-appliance-repair | commercial | commercial | /appliance-repair | /commercial-appliance-repair | ок |
| /appliance-repair/refrigerator | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |
| /appliance-repair/washer | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |
| /appliance-repair/dryer | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |
| /appliance-repair/dishwasher | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |
| /appliance-repair/stove | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |
| /appliance-repair/range | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |
| /appliance-repair/cooktop | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |
| /appliance-repair/microwave | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |
| /appliance-repair/freezer | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |
| /appliance-repair/ice-maker | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |
| /appliance-repair/wine-cooler | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |
| /appliance-repair/garbage-disposal | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |
| /commercial-appliance-repair/commercial-refrigerator-repair | commercial | commercial | /appliance-repair | /commercial-appliance-repair | ок |
| /commercial-appliance-repair/commercial-dishwasher-repair | commercial | commercial | /appliance-repair | /commercial-appliance-repair | ок |
| /commercial-appliance-repair/commercial-ice-machine-repair | commercial | commercial | /appliance-repair | /commercial-appliance-repair | ок |
| /commercial-appliance-repair/commercial-laundry-equipment-repair | commercial | commercial | /appliance-repair | /commercial-appliance-repair | ок |
| /commercial-appliance-repair/commercial-oven-range-repair | commercial | commercial | /appliance-repair | /commercial-appliance-repair | ок |
| /commercial-appliance-repair/restaurant-appliance-repair | commercial | commercial | /appliance-repair | /commercial-appliance-repair | ок |
| /commercial-appliance-repair/property-management-appliance-repair | commercial | commercial | /appliance-repair | /commercial-appliance-repair | ок |
| /towns/charlotte | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |
| /towns/ballantyne | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |
| /towns/rock-hill | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |
| /towns/fort-mill | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |
| /towns/matthews | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |
| /towns/indian-trail | residential | residential | /commercial-appliance-repair | /appliance-repair | ок |

## Страница выбора без JavaScript

| Ширина | H1 | панели (бизнес / дом, px) | бизнес первым | низ кнопки бизнеса / высота окна | гориз. скролл | итог |
|---|---|---|---|---|---|---|
| 1440 | 1 | 826 / 551 | да | 744 / 900 | нет | ок |
| 1024 | 1 | 587 / 392 | да | 631 / 768 | нет | ок |
| 768 | 1 | 743 / 743 | да | 506 / 1024 | нет | ок |
| 390 | 1 | 366 / 366 | да | 508 / 844 | нет | ок |

Клик по «Commercial Service» без JS → /commercial-appliance-repair

Переключатель: /commercial-appliance-repair → /appliance-repair → /commercial-appliance-repair

## /api/book

| Запрос | HTTP | ответ | итог |
|---|---|---|---|
| home валидный | 200 | {"ok":true} | ок |
| home без address | 400 | {"ok":false,"errors":{"address":"Please enter the address"}} | ок |
| business валидный | 200 | {"ok":true} | ок |
| business без name | 400 | {"ok":false,"errors":{"name":"Please enter your name"}} | ок |
| business без phone | 400 | {"ok":false,"errors":{"phone":"Please enter a phone number"}} | ок |
| без branch | 400 | {"ok":false,"errors":{"branch":"Please choose home or business"}} | ок |

**Дефектов:** 0
