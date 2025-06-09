import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import sampleRecruits from "../data/sample_recruits.json";  // サンプルデータ読み込み

function RecruitDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // サンプルデータからidに合致する募集を検索
    const found = sampleRecruits.find((r) => String(r.id) === String(id));
    setItem(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-xl text-gray-500">読み込み中...</p>
      </div>
    );
  }

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

      {/* 詳細情報の表示 */}
      <div className="bg-white shadow-md rounded p-4 space-y-4">
        <InfoRow label="イベント" value={item.event} />
        <InfoRow label="作曲者" value={item.composer || "未記入"} />
        <InfoRow label="アーティスト" value={item.artist || "未記入"} />
        <InfoRow label="アンサリーダー" value={`${item.leader}（${item.generation}代）`} />
        <InfoRow label="募集人数" value={`${item.capacity}人`} />
        <InfoRow label="ジャンル" value={item.genres && item.genres.length > 0 ? item.genres.join("、") : "未記入"} />
        {item.comment && <InfoRow label="コメント" value={item.comment} />}
      </div>
    </div>
  );
}

// 共通の1行表示コンポーネント
function InfoRow({ label, value }) {
  return (
    <div className="flex">
      <h2 className="font-semibold text-gray-700 w-32 shrink-0">{label}</h2>
      <p className="text-gray-800">{value}</p>
    </div>
  );
}

export default RecruitDetail;
