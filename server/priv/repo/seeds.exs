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
{_, featured_tag} = Live.tag_create(%{name: "featured"})

# Create packs

# 1.
# What state is this?
# Users will be shown a picture of a state to guess its name
{_, states_pack} =
  Live.pack_create(user, %{
    name: "States",
    is_random: true,
    description: "Guess the name of state by looking at the map",
    tags: [],
    length: 10
  })

states_questions = [
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Alabama_in_United_States.svg/600px-Alabama_in_United_States.svg.png",
    "Alabama"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Alaska_in_United_States_%28US50%29.svg/600px-Alaska_in_United_States_%28US50%29.svg.png",
    "Alaska"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Arizona_in_United_States.svg/600px-Arizona_in_United_States.svg.png",
    "Arizona"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Arkansas_in_United_States.svg/600px-Arkansas_in_United_States.svg.png",
    "Arkansas"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/California_in_United_States.svg/600px-California_in_United_States.svg.png",
    "California"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Colorado_in_United_States.svg/600px-Colorado_in_United_States.svg.png",
    "Colorado"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Connecticut_in_United_States_%28zoom%29.svg/600px-Connecticut_in_United_States_%28zoom%29.svg.png",
    "Connecticut"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Delaware_in_United_States_%28zoom%29.svg/600px-Delaware_in_United_States_%28zoom%29.svg.png",
    "Delaware"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Florida_in_United_States.svg/600px-Florida_in_United_States.svg.png",
    "Florida"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Georgia_in_United_States.svg/600px-Georgia_in_United_States.svg.png",
    "Georgia"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Hawaii_in_United_States_%28zoom%29_%28US50%29_%28-grid%29.svg/600px-Hawaii_in_United_States_%28zoom%29_%28US50%29_%28-grid%29.svg.png",
    "Hawaii"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Idaho_in_United_States.svg/600px-Idaho_in_United_States.svg.png",
    "Idaho"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Illinois_in_United_States.svg/600px-Illinois_in_United_States.svg.png",
    "Illinois"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Indiana_in_United_States.svg/600px-Indiana_in_United_States.svg.png",
    "Indiana"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Iowa_in_United_States.svg/600px-Iowa_in_United_States.svg.png",
    "Iowa"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Kansas_in_United_States.svg/600px-Kansas_in_United_States.svg.png",
    "Kansas"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Kentucky_in_United_States.svg/600px-Kentucky_in_United_States.svg.png",
    "Kentucky"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Louisiana_in_United_States.svg/600px-Louisiana_in_United_States.svg.png",
    "Louisiana"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Maine_in_United_States.svg/600px-Maine_in_United_States.svg.png",
    "Maine"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Maryland_in_United_States_%28zoom%29.svg/600px-Maryland_in_United_States_%28zoom%29.svg.png",
    "Maryland"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Massachusetts_in_United_States_%28zoom%29.svg/600px-Massachusetts_in_United_States_%28zoom%29.svg.png",
    "Massachusetts"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Michigan_in_United_States.svg/600px-Michigan_in_United_States.svg.png",
    "Michigan"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Minnesota_in_United_States.svg/600px-Minnesota_in_United_States.svg.png",
    "Minnesota"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Mississippi_in_United_States.svg/600px-Mississippi_in_United_States.svg.png",
    "Mississippi"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Missouri_in_United_States.svg/600px-Missouri_in_United_States.svg.png",
    "Missouri"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Montana_in_United_States.svg/600px-Montana_in_United_States.svg.png",
    "Montana"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Nebraska_in_United_States.svg/600px-Nebraska_in_United_States.svg.png",
    "Nebraska"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Nevada_in_United_States.svg/600px-Nevada_in_United_States.svg.png",
    "Nevada"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/New_Hampshire_in_United_States.svg/600px-New_Hampshire_in_United_States.svg.png",
    "New Hampshire"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/New_Jersey_in_United_States_%28zoom%29.svg/600px-New_Jersey_in_United_States_%28zoom%29.svg.png",
    "New Jersey"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/New_Mexico_in_United_States.svg/600px-New_Mexico_in_United_States.svg.png",
    "New Mexico"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/New_York_in_United_States.svg/600px-New_York_in_United_States.svg.png",
    "New York"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/North_Carolina_in_United_States.svg/600px-North_Carolina_in_United_States.svg.png",
    "North Carolina"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/North_Dakota_in_United_States.svg/600px-North_Dakota_in_United_States.svg.png",
    "North Dakota"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Ohio_in_United_States.svg/600px-Ohio_in_United_States.svg.png",
    "Ohio"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Oklahoma_in_United_States.svg/600px-Oklahoma_in_United_States.svg.png",
    "Oklahoma"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Oregon_in_United_States.svg/600px-Oregon_in_United_States.svg.png",
    "Oregon"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Pennsylvania_in_United_States.svg/600px-Pennsylvania_in_United_States.svg.png",
    "Pennsylvania"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Rhode_Island_in_United_States_%28zoom%29.svg/600px-Rhode_Island_in_United_States_%28zoom%29.svg.png",
    "Rhode Island"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/South_Carolina_in_United_States.svg/600px-South_Carolina_in_United_States.svg.png",
    "South Carolina"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/South_Dakota_in_United_States.svg/600px-South_Dakota_in_United_States.svg.png",
    "South Dakota"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Tennessee_in_United_States.svg/600px-Tennessee_in_United_States.svg.png",
    "Tennessee"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Texas_in_United_States.svg/600px-Texas_in_United_States.svg.png",
    "Texas"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Utah_in_United_States.svg/600px-Utah_in_United_States.svg.png",
    "Utah"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Vermont_in_United_States_%28zoom%29.svg/600px-Vermont_in_United_States_%28zoom%29.svg.png",
    "Vermont"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Virginia_in_United_States.svg/600px-Virginia_in_United_States.svg.png",
    "Virginia"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Washington_in_United_States.svg/600px-Washington_in_United_States.svg.png",
    "Washington"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/West_Virginia_in_United_States.svg/600px-West_Virginia_in_United_States.svg.png",
    "West Virginia"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Wisconsin_in_United_States.svg/600px-Wisconsin_in_United_States.svg.png",
    "Wisconsin"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Wyoming_in_United_States.svg/600px-Wyoming_in_United_States.svg.png",
    "Wyoming"
  ]
]

