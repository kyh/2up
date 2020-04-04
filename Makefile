# Makefile conventions
# Targets: verb or verb-noun
# Constants: CAPS_WITH_UNDERSCORES

.PHONY: \
	setup build test deploy console

setup: install
	cd server && mix ecto.setup

install:
	cd client && npm i
	cd server && mix deps.get

console:
	source .env && cd server && iex -S mix

console-prod:
	gigalixir ps:remote_console

reset:
	cd server && mix ecto.reset

migrate:
	cd server && mix ecto.migrate

migrate-gen:
	cd server && mix ecto.gen.migration $(NAME)

migrate-prod:
	gigalixir run mix ecto.migrate

deploy:
	git subtree push --prefix server gigalixir master

phx:
	source .env && cd server && mix phx.server

react:
	cd client && npm start

logs:
	gigalixir logs

test:
	cd server && mix test

seeds:
	cd server && mix run priv/repo/seeds.exs

gql-gen:
	cd client && get-graphql-schema http://localhost:4000/graphql > schema.graphql
	cd client && npm run relay
