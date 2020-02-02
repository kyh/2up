# Playhouse

> Some description of this game

## Directory Layout

```
├── /client                      # ReactJS client
|   └── /src
│       ├── /components          # React components
│       ├── /pages               # App routes
│       ├── /styles              # Theme and global styling
│       └── /utils               # Utility
│── /design                      # Design assets
│── /docs                        # App documentation
└── /server                      # Phoenix server
```

## Setting up the Client

The client is bootstrapped with `create-react-app`. To get started:

```
cd client
npm i
npm run start
```

## Setting up the Server

Install Erlang and Elixir

```
brew update
brew install erlang
brew install elixir
```

Install Hex package manager

```
mix local.hex
```

Install Phoenix

```
mix archive.install hex phx_new 1.4.12
```

Install dependencies

```
mix deps.get
```

Create db in config/dev.exs

```
mix ecto.create
```

Install the node.js dependencies

```
cd assets && npm install && cd ..
```

Run migrations

```
mix ecto.migrate
```

Start phoenix server

```
mix phx.server
```
