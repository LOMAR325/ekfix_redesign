# 04 — Заявка: lib/book + /api/book + BookForm (прототип)

**Требования:** R06, R06.1, R06.2, R06.3, R06a, R42, R23 (поле формы)
**Blocked by:** 02
**Зона:** `lib/book/`, `app/api/book/route.ts`, `components/BookForm.tsx`, `components/BookingProvider.tsx`, тесты
**Волна:** 3
**Status:** ready

## Что должно заработать

Посетитель заполняет форму заявки, жмёт «Send My Request», форма постит на
`/api/book`, роут валидирует и логирует заявку, возвращает 200, форма показывает
«Thank you!». Невалидный ввод — понятная ошибка, введённое не пропадает. Сбой сети —
сообщение «позвоните», не белый экран. Двойной клик не шлёт дважды. Реальная доставка
на email/вебхук **не подключается** — это прототип; интерфейс `LeadSink` и
`.env.example` готовы для владельца.

## Из брифа, дословно

> «реализовать реальный Route Handler (app/api/book/route.ts), который шлёт заявку на email и/или в вебхук. Это важнее любых других правок»
> Дополнение 2026-09-01: «пока что это работать не будет, сделай просто как прототип»
> «новое поле в форме заявки» — «I'm contacting you as a...»
> «Форма заявки реально отправляет данные (email/webhook) — проверено сквозным тестом» (сужено: тест = роут принимает валидный POST → 200 + лог, отклоняет невалидный)

## Разделы спецификации

Истории 18–22, 27; Границы `lib/book` / `app/api/book`; Шов 1; Решения §lib/book,
§Клиентское поведение (BookForm, BookingProvider).

## Что делать

1. `lib/book/schema.ts` — zod: `name` (non-empty), `phone` (non-empty; лёгкая
   нормализация, без жёсткого формата), `appliance` (non-empty, из списка
   `data/services` + `commercialCategories` + «Commercial kitchen» + «Other»),
   `contactAs` (enum: Homeowner / Property Manager / Restaurant or Café /
   Hotel or Hospitality / Other Business), `message` (optional).
2. `lib/book/sinks.ts` — `interface LeadSink { name; enabled; send(lead) }`.
   - `ConsoleLeadSink` — `enabled: true`, `console.info` структурированной заявки.
   - `EmailLeadSink` — `enabled: !!process.env.RESEND_API_KEY && !!process.env.BOOK_NOTIFY_EMAIL`;
     `send()` — **заглушка** (`// TODO: подключить Resend`), не делает сетевых вызовов.
   - `WebhookLeadSink` — `enabled: !!process.env.BOOK_WEBHOOK_URL`; `send()` —
     `fetch(POST)` на URL, обёрнут в try/catch (не валит заявку). Реально работает,
     если переменная задана, но по умолчанию выключен.
3. `lib/book/submit.ts` — `submitLead(input)`: валидирует zod → при ошибке
   `{ok:false, errors}` (map поле→сообщение, БЕЗ вызова sinks); при успехе —
   `Promise.allSettled` по включённым sinks, вернуть `{ok:true}` даже если sink
   бросил (заявка «принята»).
4. `app/api/book/route.ts` — `POST`: `await req.json()` → `submitLead` → `NextResponse`
   200 `{ok:true}` или 400 `{ok:false, errors}`. `runtime: 'nodejs'`.
5. `components/BookingProvider.tsx` (`'use client'`) — контекст `{appliance, setAppliance}`.
6. `components/BookForm.tsx` (`'use client'`) — разметка 1:1 из текущего
   `#book .book-card` / `form#book-form`: `row-2` (name, phone), `<select id="appliance">`
   (опции из `data/services.formLabel` + `commercialCategories.formLabel` +
   «Commercial kitchen» + «Other»), **новый `<select>`** «I'm contacting you as a…»
   ПЕРЕД `<textarea>` (тот же класс/стиль, значения из п.1; порядок: Homeowner,
   Property Manager, Restaurant or Café, Hotel or Hospitality, Other Business —
   но в приёмке R27 юрлица должны идти перед «Other Business»; Homeowner первым
   допустимо — это дефолт-аудитория формы, юрлица идут выше «Other»), `<textarea>`,
   кнопка. Состояния: `idle` → `submitting` (кнопка disabled, «Sending…») →
   `success` (показать `#book-thanks`, скрыть форму) | `fieldErrors` (текст под
   полями, значения сохранены, `required` остаётся) | `netError` («Не удалось
   отправить — позвоните (980) 371-4319», форма с данными).
   Читает `appliance` из `BookingProvider` (пресет из карточек `#repair`).
7. Список опций `contactAs` и `appliance` — экспортировать из `lib/book/options.ts`
   (или `data`), чтобы BookForm и schema не разъезжались.

## Тесты (шов 1)

- `lib/book/submit.test.ts`:
  - валидный `LeadInput` → `{ok:true}`, `ConsoleLeadSink.send` вызван
  - пустое `name` → `{ok:false}`, `errors.name` задан, ни один sink не вызван
  - пустой `phone` → `{ok:false, errors.phone}`
  - пустой/неизвестный `appliance` → `{ok:false}`
  - sink бросил исключение → всё равно `{ok:true}` (заявка принята)
- `app/api/book/route.test.ts` (или integration): `POST` валидного JSON → 200 `{ok:true}`;
  `POST` `{}` → 400 `{ok:false, errors}`.

## Критерии приёмки

- [ ] `POST /api/book` валидный → 200 `{ok:true}` + запись в лог; невалидный → 400 `{ok:false,errors}`
- [ ] Форма: успех → «Thank you!»; ошибка валидации → текст у поля, данные не потеряны;
      сбой сети → сообщение с телефоном, не белый экран
- [ ] Кнопка disabled во время запроса; повторный submit игнорируется
- [ ] Новый `<select>` «I'm contacting you as a…» присутствует, стиль идентичен
      существующему `<select>`, значение уходит в запрос
- [ ] `EmailLeadSink`/`WebhookLeadSink` по умолчанию выключены; `.env.example` имеет
      3 пустые переменные
- [ ] тесты шва 1 зелёные
- [ ] `interfaces.md` дописан: `submitLead`, `LeadInput`, `LeadSink`, опции
