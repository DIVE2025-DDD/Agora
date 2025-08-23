defmodule Agora.Repo.Migrations.CreateChats do
  use Ecto.Migration

  def up do
    create table(:chats) do
      add :message, :text, null: false
      add :sequence, :integer
      add :conversation_id, :integer, null: false
      add :user_id, :integer, null: false

      timestamps(type: :utc_datetime)
    end

    create index(:chats, [:conversation_id])
    create index(:chats, [:user_id])
    create index(:chats, [:conversation_id, :sequence])
    create index(:chats, [:conversation_id, :inserted_at])
  end

  def down do
    drop table(:chats)
  end
end
