# Шаблонность — story 83 (R97, R93)

Прогон 2026-09-29 · `npm run check:similarity -- --base http://localhost:3112 --group areas|commercial` против `npm run dev` (видны черновики). Порог публикации ≤ 0.30 по **редакционной** метрике (spec §10, поправка D01); полная метрика — для сведения.

## Итог

- **Коммерческие (7):** максимум по редакционной 0.07–0.11, по полной 0.10–0.15 — все ≤ 0.30, все 7 опубликованы законно.
- **Районы/города (7):** Charlotte 0.24, Ballantyne 0.04 (опубликован), South Charlotte 0.04 (черновик — не хватает фактов 3–5, не сходства). **Rock Hill 0.42, Fort Mill 0.33, Matthews 0.44, Indian Trail 0.44 — выше порога.** Эти четыре страницы опубликованы до прогона (ADR 0008); по spec D01 это находка для отчёта, а не повод менять порог или снимать страницы. Общее у них: блок отзывов и абзац про $75/same-day. Решение — владельцу: переписать абзацы своими фактами по каждому городу или снять в черновик.

## Районы и города — полный вывод

```

> ekfix@0.1.0 check:similarity
> node --no-warnings scripts/similarity.mjs --base http://localhost:3112 --group areas


check:similarity — group "areas", 7 page(s), base http://localhost:3112
masked as ⟨X⟩: South Charlotte, NC, Indian Trail, NC, South Charlotte, Ballantyne, NC, Charlotte, NC, Rock Hill, SC, Fort Mill, SC, Matthews, NC, Indian Trail, Ballantyne, Charlotte, Rock Hill, Fort Mill, Matthews

full text — Jaccard, 3-word shingles
                     1    2    3    4    5    6    7
charlotte            — 0.10 0.06 0.27 0.23 0.27 0.28   (1, 344 shingles)
south-charlotte   0.10    — 0.07 0.11 0.11 0.12 0.12   (2, 67 shingles)
ballantyne        0.06 0.07    — 0.06 0.04 0.06 0.05   (3, 479 shingles)
rock-hill         0.27 0.11 0.06    — 0.38 0.45 0.45   (4, 292 shingles)
fort-mill         0.23 0.11 0.04 0.38    — 0.38 0.38   (5, 295 shingles)
matthews          0.27 0.12 0.06 0.45 0.38    — 0.47   (6, 280 shingles)
indian-trail      0.28 0.12 0.05 0.45 0.38 0.47    —   (7, 283 shingles)

editorial text — Jaccard, 3-word shingles
                     1    2    3    4    5    6    7
charlotte            — 0.03 0.04 0.23 0.18 0.23 0.24   (1, 276 shingles)
south-charlotte   0.03    — 0.01 0.04 0.04 0.04 0.04   (2, 33 shingles)
ballantyne        0.04 0.01    — 0.03 0.01 0.02 0.02   (3, 437 shingles)
rock-hill         0.23 0.04 0.03    — 0.30 0.42 0.42   (4, 215 shingles)
fort-mill         0.18 0.04 0.01 0.30    — 0.33 0.33   (5, 220 shingles)
matthews          0.23 0.04 0.02 0.42 0.33    — 0.44   (6, 205 shingles)
indian-trail      0.24 0.04 0.02 0.42 0.33 0.44    —   (7, 207 shingles)

Max per page — decision by EDITORIAL, threshold ≤ 0.30
page              full  editorial
charlotte        0.28       0.24   ok
south-charlotte  0.12       0.04   ok
ballantyne       0.07       0.04   ok
rock-hill        0.45       0.42   OVER — keep as draft (vs matthews)
fort-mill        0.38       0.33   OVER — keep as draft (vs indian-trail)
matthews         0.47       0.44   OVER — keep as draft (vs indian-trail)
indian-trail     0.47       0.44   OVER — keep as draft (vs matthews)
```

## Коммерческие страницы — полный вывод

