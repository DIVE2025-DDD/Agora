defmodule AgoraWeb.ForumController do
  use AgoraWeb, :controller

  alias Agora.Forums
  alias AgoraWeb.Serializers.ForumSerializer

  require Logger

  def index(conn, %{"id" => id}) do
    forum = Forums.get_forum_with_comments(id)

    conn
    |> assign(:page_title, "포럼 페이지 상세")
    |> ForumSerializer.assign_prop(:forum, forum)
    |> render_inertia("ForumDetailPage")
  end

  # 작성 화면: 현재 로그인 사용자 정보를 페이지로 전달
  def save(conn, _params) do
    conn
    |> assign(:page_title, "포럼 페이지 저장")
    |> render_inertia("ForumSavePage")
  end

  # POST /forum/save
  def save_post(conn, %{"title" => title, "content" => content} = params) do
    author =
      case conn.assigns[:current_user] do
        %{name: name} when is_binary(name) and name != "" -> name
        %{email: email} when is_binary(email) and email != "" -> email
        _ -> "익명"
      end

    attrs = %{
      "title" => title,
      "author" => author,
      "content" => content,
      "deadline" => parse_date(params["deadline"])
    }

    Logger.info("Creating forum with attrs: #{inspect(attrs)}")

    # 먼저 기본 방법 시도, 실패하면 안전한 방법 시도
    case Forums.create_forum_with_conversation(attrs) do
      {:ok, _forum} ->
        Logger.info("Forum created successfully")

        conn
        |> put_flash(:info, "등록되었습니다.")
        |> redirect(to: ~p"/")

      {:error, changeset} ->
        Logger.error("Forum creation failed with changeset method: #{inspect(changeset.errors)}")

        # 안전한 방법으로 재시도
        case Forums.create_forum_with_conversation_safe(attrs) do
          {:ok, _forum} ->
            Logger.info("Forum created successfully with safe method")

            conn
            |> put_flash(:info, "등록되었습니다.")
            |> redirect(to: ~p"/")

          {:error, safe_changeset} ->
            Logger.error("Forum creation failed with safe method: #{inspect(safe_changeset)}")

            conn
            |> put_flash(:error, "등록에 실패했습니다.")
            |> assign(:errors, changeset)
            |> render_inertia("ForumSavePage")
        end
    end
  end

  defp parse_date(nil), do: nil
  defp parse_date(""), do: nil

  defp parse_date(str) do
    case Date.from_iso8601(str) do
      {:ok, d} -> d
      _ -> nil
    end
  end
end
