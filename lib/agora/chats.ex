defmodule Agora.Chats do
  @moduledoc """
  The Chats context.
  """

  import Ecto.Query, warn: false
  alias Agora.Repo
  alias Agora.Chat
  alias Agora.Forum.Conversation

  @doc """
  Creates a chat message for a forum.
  """
  def create_chat_for_forum(forum_id, user_id, message) do
    # First, get or create conversation for this forum
    conversation = get_or_create_conversation_for_forum(forum_id)

    # Get the next sequence number
    next_sequence = get_next_sequence_for_conversation(conversation.id)

    # Create the chat
    %Chat{}
    |> Chat.changeset(%{
      message: message,
      conversation_id: conversation.id,
      user_id: user_id,
      sequence: next_sequence
    })
    |> Repo.insert()
  end

  @doc """
  Gets a chat with user information.
  """
  def get_chat_with_user(chat_id) do
    Repo.get(Chat, chat_id)
    |> Repo.preload(:user)
  end

  defp get_or_create_conversation_for_forum(forum_id) do
    case Repo.get_by(Conversation, forum_id: forum_id) do
      nil ->
        {:ok, conversation} =
          %Conversation{}
          |> Conversation.changeset(%{forum_id: forum_id})
          |> Repo.insert()

        conversation

      conversation ->
        conversation
    end
  end

  defp get_next_sequence_for_conversation(conversation_id) do
    query =
      from c in Chat,
        where: c.conversation_id == ^conversation_id,
        select: max(c.sequence)

    case Repo.one(query) do
      nil -> 1
      max_sequence -> max_sequence + 1
    end
  end
end