# 2.
# What flag is this?
# Users will be shown a picture of a flag to guess its country
{_, flags_pack} =
  Live.pack_create(user, %{
    name: "Flags",
    is_random: true,
    description: "Guess the name of the country by looking at its flag",
    tags: [],
    length: 10
  })

flags_questions = [
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/250px-Flag_of_the_People%27s_Republic_of_China.svg.png",
    "China"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/250px-Flag_of_India.svg.png",
    "India"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/250px-Flag_of_the_United_States.svg.png",
    "United States"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/250px-Flag_of_Indonesia.svg.png",
    "Indonesia"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Flag_of_Pakistan.svg/250px-Flag_of_Pakistan.svg.png",
    "Pakistan"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/250px-Flag_of_Brazil.svg.png",
    "Brazil"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flag_of_Nigeria.svg/250px-Flag_of_Nigeria.svg.png",
    "Nigeria"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Flag_of_Bangladesh.svg/250px-Flag_of_Bangladesh.svg.png",
    "Bangladesh"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Flag_of_Russia.svg/250px-Flag_of_Russia.svg.png",
    "Russia"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Mexico.svg/250px-Flag_of_Mexico.svg.png",
    "Mexico"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Flag_of_Japan.svg/250px-Flag_of_Japan.svg.png",
    "Japan"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Flag_of_Ethiopia.svg/250px-Flag_of_Ethiopia.svg.png",
    "Ethiopia"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Flag_of_the_Philippines.svg/250px-Flag_of_the_Philippines.svg.png",
    "Philippines"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Egypt.svg/250px-Flag_of_Egypt.svg.png",
    "Egypt"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/250px-Flag_of_Vietnam.svg.png",
    "Vietnam"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Flag_of_the_Democratic_Republic_of_the_Congo_%283-2%29.svg/250px-Flag_of_the_Democratic_Republic_of_the_Congo_%283-2%29.svg.png",
    "Democratic Republic of the Congo"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Flag_of_Iran.svg/250px-Flag_of_Iran.svg.png",
    "Iran"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/250px-Flag_of_Turkey.svg.png",
    "Turkey"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Flag_of_Germany.svg/250px-Flag_of_Germany.svg.png",
    "Germany"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/250px-Flag_of_France.svg.png",
    "France"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/250px-Flag_of_the_United_Kingdom.svg.png",
    "United Kingdom"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_Thailand.svg/250px-Flag_of_Thailand.svg.png",
    "Thailand"
  ]
]

