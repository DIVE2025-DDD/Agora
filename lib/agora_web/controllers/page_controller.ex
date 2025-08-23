defmodule AgoraWeb.PageController do
  use AgoraWeb, :controller

  def home(conn, _params) do
    conn
    |> assign(:page_title, "데이터 분석")
    |> render_inertia("HomePage")
  end
end
