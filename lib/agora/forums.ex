defmodule Agora.Forums do
  @moduledoc """
  The Forums context.
  """

  import Ecto.Query, warn: false
  alias Agora.Repo

  alias Agora.Forum

  def list_forums do
    Repo.all(from f in Forum, order_by: [desc: f.inserted_at])
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

  def create_forum_with_conversation(attrs \\ %{}) do
    %Forum{view_count: 0}
    |> Forum.changeset_with_conversation(attrs)
    |> Repo.insert()
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
