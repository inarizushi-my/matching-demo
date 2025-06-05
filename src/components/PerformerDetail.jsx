import { useParams, Link } from "react-router-dom";
import data from "../data/sample_performers.json";

function PerformerDetail() {
  const { id } = useParams();
  const person = data.find((p) => p.id.toString() === id);

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-xl text-red-500">該当する演奏者が見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pt-6 max-w-md mx-auto">
      {/* 戻るボタン */}
      <div className="mb-4">
        <Link to="/performer">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            ← 演奏者一覧に戻る
          </button>
        </Link>
      </div>

      {/* タイトル */}
      <h1 className="text-2xl font-bold mb-4 text-center">{person.name}</h1>

      {/* プロフィール項目（1段・左揃え） */}
      <div className="bg-white shadow-md rounded p-4 space-y-3">
        <div className="flex">
          <span className="font-semibold text-gray-700 w-24">代</span>
          <span className="text-gray-800">{person.generation}代</span>
        </div>
        <div className="flex">
          <span className="font-semibold text-gray-700 w-24">イベント</span>
          <span className="text-gray-800">{person.event}</span>
        </div>
        <div className="flex">
          <span className="font-semibold text-gray-700 w-24">空き曲数</span>
          <span className="text-gray-800">{person.slots ?? 0}曲</span>
        </div>
        {person.comment && (
          <div className="flex">
            <span className="font-semibold text-gray-700 w-24">自己紹介</span>
            <span className="text-gray-800 break-words">{person.comment}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PerformerDetail;
