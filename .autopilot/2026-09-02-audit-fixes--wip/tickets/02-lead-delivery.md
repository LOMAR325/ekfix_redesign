# 02 — Доставка заявки: EmailLeadSink + тесты (задача 3)

**Требования:** R08, R09, R10, R11, R11.1, R12, R13, R14, R28 (юнит-часть); вклад в R32 (ADR 0010)
**Blocked by:** —
**Зона:** `lib/book/`
**Волна:** 1
**Status:** ready

## Что должно заработать

Владелец вписывает `RESEND_API_KEY` и `BOOK_NOTIFY_EMAIL` в `.env` — и на каждую
заявку приходит письмо, **без единой правки кода**. Задаёт `BOOK_WEBHOOK_URL` — заявка
уходит и в вебхук. Оба заданы — уходит в оба. Любой канал упал — посетитель всё равно
видит «Thank you!», а сбой пишется в лог. Ни один канал не задан — форма работает,
сетевых вызовов ноль.

## Из брифа, дословно

> «реализуй EmailLeadSink полностью (Resend, переменные RESEND_API_KEY и
> BOOK_NOTIFY_EMAIL уже заявлены в .env.example), убедись, что WebhookLeadSink
> рабочий, что при нескольких включённых каналах отправка идёт во все и что падение
> любого канала не роняет ответ формы … ошибка доставки логируется … после
> заполнения .env доставка должна заработать без единой правки кода. Покрой логику
> тестами … включая случай, когда не задан ни один канал. Секреты не коммить,
> .env не создавай.»

## Разделы спецификации

Истории 7–14, 28; Решения §ADR 0010, §Задача 3, §Задача 3 обработчик ошибок; Границы
`lib/book/sinks` + `lib/book/submit`; **шов 1**.

## Как это устроено (форма, не реализация)

```
EmailLeadSink.send(lead):
  POST https://api.resend.com/emails
  headers: Authorization: Bearer ${RESEND_API_KEY}, content-type: application/json
  body: { from: "EK Global <onboarding@resend.dev>", to: [BOOK_NOTIFY_EMAIL],
          subject: `New lead — ${lead.appliance}`, text: <поля лида построчно> }
  // from: onboarding@resend.dev — TODO: владелец, подтверждённый домен-отправитель
  не-2xx или сетевая ошибка → console.warn("[book] email sink delivery failed", …), НЕ бросать
EmailLeadSink.enabled = Boolean(RESEND_API_KEY) && Boolean(BOOK_NOTIFY_EMAIL)   // как сейчас
```

## Критерии приёмки

- [ ] `EmailLeadSink.send()` делает реальный `POST` на Resend REST API (не no-op);
      комментарий `// TODO: подключить Resend` удалён
- [ ] `from` = `onboarding@resend.dev` с комментарием-TODO про подтверждённый домен
- [ ] обработка ошибки канала единообразна: `EmailLeadSink` и `WebhookLeadSink` оба
      ловят свой сбой и пишут `console.warn("[book] <name> sink delivery failed", err)`,
      не бросают (вынести в общий хелпер или продублировать одинаково — на усмотрение)
- [ ] пакет `resend` НЕ добавляется — только `fetch` (как в `WebhookLeadSink`)
- [ ] `submitLead` не меняется по контракту (`Promise.allSettled` уже изолирует каналы)
- [ ] `enabled` всех sink читается из `process.env` в рантайме (уже так — не сломать)
- [ ] `.env` не создаётся; `.env.example` не меняется (3 имени уже там); ни одного
      значения секрета в коде/тестах/коммите
- [ ] тесты (`lib/book/submit.test.ts` и/или новый `lib/book/sinks.test.ts`), мок `fetch` +
      `vi.stubEnv`:
  - [ ] валидный вход → `{ok:true}`, каждый `enabled` sink получил лид
  - [ ] невалидный → `{ok:false, errors}`, ни один sink не вызван
  - [ ] один sink бросает → `{ok:true}`, второй всё равно вызван
  - [ ] **ни одного `enabled` канала (env пуст) → `{ok:true}`, `fetch` не вызывался**
  - [ ] `EmailLeadSink.enabled` = false без пары переменных, true с обеими; то же для webhook
  - [ ] `EmailLeadSink` с заданным env → `fetch` вызван с URL `api.resend.com/emails` и
        `Authorization` заголовком (значение — фейковое из `vi.stubEnv`)
- [ ] существующие тесты (`app/sitemap.test.ts`, `lib/jsonld.test.ts`,
      `app/api/book/route.test.ts`) не тронуты и зелёные
- [ ] `npx tsc --noEmit`, `npm run build`, `npm test` — зелёные
- [ ] дописать `interfaces.md` раздел «### Таск 02»; отметить, что `docs/adr/0010`
      требует приписки (делает оркестратор/таск 04): «EmailLeadSink реализован 2026-09-02»
