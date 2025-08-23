defmodule AgoraWeb.Serializers.ForumSerializer do
  alias AgoraWeb.UserSerializer

  def to_map(forum = %Agora.Forum{}) do
    %{
      id: forum.id,
      title: forum.title,
      author: forum.author,
      content: forum.content,
      view_count: forum.view_count,
      inserted_at: forum.inserted_at,
      updated_at: forum.updated_at,
      conversation: serialize_conversation(forum.conversation)
    }
  end

  def to_map(nil), do: nil

  defp serialize_conversation(nil), do: nil
  defp serialize_conversation(conversation) do
    %{
      id: conversation.id,
      chats: serialize_chats(conversation.chats)
    }
  end

  defp serialize_chats(chats) when is_list(chats) do
    Enum.map(chats, &serialize_chat/1)
  end
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

  def assign_prop(conn, name, forum) do
    Inertia.Controller.assign_prop(conn, name, fn -> forum && to_map(forum) end)
  end
end
