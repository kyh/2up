# Playhouse

> Real-time multiplayer guessing game

## Directory Layout

```
├── /client                      # ReactJS client
|   └── /src
│       ├── /app                 # Root app setup files
│       ├── /components          # React components
│       ├── /features            # App routes
│       ├── /styles              # Theme and global styling
│       └── /utils               # Utility
│── /design                      # Design assets
│── /docs                        # App documentation
└── /server                      # Phoenix server
    └── /lib
        ├── /database            # Database access
        ├── /game                # Game server
        ├── /web                 # Channels and routes
```

## Tech Stack

**Client**: The web client is a React/Redux application bootstrapped with `create-react-app`

**Data Transport**: We use GraphQL Relay as our frontend data store, GraphQL (Dashboard) and Websocket (Game) for data transport

**Server**: Backend server is an Elixir/Pheonix API server

**Database**: Everything is stored in a Postgres database

## Setting up

Before we start, make sure you have [Node.js](https://nodejs.org/en/download/), [Elixir](https://elixir-lang.org/install.html), and [Postgres](https://www.postgresql.org/download/) installed on your machine

Once installed, copy and paste the `.env.example` to `.env` and update your enviroment keys

Then run:

```bash
make setup
# If you want, you can seed some questions
make seeds
```

## Running the app locally

```bash
# Start the api server
make phx

# In a seperate terminal window
make react
```

## Deployment

Any code merged into master will autodeploy through [Render](https://render.com/)
