console:
	cd server && iex -S mix

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
