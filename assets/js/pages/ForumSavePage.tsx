import {
  ChevronDown,
  Bold,
  Italic,
  Underline,
  Link,
  ImageIcon,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import Button from "@/components/Button";
import RichEditor from "@/components/RichEditor";
import { useState } from "react";

const ForumSavePage = () => {
  const [content, setContent] = useState("");

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
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div>
        <div className="pb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            토론 주제 등록하기
          </h1>
        </div>

        <div className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리
            </label>
            <div className="relative">
              <select className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
                <option>카테고리를 선택하세요</option>
                <option>정책</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="토론 주제를 입력하세요"
            />
          </div>

          {/* Deadline Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              토론 마감일
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 내용 입력 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              내용
            </label>

            {/* 감싸는 div에 테두리/라운드를 주고 싶으면 여기서 Tailwind로 래핑 */}
            <div className="border border-ag-gray-200 rounded-md overflow-hidden">
              <RichEditor
                value={content}
                onChange={setContent}
                placeholder="토론 내용을 입력하세요…"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline">취소</Button>
            <Button variant="primary">등록</Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForumSavePage;
