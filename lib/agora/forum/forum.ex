defmodule Agora.Forum do
  use Ecto.Schema
  import Ecto.Changeset

  schema "forums" do
    field :title, :string
    field :author, :string
    field :content, :string
    field :view_count, :integer

    has_one :conversation, Agora.Forum.Conversation

    timestamps(type: :utc_datetime)
  end

  def changeset(forum, attrs) do
    forum
    |> cast(attrs, [:title, :content, :author, :view_count])
    |> validate_required([:title, :content, :author])
  end

  def changeset_with_conversation(forum, attrs) do
    conversation_attrs = %{
      title: attrs["title"],
      content: attrs["content"],
      author: attrs["author"],
      view_count: 0
    }

    attrs_with_conversation = Map.put(attrs, "conversation", conversation_attrs)

    forum
    |> cast(attrs_with_conversation, [:title, :content, :author, :view_count])
    |> validate_required([:title, :content, :author])
    |> cast_assoc(:conversation, required: true)
  end
end
