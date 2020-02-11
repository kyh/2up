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
    └── /lib
        ├── /database            # Database access
        ├── /trivia              # Trivia game server
        ├── /web                 # Channels and routes
```

## Setting up the Client

The client is bootstrapped with `create-react-app`. To get started:

```
cd client
npm i
npm run start
```

## Setting up the Server

The server is bootstrapped with `mix phx.new`. To get started:

```
cd server
mix deps.get
mix ecto.setup
mix phx.server
```
