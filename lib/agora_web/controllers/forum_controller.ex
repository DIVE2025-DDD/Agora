defmodule AgoraWeb.ForumController do
  use AgoraWeb, :controller

  def index(conn, %{"id" => id} = _params) do
    conn
    |> assign(:page_title, "포럼 페이지 상세")
    |> render_inertia("ForumDetailPage")
  end
end
