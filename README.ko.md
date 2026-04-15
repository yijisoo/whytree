# Why Tree

**내 삶의 의미는 뭘까?**

어려운 질문입니다. 많은 철학자들이 답하려 했습니다. 하지만 이 질문이 그렇게 어렵게 느껴지는 건, 답이 바깥에 있지 않기 때문이라고 생각합니다 — 답은 내 안에 있습니다. 작은 실험을 해보고, 내가 어떻게 반응하는지 주의 깊게 관찰하면서 찾아가는 겁니다. 나를 만들어가는 건 나 자신입니다. 알아내는 것도 내 몫입니다.

Why Tree는 그 작업을 도와주는 AI 도구입니다.

## 어떻게 진행되나요

AI 상담사와 대화합니다. 답을 알려주지 않습니다 — 스스로의 목소리를 듣도록 도와줍니다. "목표가 뭐예요?" 같은 질문은 하지 않습니다. 준비된 답이 나오니까요. 대신, 내가 하는 것들이 *왜* 중요한지를 추적해서 스스로 보지 못했던 것을 드러냅니다. 그다음, 같은 뿌리를 채울 수 있는 *다른 방법*을 물어서 생각지 못했던 길을 찾아줍니다.

시간에 맞춰 조절됩니다. 20분이면 하나의 실마리, 하나의 발견, 오늘 해볼 것 하나. 시간이 넉넉하면 더 깊이 들어갑니다.

매 세션은 하나의 실험으로 끝납니다. 가능성 목록이 아니라, 오늘 당장 해보고 싶은 것 하나.

## 무엇을 얻나요

- 말로 만들지 못했던 것을 말로 만든 경험
- 다음 세션 전에 해볼 작은 것 하나
- 세션을 거듭하며 자라는 트리 — 발견한 것들이 연결되는 곳

트리는 뼈대이지 핵심이 아닙니다. 대화가 쌓여갈 수 있게 발견을 저장하는 곳입니다. 진짜 경험은 내가 표현하지 못했던 것을 직접 말하게 되는 순간입니다.

## 개인정보

트리 — 발견한 것들의 구조화된 기록 — 는 내 기기의 `~/.whytree/`에만 저장됩니다. 어디에도 전송되지 않습니다.

대화 내용은 Claude Code를 통해 Anthropic이 처리합니다. 세션 중 대화가 Anthropic 서버로 전송되며, 기본 30일간 보관됩니다 (모델 개선에 동의한 경우 더 길어질 수 있습니다). 자세한 내용은 [Claude Code 데이터 사용 정책](https://docs.anthropic.com/en/docs/claude-code/data-usage)을 참고하세요.

개발자에게 전달될 수 있는 것은 두 가지뿐이고, 모두 명시적 동의가 필요합니다:
- **익명 메트릭** — 구조 정보만 (토픽 수, 깊이). 내용은 절대 포함되지 않습니다.
- **피드백** — 세션 중 직접 보내기로 한 것만.

## 설치

[Claude Code](https://docs.anthropic.com/en/docs/claude-code)가 필요합니다 — 터미널, 데스크톱 앱, VS Code, JetBrains 모두 가능. Windows는 [Git for Windows](https://git-scm.com/downloads/win)가 필요합니다.

Claude Code에 이것을 붙여넣으세요:

> Install whytree: if `~/.claude/skills/whytree` already exists, update it with `cd ~/.claude/skills/whytree && git pull origin main`. Otherwise clone it with `git clone https://github.com/yijisoo/whytree.git ~/.claude/skills/whytree`. Then read `~/.claude/settings.json` — if it exists, add `"https://kardens.io/api/whytree-telemetry"` to the existing `permissions.allowedURLs` array (preserve all other settings). If the file doesn't exist, create it with `{"permissions":{"allowedURLs":["https://kardens.io/api/whytree-telemetry"]}}`.

별도 설치나 빌드 과정 없이 Claude가 스킬 파일을 직접 읽습니다.

## 시작

Claude Code에서 `/whytree`를 입력하세요. 준비할 것 없습니다. 솔직하게 답하면 됩니다.

## 피드백

세션 중 언제든 피드백을 보낼 수 있습니다. 마지막에 물어보기도 하고, 중간에 직접 말씀하셔도 됩니다.

## 이름의 유래

"Why Tree"는 식스 시그마에서 "왜?"를 반복해 결함의 근본 원인을 찾는 기법과 이름이 겹칩니다. 메커니즘은 비슷하지만 방향이 다릅니다. 근본 원인 분석은 고장 난 프로세스를 향해 질문합니다. Why Tree는 나 자신을 향해 질문합니다. 뭐가 잘못됐는지가 아니라, 뭐가 진짜 중요한지를 발견하기 위해.

## 라이선스

[Business Source License 1.1](LICENSE) — 개인, 비상업적 사용은 무료. 2030-03-31에 MIT로 전환됩니다.

---

[English](README.md)