```

> ekfix@0.1.0 check:similarity
> node --no-warnings scripts/similarity.mjs --base http://localhost:3112 --group commercial


check:similarity — group "commercial", 7 page(s), base http://localhost:3112
masked as ⟨X⟩: Property Management Appliance Repairs, Commercial Laundry Equipment Repairs, Property Management Appliance Repair, Commercial Laundry Equipment Repair, Property Management & Multifamilys, Commercial Dishwasher/Warewashers, Property Management & Multifamily, Commercial Dishwasher/Warewasher, Commercial Refrigerator Repairs, Commercial Oven & Range Repairs, Commercial Refrigerator Repair, Commercial Ice Machine Repairs, Commercial Oven & Range Repair, Commercial Dishwasher Repairs, Commercial Ice Machine Repair, Commercial Laundry Equipments, Commercial Dishwasher Repair, Commercial Laundry Equipment, Restaurant Appliance Repairs, Restaurant Appliance Repair, Commercial Refrigerations, Laundry Equipment Repairs, Commercial Refrigerators, Commercial Refrigeration, Laundry Equipment Repair, Commercial Oven & Ranges, Commercial Refrigerator, Commercial Ice Machines, Commercial Oven & Range, Commercial Dishwashers, Dishwasher/Warewashers, Commercial Ice Machine, Commercial Dishwasher, Dishwasher/Warewasher, Refrigerator Repairs, Oven & Range Repairs, Property Managements, Property managements, Refrigerator Repair, Ice Machine Repairs, Oven & Range Repair, Restaurants & Cafés, Restaurants & cafés, Commercial Kitchens, Property Management, Property management, Dishwasher Repairs, Ice Machine Repair, Laundry Equipments, Commercial Kitchen, Dishwasher Repair, Laundry Equipment, Property Managers, Commercial Ovens, Property Manager, Commercial Oven, Refrigerations, Refrigerators, Refrigeration, Range Repairs, Oven & Ranges, Refrigerator, Ice Machines, Range Repair, Oven & Range, Hospitalitys, Multifamilys, Dishwashers, Warewashers, Ice Machine, Restaurants, Hospitality, Multifamily, Dishwasher, Warewasher, Restaurant, Kitchens, Kitchen, Ranges, Hotels, Range, Cafés, cafés, Cafes, Hotel, Café, Cafe

full text — Jaccard, 3-word shingles
                                          1    2    3    4    5    6    7
commercial-refrigerator-repair            — 0.09 0.11 0.09 0.10 0.10 0.09   (1, 597 shingles)
commercial-dishwasher-repair           0.09    — 0.10 0.11 0.11 0.15 0.10   (2, 566 shingles)
commercial-ice-machine-repair          0.11 0.10    — 0.10 0.12 0.12 0.10   (3, 545 shingles)
commercial-laundry-equipment-repair    0.09 0.11 0.10    — 0.11 0.10 0.10   (4, 540 shingles)
commercial-oven-range-repair           0.10 0.11 0.12 0.11    — 0.12 0.09   (5, 516 shingles)
restaurant-appliance-repair            0.10 0.15 0.12 0.10 0.12    — 0.09   (6, 518 shingles)
property-management-appliance-repair   0.09 0.10 0.10 0.10 0.09 0.09    —   (7, 572 shingles)

editorial text — Jaccard, 3-word shingles
                                          1    2    3    4    5    6    7
commercial-refrigerator-repair            — 0.07 0.08 0.07 0.07 0.07 0.06   (1, 551 shingles)
commercial-dishwasher-repair           0.07    — 0.08 0.08 0.09 0.11 0.07   (2, 518 shingles)
commercial-ice-machine-repair          0.08 0.08    — 0.07 0.09 0.08 0.07   (3, 504 shingles)
commercial-laundry-equipment-repair    0.07 0.08 0.07    — 0.08 0.08 0.07   (4, 486 shingles)
commercial-oven-range-repair           0.07 0.09 0.09 0.08    — 0.08 0.07   (5, 476 shingles)
restaurant-appliance-repair            0.07 0.11 0.08 0.08 0.08    — 0.07   (6, 461 shingles)
property-management-appliance-repair   0.06 0.07 0.07 0.07 0.07 0.07    —   (7, 524 shingles)

Max per page — decision by EDITORIAL, threshold ≤ 0.30
page                                   full  editorial
commercial-refrigerator-repair        0.11       0.08   ok
commercial-dishwasher-repair          0.15       0.11   ok
commercial-ice-machine-repair         0.12       0.09   ok
commercial-laundry-equipment-repair   0.11       0.08   ok
commercial-oven-range-repair          0.12       0.09   ok
restaurant-appliance-repair           0.15       0.11   ok
property-management-appliance-repair  0.10       0.07   ok
```
