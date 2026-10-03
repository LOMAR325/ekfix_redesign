# Фото сайта: разбор и промпты для генерации (2026-10-03)

## Разбор текущих фото техники (`public/images/*-repair.webp`)

Это стоковые студийные вырезки разных брендов, ракурсов и освещения. Для карточек они годятся, для hero —
нет: это не сцены.

| Карточка | Что на фото | Проблема |
|---|---|---|
| Refrigerator | Samsung French door, тёмный | ок |
| Washer | Haier фронтальная, тёмная | ок, но другой стиль, чем у Dryer |
| Dryer | Beko сушилка, белая | ок |
| Dishwasher | Siemens, открытая | ок |
| Stove / **Range** | одно и то же фото Samsung | **дубль**: у Range нет своего фото |
| Cooktop | газовая панель WindMax | ок |
| Microwave | Whirlpool OTR | ок |
| **Freezer** | двухкамерный холодильник Samsung | **не морозилка** |
| Ice Maker | встраиваемый льдогенератор | ок |
| Wine Cooler | NewAir | ок |
| Garbage Disposal | InSinkErator Badger, крупный логотип | бренд в кадре |
| **Коммерческие карточки (4)** | те же бытовые вырезки | **не коммерческое оборудование** |

Вывод: заменить Range, Freezer, Garbage Disposal и все коммерческие карточки (5 equipment-страниц),
а остальные карточки переснять в одном стиле — тогда сетка выглядит как одна серия.

**Hero внутренних страниц** сейчас временно стоят на настоящих фото Константина с вызовов: кухня — для
плит, посудомойки, микроволновки и измельчителя; прачечная — для стиральной и сушильной машин; холодильник
Thermador — для холодильника, морозилки, льдогенератора и винного шкафа. Это честно (на фото именно он), но
не всегда та техника. Ниже — промпты для сцен каждой страницы.

## Общий стиль (вставлять в начало каждого промпта)

```
Photorealistic editorial photo, shot on a full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key
lighting: near-black background (#0b0c0b), one soft warm key light from the right, subtle rim light.
Muted colors with a slight green tint, natural skin and metal textures, no HDR, no glossy CGI look.
The subject sits in the RIGHT 55% of the frame; the left 45% is dark and empty (text goes there).
No text, no logos, no brand names, no watermarks. 16:9, 2400x1350.
```

## Hero: бытовые услуги (12)

Без людей или только руки техника (перчатки, инструмент), чтобы не выдавать сгенерированного человека за
Константина. Каждому — «Общий стиль» + строка:

- **refrigerator** — `A modern stainless French-door refrigerator in a real home kitchen at night, lower door open, a technician's gloved hand holding a multimeter probe near the control board.`
- **washer** — `A front-load washing machine in a home laundry room, door open, a technician's gloved hands removing the drain pump filter, towel on the floor.`
- **dryer** — `A front-load clothes dryer pulled away from the wall in a laundry room, rear panel off, vent hose and heating element visible, a work light on the floor.`
- **dishwasher** — `A built-in dishwasher in a home kitchen with the lower kick panel removed, a technician's gloved hand with a flashlight checking the pump underneath.`
- **stove** — `A freestanding stainless gas stove in a home kitchen, oven door open, a technician's hand testing the bake igniter with a meter, faint glow inside the oven.`
- **range** — `A professional-style 36-inch range with six burners and a large oven in an upscale home kitchen, one burner cap removed, tools laid on a towel on the counter.`
- **cooktop** — `A built-in gas cooktop on a stone countertop, grates and burner caps lifted off and placed aside, a technician's hand cleaning an igniter with a small brush.`
- **microwave** — `An over-the-range microwave above a stove in a home kitchen, door open, the control panel slightly pulled out, a small screwdriver set on the counter below.`
- **freezer** — `A standalone upright freezer in a garage, door open with frost on the shelves, a technician's gloved hand checking the evaporator cover.`
- **ice-maker** — `An undercounter ice maker built into kitchen cabinetry, front grille removed, ice bin half full, a technician's hand pointing a flashlight inside.`
- **wine-cooler** — `A dual-zone built-in wine cooler in a home bar, wine bottles inside, the glass door open, soft blue interior LED, a technician's gloved hand at the thermostat.`
- **garbage-disposal** — `The cabinet under a kitchen sink, a garbage disposal unit mounted below the drain, a technician's hand with an Allen key in the bottom socket, flashlight on.`

