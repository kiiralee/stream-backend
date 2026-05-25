# Sequence Diagrams

## Login (Session)

```mermaid
sequenceDiagram
  participant C as Client
  participant GQL as GraphQL
  participant S as SessionService
  participant R as Redis
  participant DB as PostgreSQL

  C->>GQL: mutation loginUser
  GQL->>S: validate credentials
  S->>DB: find user (argon2 verify)
  S->>R: store session (userId)
  S-->>C: Set-Cookie + AuthModel
```

## Go Live (LiveKit)

```mermaid
sequenceDiagram
  participant Streamer as Streamer/OBS
  participant LK as LiveKit
  participant WH as WebhookController
  participant DB as PostgreSQL
  participant N as NotificationService
  participant TG as Telegram

  Streamer->>LK: RTMP/WHIP ingest
  LK->>WH: POST /webhook/livekit ingress_started
  WH->>DB: stream.isLive = true
  WH->>DB: load followers
  loop each follower
    WH->>N: site notification
    WH->>TG: telegram (if enabled)
  end
```

## Sponsorship Payment

```mermaid
sequenceDiagram
  participant C as Client
  participant GQL as GraphQL
  participant ST as Stripe Checkout
  participant WH as Webhook
  participant DB as PostgreSQL

  C->>GQL: mutation makePayment(planId)
  GQL->>ST: create checkout session
  GQL-->>C: redirect URL
  C->>ST: pay
  ST->>WH: checkout.session.completed
  WH->>DB: transaction + subscription
```

## Chat Message (Realtime)

```mermaid
sequenceDiagram
  participant C as Client
  participant GQL as GraphQL
  participant CS as ChatService
  participant PS as PubSub
  participant Sub as Subscribers

  C->>GQL: mutation sendChatMessage
  GQL->>CS: persist message
  CS->>PS: publish CHAT_MESSAGE_ADDED
  PS-->>Sub: subscription chatMessageAdded
```

> **Note:** PubSub in-memory (`graphql-subscriptions`) — не масштабируется на несколько инстансов без Redis PubSub adapter *(architectural gap)*.
