import { useParams, Link } from "react-router-dom";
import data from "../data/sample_recruit.json";

function RecruitDetail() {
  const { id } = useParams();
  const item = data.find((entry) => entry.id.toString() === id);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-xl text-red-500">該当する曲が見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pt-6 max-w-3xl mx-auto">
      {/* 募集一覧に戻るボタン */}
      <div className="mb-6">
        <Link to="/recruit">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            ← 募集一覧に戻る
          </button>
        </Link>
      </div>

      {/* 曲タイトル */}
      <h1 className="text-2xl font-bold mb-4 text-center">{item.title}</h1>

      {/* 詳細情報の表示（横並びレイアウト） */}
      <div className="bg-white shadow-md rounded p-4 space-y-4">
        <div className="flex">
          <h2 className="font-semibold text-gray-700 w-32">イベント</h2>
          <p className="text-gray-800">{item.event}</p>
        </div>
        <div className="flex">
          <h2 className="font-semibold text-gray-700 w-32">募集状況</h2>
          <p className="text-gray-800">{item.status}</p>
        </div>
        {/* 必要に応じて以下に項目を追加可能 */}
        {/* 
        <div className="flex">
          <h2 className="font-semibold text-gray-700 w-32">ジャンル</h2>
          <p className="text-gray-800">{item.genre}</p>
        </div> 
        */}
      </div>
    </div>
  );
}

export default RecruitDetail;
