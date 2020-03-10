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
        ├── /trivia              # Trivia game server
        ├── /web                 # Channels and routes
```

## Setting up

**Client**: The web client is a React/Redux application bootstrapped with `create-react-app`

**Server**: Backend server is an Elixir/Pheonix api server

#### To set up your local instance:

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

Any code merged into master will autodeploy with Netlify
