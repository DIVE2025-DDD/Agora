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

  # POST /api/forum/:forum_id/generate_evidence
  def generate_evidence(conn, %{"forum_id" => forum_id, "ids" => ids} = _params) do
    Logger.info("Generating evidence for forum #{forum_id} with chat ids: #{inspect(ids)}")
    
    # 샘플 응답 데이터
    sample_messages = [
      "선택하신 의견들을 분석한 결과, 지속가능성 측면에서 긍정적인 효과가 예상됩니다. 특히 환경적 영향을 고려할 때 2025년까지 약 15%의 개선 효과를 기대할 수 있습니다.",
      "제시된 논점들을 종합해보면, 경제적 타당성과 환경적 지속가능성 사이의 균형이 중요합니다. 데이터에 따르면 장기적으로 투자 대비 효과가 높을 것으로 예측됩니다.",
      "분석 결과, 선택하신 의견들은 SDG 목표 달성에 직접적으로 기여할 수 있는 방향성을 제시하고 있습니다. 구체적인 실행 계획이 필요한 상황입니다."
    ]
    
    # 랜덤하게 차트 또는 메시지 타입 결정
    is_chart = Enum.random([true, false])
    
    response = if is_chart do
      %{
        type: "chart",
        message: "CHART_DATA"
      }
    else
      %{
        type: "message", 
        message: Enum.random(sample_messages)
      }
    end
    
    json(conn, %{
      success: true,
      data: response
    })
  end
end
