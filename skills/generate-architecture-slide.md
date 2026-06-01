# Skill: generate-architecture-slide

자연어로 된 기술 아키텍처 설명을 받아 유효한 `architecture` slide의 `diagram` 스펙(source: inline)을 생성하는 skill.

`create-deck` 안에서 architecture slide를 작성할 때 내부적으로 이 절차를 따른다.
단독으로 호출하면 architecture slide snippet만 생성하고 종료한다.

**MUST:** 출력은 항상 `source: inline`이다. `source: file`은 렌더러가 실제 다이어그램으로 변환하지 않는다.

**진입 경로:**
- Claude Code: `/generate-architecture-slide`
- Codex CLI/App: `.agents/skills/generate-architecture-slide/SKILL.md` 로드
- Claude 채팅: 이 파일 내용을 참조하여 대화 절차 수행

---

## 이 skill이 하는 일

```
아키텍처 설명 입력
  → Step 0: 호출 컨텍스트 판별
  → Step 1: 입력 수집
  → Step 2: 컴포넌트 추출 + node kind 분류
  → Step 3: 토폴로지 분석 + 노드 수 확인
  → Step 4: Zone 배치
  → Step 5: Edge 추출
  → Step 6: Groups 식별 (선택)
  → Step 7: YAML 출력 + 자체 검증
```

---

## Step 0 — 호출 컨텍스트 판별

| 컨텍스트 | 행동 |
|---|---|
| 단독 command | architecture slide snippet만 생성하고 종료 |
| `create-deck` 내부 | 전체 deck의 title, section_label, notes 스타일과 일관성 유지. 기존 blueprint의 deck.title, deck.theme에 맞춰 생성 |

---

## Step 1 — 입력 수집

아키텍처 설명이 없으면 묻는다:

```
어떤 시스템의 아키텍처 슬라이드를 만들까요?
컴포넌트와 흐름을 자유롭게 설명해 주세요.

예시:
  "API Gateway → Auth Service → User DB.
   Auth Service는 Redis Cache를 사용하고,
   외부 Client가 Gateway를 호출한다."
```

슬라이드 제목(`title`)이 없으면 아키텍처 설명에서 자동으로 추론한다.

---

## Step 2 — 컴포넌트 추출 + node kind 분류

설명에서 시스템 컴포넌트를 명사 단위로 추출하고, 아래 기준표로 `kind`를 분류한다.

### node.kind 분류 기준표

| kind | 해당하는 컴포넌트 | 판단 기준 |
|---|---|---|
| `client` | 사용자, 브라우저, 모바일 앱, 외부 요청자 | 흐름의 시작점, 사람 또는 외부 요청 |
| `gateway` | API Gateway, Load Balancer, Reverse Proxy, BFF | 진입점, 라우팅, 트래픽 제어 역할 |
| `service` | 백엔드 서비스, API 서버, 마이크로서비스 | 비즈니스 로직 처리, 내부 서비스 |
| `database` | RDB, NoSQL, 데이터 저장소 | 영속 데이터 저장 (MySQL, PostgreSQL, MongoDB 등) |
| `cache` | Redis, Memcached, CDN | 임시 데이터 저장, 빠른 읽기 최적화 |
| `queue` | Kafka, RabbitMQ, SQS, 이벤트 버스 | 비동기 메시지 전달, 이벤트 스트림 |
| `storage` | S3, GCS, Object Store, 파일 서버 | 파일·객체 저장 |
| `container` | Docker, Kubernetes Pod, 컨테이너 런타임 | 컨테이너 단위 실행 환경 |
| `cloud` | AWS, GCP, Azure, 외부 클라우드 서비스 | 관리형 클라우드 플랫폼 자체 |
| `external` | 서드파티 API, 외부 결제사, SMS 제공자 | 제어 범위 밖의 외부 시스템 |

> 판단이 애매한 경우: 역할(무엇을 하는가) → 위치(어디에 있는가) → 통신방식(어떻게 연결되는가) 순으로 판단한다.
> 예: "인증 서버"가 JWT 발급 전용이면 `service`, 모든 요청의 진입점이면 `gateway`.

`node.id`는 영문 소문자 kebab-case로 할당한다. (예: `api-gateway`, `user-db`, `auth-service`)

---

## Step 3 — 토폴로지 분석 + 노드 수 확인

**토폴로지 패턴 판별:**

