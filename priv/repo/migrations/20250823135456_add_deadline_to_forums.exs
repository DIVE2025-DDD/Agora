defmodule Agora.Repo.Migrations.AddDeadlineToForums do
  use Ecto.Migration

  def change do
    alter table(:forums) do
      add :deadline, :date
    end
  end
end
