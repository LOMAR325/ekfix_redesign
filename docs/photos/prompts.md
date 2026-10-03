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
плит, посудомойки, микроволновки и измельчителя; прачечная — для стиральной и сушильной машин; кухня — и для холодильника, морозилки, льдогенератора
и винного шкафа (фото у Thermador убрано по просьбе владельца). Это честно (на фото именно он), но
не всегда та техника. Ниже — промпты для сцен каждой страницы.

## Hero: бытовые услуги (12)

Каждый промпт — целиком, просто скопировать. В кадре только техника: люди и руки запрещены явно.
Если генератор всё равно рисует человека — добавить в поле negative prompt: `person, people, man, woman, hands, arms, fingers, body`.

### refrigerator

```
A modern stainless French-door refrigerator in a real home kitchen at night, the lower freezer drawer slightly open, a multimeter and a small toolbag resting on the counter beside it. Photorealistic editorial interior photo, full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key lighting: near-black shadows, one soft warm key light from the right, subtle rim light on metal edges. Muted colors with a slight green tint, real textures, no HDR, no glossy CGI look. Composition: the appliance sits in the RIGHT 55% of the frame, the LEFT 45% is dark, calm and empty (space for text). NO PEOPLE: no person, no hands, no arms, no body parts, no reflections of people — an empty room with the appliance only. No text, no logos, no brand names, no watermarks. Aspect ratio 16:9, 2400x1350.
```

### washer

```
A front-load washing machine in a home laundry room, its door open, the small drain-pump filter cover at the bottom open, a folded towel on the floor in front of it. Photorealistic editorial interior photo, full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key lighting: near-black shadows, one soft warm key light from the right, subtle rim light on metal edges. Muted colors with a slight green tint, real textures, no HDR, no glossy CGI look. Composition: the appliance sits in the RIGHT 55% of the frame, the LEFT 45% is dark, calm and empty (space for text). NO PEOPLE: no person, no hands, no arms, no body parts, no reflections of people — an empty room with the appliance only. No text, no logos, no brand names, no watermarks. Aspect ratio 16:9, 2400x1350.
```

### dryer

```
A front-load clothes dryer pulled out from the wall in a home laundry room, the flexible vent hose detached behind it, a work light standing on the floor. Photorealistic editorial interior photo, full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key lighting: near-black shadows, one soft warm key light from the right, subtle rim light on metal edges. Muted colors with a slight green tint, real textures, no HDR, no glossy CGI look. Composition: the appliance sits in the RIGHT 55% of the frame, the LEFT 45% is dark, calm and empty (space for text). NO PEOPLE: no person, no hands, no arms, no body parts, no reflections of people — an empty room with the appliance only. No text, no logos, no brand names, no watermarks. Aspect ratio 16:9, 2400x1350.
```

### dishwasher

```
A built-in stainless dishwasher in a home kitchen, door half open with the lower rack pulled out, the bottom kick panel removed and leaning against the cabinet, a flashlight on the floor. Photorealistic editorial interior photo, full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key lighting: near-black shadows, one soft warm key light from the right, subtle rim light on metal edges. Muted colors with a slight green tint, real textures, no HDR, no glossy CGI look. Composition: the appliance sits in the RIGHT 55% of the frame, the LEFT 45% is dark, calm and empty (space for text). NO PEOPLE: no person, no hands, no arms, no body parts, no reflections of people — an empty room with the appliance only. No text, no logos, no brand names, no watermarks. Aspect ratio 16:9, 2400x1350.
```

### stove

```
A freestanding stainless gas stove in a home kitchen, oven door open with a faint orange glow inside, one burner grate set aside on the counter. Photorealistic editorial interior photo, full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key lighting: near-black shadows, one soft warm key light from the right, subtle rim light on metal edges. Muted colors with a slight green tint, real textures, no HDR, no glossy CGI look. Composition: the appliance sits in the RIGHT 55% of the frame, the LEFT 45% is dark, calm and empty (space for text). NO PEOPLE: no person, no hands, no arms, no body parts, no reflections of people — an empty room with the appliance only. No text, no logos, no brand names, no watermarks. Aspect ratio 16:9, 2400x1350.
```

### range

```
A professional-style 36-inch stainless range with six burners and a large oven in an upscale home kitchen, one burner cap removed and lying on a towel on the counter. Photorealistic editorial interior photo, full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key lighting: near-black shadows, one soft warm key light from the right, subtle rim light on metal edges. Muted colors with a slight green tint, real textures, no HDR, no glossy CGI look. Composition: the appliance sits in the RIGHT 55% of the frame, the LEFT 45% is dark, calm and empty (space for text). NO PEOPLE: no person, no hands, no arms, no body parts, no reflections of people — an empty room with the appliance only. No text, no logos, no brand names, no watermarks. Aspect ratio 16:9, 2400x1350.
```

