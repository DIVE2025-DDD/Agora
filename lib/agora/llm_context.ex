defmodule Agora.LlmContext do
  @moduledoc """
  LLM을 사용하기 위한 간단한 컨텍스트 모듈
  """

  alias LangChain.Message
  alias LangChain.Chains.LLMChain
  alias LangChain.ChatModels.ChatAnthropic
  alias LangChain.Utils.ChainResult

  @doc """
  Anthropic LLM을 초기화합니다.
  """
  def create_anthropic_llm(model \\ "claude-3-5-sonnet-20241022") do
    ChatAnthropic.new!(%{
      model: model,
      api_key: System.get_env("ANTHROPIC_API_KEY")
    })
  end

  @doc """
  단순한 텍스트 메시지를 보내고 응답을 받습니다.
  """
  def send_message(llm, content) do
    try do
      {:ok, chain} =
        LLMChain.new!(%{llm: llm})
        |> LLMChain.add_message(Message.new_user!(content))
        |> LLMChain.run()

      response = ChainResult.to_string!(chain)
      {:ok, response}
    rescue
      error -> {:error, error}
    end
  end

  @doc """
  여러 메시지를 포함한 대화를 진행합니다.
  """
  def send_conversation(llm, messages) when is_list(messages) do
    try do
      formatted_messages =
        messages
        |> Enum.map(fn
          %{role: "user", content: content} -> Message.new_user!(content)
          %{role: "assistant", content: content} -> Message.new_assistant!(content)
          %{role: "system", content: content} -> Message.new_system!(content)
          content when is_binary(content) -> Message.new_user!(content)
        end)

      chain = LLMChain.new!(%{llm: llm})

      {:ok, updated_chain} =
        formatted_messages
        |> Enum.reduce(chain, fn message, acc_chain ->
          LLMChain.add_message(acc_chain, message)
        end)
        |> LLMChain.run()

      response = ChainResult.to_string!(updated_chain)
      {:ok, response}
    rescue
      error -> {:error, error}
    end
  end

  @doc """
  스트리밍으로 응답을 받습니다.
  """
  def stream_message(llm, content, callback_fn \\ nil) do
    try do
      stream_llm = %{llm | stream: true}

      {:ok, chain} =
        LLMChain.new!(%{
          llm: stream_llm,
          verbose: callback_fn != nil
        })
        |> LLMChain.add_message(Message.new_user!(content))
        |> LLMChain.run()

      response = ChainResult.to_string!(chain)
      if callback_fn, do: callback_fn.({:content, response})
      {:ok, response}
    rescue
      error -> {:error, error}
    end
  end

  @doc """
  채팅 내용을 바탕으로 지속가능성 관련 증거를 생성합니다.
  """
  def generate_evidence(chat_content) do
    llm = create_anthropic_llm()
    
    prompt = """
    다음 채팅 내용을 바탕으로 지속가능성 관련 증거를 생성해주세요.
    채팅 참여자들의 의견과 논의 내용을 종합하여 구체적이고 실용적인 증거 자료를 만들어주세요.

    채팅 내용:
    #{chat_content}

    증거 생성 요구사항:
    1. 객관적이고 구체적인 내용 포함
    2. 실행 가능한 제안사항 제시
    3. 데이터나 사례가 있다면 포함
    4. 한국어로 작성
    """

    send_message(llm, prompt)
  end
end