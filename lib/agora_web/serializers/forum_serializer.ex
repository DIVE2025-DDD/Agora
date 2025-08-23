defmodule AgoraWeb.Serializers.ForumSerializer do
  alias AgoraWeb.UserSerializer

  def to_map(forums) when is_list(forums) do
    Enum.map(forums, &to_map/1)
  end

  def to_map(forum = %Agora.Forum{}) do
    %{
      id: forum.id,
      title: forum.title,
      author: forum.author,
      content: forum.content,
      view_count: forum.view_count,
      deadline: if(forum.deadline, do: Date.to_iso8601(forum.deadline), else: nil),
      chat_count:
        case Map.get(forum, :chat_count) do
          nil ->
            case forum.conversation do
              %{chats: chats} when is_list(chats) -> length(chats)
              _ -> 0
            end

          n ->
            n
        end,
      inserted_at: forum.inserted_at,
      updated_at: forum.updated_at,
      conversation: serialize_conversation(forum.conversation)
    }
  end

  def to_map(nil), do: nil

  defp serialize_conversation(nil), do: nil
  defp serialize_conversation(%Ecto.Association.NotLoaded{}), do: nil

  defp serialize_conversation(conversation) when is_struct(conversation) do
    %{
      id: conversation.id,
      chats: serialize_chats(Map.get(conversation, :chats))
    }
  end

  defp serialize_conversation(_), do: nil

  defp serialize_chats(chats) when is_list(chats) do
    Enum.map(chats, &serialize_chat/1)
  end

  defp serialize_chats(%Ecto.Association.NotLoaded{}), do: []
  defp serialize_chats(_), do: []

  defp serialize_chat(chat) do
    %{
      id: chat.id,
      message: chat.message,
      sequence: chat.sequence,
      inserted_at: chat.inserted_at,
      user: UserSerializer.to_map(chat.user)
    }
  end

  def assign_prop(conn, name, value) do
    Inertia.Controller.assign_prop(conn, name, fn ->
      case value do
        nil -> nil
        _ -> to_map(value)
      end
    end)
  end
end