### cooktop

```
A built-in gas cooktop set into a dark stone countertop, two grates and a burner cap lifted off and placed neatly beside it, a small brush next to them. Photorealistic editorial interior photo, full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key lighting: near-black shadows, one soft warm key light from the right, subtle rim light on metal edges. Muted colors with a slight green tint, real textures, no HDR, no glossy CGI look. Composition: the appliance sits in the RIGHT 55% of the frame, the LEFT 45% is dark, calm and empty (space for text). NO PEOPLE: no person, no hands, no arms, no body parts, no reflections of people — an empty room with the appliance only. No text, no logos, no brand names, no watermarks. Aspect ratio 16:9, 2400x1350.
```

### microwave

```
An over-the-range stainless microwave above a stove in a home kitchen, its door open, a small screwdriver set lying on the stove top below. Photorealistic editorial interior photo, full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key lighting: near-black shadows, one soft warm key light from the right, subtle rim light on metal edges. Muted colors with a slight green tint, real textures, no HDR, no glossy CGI look. Composition: the appliance sits in the RIGHT 55% of the frame, the LEFT 45% is dark, calm and empty (space for text). NO PEOPLE: no person, no hands, no arms, no body parts, no reflections of people — an empty room with the appliance only. No text, no logos, no brand names, no watermarks. Aspect ratio 16:9, 2400x1350.
```

### freezer

```
A standalone stainless upright freezer in a clean garage, door open, light frost on the shelves, cool light from inside the freezer. Photorealistic editorial interior photo, full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key lighting: near-black shadows, one soft warm key light from the right, subtle rim light on metal edges. Muted colors with a slight green tint, real textures, no HDR, no glossy CGI look. Composition: the appliance sits in the RIGHT 55% of the frame, the LEFT 45% is dark, calm and empty (space for text). NO PEOPLE: no person, no hands, no arms, no body parts, no reflections of people — an empty room with the appliance only. No text, no logos, no brand names, no watermarks. Aspect ratio 16:9, 2400x1350.
```

### ice-maker

```
An undercounter stainless ice maker built into kitchen cabinetry, its front grille removed and leaning on the cabinet, the ice bin half full of clear cubes. Photorealistic editorial interior photo, full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key lighting: near-black shadows, one soft warm key light from the right, subtle rim light on metal edges. Muted colors with a slight green tint, real textures, no HDR, no glossy CGI look. Composition: the appliance sits in the RIGHT 55% of the frame, the LEFT 45% is dark, calm and empty (space for text). NO PEOPLE: no person, no hands, no arms, no body parts, no reflections of people — an empty room with the appliance only. No text, no logos, no brand names, no watermarks. Aspect ratio 16:9, 2400x1350.
```

### wine-cooler

```
A dual-zone built-in wine cooler in a home bar, wine bottles on wooden racks inside, the glass door slightly open, soft blue interior LED light. Photorealistic editorial interior photo, full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key lighting: near-black shadows, one soft warm key light from the right, subtle rim light on metal edges. Muted colors with a slight green tint, real textures, no HDR, no glossy CGI look. Composition: the appliance sits in the RIGHT 55% of the frame, the LEFT 45% is dark, calm and empty (space for text). NO PEOPLE: no person, no hands, no arms, no body parts, no reflections of people — an empty room with the appliance only. No text, no logos, no brand names, no watermarks. Aspect ratio 16:9, 2400x1350.
```

### garbage-disposal

```
The open cabinet under a kitchen sink, a garbage disposal unit mounted below the drain, a flashlight lying on the cabinet floor lighting it from below. Photorealistic editorial interior photo, full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key lighting: near-black shadows, one soft warm key light from the right, subtle rim light on metal edges. Muted colors with a slight green tint, real textures, no HDR, no glossy CGI look. Composition: the appliance sits in the RIGHT 55% of the frame, the LEFT 45% is dark, calm and empty (space for text). NO PEOPLE: no person, no hands, no arms, no body parts, no reflections of people — an empty room with the appliance only. No text, no logos, no brand names, no watermarks. Aspect ratio 16:9, 2400x1350.
```

## Hero: коммерческие страницы (7)

### commercial-refrigerator

