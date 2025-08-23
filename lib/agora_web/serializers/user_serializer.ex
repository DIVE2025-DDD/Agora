defmodule AgoraWeb.UserSerializer do
  def to_map(user = %Agora.Accounts.User{}) do
    %{
      id: user.id,
      email: user.email
    }
  end

  def to_map(nil), do: nil

  def assign_prop(conn, name, user) do
    Inertia.Controller.assign_prop(conn, name, fn -> user && to_map(user) end)
  end
end
