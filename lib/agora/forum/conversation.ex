defmodule Agora.Forum.Conversation do
  use Ecto.Schema
  import Ecto.Changeset

  schema "conversations" do
    belongs_to :forum, Agora.Forum
    has_many :chats, Agora.Chat

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(conversation, attrs) do
    conversation
    |> cast(attrs, [:forum_id])
    |> validate_required([:forum_id])
  end
end
