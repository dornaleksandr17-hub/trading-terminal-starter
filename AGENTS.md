<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- ИИ-аналитик (/analyst): только аналитика, сигналы не генерирует; контекст = выжимка локальной истории (src/lib/analyst/history-summary.ts, считается в браузере) + src/lib/analyst/backtest-context.gen.json (генерируется `npm run backtest:gen-analyst-context` из backtest/output) — чтобы полные отчёты не попадали в серверный бандл.
