defmodule AgoraWeb.Router do
  use AgoraWeb, :router

  import AgoraWeb.UserAuth

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {AgoraWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_current_user
    plug Inertia.Plug
  end

  pipeline :authenticated do
    plug AgoraWeb.AuthPlug, :user_required
  end

  pipeline :unauthenticated do
    plug AgoraWeb.AuthPlug, :no_user
  end

  pipeline :auth_optional do
    plug AgoraWeb.AuthPlug, :user_optional
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", AgoraWeb do
    pipe_through [:browser, :auth_optional]

    get "/", PageController, :home
    get "/forum/save", ForumController, :save
    get "/forum/:id/detail", ForumController, :index
  end

  scope "/", AgoraWeb do
    pipe_through [:browser, :unauthenticated]

    get "/register", RegisterController, :index
    post "/register", RegisterController, :register

    get "/login", LoginController, :index
    post "/login", LoginController, :login
  end

  scope "/", AgoraWeb do
    pipe_through [:browser, :authenticated]

    delete "/users/log_out", UserSessionController, :delete
  end

  # Other scopes may use custom stacks.
  # scope "/api", AgoraWeb do
  #   pipe_through :api
  # end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:agora, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: AgoraWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
