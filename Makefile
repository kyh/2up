console:
	cd server && iex -S mix

console-prod:
	gigalixir ps:remote_console

reset:
	cd server && mix ecto.reset

migrate:
	cd server && mix ecto.migrate

migrate-gen:
	cd server && mix ecto.gen.migration $(NAME)

deploy:
	git subtree push --prefix server gigalixir master

deploy-force:
	git push gigalixir `git subtree split --prefix server master`:master --force

phoenix:
	cd server && mix phx.server

react:
	cd client && npm start

logs:
	gigalixir logs

test:
	cd server && mix test

install:
	cd server && mix deps.get