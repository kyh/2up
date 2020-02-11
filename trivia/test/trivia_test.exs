defmodule TriviaTest do
  use ExUnit.Case
  doctest Trivia

  test "greets the world" do
    assert Trivia.hello() == :world
  end
end
