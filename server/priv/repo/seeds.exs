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
alias Remote.Stage.Character
alias Remote.Stage.Production
alias Remote.Stage.Performance
alias Remote.Stage.Interaction

user =
  %User{}
  |> User.changeset(%{
      username: "user",
      email: "user@example.com",
      password_hash: "password"
    })
  |> Repo.insert!

play = %Play{
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

production = %Production{
  play: play,
} |> Repo.insert!

character1 = %Character{
  name: "Andrew",
  user: user,
  production: production
} |> Repo.insert!

character2 = %Character{
  name: "Kai",
  production: production
} |> Repo.insert!

scenes = Repo.all(Scene)

Enum.each scenes, fn scene -> 
  %Performance{
    scene: scene
  } |> Repo.insert!
end

response = Repo.all(Response, limit: 1) |> List.first
performance = Repo.all(Performance, limit: 1) |> List.first

%Interaction{
  response: response,
  performance: performance,
  character: character1
} |> Repo.insert!
