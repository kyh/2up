# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Playhouse.Repo.insert!(%Playhouse.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Playhouse.Repo
alias Playhouse.Catalog.Question
alias Playhouse.Catalog.Answer

questions = [
  ["Who won the NBA finals in 2003?", "San Antonio Spurs"],
  ["Who was the 6th president of United States?", "John Quincy Adams"],
  ["On a QWERTY keyboard, what two letters have raised marks to assist with touch typing?", "F and J"],
  ["How do you call a group of unicorns?", "A blessing"],
  ["Who is the oldest man to win People Magazine's sexiest man alive?", "Sean Connery"]
]

Enum.each questions, fn question -> 
  [q | a] = question

  %Answer{
    question: %Question{
      content: q
    },
    content: Enum.at(a, 0)
  } |> Repo.insert!
end
