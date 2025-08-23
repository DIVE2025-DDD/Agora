import React, { useState } from "react";
import { Link } from "@inertiajs/react";

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
}

const ForumDetailPage = ({ forum }: ForumDetailPageProps) => {
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  if (!forum) {
    return <div>포럼을 찾을 수 없습니다.</div>;
  }

  const chats = forum.conversation?.chats || [];
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back button and title */}
        <div className="flex items-center mb-6">
          <Link
            href="/forum"
            className="mr-4 text-gray-600 hover:text-gray-900"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {forum.title}
          </h1>
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
            className={`mt-4 bg-white rounded-lg shadow-sm border p-4 ${isExpanded ? "block" : "hidden"}`}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Section - Chat */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Chat header */}
              <div className="bg-blue-500 text-white px-4 py-3">
                <h4 className="font-semibold">Chat</h4>
              </div>

              {/* Chat messages */}
              <div className="p-4 space-y-4 h-96 overflow-y-auto">
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
                          <p className="text-sm text-gray-700">{chat.message}</p>
                        </div>
                      </div>
                    ))
                )}
              </div>

              {/* Chat input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="주제에 대한 의견을 남겨 주세요!"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex-shrink-0">
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
              </div>
            </div>
          </div>

          {/* Right Section - AI 근거 히스토리 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-blue-500 text-white px-4 py-3">
                <h3 className="font-semibold">AI 근거 히스토리</h3>
              </div>

              <div className="p-6 space-y-6">
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
                  <span className="text-gray-500">이번 근거</span>
                  <span className="text-gray-500">다음 근거</span>
                </div>

                <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-md text-sm hover:bg-blue-600">
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
            <div className="bg-white rounded-lg shadow">
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
            <div className="bg-white rounded-lg shadow">
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
            <div className="bg-white rounded-lg shadow">
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
            <div className="bg-white rounded-lg shadow">
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