| 패턴 | 특징 | 전형적인 예 |
|---|---|---|
| 좌→우 (LR) | 선형 요청 흐름 | Client → Gateway → Service → DB |
| 상→하 (TB) | 계층 구조 | 사용자 → API → DB |
| 3-tier 레이어드 | 레이어별 3개 그룹 | Presentation / Application / Data |
| 허브-스포크 | 중앙 + 주변 서비스 | API Gateway + 다수 마이크로서비스 |
| 복합 | 위 패턴 혼합 | — |

**노드 수 확인:**

추출된 노드가 9개를 초과하면 진행을 멈추고 협의한다:

```
현재 컴포넌트가 {N}개입니다. 3×3 그리드 최대(9개)를 초과합니다.
아래 중 하나를 선택해 주세요:

  A. 유사 컴포넌트 병합 (예: Auth Service + Session Service → Auth Layer)
  B. 핵심 컴포넌트만 남기고 나머지 생략
  C. 슬라이드 2장으로 분리 (예: Frontend 레이어 / Backend 레이어)
```

---

## Step 4 — Zone 배치

토폴로지 패턴에 따라 zone을 할당한다. **zone 중복은 절대 허용되지 않는다.**

### 패턴별 zone 배치 가이드

**좌→우 흐름 (LR):**
```
center-left  →  center  →  center-right
(또는 top-left → top-center → top-right — 하단에 DB 배치 시)
```

**상→하 계층 (TB):**
```
top-center
    ↓
  center
    ↓
bottom-center
```

**3-tier 레이어드:**
```
top-left    | top-center    | top-right      ← Presentation layer
center-left | center        | center-right   ← Application layer
bottom-left | bottom-center | bottom-right   ← Data layer
```

**허브-스포크:**
```
top-left  | top-center | top-right
center-left |  center  | center-right   ← hub = center
bottom-left | bottom-center | bottom-right
```

**주의:**
- `left`는 `center-left`의 별칭, `right`는 `center-right`의 별칭이다. 둘을 동시에 사용하면 중복이 된다.
- 별칭 대신 명시적 zone 이름(`center-left`, `center-right`)을 우선 사용한다.

---

## Step 5 — Edge 추출

컴포넌트 간 관계를 edge로 변환하고 `kind`를 분류한다.

### edge.kind 선택 가이드

| kind | 사용 상황 | 예시 |
|---|---|---|
| `sync` | 동기 요청-응답, REST API 호출 | Client → API Gateway, Service → DB |
| `async` | 비동기 메시지 발행/구독 | Service → Queue, Queue → Consumer |
| `bidirectional` | 양방향 실시간 통신 | WebSocket, gRPC streaming |
| `data-flow` | 데이터 흐름, ETL, 파이프라인 | DB → Analytics, S3 → Processing |

**검증:** 모든 edge의 `from`과 `to`가 Step 2에서 할당한 node.id 중 하나인지 확인한다.

---

## Step 6 — Groups 식별 (선택)

논리적으로 묶이는 노드 그룹이 명확하면 `groups`를 추가한다.

```yaml
groups:
  - id: backend-services
    label: Backend Services
    nodes: [auth-service, user-service, order-service]
  - id: data-layer
    label: Data Layer
    nodes: [user-db, cache, message-queue]
```

그룹이 불명확하거나 4개 이하의 소규모 다이어그램이면 생략한다.

---

## Step 7 — YAML 출력 + 자체 검증

### 출력 형식

```yaml
- id: architecture-slide
  type: architecture
  title: {슬라이드 제목}
  subtitle: {한 줄 설명 — 선택}
  diagram:
    source: inline
    version: "1.0"
    nodes:
      - id: {node-id}
        kind: {kind}
        label: {표시 이름}
        zone: {zone}
        description: {설명 — 선택}
    edges:
      - from: {node-id}
        to: {node-id}
        kind: {edge-kind}
        label: {레이블 — 선택}
    groups:           # 선택
      - id: {group-id}
        label: {그룹명}
        nodes: [{node-id}, ...]
```

### 자체 체크리스트

출력 전 반드시 확인한다:

- [ ] `diagram.source: inline` 명시
- [ ] 모든 `node.id` 고유 (중복 없음)
- [ ] 모든 `node.zone` 고유 (alias 포함하여 중복 없음)
- [ ] 모든 `edge.from` / `edge.to` 가 존재하는 node.id 참조
- [ ] 노드 수 ≤ 9

