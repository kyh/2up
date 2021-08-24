# Playhouse

> A platform for real-time multiplayer trivia games 🎮

## 📁 Directory Layout

```
│── /docs                        # App documentation
├── /web                         # Web ReactJS client
|   └── /src
│       ├── /pages               # Next.js renderable pages
│       ├── /components          # Shared React components
│       ├── /features            # App features and routes
│       ├── /styles              # Theme and global styling
│       └── /util                # Utility modules
│── /voice                       # Voice server
└── /server                      # Phoenix server
    └── /lib
        ├── /database            # Database models
        ├── /game                # Game server
        └── /web                 # Channels and graphql routes
```

## 🥞 Tech Stack

- **Client**:
  - The web client is a `Next.js/React` application
  - The `Game` itself uses websockets but the rest of the pages use `Apollo` with `Graphql`
- **Server**:
  - `Elixir/Phoenix` API server
  - `Node.js` voice chat server
- **Data Transport**:
  - RabbitMQ for message passing
- **Database**:
  - Postgres

## ⚙️ Setting up

Before we start, make sure you these prerequisites installed:

- [Node.js](https://nodejs.org/en/download/)
- [Elixir](https://elixir-lang.org/install.html)
- [RabbitMQ](https://www.rabbitmq.com/)
- [Postgres](https://www.postgresql.org/download/)

Once installed, copy and paste the `.env.example` to `.env` and update your environment keys

Then run:

```bash
make setup
# If you want, you can seed some questions
make seeds
```

## 💻 Running the app locally

```bash
# Start the api server
make phx

# In a separate terminal window
make react
```

## 📤 Deployment

Any code merged into `main` will autodeploy through [Render](https://render.com/)
