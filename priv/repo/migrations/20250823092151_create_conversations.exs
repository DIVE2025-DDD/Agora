defmodule Agora.Repo.Migrations.CreateConversations do
  use Ecto.Migration

  def up do
    create table(:conversations) do
      add :forum_id, :integer, null: false

      timestamps(type: :utc_datetime)
    end

    create index(:conversations, [:forum_id])
    create index(:conversations, [:inserted_at])
  end

  def down do
    drop table(:conversations)
  end
end