# 3.
# Name the country's capital
# Users will guess the name of capital of given country's name
{_, capitals_pack} =
  Live.pack_create(user, %{
    name: "Capitals",
    is_random: true,
    description: "Guess the capital of given country",
    tags: [],
    length: 10
  })

capitals_questions = [
  ["China", "Beijing"],
  ["India", "New Delhi"],
  ["United States", "Washington, D.C."],
  ["Indonesia", "Jakarta"],
  ["Pakistan", "Isamabad"],
  ["Brazil", "Brasília"],
  ["Nigeria", "Abuja"],
  ["Bangladesh", "Dhaka"],
  ["Russia", "Moscow"],
  ["Mexico", "Mexico City"],
  ["Japan", "Tokyo"],
  ["Ethiopia", "Addis Ababa"],
  ["Philippines", "Manila"],
  ["Egypt", "Cairo"],
  ["Vietnam", "Hanoi"],
  ["Democratic Republic of the Congo", "Kinshasa"],
  ["Iran", "Tehran"],
  ["Turkey", "Ankara"],
  ["Germany", "Berlin"],
  ["France", "Paris"],
  ["United Kingdom", "London"],
  ["Thailand", "Bangkok"]
]

# 4.
# Name the stock ticker
# Users will be shown a picture of a logo to guess its ticker
{_, stocks_pack} =
  Live.pack_create(user, %{
    name: "Stocks",
    is_random: true,
    description: "Guess the ticker of the company",
    tags: [],
    length: 10
  })

stocks_questions = [
  ["https://s3.amazonaws.com/images.teladoc.com/www/clients/template-hp/tdoc.jpg", "TDOC"],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/1200px-Tesla_Motors.svg.png",
    "TSLA"
  ],
  ["https://image.roku.com/bWFya2V0aW5n/roku-logo.png", "ROKU"],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Square%2C_Inc._logo.svg/1024px-Square%2C_Inc._logo.svg.png",
    "SQ"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/2560px-Shopify_logo_2018.svg.png",
    "SHOP"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Zoom_Communications_Logo.svg/2560px-Zoom_Communications_Logo.svg.png",
    "ZM"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Twilio-logo-red.svg/1024px-Twilio-logo-red.svg.png",
    "TWLO"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Coinbase_Logo_2013.png/1200px-Coinbase_Logo_2013.png",
    "COIN"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/1280px-Spotify_logo_with_text.svg.png",
    "SPOT"
  ],
  [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Unity_Technologies_logo.svg/1024px-Unity_Technologies_logo.svg.png",
    "U"
  ]
]

# 5.
# Crypto
# Users will have to do basic math
{_, crypto_pack} =
  Live.pack_create(user, %{
    name: "Crypto",
    is_random: true,
    description: "Guess the crypto of given icon",
    tags: [],
    length: 10
  })

