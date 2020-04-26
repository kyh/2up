#!/usr/bin/env bash
# exit on error
set -o errexit

# Initial setup
mix deps.get --only prod
MIX_ENV=prod mix compile

# Run migrations
mix ecto.migrate

# Generate schema.json and move to client
mix absinthe.schema.json --schema Web.GraphQL.Schema --pretty ../client/schema.json

# Build the release and overwrite the existing release directory
MIX_ENV=prod mix release --overwrite
