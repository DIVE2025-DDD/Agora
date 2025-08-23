defmodule Agora.Chat do
  use Ecto.Schema
  import Ecto.Changeset

  schema "chats" do
    field :message, :string
    field :sequence, :integer

    belongs_to :conversation, Agora.Forum.Conversation
    belongs_to :user, Agora.Accounts.User

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(chat, attrs) do
    chat
    |> cast(attrs, [:message, :sequence, :conversation_id, :user_id])
    |> validate_required([:message, :conversation_id, :user_id])
  end
end
