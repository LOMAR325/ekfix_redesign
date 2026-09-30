# 0023. Две формы — один `/api/book`: размеченное объединение по `branch`, пресеты из URL, GA4

## Контекст

ADR 0010: одна форма `BookForm` (имя, телефон, прибор, «I'm contacting you as a…», описание),
`POST /api/book` → `submitLead` → zod → sinks. Пресет формы с других страниц — `/?as=…&appliance=…#book`,
который читал `BookingProvider`. Бриф `two-branch-site` §5: бытовая форма — как была, без поля
«contacting you as» (ветка уже это определяет); коммерческая — компания, контактное лицо, телефон,
email, тип бизнеса, оборудование, число объектов/юнитов, срочность, описание (обязательны компания,
имя, телефон, тип бизнеса). Один обработчик принимает обе как размеченное объединение с zod на
каждую; письмо о коммерческой заявке отличается темой; события GA4 отдельно по каждой форме.

## Решение

- **Схема** (`lib/book/schema.ts`): `leadSchema = z.discriminatedUnion("branch", [homeLeadSchema,
  businessLeadSchema])`. Пустые `email` / `equipment` / `urgency` считаются отсутствующими.
  `submitLead` сам проверяет `branch` до zod: нет или неизвестен → `400 {errors:{branch}}`, чтобы
  служебное сообщение zod не попало в интерфейс. Остальное — как в ADR 0010 (первое сообщение на
  поле, sinks через `Promise.allSettled`, упавший канал не валит заявку).
- **Опции** — `data/forms.ts` (`homeApplianceOptions`, `businessTypeOptions`,
  `businessEquipmentOptions`, `urgencyOptions`), реэкспорт в `lib/book/options`; `<select>` и zod
  читают одни массивы. `LeadInput` в `data/types` — объединение `HomeLeadInput | BusinessLeadInput`;
  тип-проверка в схеме держит их совместимыми.
- **Письмо** (`EmailLeadSink`): тема бытовой — `New home repair request — <appliance>`, коммерческой —
  `[BUSINESS] Commercial service request — <company> (<businessType>)`.
- **Формы** — `components/HomeBookForm` (в `#book` бытовой главной) и `components/BusinessRequestForm`
  (в `#request` коммерческой), общая логика отправки — `components/lead-submit.ts`. Разметка и
  классы — прежние `.book-card` / `.book-form` / `.row-2`; новых стилей формы не понадобилось.
- **Пресеты** — `components/booking-link.ts` (единственное место имён параметров):
  `homeBookingHref({appliance})` → `/appliance-repair?appliance=…#book` (CTA страниц услуг),
  `businessRequestHref({businessType, equipment})` → `/commercial-appliance-repair?type=…&equipment=…#request`
  (карточки сегментов без отраслевой страницы, CTA дочерних коммерческих страниц). Форма читает
  `location.search` на монтировании и принимает только реальные опции. `BookingProvider`,
  `RequestQuoteButton`, `contactAs` и `ContactAsOption` удалены.
- **GA4** (`lib/analytics.track`): `branch_select {branch}` — клик на странице выбора;
  `residential_form_submit {appliance}` и `commercial_form_submit {business_type}` — успешная отправка.
  Без загруженного `gtag` событие молча пропускается, переход и отправку не задерживает
  (`transport_type: beacon`).

## Почему так, а не иначе

- **Два обработчика (`/api/book` и `/api/request`)** — отвергнуто брифом («один обработчик») и
  дублировало бы sinks и тесты; дискриминатор в теле — обычный способ различать формы у одного адреса.
- **Оставить `contactAs` и вывести ветку из него** — отвергнуто: бытовая форма по брифу без этого
  поля, а коммерческой нужен свой «Type of business» с другими значениями.
- **Контекст-провайдер для пресета** — не нужен: карточки бытовой главной ведут на страницы услуг,
  а все пресеты приходят из URL; форма читает их сама.

## Последствия

- ADR 0010 в части «одна форма, поле contactAs» заменён; механизм sinks и `.env` не менялся.
- Старый клиент, шлющий заявку без `branch`, получит 400 — такого клиента нет (форма в том же деплое).
- Тесты: `lib/book/submit.test.ts`, `lib/book/sinks.test.ts`, `app/api/book/route.test.ts` (42),
  `components/booking-link.test.ts`.

> **Пересмотрено 2026-09-30 (владелец):** обе формы — одни и те же четыре поля: имя, телефон, адрес,
> проблема/заметки (обязательны первые три). Один компонент `components/LeadForm({branch})`; `branch` по-прежнему
> в теле запроса и в теме письма (`[BUSINESS] Commercial service request — <имя>, <адрес>`). Поля выбора
> (прибор, тип бизнеса, оборудование, срочность) и пресеты из URL (`components/booking-link`) удалены;
> `data/forms` держит только `leadBranches`. GA4-события — без параметров.
