defmodule AgoraWeb.RoomChannel do
  use AgoraWeb, :channel
  alias Agora.Forums
  alias Agora.Chats
  alias LangChain.Chains.LLMChain
  alias LangChain.ChatModels.ChatAnthropic
  alias LangChain.Message

  @impl true
  def join("room:lobby", payload, socket) do
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def join("room:forum:" <> forum_id, payload, socket) do
    if authorized?(payload) do
      socket = assign(socket, :forum_id, String.to_integer(forum_id))
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (room:lobby).
  @impl true
  def handle_in("shout", payload, socket) do
    broadcast(socket, "shout", payload)
    {:noreply, socket}
  end

  @impl true
  def handle_in("new_message", %{"message" => message, "user_id" => user_id}, socket) do
    forum_id = socket.assigns.forum_id

    case Chats.create_chat_for_forum(forum_id, user_id, message) do
      {:ok, chat} ->
        # Load the chat with user information for broadcasting
        chat_with_user = Chats.get_chat_with_user(chat.id)

        # Broadcast to all clients in this forum room
        broadcast(socket, "new_message", %{
          chat: %{
            id: chat_with_user.id,
            message: chat_with_user.message,
            sequence: chat_with_user.sequence,
            inserted_at: chat_with_user.inserted_at,
            user: %{
              id: chat_with_user.user.id,
              email: chat_with_user.user.email,
              nickname: chat_with_user.user.nickname
            }
          }
        })

        {:reply, {:ok, %{chat: chat_with_user}}, socket}

      {:error, changeset} ->
        {:reply, {:error, %{errors: changeset.errors}}, socket}
    end
  end

  @impl true
  def handle_in("generate_evidence", %{"chat_ids" => chat_ids, "forum_id" => forum_id}, socket) do
    Task.start(fn ->
      # 실제 채팅 내용을 조회하여 LLM 입력용 텍스트로 변환
      chat_content = Chats.get_chats_for_llm(chat_ids)
      IO.inspect(chat_content, label: "Chat content for LLM")

      # LLM API 호출을 통한 증거 생성
      result = generate_evidence_with_llm(chat_content, socket)

      case result do
        {:ok, evidence} ->
          # 최종 응답 전송
          broadcast(socket, "evidence_response", %{
            content: evidence,
            timestamp: DateTime.utc_now() |> DateTime.to_iso8601()
          })

        {:error, error} ->
          # 에러 응답 전송
          broadcast(socket, "evidence_error", %{
            error: error,
            timestamp: DateTime.utc_now() |> DateTime.to_iso8601()
          })
      end
    end)

    {:reply, {:ok, %{status: "generating"}}, socket}
  end

  # LLM을 사용하여 채팅 내용을 기반으로 증거를 생성하는 함수
  defp generate_evidence_with_llm(chat_content, socket) do
    try do
      # 스트리밍 콜백 핸들러 정의
      handler = %{
        on_llm_new_delta: fn _model, message_delta ->
          # 스트리밍 청크 전송
          broadcast(socket, "stream_chunk", %{
            text: message_delta.content || "",
            timestamp: DateTime.utc_now() |> DateTime.to_iso8601()
          })
        end
      }

      # LLM 체인 생성 및 실행
      system_prompt = """
      당신은 토론 내용을 분석하여 근거있는 증거와 결론을 도출하는 전문 분석가입니다.
      주어진 채팅 대화 내용을 바탕으로 다음을 수행해주세요:
      
      1. 주요 논점과 의견들을 요약해주세요
      2. 각 논점에 대한 근거와 증거를 정리해주세요
      3. 토론의 결론이나 합의점을 도출해주세요
      4. 추가로 고려해야 할 사항이나 질문을 제시해주세요
      
      답변은 한국어로 작성하며, 명확하고 구조화된 형태로 제공해주세요.
      """

      user_prompt = """
      다음은 분석할 채팅 대화 내용입니다:

      #{chat_content}
      """

      case %{llm: ChatAnthropic.new!(%{model: "claude-3-5-sonnet-20241022", stream: true, temperature: 0.7})}
           |> LLMChain.new!()
           |> LLMChain.add_message(Message.new_system!(system_prompt))
           |> LLMChain.add_message(Message.new_user!(user_prompt))
           |> LLMChain.add_callback(handler)
           |> LLMChain.run() do
        {:ok, updated_chain} ->
          # 최신 메시지에서 응답 추출
          case LLMChain.last_message(updated_chain) do
            %Message{role: :assistant, content: content} -> {:ok, content}
            _ -> {:error, "LLM 응답을 받을 수 없습니다."}
          end

        {:error, reason} ->
          {:error, "LLM 호출 중 오류가 발생했습니다: #{inspect(reason)}"}
      end
    rescue
      e ->
        {:error, "예상치 못한 오류가 발생했습니다: #{inspect(e)}"}
    end
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
