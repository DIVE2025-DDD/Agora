# Agora

## 서비스
- 주소: https://agora-restless-darkness-5801.fly.dev/

## 설치 및 실행 방법

### 사전 요구사항
- `.tool-versions` 에 `Erlang` 및 `Elixir` 버전 포함되어 있음, `asdf`를 사용하여 관리하는 경우 `asdf install` 명령어를 실행하여 필요한 버전을 설치합니다.
- PostgreSQL `docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres`
- Node.js `v22.3.0` (Frontend 빌드용)

1. 의존성 설치
```bash
mix setup
```

2. 데이터베이스 설정
```bash
mix ecto.create
mix ecto.migrate
```

3. 서버 실행
```bash
mix phx.server
```
또는 Interactive Elixir 환경에서:
```bash
iex -S mix phx.server
```
