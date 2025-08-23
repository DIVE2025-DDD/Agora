defmodule AgoraWeb.RoomChannel do
  use AgoraWeb, :channel
  alias Agora.Forums
  alias Agora.Chats

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
      # 샘플 응답 데이터
      sample_messages = [
        "영도구 외국인 소비액 7,243,337원(2.0%)로 하위권.
        해운대 366,460,819원(3.0%)·부산진 205,272,390원(4.0%)·중구 105,718,041원(10.0%) 대비 낮음.
        → 현재 데이터 기준 ‘영도구 안내센터 우선’ 근거 약함."
      ]

      # 스트리밍 시뮬레이션 (실제로는 LLM API 호출)
      selected_message = Enum.random(sample_messages)

      # 스트리밍 청크 전송 (선택사항)
      words = String.split(selected_message, " ")

      Enum.each(words, fn word ->
        broadcast(socket, "stream_chunk", %{
          text: word <> " ",
          timestamp: DateTime.utc_now() |> DateTime.to_iso8601()
        })

        # 스트리밍 효과
        Process.sleep(50)
      end)

      # 최종 응답 전송
      broadcast(socket, "evidence_response", %{
        content: selected_message,
        timestamp: DateTime.utc_now() |> DateTime.to_iso8601()
      })
    end)

    {:reply, {:ok, %{status: "generating"}}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