## Hero: коммерческие страницы (7)

- **commercial-refrigerator** — `Inside a restaurant walk-in cooler, stainless shelving with produce crates, the evaporator fan coil visible at the top, a technician's gloved hand with a refrigerant gauge set.`
- **commercial-dishwasher** — `A stainless door-type commercial dish machine in a restaurant dish room, steam rising, racks of plates beside it, a technician's hand on the control panel.`
- **commercial-ice-machine** — `A commercial modular ice machine on a storage bin in a restaurant back-of-house, front panel off, clear ice cubes in the bin, a technician's flashlight beam inside.`
- **commercial-laundry** — `A row of large stainless commercial washer-extractors in a hotel on-premise laundry, one door open, carts with white towels, a technician's toolbag on the floor.`
- **commercial-oven-range** — `A restaurant cook line: a six-burner commercial range with a convection oven below and a fryer beside it, stainless backsplash, the oven door open, after-hours lighting.`
- **restaurant** — `An empty restaurant kitchen after closing: stainless prep tables, a reach-in cooler, a range and a dish station in depth, one work light on, a toolbag on the prep table.`
- **property-management** — `A tidy apartment unit kitchen with standard appliances (fridge, range, dishwasher), a clipboard with a work order on the counter, a technician's toolbag at the door.`

## Карточки техники (сетка «We repair» и коммерческие карточки) — одна серия

```
Studio product photo of [APPLIANCE], three-quarter view from the left, isolated on a fully transparent
background, soft even studio light, realistic stainless steel and black glass, no logos or brand
names on the appliance, no text. Square 1000x1000 PNG, the appliance fills 85% of the height, centered.
```

Подставить в `[APPLIANCE]`: `a stainless French-door refrigerator` · `a front-load washing machine` ·
`a front-load clothes dryer` · `a stainless built-in dishwasher, door closed` · `a freestanding gas stove`
· `a 36-inch professional-style dual-fuel range` · `a 30-inch gas cooktop with cast-iron grates` ·
`an over-the-range microwave` · `a stainless upright freezer` · `an undercounter ice maker` ·
`a dual-zone wine cooler` · `a garbage disposal unit` · коммерческие: `a two-door stainless commercial
reach-in refrigerator` · `a stainless door-type commercial dishwasher` · `a commercial modular ice machine
on an ice bin` · `a stainless commercial washer-extractor` · `a commercial six-burner range with an oven`.

## Страница выбора: фон панели «For Business»

Цель — фото в паре к панели «For Homes» (Константин в тёмно-зелёном поло у стиральной машины, тёмный фон,
мягкий тёплый свет справа). Сейчас бизнес-панель — селфи на кухне ресторана: другой ракурс, свет и цвет.

**Вариант A (рекомендую): реальный Константин, генерация по референсу.** В генератор с загрузкой
референсов (например, Nano Banana / Gemini, ChatGPT images, Midjourney --cref) загрузить два фото:
`public/images/ek-global-technician-washer-repair-charlotte.webp` (стиль и свет) и
`public/images/ek-global-owner-thermador-refrigerator-charlotte.webp` (лицо). Промпт:

```
Use the first reference image for lighting, color grade, framing and wardrobe, and the second for the
man's face and build — keep his face exactly as in the reference, no beautification. Same man, same
dark green polo with a small logo on the chest, same black work gloves, holding a cordless drill,
smiling at the camera, standing in a restaurant back-of-house kitchen next to a stainless commercial
reach-in refrigerator and a dish machine, stainless shelving behind. Same dark moody low-key light as
reference one: near-black background, soft warm key from the right, slight green tint. Waist-up, he is
on the right half of the frame, the left half is dark and calm. Photorealistic, not CGI. No text, no logos
other than the one on the polo. 3:2, 2400x1600.
```

**Вариант B: без генерации.** Взять настоящее фото у промышленной стиральной машины
(`ek-global-technician-commercial-washer-extractor.webp`) и обработать в цвет «домашнего» фото:
затемнить фон, поднять лицо, тёплый свет, лёгкий зелёный тон. Минус — исходник 1280px, на больших
экранах будет мягковато; лучше прислать оригинал в полном размере.

Что бы ни выбрали — пришлите результат, я вставлю его, подстрою кадрирование и затемнение панели.
