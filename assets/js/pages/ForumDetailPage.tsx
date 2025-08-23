import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import { PhoenixSocketContext } from "../lib/phoenixSocketContext";

interface User {
  id: number;
  email: string;
}

interface Chat {
  id: number;
  message: string;
  sequence: number;
  inserted_at: string;
  user: User;
}

interface Conversation {
  id: number;
  chats: Chat[];
}

interface Forum {
  id: number;
  title: string;
  author: string;
  content: string;
  view_count: number;
  inserted_at: string;
  updated_at: string;
  conversation: Conversation | null;
}

interface ForumDetailPageProps {
  forum: Forum | null;
  user?: {
    id: number;
    email: string;
  };
}

const ForumDetailPage = ({ forum }: ForumDetailPageProps) => {
  const { props } = usePage();
  const user = props.user;
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [channel, setChannel] = useState<any>(null);
  const socket = useContext(PhoenixSocketContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forum?.conversation?.chats) {
      setChats(forum.conversation.chats);
    }
  }, [forum]);

  useEffect(() => {
    if (!socket || !forum) return;

    // Join the forum-specific channel
    const channelTopic = `room:forum:${forum.id}`;
    const newChannel = socket.channel(channelTopic, {});

    newChannel
      .join()
      .receive("ok", (resp) => {
        console.log("Joined successfully", resp);
        setChannel(newChannel);
      })
      .receive("error", (resp) => {
        console.log("Unable to join", resp);
      });

    // Listen for new messages
    newChannel.on("new_message", (payload) => {
      console.log("New message received:", payload);
      setChats((prevChats) => [...prevChats, payload.chat]);
    });

    return () => {
      newChannel.leave();
      setChannel(null);
    };
  }, [socket, forum]);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !channel || !user) return;

    const messageToSend = message.trim();
    setMessage(""); // 즉시 입력창 초기화

    channel
      .push("new_message", {
        message: messageToSend,
        user_id: user.id,
      })
      .receive("ok", (response) => {
        console.log("Message sent successfully", response);
        scrollToBottom();
      })
      .receive("error", (response) => {
        console.log("Error sending message", response);
        setMessage(messageToSend); // 실패시 메시지 복원
      });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!forum) {
    return <div>포럼을 찾을 수 없습니다.</div>;
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back button and title */}
        <div className="flex items-center mb-6">
          <Link href="/" className="mr-4 text-gray-600 hover:text-gray-900">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{forum.title}</h1>
        </div>

        {/* Subject content header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">주제 본문</h2>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 text-sm hover:underline flex items-center"
            >
              {isExpanded ? "접기" : "펼치기"}
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Subject content body */}
          <div
            className={`mt-4 bg-white rounded-lg border border-gray-200 shadow-sm p-4 ${isExpanded ? "block" : "hidden"}`}
          >
            <div className="text-sm text-gray-700 leading-relaxed space-y-3">
              <p>{forum.content}</p>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
                <div className="space-y-1">
                  <div>담당자: {forum.author}</div>
                  <div>작성일: {formatDate(forum.inserted_at)}</div>
                </div>
                <div className="space-y-1 text-right">
                  <div>댓글수: {chats.length}</div>
                  <div>조회수: {forum.view_count}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Chat (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <div
              className="bg-white rounded-lg border border-gray-200 shadow overflow-hidden flex flex-col"
              style={{ height: "500px" }}
            >
              {/* Chat header */}
              <div className="bg-blue-500 text-white px-4 py-3">
                <h4 className="font-semibold">Chat</h4>
              </div>

              {/* Chat messages */}
              <div
                ref={chatContainerRef}
                className="p-4 space-y-4 flex-1 overflow-y-auto max-h-96"
              >
                {chats.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">
                    아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
                  </div>
                ) : (
                  chats
                    .sort((a, b) => a.sequence - b.sequence)
                    .map((chat) => (
                      <div key={chat.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-medium text-gray-600">
                              {chat.user.email}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatDate(chat.inserted_at)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {chat.message}
                          </p>
                        </div>
                      </div>
                    ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat input */}
              <div className="p-4 border-t">
                {user ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="주제에 대한 의견을 남겨 주세요!"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!channel}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || !channel}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex-shrink-0"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    로그인 후 댓글을 작성할 수 있습니다.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - AI 근거 히스토리 (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow overflow-hidden h-full flex flex-col">
              <div className="bg-blue-500 text-white px-4 py-3">
                <h3 className="font-semibold">AI 근거 히스토리</h3>
              </div>

              <div className="p-6 space-y-6 flex-1 flex flex-col">
                {/* Pie chart with text */}
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg
                      className="w-32 h-32 transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray="65, 100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-semibold">2025</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    어쩌구 저쩌구 토론 관련해서 적혀있는 내용 어쩌구 저쩌구 토론
                    관련해서 적혀있는 내용어쩌구 저쩌구 토론 관련해서 적혀있는
                    내용어쩌구 저쩌구 토론 관련해서 적혀있는 내용어쩌구 저쩌구
                    토론 관련해서 적혀있는 내용 어쩌구 저쩌구 토론 관련해서
                    적혀있는 내용어쩌구 저쩌구 토론 관련해서 적혀있는 내용어쩌구
                    저쩌구
                  </p>
                </div>

                <div className="flex justify-between text-sm">
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-xs">
                    이번 근거
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-xs">
                    다음 근거
                  </button>
                </div>

                <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-md text-sm hover:bg-blue-600 mt-auto">
                  데이터 출처에서 내 주장 근거 찾기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Bottom section with detailed analysis */}
        <div className="mt-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              AI
            </div>
            <h2 className="text-xl font-semibold text-gray-900">토론 현황</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 우세한 의견의 주요 주장 section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-t-lg">
                <h3 className="font-semibold">우세한 의견</h3>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  어쩌구 저쩌구 토론 관련해서 적혀있는 내용 어쩌구 저쩌구 토론
                  관련해서 적혀있는 내용어쩌구 저쩌구 토론 관련해서 적혀있는
                  내용어쩌구 저쩌구 토론 관련해서 적혀있는 내용어쩌구 저쩌구
                  토론 관련해서 적혀있는 내용어쩌구 저쩌구 토론 관련해서
                  적혀있는 내용어쩌구 저쩌구 토론 관련해서 적혀있는 내용어쩌구
                  저쩌구 토론 관련해서 적혀있는 내용어쩌구 저쩌구 토론 관련해서
                  적혀있는 내용어쩌구 저쩌구 토론 관련해서 적혀있는
                </p>
                <button className="text-blue-600 text-sm hover:underline">
                  근거 찾기
                </button>
              </div>
            </div>

            {/* 반대 의견의 주요 주장 section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow">
              <div className="bg-gray-500 text-white px-4 py-2 rounded-t-lg">
                <h3 className="font-semibold">반대 의견</h3>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  어쩌구 저쩌구 토론 관련해서 적혀있는 내용 어쩌구 저쩌구 토론
                  관련해서 적혀있는 내용어쩌구 저쩌구 토론 관련해서 적혀있는
                  내용어쩌구 저쩌구 토론 관련해서 적혀있는 내용어쩌구 저쩌구
                  토론 관련해서 적혀있는 내용어쩌구 저쩌구 토론 관련해서
                  적혀있는
                </p>
                <button className="text-blue-600 text-sm hover:underline">
                  근거 찾기
                </button>
              </div>
            </div>
          </div>

          {/* 뜻밖의 근거와 반박 근거 section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* 뜻밖의 근거 section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    AI
                  </div>
                  <h3 className="font-semibold text-gray-900">뜻밖의 근거</h3>
                </div>
              </div>

              <div className="p-4">
                <div className="text-center space-y-3">
                  <div className="relative w-20 h-20 mx-auto">
                    <svg
                      className="w-20 h-20 transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray="75, 100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-semibold">2025</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-tight">
                    어쩌구 저쩌구 토론 관련해서 적혀있는 내용 어쩌구 저쩌구 토론
                    관련해서 적혀있는 내용어쩌구 저쩌구 토론 관련해서 적혀있는
                    내용어쩌구 저쩌구 토론 관련해서 적혀있는 내용어쩌구 저쩌구
                    토론 관련해서 적혀있는 내용어쩌구 저
                  </p>
                </div>
              </div>
            </div>

            {/* 반박 근거 section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    AI
                  </div>
                  <h3 className="font-semibold text-gray-900">반박 근거</h3>
                </div>
              </div>

              <div className="p-4">
                <div className="text-center space-y-3">
                  <div className="relative w-20 h-20 mx-auto">
                    <svg
                      className="w-20 h-20 transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray="60, 100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-semibold">2025</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-tight">
                    어쩌구 저쩌구 토론 관련해서 적혀있는 내용 어쩌구 저쩌구 토론
                    관련해서 적혀있는 내용어쩌구 저쩌구 토론 관련해서 적혀있는
                    내용어쩌구 저쩌구 토론 관련해서 적혀있는 내용어쩌구 저쩌구
                    토론 관련해서 적혀있는 내용어쩌구
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumDetailPage;
