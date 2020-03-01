defmodule Trivia.QuestionCache do
  use GenServer

  @refresh_interval :timer.minutes(5)

  def start_link(_arg) do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def get_questions() do
    GenServer.call(__MODULE__, :get_questions)
  end

  def init(:ok) do
    state = load_questions()
    schedule_refresh()
    {:ok, state}
  end

  def handle_call(:get_questions, _from, state) do
    {:reply, state, state}
  end

  def handle_info(:refresh, _state) do
    state = load_questions()
    schedule_refresh()
    {:noreply, state}
  end

  defp schedule_refresh do
    Process.send_after(self(), :refresh, @refresh_interval)    
  end

  def load_questions() do
    key = Application.get_env(:playhouse, :airtable_key)
    url = "https://api.airtable.com/v0/appOUKhim5DD45JMb/Question%20Bank\?api_key\=#{key}"
    response = HTTPoison.get!(url)
    req = Poison.decode!(response.body)
    records = req["records"]

    Enum.map(records, fn x ->
      fields = x["fields"]
      [fields["Question"], fields["Answer"], fields["Pack"]]
    end)
  end
end
