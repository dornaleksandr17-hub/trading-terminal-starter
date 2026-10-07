import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { ensureThread, saveThreadMessages } from "@/lib/analyst/threads";
import { summarizeSignalHistory } from "@/lib/analyst/history-summary";
import { useAnalyticsStore } from "@/stores/useAnalyticsStore";
import logo from "@/assets/analyst-logo.png";

export const Route = createFileRoute("/analyst/$threadId")({
  ssr: false,
  component: ThreadPage,
});

function ThreadPage() {
  const { threadId } = Route.useParams();
  return <ThreadChat key={threadId} threadId={threadId} />;
}

const SUGGESTIONS = [
  "Какие паттерны у меня работают лучше и хуже всего?",
  "В какую сессию и в какие часы я чаще проигрываю?",
  "Сравни мою историю с результатами бэктеста",
  "Что проверить в форвард-тесте, чтобы приблизиться к безубыточности?",
];

function ThreadChat({ threadId }: { threadId: string }) {
  const [initialMessages] = useState<UIMessage[]>(() => ensureThread(threadId).messages);
  const signals = useAnalyticsStore((s) => s.signals);
  const signalsRef = useRef(signals);
  signalsRef.current = signals;
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/analyst",
        // История пересчитывается на каждый вопрос — модель видит актуальные исходы.
        body: () => ({ threadId, history: summarizeSignalHistory(signalsRef.current) }),
      }),
    [threadId],
  );

  const { messages, sendMessage, status, stop } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (e) => setError(e.message || "Не удалось получить ответ ИИ."),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (status === "ready" || status === "error") saveThreadMessages(threadId, messages);
  }, [messages, status, threadId]);

  useEffect(() => {
    if (!busy) inputRef.current?.focus();
  }, [busy]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    setError(null);
    setInput("");
    void sendMessage({ text: t });
  };

  const decided = signals.filter((s) => s.outcome === "win" || s.outcome === "loss").length;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl">
          {messages.length === 0 ? (
            <ConversationEmptyState>
              <div className="mt-4 flex flex-col items-center gap-3 text-center">
                <img src={logo} alt="" className="h-14 w-14" />
                <h2 className="text-base font-semibold">Спросите об истории своих сигналов</h2>
                <p className="max-w-md text-xs text-muted-foreground">
                  В истории: {signals.length} сигналов, с исходом — {decided}. ИИ также видит итоги бэктестов.
                  Это аналитика, а не торговые сигналы.
                </p>
                <div className="mt-2 grid w-full max-w-lg gap-2 sm:grid-cols-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-md border border-border px-3 py-2 text-left text-xs hover:bg-muted"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((m) => (
              <Message key={m.id} from={m.role}>
                <MessageContent className="group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground">
                  {m.parts.map((p, i) => {
                    if (p.type === "text") return <MessageResponse key={i}>{p.text}</MessageResponse>;
                    if (p.type === "reasoning" && p.text)
                      return (
                        <Reasoning key={i} isStreaming={busy && m.id === messages[messages.length - 1]?.id}>
                          <ReasoningTrigger />
                          <ReasoningContent>{p.text}</ReasoningContent>
                        </Reasoning>
                      );
                    return null;
                  })}
                </MessageContent>
              </Message>
            ))
          )}
          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer>Анализирую историю…</Shimmer>
              </MessageContent>
            </Message>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="mx-auto w-full max-w-3xl p-3">
        <PromptInput onSubmit={(msg) => send(msg.text ?? "")}>
          <PromptInputTextarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Например: почему падает винрейт на EURUSD в лондонскую сессию?"
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} onStop={() => void stop()} disabled={!busy && !input.trim()} />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
          Не инвестиционная рекомендация. Любую гипотезу ИИ проверяйте форвард-тестом.
        </p>
      </div>
    </div>
  );
}
