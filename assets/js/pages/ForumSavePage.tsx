import { ChevronDown } from "lucide-react";
import Button from "@/components/Button";
import RichEditor from "@/components/RichEditor";
import { useState } from "react";
import { usePage } from "@inertiajs/react";

type CurrentUser = {
  id: number;
  name?: string;
  email?: string;
};

const ForumSavePage = () => {
  const { props } = usePage();
  const user = props.user;

  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState<string>("");
  const [content, setContent] = useState("");

  const csrf =
    (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
      ?.content || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/forum/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrf,
      },
      // author는 서버에서 로그인 사용자로 채움
      body: JSON.stringify({ title, deadline, content }),
    });

    if (res.ok) {
      window.location.href = "/";
    } else {
      alert("등록에 실패했습니다.");
    }
  };


  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <form onSubmit={handleSubmit}>
        <div className="pb-6">
          <h1 className="ag-title-30-m">토론 주제 등록하기</h1>
        </div>

        <div className="space-y-6">
          {/* Category (데모) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리
            </label>
            <div className="relative">
              <select className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
                <option>카테고리를 선택하세요</option>
                <option>정책</option>
                <option>기타</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="토론 주제를 입력하세요"
              required
            />
          </div>


          {/* 마감일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              토론 마감일
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              내용
            </label>
            <div className="border border-ag-gray-200 rounded-md overflow-hidden">
              <RichEditor
                value={content}
                onChange={setContent}
                placeholder="토론 내용을 입력하세요…"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => (window.location.href = "/")}
            >
              취소
            </Button>
            <Button type="submit" variant="primary">
              등록
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default ForumSavePage;
