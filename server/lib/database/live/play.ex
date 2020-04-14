defmodule Database.Live.Play do
  use Database.Model

  schema "plays" do
    belongs_to :pack, Database.Live.Pack
    field :game_state, :map

    timestamps()
  end

  def changeset(play, attrs) do
    required_fields = [:game_state]

    play
    |> cast(attrs, required_fields)
    |> validate_required(required_fields)
    |> assoc_constraint(:pack)
  end
end
