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
    state = load_questions("")
    schedule_refresh()
    {:ok, state}
  end

  def handle_call({:get_questions, pack}, _from, state) do
    questions = get_questions(state, pack)
    {:reply, questions, state}
  end

  def handle_info(:refresh, _state) do
    state = load_questions("")
    schedule_refresh()
    {:noreply, state}
  end

  def get_questions(questions, pack) do
    case pack == "Variety" do
      true -> 
        questions |> get_random_questions(10)
      false -> 
        Enum.filter(questions, fn x ->
          pack_field = Enum.at(x, 2)
          pack_name = Enum.at(pack_field, 0)
          pack_name == pack
        end) |> get_random_questions(10)
    end
  end

  def get_random_questions(questions, count) do
    questions |> Enum.shuffle |> Enum.take(count)
  end

  def schedule_refresh do
    Process.send_after(self(), :refresh, @refresh_interval)
  end

  def format_records(records) do
    Enum.map(records, fn x ->
      fields = x["fields"]
      [fields["Question"], fields["Answer"], fields["Pack"]]
      case Map.has_key?(fields, "Answer") do
        true ->
          [fields["Question"], fields["Answer"], fields["Pack"]]
        false ->
          [fields["Question"], "", fields["Pack"]]
      end
    end)
    |> Enum.filter(fn y ->
      Enum.at(y, 0) != nil && Enum.at(y, 1) && Enum.at(y, 2)
    end)
  end

  @doc """
  Recursive fn to get all paginated results. Starts with "" offset and end
  with nil offset
  """
  def load_questions(offset) do
    key = System.get_env("AIRTABLE_KEY")
    all_questions = []

    case offset == nil do
      true -> []
      false ->
        url = "https://api.airtable.com/v0/appOUKhim5DD45JMb/Question%20Bank\?api_key\=#{key}\&offset\=#{offset}"
        response = HTTPoison.get!(url)

        body = Poison.decode!(response.body)
        records = body["records"]
        new_offset = body["offset"]

        case records == nil do
          true -> all_questions
          false ->
            all_questions = Enum.concat(all_questions, format_records(records))
            Enum.concat(all_questions, load_questions(new_offset))
        end
    end
  end
end
