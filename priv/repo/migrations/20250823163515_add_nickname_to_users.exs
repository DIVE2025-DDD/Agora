defmodule Agora.Repo.Migrations.AddNicknameToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :nickname, :string
    end

    # Update existing users to have a default nickname based on email
    execute "UPDATE users SET nickname = 'user_' || id WHERE nickname IS NULL"

    # Now make the column not null
    alter table(:users) do
      modify :nickname, :string, null: false
    end

    create unique_index(:users, [:nickname])
  end
end
