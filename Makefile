# Makefile conventions
# Targets: verb or verb-noun
# Constants: CAPS_WITH_UNDERSCORES

.PHONY: \
	setup build test deploy console

setup: install
	cd server && mix ecto.setup

install:
	npm i
	cd server && mix deps.get

console:
	source .env && cd server && iex -S mix

start-server:
	source .env && cd server && iex -S mix phx.server

start-web:
	npm run dev:web

start-voice:
	npm run dev:voice

start-docker:
	docker-compose up -d

stop-docker:
	docker-compose down

test:
	cd server && mix test

db-reset:
	cd server && mix ecto.reset

db-migrate:
	cd server && mix ecto.migrate

db-migrate-gen:
	cd server && mix ecto.gen.migration $(NAME)

db-seed:
	cd server && mix run priv/repo/seeds.exs