```
Inside a restaurant walk-in cooler, stainless wire shelving with produce crates, the evaporator coil with its fan at the top of the back wall, a refrigerant gauge set hanging from a shelf. Photorealistic editorial interior photo, full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key lighting: near-black shadows, one soft warm key light from the right, subtle rim light on metal edges. Muted colors with a slight green tint, real textures, no HDR, no glossy CGI look. Composition: the appliance sits in the RIGHT 55% of the frame, the LEFT 45% is dark, calm and empty (space for text). NO PEOPLE: no person, no hands, no arms, no body parts, no reflections of people — an empty room with the appliance only. No text, no logos, no brand names, no watermarks. Aspect ratio 16:9, 2400x1350.
```

### commercial-dishwasher

```
A stainless door-type commercial dish machine in a restaurant dish room, a little steam rising, racks of clean plates stacked beside it, wet tiled floor. Photorealistic editorial interior photo, full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key lighting: near-black shadows, one soft warm key light from the right, subtle rim light on metal edges. Muted colors with a slight green tint, real textures, no HDR, no glossy CGI look. Composition: the appliance sits in the RIGHT 55% of the frame, the LEFT 45% is dark, calm and empty (space for text). NO PEOPLE: no person, no hands, no arms, no body parts, no reflections of people — an empty room with the appliance only. No text, no logos, no brand names, no watermarks. Aspect ratio 16:9, 2400x1350.
```

### commercial-ice-machine

```
A commercial modular ice machine sitting on a stainless storage bin in a restaurant back-of-house, its front panel removed, clear ice cubes visible in the bin. Photorealistic editorial interior photo, full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key lighting: near-black shadows, one soft warm key light from the right, subtle rim light on metal edges. Muted colors with a slight green tint, real textures, no HDR, no glossy CGI look. Composition: the appliance sits in the RIGHT 55% of the frame, the LEFT 45% is dark, calm and empty (space for text). NO PEOPLE: no person, no hands, no arms, no body parts, no reflections of people — an empty room with the appliance only. No text, no logos, no brand names, no watermarks. Aspect ratio 16:9, 2400x1350.
```

### commercial-laundry

```
A row of large stainless commercial washer-extractors in a hotel on-premise laundry, one door open, carts of folded white towels, a toolbag on the concrete floor. Photorealistic editorial interior photo, full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key lighting: near-black shadows, one soft warm key light from the right, subtle rim light on metal edges. Muted colors with a slight green tint, real textures, no HDR, no glossy CGI look. Composition: the appliance sits in the RIGHT 55% of the frame, the LEFT 45% is dark, calm and empty (space for text). NO PEOPLE: no person, no hands, no arms, no body parts, no reflections of people — an empty room with the appliance only. No text, no logos, no brand names, no watermarks. Aspect ratio 16:9, 2400x1350.
```

### commercial-oven-range

```
A restaurant cook line after hours: a six-burner commercial range with a convection oven below, a fryer beside it, stainless backsplash, the oven door open. Photorealistic editorial interior photo, full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key lighting: near-black shadows, one soft warm key light from the right, subtle rim light on metal edges. Muted colors with a slight green tint, real textures, no HDR, no glossy CGI look. Composition: the appliance sits in the RIGHT 55% of the frame, the LEFT 45% is dark, calm and empty (space for text). NO PEOPLE: no person, no hands, no arms, no body parts, no reflections of people — an empty room with the appliance only. No text, no logos, no brand names, no watermarks. Aspect ratio 16:9, 2400x1350.
```

### restaurant

```
An empty restaurant kitchen after closing: stainless prep tables, a two-door reach-in cooler, a range and a dish station receding into depth, a single work light on. Photorealistic editorial interior photo, full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key lighting: near-black shadows, one soft warm key light from the right, subtle rim light on metal edges. Muted colors with a slight green tint, real textures, no HDR, no glossy CGI look. Composition: the appliance sits in the RIGHT 55% of the frame, the LEFT 45% is dark, calm and empty (space for text). NO PEOPLE: no person, no hands, no arms, no body parts, no reflections of people — an empty room with the appliance only. No text, no logos, no brand names, no watermarks. Aspect ratio 16:9, 2400x1350.
```

### property-management

```
A tidy apartment kitchen with standard appliances — refrigerator, range and dishwasher — a clipboard with a work order lying on the counter, a toolbag by the door. Photorealistic editorial interior photo, full-frame camera, 35mm lens, f/2.8. Dark, moody, low-key lighting: near-black shadows, one soft warm key light from the right, subtle rim light on metal edges. Muted colors with a slight green tint, real textures, no HDR, no glossy CGI look. Composition: the appliance sits in the RIGHT 55% of the frame, the LEFT 45% is dark, calm and empty (space for text). NO PEOPLE: no person, no hands, no arms, no body parts, no reflections of people — an empty room with the appliance only. No text, no logos, no brand names, no watermarks. Aspect ratio 16:9, 2400x1350.
```

