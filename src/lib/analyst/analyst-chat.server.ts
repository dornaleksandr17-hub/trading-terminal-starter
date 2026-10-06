/**
 * ИИ-аналитик истории сигналов (только аналитика, сигналы не генерирует).
 * Серверная часть: собирает контекст (выжимка локальной истории сигналов от
 * клиента + выжимка бэктестов) и стримит ответ модели через Lovable AI Gateway.
 */
import { createOpenAI } from "@ai-sdk/openai";
import { APICallError, convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";
import backtestContext from "./backtest-context.gen.json";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai/run-id.server";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";
const MAX_HISTORY_CHARS = 200_000;
const MAX_MESSAGES = 60;

const BodySchema = z.object({
  threadId: z.string().min(1).max(100),
  messages: z.array(z.custom<UIMessage>((m) => typeof m === "object" && m !== null && "role" in m)).min(1),
  history: z.record(z.string(), z.unknown()).nullable().optional(),
});

const INSTRUCTIONS = `Ты — аналитик истории сигналов торгового терминала бинарных контрактов (крипта и форекс). Отвечай по-русски, кратко и по делу, используй markdown-таблицы для чисел.

Экономика (не меняй и не оспаривай):
- Выигрыш +выплата, проигрыш −1, timeout 0. Выплата по умолчанию 80%.
- Безубыточность = 100/(100+выплата) = 55.56% при 80%. Винрейт = wins/(wins+losses), timeout исключены.
- 53–55% при выплате 80% — это всё ещё УБЫТОК. Говори об этом прямо, если пользователь называет такую цель.

Правила честности:
1. Используй ТОЛЬКО числа из блоков «История сигналов пользователя» и «Бэктест». Ничего не выдумывай. Нет выборки — пиши «недостаточно данных».
2. Группа с менее чем 30 исходами — шум; не делай по ней выводов. Опирайся на нижнюю границу Вильсона (wilsonLowerPct), а не на сырой винрейт.
3. Если сравниваешь много срезов, напоминай о множественных сравнениях: лучший срез из многих почти всегда выглядит хорошо случайно.
4. Ты не генерируешь торговые сигналы и не обещаешь рост винрейта. Можно предлагать ГИПОТЕЗЫ (например «не брать сигналы X в сессию Y»), но каждая гипотеза — только кандидат для форвард-теста, а не готовое правило.
5. Сопоставляй живую историю с бэктестом: если паттерн в бэктесте ниже 50% или rejected, скажи об этом.
6. В бэктесте: verdict valid — прошёл все фильтры; rejected — значимо хуже 50%; no-evidence / insufficient-data — эффекта не найдено. В аудитах 0 паттернов имеют статус valid.
7. Объём на форексе и на крипте из Deriv отсутствует — не делай выводов по объёму.
8. Это не инвестиционная рекомендация.

Бэктест (выжимка отчётов walk-forward на независимых наблюдениях):
${JSON.stringify(backtestContext)}`;

function errorMessage(error: unknown): string {
  if (APICallError.isInstance(error)) {
    if (error.statusCode === 429) return "Слишком много запросов к ИИ. Подождите минуту и повторите.";
    if (error.statusCode === 402) return "Закончились кредиты ИИ в рабочем пространстве. Пополните их в настройках оплаты.";
    if (error.statusCode === 403) return "Доступ к модели ИИ запрещён для этого рабочего пространства.";
    if (error.statusCode === 401) return "ИИ не настроен на сервере.";
  }
  return "Не удалось получить ответ ИИ. Попробуйте ещё раз.";
}

function jsonError(status: number, error: string) {
  return new Response(JSON.stringify({ error }), { status, headers: { "Content-Type": "application/json" } });
}

export async function handleAnalystChat(request: Request): Promise<Response> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return jsonError(500, "ИИ не настроен на сервере.");

  let parsed: z.infer<typeof BodySchema>;
  try {
    parsed = BodySchema.parse(await request.json());
  } catch {
    return jsonError(400, "Некорректный запрос.");
  }

  const historyJson = parsed.history ? JSON.stringify(parsed.history) : "";
  if (historyJson.length > MAX_HISTORY_CHARS) return jsonError(400, "История сигналов слишком большая.");

  const messages = parsed.messages.slice(-MAX_MESSAGES);
  const instructions = `${INSTRUCTIONS}

История сигналов пользователя (выжимка из этого браузера на момент вопроса):
${historyJson || "нет данных — история сигналов пуста"}`;

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses(MODEL),
    instructions,
    messages: await convertToModelMessages(messages),
    abortSignal: request.signal,
    maxRetries: 1,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "medium",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  return withLovableAiGatewayRunIdHeader(
    result.toUIMessageStreamResponse({
      originalMessages: messages,
      sendReasoning: true,
      onError: errorMessage,
    }),
    runIdFetch,
  );
}
