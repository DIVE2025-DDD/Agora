defmodule AgoraWeb.PageController do
  use AgoraWeb, :controller
  alias Agora.Forums
  alias AgoraWeb.Serializers.ForumSerializer

  def home(conn, _params) do
    forums = Forums.list_forums()

    conn
    |> assign(:page_title, "토론하기")
    |> ForumSerializer.assign_prop(:forums, forums)
    |> render_inertia("HomePage")
  end
end