## Карточки техники — одна серия (17)

Затем для сетки «We repair» и коммерческих карточек — на прозрачном фоне.

### card: refrigerator

```
Studio product photo of a stainless French-door refrigerator, three-quarter view from the left, isolated on a fully transparent background, soft even studio lighting, realistic stainless steel and black glass, no logos or brand names on the appliance, no people, no hands, no text. Square 1000x1000 PNG, the appliance fills 85% of the height, centered.
```

### card: washer

```
Studio product photo of a front-load washing machine, three-quarter view from the left, isolated on a fully transparent background, soft even studio lighting, realistic stainless steel and black glass, no logos or brand names on the appliance, no people, no hands, no text. Square 1000x1000 PNG, the appliance fills 85% of the height, centered.
```

### card: dryer

```
Studio product photo of a front-load clothes dryer, three-quarter view from the left, isolated on a fully transparent background, soft even studio lighting, realistic stainless steel and black glass, no logos or brand names on the appliance, no people, no hands, no text. Square 1000x1000 PNG, the appliance fills 85% of the height, centered.
```

### card: dishwasher

```
Studio product photo of a stainless built-in dishwasher with the door closed, three-quarter view from the left, isolated on a fully transparent background, soft even studio lighting, realistic stainless steel and black glass, no logos or brand names on the appliance, no people, no hands, no text. Square 1000x1000 PNG, the appliance fills 85% of the height, centered.
```

### card: stove

```
Studio product photo of a freestanding stainless gas stove, three-quarter view from the left, isolated on a fully transparent background, soft even studio lighting, realistic stainless steel and black glass, no logos or brand names on the appliance, no people, no hands, no text. Square 1000x1000 PNG, the appliance fills 85% of the height, centered.
```

### card: range

```
Studio product photo of a 36-inch professional-style stainless dual-fuel range, three-quarter view from the left, isolated on a fully transparent background, soft even studio lighting, realistic stainless steel and black glass, no logos or brand names on the appliance, no people, no hands, no text. Square 1000x1000 PNG, the appliance fills 85% of the height, centered.
```

### card: cooktop

```
Studio product photo of a 30-inch gas cooktop with cast-iron grates, three-quarter view from the left, isolated on a fully transparent background, soft even studio lighting, realistic stainless steel and black glass, no logos or brand names on the appliance, no people, no hands, no text. Square 1000x1000 PNG, the appliance fills 85% of the height, centered.
```

### card: microwave

```
Studio product photo of an over-the-range stainless microwave, three-quarter view from the left, isolated on a fully transparent background, soft even studio lighting, realistic stainless steel and black glass, no logos or brand names on the appliance, no people, no hands, no text. Square 1000x1000 PNG, the appliance fills 85% of the height, centered.
```

### card: freezer

```
Studio product photo of a stainless upright freezer, three-quarter view from the left, isolated on a fully transparent background, soft even studio lighting, realistic stainless steel and black glass, no logos or brand names on the appliance, no people, no hands, no text. Square 1000x1000 PNG, the appliance fills 85% of the height, centered.
```

### card: ice-maker

```
Studio product photo of a stainless undercounter ice maker, three-quarter view from the left, isolated on a fully transparent background, soft even studio lighting, realistic stainless steel and black glass, no logos or brand names on the appliance, no people, no hands, no text. Square 1000x1000 PNG, the appliance fills 85% of the height, centered.
```

### card: wine-cooler

```
Studio product photo of a dual-zone wine cooler with a glass door, three-quarter view from the left, isolated on a fully transparent background, soft even studio lighting, realistic stainless steel and black glass, no logos or brand names on the appliance, no people, no hands, no text. Square 1000x1000 PNG, the appliance fills 85% of the height, centered.
```

### card: garbage-disposal

```
Studio product photo of a garbage disposal unit, three-quarter view from the left, isolated on a fully transparent background, soft even studio lighting, realistic stainless steel and black glass, no logos or brand names on the appliance, no people, no hands, no text. Square 1000x1000 PNG, the appliance fills 85% of the height, centered.
```

### card: commercial-refrigeration

```
Studio product photo of a two-door stainless commercial reach-in refrigerator, three-quarter view from the left, isolated on a fully transparent background, soft even studio lighting, realistic stainless steel and black glass, no logos or brand names on the appliance, no people, no hands, no text. Square 1000x1000 PNG, the appliance fills 85% of the height, centered.
```

