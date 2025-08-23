defmodule Agora.Forum do
  use Ecto.Schema
  import Ecto.Changeset

  schema "forums" do
    field :title, :string
    field :author, :string
    field :content, :string
    field :view_count, :integer
    field :deadline, :date
    field :chat_count, :integer, virtual: true, default: 0

    has_one :conversation, Agora.Forum.Conversation

    timestamps(type: :utc_datetime)
  end

  def changeset(forum, attrs) do
    forum
    |> cast(attrs, [:title, :content, :author, :view_count, :deadline])
    |> validate_required([:title, :content, :author])
  end

  def changeset_with_conversation(forum, attrs) do
    attrs_with_conversation = Map.put(attrs, "conversation", %{})

    forum
    |> cast(attrs_with_conversation, [:title, :content, :author, :view_count, :deadline])
    |> validate_required([:title, :content, :author])
    |> cast_assoc(:conversation, with: &Agora.Forum.Conversation.changeset/2, required: true)
  end
end
