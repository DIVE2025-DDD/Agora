defmodule Agora.Repo.Migrations.CreateForums do
  use Ecto.Migration

  def up do
    create table(:forums) do
      add :title, :string, null: false
      add :content, :text, null: false
      add :author, :string, null: false
      add :view_count, :integer, default: 0

      timestamps(type: :utc_datetime)
    end

    create index(:forums, [:author])
    create index(:forums, [:inserted_at])
  end

  def down do
    drop table(:forums)
  end
end