crypto_questions = [
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/1.png", "Bitcoin"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png", "Ethereum"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/825.png", "Tether"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png", "Cardano"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png", "Binance Coin"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/74.png", "Dogecoin"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/52.png", "XRP"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png", "Polkadot"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/8916.png", "Internet Computer"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png", "USD Coin"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/1831.png", "Bitcoin Cash"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png", "Uniswap"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/2.png", "Litecoin"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png", "Chainlink"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/512.png", "Stellar"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png", "Binance USD"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png", "Solana"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/2416.png", "THETA"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png", "Polygon"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/1321.png", "Ethereum Classic"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png", "Wrapped Bitcoin"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/3077.png", "VeChain"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png", "TRON"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/2280.png", "Filecoin"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/1765.png", "EOS"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/328.png", "Monero"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png", "Dai"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png", "Aave"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png", "SHIBA INU"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/1376.png", "Neo"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/4256.png", "Klaytn"],
  ["https://s2.coinmarketcap.com/static/img/coins/64x64/3602.png", "Bitcoin SV"]
]

# Create pack tags
Live.pack_tag_create(states_pack, featured_tag)
Live.pack_tag_create(flags_pack, featured_tag)
Live.pack_tag_create(capitals_pack, featured_tag)
Live.pack_tag_create(stocks_pack, featured_tag)
Live.pack_tag_create(crypto_pack, featured_tag)

# Create question types
{_, text_question_type} = Catalog.question_type_create(%{slug: "text"})
{_, image_question_type} = Catalog.question_type_create(%{slug: "image"})
Catalog.question_type_create(%{slug: "audio"})
Catalog.question_type_create(%{slug: "video"})
Catalog.question_type_create(%{slug: "code"})

# Create answer types
{_, text_answer_type} = Catalog.answer_type_create(%{slug: "text"})
{_, multi_text_answer_type} = Catalog.answer_type_create(%{slug: "multi_text"})
Catalog.answer_type_create(%{slug: "letter_text"})

states_questions
|> Enum.with_index()
|> Enum.each(fn {x, i} ->
  {_, scene} =
    Catalog.scene_create(user, states_pack, image_question_type, text_answer_type, %{
      question: Enum.at(x, 0),
      answer: Enum.at(x, 1),
      order: i
    })

  Catalog.scene_answer_create(user, scene, Enum.at(x, 1), true)
end)

flags_questions
|> Enum.with_index()
|> Enum.each(fn {x, i} ->
  {_, scene} =
    Catalog.scene_create(user, flags_pack, image_question_type, text_answer_type, %{
      question: Enum.at(x, 0),
      answer: Enum.at(x, 1),
      order: i
    })

  Catalog.scene_answer_create(user, scene, Enum.at(x, 1), true)
end)

capitals_questions
|> Enum.with_index()
|> Enum.each(fn {x, i} ->
  {_, scene} =
    Catalog.scene_create(user, capitals_pack, text_question_type, text_answer_type, %{
      question: Enum.at(x, 0),
      answer: Enum.at(x, 1),
      order: i
    })

  Catalog.scene_answer_create(user, scene, Enum.at(x, 1), true)
end)

stocks_questions
|> Enum.with_index()
|> Enum.each(fn {x, i} ->
  {_, scene} =
    Catalog.scene_create(user, stocks_pack, image_question_type, text_answer_type, %{
      question: Enum.at(x, 0),
      answer: Enum.at(x, 1),
      order: i
    })

  Catalog.scene_answer_create(user, scene, Enum.at(x, 1), true)
end)

crypto_questions
|> Enum.with_index()
|> Enum.each(fn {x, i} ->
  {_, scene} =
    Catalog.scene_create(user, crypto_pack, image_question_type, text_answer_type, %{
      question: Enum.at(x, 0),
      answer: Enum.at(x, 1),
      order: i
    })

  Catalog.scene_answer_create(user, scene, Enum.at(x, 1), true)
end)
