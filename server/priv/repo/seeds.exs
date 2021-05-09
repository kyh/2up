# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Database.Repo.insert!(%Database.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Database.{
  Catalog,
  Accounts,
  Live
}

# Create playhouse user
{_, user} =
  Accounts.user_create(%{
    username: "playhouse",
    email: "hello@playhouse.gg",
    password: "password"
  })

# Create featured tag
{_, featured_tag} =
  Live.tag_create(%{
    name: "Featured"
  })

# Create packs
{_, startups_pack} =
  Live.pack_create(user, %{
    name: "Startups",
    is_random: true,
    description: "Guess the one liners of tech startups",
    length: 10
  })

{_, sat_pack} =
  Live.pack_create(user, %{
    name: "SAT",
    is_random: true,
    description: "How well do you know your SAT vocab?",
    length: 10
  })

{_, color_pack} =
  Live.pack_create(user, %{
    name: "Color",
    is_random: true,
    description: "Do you even know your colors?",
    length: 10
  })

{_, drawing_pack} =
  Live.pack_create(user, %{
    name: "Drawing",
    is_random: true,
    image_url: "https://i.picsum.photos/id/258/320/320.jpg",
    description: "Who is the best drawer of them all?",
    length: 10
  })

{_, variety_pack} =
  Live.pack_create(user, %{
    name: "Variety",
    is_random: true,
    image_url: "https://i.picsum.photos/id/258/320/320.jpg",
    description: "Best of the best, from all the sorts of packs",
    length: 10
  })

# Create pack tags
Live.pack_tag_create(startups_pack, featured_tag)
Live.pack_tag_create(sat_pack, featured_tag)
Live.pack_tag_create(color_pack, featured_tag)
Live.pack_tag_create(drawing_pack, featured_tag)
Live.pack_tag_create(variety_pack, featured_tag)

# Create question types
{_, text_question_type} = Catalog.question_type_create(%{slug: "text"})
{_, _} = Catalog.question_type_create(%{slug: "image"})

# Create answer types
{_, text_answer_type} = Catalog.answer_type_create(%{slug: "text"})
# {_, multi_text_answer_type} = Catalog.answer_type_create(%{slug: "multi_text"})

# Create scenes
startups_questions = [
  ["GoCardless", "Set up interbank transfers for customers"],
  ["Spoil", "Make the world a happier place through giving"],
  ["Penny", "Keep track of your finances"],
  ["ShiftDoc", "On-demand healthcare staffing marketplace"],
  ["MessageBird", "API for sending text, voice & chat messages"],
  ["Fabric", "Catalogue your real-world experiences"],
  ["Simple Habit", "Netflix of meditation"],
  ["MetricWire", "Research wherever you are"],
  ["drchrono", "Medical platform for doctors and patients"],
  ["Ctzen", "311 for the developing world"],
  ["Vizera Labs", "Unprecedented shopping experience"],
  ["People and Pages", "A service similar to Google Groups"],
  ["HD Trade Services", "Mobile and cloud based logistics software"],
  ["Apify", "The web scraping and automation platform"],
  ["Vanido", "Your personal AI music teacher"],
  ["DNAsimple", "Donate and find DNA samples online"],
  ["Panorama Education", "Feedback surveys of teachers"],
  ["Sliced Investing", "Technology to help financial advisors"],
  ["Care Ledger", "Get free medical care"],
  ["Valor Water Analytics", "Transforming your data into improved revenue"]
]

startups_questions
|> Enum.with_index()
|> Enum.each(fn {x, i} ->
  {_, scene} =
    Catalog.scene_create(text_question_type, text_answer_type, %{
      question: Enum.at(x, 0),
      answer: Enum.at(x, 1),
      instruction: "Give a one line description of this startup"
    })

  Catalog.scene_answer_create(scene, Enum.at(x, 1), true)

  Live.pack_scene_create(startups_pack, scene, %{order: i})
end)

sat_questions = [
  ["abate", "lessen"],
  ["aberration", "deviation, not normal"],
  ["abhorrence", "hatred"],
  ["abstruse", "difficult to understand"],
  ["accost", "confront"],
  ["acrimony", "bitter animosity"],
  ["acumen", "insightfulness"],
  ["adamant", "not yielding"],
  ["adept", "skillful"],
  ["adroit", "skillful"],
  ["alacrity", "eagerness"],
  ["allocate", "assign, portion"],
  ["altruistic", "generous"],
  ["amenable", "yielding"],
  ["amiable", "friendly"],
  ["amicable", "friendly"],
  ["antediluvian", "very old"],
  ["anthropology", "study of human beings"],
  ["antipathy", "dislike"],
  ["apaty", "lacking interest"]
]

sat_questions
|> Enum.with_index()
|> Enum.each(fn {x, i} ->
  {_, scene} =
    Catalog.scene_create(text_question_type, text_answer_type, %{
      question: Enum.at(x, 0),
      instruction: "Give a short definition of this word"
    })

  Catalog.scene_answer_create(scene, Enum.at(x, 1), true)

  Live.pack_scene_create(sat_pack, scene, %{order: i})
end)
