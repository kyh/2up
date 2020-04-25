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

# Create featured category
{_, featured_category} =
  Live.category_create(%{
    name: "Featured"
  })

# Create packs
{_, startups_pack} =
  Live.pack_create(user, %{
    name: "Startups",
    is_random: true,
    image_url: "https://i.picsum.photos/id/258/320/320.jpg",
    description: "Guess the one liners of tech startups",
    length: 10
  })

{_, sat_pack} =
  Live.pack_create(user, %{
    name: "SAT",
    is_random: true,
    image_url: "https://i.picsum.photos/id/258/320/320.jpg",
    description: "How well do you know your SAT vocab?",
    length: 10
  })

{_, color_pack} =
  Live.pack_create(user, %{
    name: "Color",
    is_random: true,
    image_url: "https://i.picsum.photos/id/258/320/320.jpg",
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

# Create pack categories
Live.pack_category_create(startups_pack, featured_category)
Live.pack_category_create(sat_pack, featured_category)
Live.pack_category_create(color_pack, featured_category)
Live.pack_category_create(drawing_pack, featured_category)
Live.pack_category_create(variety_pack, featured_category)

# Create tags
{_, startups_tag} = Live.tag_create(%{name: "Startups"})
{_, sat_tag} = Live.tag_create(%{name: "SAT"})
{_, color_tag} = Live.tag_create(%{name: "Color"})
{_, drawing_tag} = Live.tag_create(%{name: "Drawing"})

# Create question types
{_, text_question_type} = Catalog.question_type_create(%{slug: "text"})
{_, _} = Catalog.question_type_create(%{slug: "image"})

# Create answer types
{_, drawing_answer_type} = Catalog.answer_type_create(%{slug: "drawing"})
{_, color_answer_type} = Catalog.answer_type_create(%{slug: "color"})
{_, text_answer_type} = Catalog.answer_type_create(%{slug: "text"})

# Create acts
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

Enum.each(startups_questions, fn x ->
  {_, act} =
    Catalog.act_create(user, text_question_type, text_answer_type, %{
      question: Enum.at(x, 0),
      answer: Enum.at(x, 1),
      instruction: "Give a one line description of this startup"
    })

  Catalog.act_tag_create(act, startups_tag)
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

Enum.each(sat_questions, fn x ->
  {_, act} =
    Catalog.act_create(user, text_question_type, text_answer_type, %{
      question: Enum.at(x, 0),
      answer: Enum.at(x, 1),
      instruction: "Give a short definition of this word"
    })

  Catalog.act_tag_create(act, sat_tag)
end)

color_questions = [
  ["#4285F4", nil],
  ["#DB4437", nil],
  ["#F4B400", nil],
  ["#0F9D58", nil],
  ["#4267B2", nil],
  ["#3DBB3D", nil],
  ["#666666", nil],
  ["#E50914", nil],
  ["#FFFC00", nil],
  ["#00704A", nil],
  ["#EE1D23", nil],
  ["#185494", nil],
  ["#FAAF18", nil],
  ["#EA0A8E", nil],
  ["#FFFF64", nil],
  ["#0ABAB5", nil],
  ["#F58426", nil],
  ["#BEC0C2", nil]
]

Enum.each(color_questions, fn x ->
  {_, act} =
    Catalog.act_create(user, text_question_type, color_answer_type, %{
      question: Enum.at(x, 0),
      answer: Enum.at(x, 1),
      instruction: "What color is this hex?"
    })

  Catalog.act_tag_create(act, color_tag)
end)

drawing_questions = [
  ["Tiger King", nil, "Drawing"],
  ["tonkotsu ramen", nil, "Drawing"],
  ["fundraising", nil, "Drawing"],
  ["API", nil, "Drawing"],
  ["encryption", nil, "Drawing"],
  ["BTS", nil, "Drawing"],
  ["Carole Baskin", nil, "Drawing"],
  ["Harvard", nil, "Drawing"],
  ["Wartortle", nil, "Drawing"],
  ["Coachella", nil, "Drawing"],
  ["OP", nil, "Drawing"],
  ["Joy Luck Club", nil, "Drawing"],
  ["kimchi", nil, "Drawing"],
  ["hamachi kama", nil, "Drawing"],
  ["kale", nil, "Drawing"],
  ["Beatles", nil, "Drawing"],
  ["Hotel California", nil, "Drawing"],
  ["Elon Musk", nil, "Drawing"]
]

Enum.each(drawing_questions, fn x ->
  {_, act} =
    Catalog.act_create(user, text_question_type, drawing_answer_type, %{
      question: Enum.at(x, 0),
      answer: Enum.at(x, 1)
    })

  Catalog.act_tag_create(act, drawing_tag)
end)

# Create play acts
startup_acts = Catalog.act_list(%{tag_ids: [startups_tag.id]})
sat_acts = Catalog.act_list(%{tag_ids: [sat_tag.id]})
color_acts = Catalog.act_list(%{tag_ids: [color_tag.id]})
drawing_acts = Catalog.act_list(%{tag_ids: [drawing_tag.id]})

all_acts =
  Enum.concat(startup_acts, sat_acts)
  |> Enum.concat(color_acts)
  |> Enum.concat(drawing_acts)

startup_acts
|> Enum.with_index()
|> Enum.each(fn {x, i} ->
  Live.pack_act_create(startups_pack, x, %{order: i + 1})
end)

sat_acts
|> Enum.with_index()
|> Enum.each(fn {x, i} ->
  Live.pack_act_create(sat_pack, x, %{order: i + 1})
end)

color_acts
|> Enum.with_index()
|> Enum.each(fn {x, i} ->
  Live.pack_act_create(color_pack, x, %{order: i + 1})
end)

drawing_acts
|> Enum.with_index()
|> Enum.each(fn {x, i} ->
  Live.pack_act_create(drawing_pack, x, %{order: i + 1})
end)

all_acts
|> Enum.with_index()
|> Enum.each(fn {x, i} ->
  Live.pack_act_create(variety_pack, x, %{order: i + 1})
end)
