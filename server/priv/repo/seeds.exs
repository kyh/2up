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
alias Playhouse.Game
alias Playhouse.Player
alias Playhouse.GameQuestion
alias Playhouse.Question
alias Playhouse.Answer

game = %Game{
  act: 1,
  scene: 1
} |> Repo.insert!

question1 = %Question{
  content: "Who won the NBA finals in 2003?",
} |> Repo.insert!

%Answer{
  question: question1,
  content: "San Antonio Spurs"
} |> Repo.insert!

question2 = %Question{
  content: "Who was the 6th president of United States?",
} |> Repo.insert!

%Answer{
  question: question2,
  content: "John Quincy Adams"
} |> Repo.insert!

question3 = %Question{
  content: "On a QWERTY keyboard, what two letters have raised marks to assist with touch typing?",
} |> Repo.insert!

%Answer{
  question: question3,
  content: "F and J"
} |> Repo.insert!

question4 = %Question{
  content: "How do you call a group of unicorns?",
} |> Repo.insert!

%Answer{
  question: question4,
  content: "A blessing"
} |> Repo.insert!

question5 = %Question{
  content: "Who is the oldest man to win People Magazine's sexiest man alive?",
} |> Repo.insert!

%Answer{
  question: question5,
  content: "Sean Connery"
} |> Repo.insert!

%GameQuestion{
  game: game,
  question: question1
} |> Repo.insert!

%GameQuestion{
  game: game,
  question: question2
} |> Repo.insert!

%GameQuestion{
  game: game,
  question: question3
} |> Repo.insert!

%GameQuestion{
  game: game,
  question: question4
} |> Repo.insert!

%GameQuestion{
  game: game,
  question: question5
} |> Repo.insert!
