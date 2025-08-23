defmodule Agora.Forums do
  @moduledoc """
  The Forums context.
  """

  import Ecto.Query, warn: false
  alias Agora.Repo
  alias Agora.Forum

  def list_forums do
    forums =
      Repo.all(
        from(f in Forum,
          order_by: [desc: f.inserted_at]
        )
      )

    # 각 forum에 대해 chat_count 계산하고 Forum struct 유지
    Enum.map(forums, fn forum ->
      chat_count =
        from(conv in Agora.Forum.Conversation,
          where: conv.forum_id == ^forum.id,
          left_join: ch in assoc(conv, :chats),
          select: count(ch.id)
        )
        |> Repo.one() || 0

      %{forum | chat_count: chat_count}
    end)
  end

  def get_forum!(id), do: Repo.get!(Forum, id)

  def get_forum(id), do: Repo.get(Forum, id)

  def get_forum_with_conversation!(id) do
    Repo.get!(Forum, id)
    |> Repo.preload(:conversation)
  end

  def get_forum_with_conversation(id) do
    case Repo.get(Forum, id) do
      nil -> nil
      forum -> Repo.preload(forum, :conversation)
    end
  end

  def get_forum_with_comments!(id) do
    Repo.get!(Forum, id)
    |> Repo.preload(conversation: [chats: :user])
  end

  def get_forum_with_comments(id) do
    case Repo.get(Forum, id) do
      nil -> nil
      forum -> Repo.preload(forum, conversation: [chats: :user])
    end
  end

  def create_forum(attrs \\ %{}) do
    %Forum{view_count: 0}
    |> Forum.changeset(attrs)
    |> Repo.insert()
  end

  # 기존 방법 - 수정된 버전
  def create_forum_with_conversation(attrs \\ %{}) do
    %Forum{view_count: 0}
    |> Forum.changeset_with_conversation(attrs)
    |> Repo.insert()
  end

  # 더 안전한 방법 - 트랜잭션 사용
  def create_forum_with_conversation_safe(attrs \\ %{}) do
    Repo.transaction(fn ->
      case create_forum(attrs) do
        {:ok, forum} ->
          case %Agora.Forum.Conversation{forum_id: forum.id}
               |> Agora.Forum.Conversation.changeset(%{})
               |> Repo.insert() do
            {:ok, _conversation} ->
              forum |> Repo.preload(:conversation)

            {:error, changeset} ->
              Repo.rollback(changeset)
          end

        {:error, changeset} ->
          Repo.rollback(changeset)
      end
    end)
    |> case do
      {:ok, forum} -> {:ok, forum}
      {:error, changeset} -> {:error, changeset}
    end
  end

  def update_forum(%Forum{} = forum, attrs) do
    forum
    |> Forum.changeset(attrs)
    |> Repo.update()
  end

  def delete_forum(%Forum{} = forum) do
    Repo.delete(forum)
  end

  def increment_view_count(%Forum{} = forum) do
    forum
    |> Forum.changeset(%{view_count: forum.view_count + 1})
    |> Repo.update()
  end
end
