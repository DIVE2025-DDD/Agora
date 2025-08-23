import React from "react";
import { MessageCircle, Eye, ChevronDown } from "lucide-react";
import Button from "@/components/Button";

const HomePage = () => {
  const discussions = Array(7)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      title: "토론 주제 어쩌고 어쩌고 좋아합니다",
      author: "토론 마감일",
      timestamp: "24시간 전",
      deadline: "2025.07.31",
      comments: 151,
      views: 151,
    }));

  return (
    <div className="min-h-screen bg-ag-gray-100 text-ag-gray-900">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <div className="rounded-lg shadow-sm">
          {/* Page Title */}
          <div className="px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">토론하기</h1>
          </div>

          {/* Category Tabs */}
          <div className="px-6 py-4 border-b border-gray-400">
            <div className="flex space-x-6 pb-2">
              <Button
                variant="ghost"
                className="text-ag-gray-500 hover:text-ag-primary-50"
              >
                정책
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">검색 결과 21건</div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 text-sm text-gray-600 cursor-pointer">
                  <span>최신순</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <Button href="/forum/save" as="a" variant="primary" size="sm">
                  주제 등록하기
                </Button>
              </div>
            </div>
          </div>

          {/* Discussion List */}
          <div className="flex flex-col gap-2">
            {discussions.map((discussion) => (
              <div
                key={discussion.id}
                className="px-6 py-4 bg-ag-gray-50 hover:bg-gray-50 cursor-pointer rounded-ag"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-medium mb-2">
                      {discussion.title}
                    </h3>
                    <div className="text-sm text-gray-500">
                      {discussion.timestamp} · {discussion.author}:{" "}
                      {discussion.deadline}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 ml-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <MessageCircle className="w-4 h-4" />
                      <span>{discussion.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{discussion.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
