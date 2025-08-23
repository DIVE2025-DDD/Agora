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

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
