# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Remote.Repo.insert!(%Remote.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Remote.Repo
alias Remote.Accounts.User
alias Remote.Catalog.Play
alias Remote.Catalog.Scene
alias Remote.Catalog.Response

user =
  %User{}
  |> User.changeset(%{
      username: "user",
      email: "user@example.com",
      password_hash: "password"
    })
  |> Repo.insert!

%Play{
  name: "Hello world",
  user: user,
  scenes: [
    %Scene{
      prompt: "Which of these quarterbacks have won the Super Bowl?",
      user: user,
      responses: [
        %Response{
          response: "Tom Brady",
          correct: true,
          user: user
        },
        %Response{
          response: "Eli Manning",
          correct: true,
          user: user
        },
        %Response{
          response: "Ray Lewis",
          correct: false,
          user: user
        }
      ] 
    },
    %Scene{
      prompt: "Which of these teams have never won a Super Bowl?",
      user: user,
      responses: [
        %Response{
          response: "San Francisco 49ers",
          correct: false,
          user: user
        },
        %Response{
          response: "Buffalo Bills",
          correct: true,
          user: user
        },
        %Response{
          response: "Minnesota Vikings",
          correct: false,
          user: user
        }
      ] 
    }
  ]
} |> Repo.insert!