### card: commercial-dishwasher

```
Studio product photo of a stainless door-type commercial dishwasher, three-quarter view from the left, isolated on a fully transparent background, soft even studio lighting, realistic stainless steel and black glass, no logos or brand names on the appliance, no people, no hands, no text. Square 1000x1000 PNG, the appliance fills 85% of the height, centered.
```

### card: commercial-ice-machine

```
Studio product photo of a commercial modular ice machine on an ice storage bin, three-quarter view from the left, isolated on a fully transparent background, soft even studio lighting, realistic stainless steel and black glass, no logos or brand names on the appliance, no people, no hands, no text. Square 1000x1000 PNG, the appliance fills 85% of the height, centered.
```

### card: commercial-laundry

```
Studio product photo of a stainless commercial washer-extractor, three-quarter view from the left, isolated on a fully transparent background, soft even studio lighting, realistic stainless steel and black glass, no logos or brand names on the appliance, no people, no hands, no text. Square 1000x1000 PNG, the appliance fills 85% of the height, centered.
```

### card: commercial-oven-range

```
Studio product photo of a commercial six-burner range with an oven below, three-quarter view from the left, isolated on a fully transparent background, soft even studio lighting, realistic stainless steel and black glass, no logos or brand names on the appliance, no people, no hands, no text. Square 1000x1000 PNG, the appliance fills 85% of the height, centered.
```

## Страница выбора: фон панели «For Business»

Цель — фото в паре к панели «For Homes» (Константин в тёмно-зелёном поло у стиральной машины, тёмный фон,
мягкий тёплый свет справа). Сейчас бизнес-панель — селфи на кухне ресторана: другой ракурс, свет и цвет.

**Вариант A (рекомендую): реальный Константин, генерация по референсу.** В генератор с загрузкой
референсов (например, Nano Banana / Gemini, ChatGPT images, Midjourney --cref) загрузить два фото:
`public/images/ek-global-technician-washer-repair-charlotte.webp` (цветокор и настроение) и
`public/images/ek-global-technician-commercial-washer-extractor.webp` (лицо, налобный фонарик).

Как различить панели с первого взгляда (на «домашнем» фото он стоит, смотрит в камеру, тёплый жилой
интерьер, дрель в руке):

- **поза и действие** — не позирует, а работает: присел на одно колено у открытого шкафа, смотрит в
  манометр, не в камеру;
- **ракурс** — три четверти сбоку и чуть снизу, а не фронтально;
- **среда и цвет** — холодная нержавейка и белый свет кухни ресторана против тёплого дома;
- **детали** — налобный фонарик (есть на его реальных фото с объектов), манометры хладагента вместо дрели.

Свет, цветокор и одежда остаются общими — панели выглядят как одна серия, но читаются как разные миры.

```
Use the first reference image ONLY for the overall color grade and mood, and the second for the man's
face, build and headlamp — keep his face exactly as in the reference, no beautification, natural skin.
Same man in the same dark green polo with a small chest logo, black work gloves, a headlamp on his forehead.
He is NOT posing and NOT looking at the camera: he kneels on one knee in front of an open stainless
two-door commercial reach-in refrigerator in a restaurant back-of-house kitchen, focused, reading a
refrigerant manifold gauge set in his hands, hoses running into the unit's lower compartment. Camera at
a low three-quarter angle from his left side, 35mm, he fills the right half of the frame, the left half
is calm and dark. Environment: brushed stainless walls and shelving, cool white overhead kitchen light
falling off into shadow, a dish machine softly out of focus behind him, a toolbag on the tiled floor.
Grade: dark, low-key, near-black shadows (#0b0c0b), a slight green tint like reference one — but the
light here is cool and clinical, not warm. Photorealistic documentary photo, not CGI, not staged-looking.
No text, no logos other than the one on the polo. 3:2, 2400x1600.
```

Если генератор плохо держит лицо при таком ракурсе — запасной вариант позы: он стоит спиной к камере
вполоборота у открытой двери walk-in камеры, лицо в профиль, в руке фонарик, освещающий испаритель.

**Вариант B: без генерации.** Взять настоящее фото у промышленной стиральной машины
(`ek-global-technician-commercial-washer-extractor.webp`) и обработать в цвет «домашнего» фото:
затемнить фон, поднять лицо, тёплый свет, лёгкий зелёный тон. Минус — исходник 1280px, на больших
экранах будет мягковато; лучше прислать оригинал в полном размере.

Что бы ни выбрали — пришлите результат, я вставлю его, подстрою кадрирование и затемнение панели.
