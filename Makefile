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

reset:
	cd server && mix ecto.reset

migrate:
	cd server && mix ecto.migrate

migrate-gen:
	cd server && mix ecto.gen.migration $(NAME)

phx:
	source .env && cd server && mix phx.server

react:
	cd client && npm start

test:
	cd server && mix test

seeds:
	cd server && mix run priv/repo/seeds.exs

format:
	cd client && npm run format
	cd server && mix format
