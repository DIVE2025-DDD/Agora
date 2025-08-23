defmodule AgoraWeb.ForumController do
  use AgoraWeb, :controller

  alias Agora.Forums
  alias AgoraWeb.Serializers.ForumSerializer

  def index(conn, %{"id" => id} = _params) do
    forum = Forums.get_forum_with_comments(id)

    conn
    |> assign(:page_title, "포럼 페이지 상세")
    |> ForumSerializer.assign_prop(:forum, forum)
    |> render_inertia("ForumDetailPage")
  end

  def save(conn, _params) do
    conn
    |> assign(:page_title, "포럼 페이지 저장")
    |> render_inertia("ForumSavePage")
  end
end
