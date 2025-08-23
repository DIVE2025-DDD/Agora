import React from "react";
import { MessageCircle, Eye, ChevronDown } from "lucide-react";
import { usePage } from "@inertiajs/react";
import Button from "@/components/Button";

type Forum = {
  id: number;
  title: string;
  author: string;
  content: string;
  view_count: number;
  deadline: string | null;
  chat_count: number;
  inserted_at: string;
};

const HomePage = () => {
  const { props } = usePage<{ forums: Forum[] }>();
  console.log("props: ", props);
  const discussions = props.forums || [];

  return (
    <div className="min-h-screen bg-ag-gray-100 text-ag-gray-900">
      <main className="max-w-7xl mx-auto">
        <div className="rounded-lg shadow-sm">
          <div className="px-6 py-6">
            <h1 className="ag-title-20-m">토론하기</h1>
          </div>
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
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                검색 결과 {discussions.length}건
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 text-sm text-gray-600 cursor-pointer">
                  <span>최신순</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <Button as="a" href="/forum/save" variant="primary" size="sm">
                  주제 등록하기
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {discussions.map((d) => (
              <a
                key={d.id}
                href={`/forum/${d.id}/detail`}
                className="px-6 py-4 bg-ag-gray-50 hover:bg-gray-50 cursor-pointer rounded-ag block"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="ag-body-16-b text-ag-gray-900 mb-2 truncate">
                      {d.title}
                    </h3>
                    <div className="ag-body-12-r text-ag-gray-600">
                      작성자: {d.author}
                      {d.deadline && <> · 마감일: {d.deadline}</>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 ml-4">
                    <div className="flex items-center space-x-1 ag-body-12-r text-ag-gray-600">
                      <MessageCircle className="w-4 h-4" />
                      <span>{d.chat_count ?? 0}</span>
                    </div>
                    <div className="flex items-center space-x-1 ag-body-12-r text-ag-gray-600">
                      <Eye className="w-4 h-4" />
                      <span>{d.view_count ?? 0}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
            {discussions.length === 0 && (
              <div className="px-6 py-12 text-center text-ag-gray-600">
                등록된 주제가 없습니다.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
