defmodule Game.QuestionCache do
  @moduledoc """
  Pings Airtable every minute to get questions and store/sync results
  """

  use GenServer

  @refresh_interval :timer.minutes(1)

  def start_link(_arg) do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def get_questions(pack) do
    GenServer.call(__MODULE__, {:get_questions, pack})
  end

  def init(:ok) do
    state = load_questions()
    schedule_refresh()
    {:ok, state}
  end

  def handle_call({:get_questions, pack}, _from, state) do
    questions =
      Enum.filter(state, fn x ->
        pack_field = Enum.at(x, 2)
        pack_name = Enum.at(pack_field, 0)
        pack_name == pack
      end)
      |> Enum.shuffle
      |> Enum.take(10)

    {:reply, questions, state}
  end

  def handle_info(:refresh, _state) do
    state = load_questions()
    schedule_refresh()
    {:noreply, state}
  end

  def schedule_refresh do
    Process.send_after(self(), :refresh, @refresh_interval)    
  end

  def load_questions() do
    key = System.get_env("AIRTABLE_KEY")
    url = "https://api.airtable.com/v0/appOUKhim5DD45JMb/Question%20Bank\?api_key\=#{key}"
    response = HTTPoison.get!(url)
    req = Poison.decode!(response.body)
    records = req["records"]

    Enum.map(records, fn x ->
      fields = x["fields"]
      [fields["Question"], fields["Answer"], fields["Pack"]]
    end)
    |> Enum.filter(fn y ->
      Enum.at(y, 0) != nil && Enum.at(y, 1) && Enum.at(y, 2)
    end)
  end
end