검증 통과 후 출력하고, 임시 blueprint에 삽입해 아래로 확인을 안내한다:

```bash
npm run validate -- --blueprint blueprints/{slug}.yaml
npm run deck -- --blueprint blueprints/{slug}.yaml --output output/{slug}.pptx
```

---

## YAML 예시 3종

### 예시 1 — 좌→우 3단 흐름 (4노드)

```yaml
- id: system-architecture
  type: architecture
  title: "서비스 아키텍처"
  subtitle: "Client → Gateway → Service → DB"
  diagram:
    source: inline
    version: "1.0"
    nodes:
      - id: client
        kind: client
        label: Client
        zone: center-left
      - id: api-gateway
        kind: gateway
        label: API Gateway
        zone: center
      - id: auth-service
        kind: service
        label: Auth Service
        zone: center-right
      - id: user-db
        kind: database
        label: User DB
        zone: bottom-right
    edges:
      - from: client
        to: api-gateway
        kind: sync
      - from: api-gateway
        to: auth-service
        kind: sync
        label: JWT 검증
      - from: auth-service
        to: user-db
        kind: sync
```

### 예시 2 — 3-tier 레이어드 (9노드 최대)

```yaml
- id: three-tier-architecture
  type: architecture
  title: "3-Tier 아키텍처"
  diagram:
    source: inline
    version: "1.0"
    nodes:
      - id: web-ui
        kind: client
        label: Web UI
        zone: top-left
      - id: mobile-app
        kind: client
        label: Mobile App
        zone: top-center
      - id: cdn
        kind: cloud
        label: CDN
        zone: top-right
      - id: api-gateway
        kind: gateway
        label: API Gateway
        zone: center-left
      - id: auth-service
        kind: service
        label: Auth Service
        zone: center
      - id: order-service
        kind: service
        label: Order Service
        zone: center-right
      - id: user-db
        kind: database
        label: User DB
        zone: bottom-left
      - id: cache
        kind: cache
        label: Redis Cache
        zone: bottom-center
      - id: message-queue
        kind: queue
        label: Message Queue
        zone: bottom-right
    edges:
      - from: web-ui
        to: api-gateway
        kind: sync
      - from: mobile-app
        to: api-gateway
        kind: sync
      - from: api-gateway
        to: auth-service
        kind: sync
      - from: api-gateway
        to: order-service
        kind: sync
      - from: auth-service
        to: user-db
        kind: sync
      - from: auth-service
        to: cache
        kind: sync
      - from: order-service
        to: message-queue
        kind: async
    groups:
      - id: presentation
        label: Presentation Layer
        nodes: [web-ui, mobile-app, cdn]
      - id: application
        label: Application Layer
        nodes: [api-gateway, auth-service, order-service]
      - id: data
        label: Data Layer
        nodes: [user-db, cache, message-queue]
```

### 예시 3 — 허브-스포크 (API Gateway 중심)

```yaml
- id: hub-spoke-architecture
  type: architecture
  title: "마이크로서비스 아키텍처"
  subtitle: "API Gateway 중심 허브-스포크"
  diagram:
    source: inline
    version: "1.0"
    nodes:
      - id: client
        kind: client
        label: Client
        zone: top-left
      - id: api-gateway
        kind: gateway
        label: API Gateway
        zone: center
      - id: user-service
        kind: service
        label: User Service
        zone: top-center
      - id: order-service
        kind: service
        label: Order Service
        zone: center-right
      - id: payment-service
        kind: service
        label: Payment Service
        zone: bottom-center
      - id: inventory-service
        kind: service
        label: Inventory Service
        zone: center-left
      - id: notification-service
        kind: service
        label: Notification Service
        zone: top-right
    edges:
      - from: client
        to: api-gateway
        kind: sync
      - from: api-gateway
        to: user-service
        kind: sync
      - from: api-gateway
        to: order-service
        kind: sync
      - from: api-gateway
        to: payment-service
        kind: sync
      - from: api-gateway
        to: inventory-service
        kind: sync
      - from: order-service
        to: notification-service
        kind: async
```

---

## 관련 파일

- `skills/create-deck.md` — 대화식 deck 생성 end-to-end (blueprint 작성 포함)
- `src/schema/blueprint.ts` — node.kind, node.zone, edge.kind schema 정의
- `src/templates/slides/architecture.ts` — 렌더러 구현
