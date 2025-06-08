import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function PerformerDetail() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformer = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("performers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("データ取得エラー:", error);
        setPerson(null);
      } else {
        setPerson(data);
      }
      setLoading(false);
    };

    fetchPerformer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-xl text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-xl text-red-500">該当する演奏者が見つかりませんでした。</p>
      </div>
    );
  }

  const genreText =
    Array.isArray(person.genres) && person.genres.length > 0
      ? person.genres.join("、")
      : "未記入";

  const artistText =
    Array.isArray(person.artists) && person.artists.length > 0
      ? person.artists.join("、")
      : "未記入";

  const noteText = person.note?.trim() ? person.note : "未記入";

  return (
    <div className="min-h-screen p-6 pt-6 max-w-3xl mx-auto">
      {/* 戻るボタン */}
      <div className="mb-6">
        <Link to="/performer">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            ← 演奏者一覧に戻る
          </button>
        </Link>
      </div>

      {/* タイトル */}
      <h1 className="text-2xl font-bold mb-4 text-center">{person.name}</h1>

      {/* 詳細情報の表示 */}
      <div className="bg-white shadow-md rounded p-4 space-y-4">
        <InfoRow label="イベント" value={person.event} />
        <InfoRow label="代" value={`${person.generation}代`} />
        <InfoRow label="空き曲数" value={`${person.available ?? 0}曲`} />
        <InfoRow label="ジャンル" value={genreText} />
        <InfoRow label="アーティスト" value={artistText} />
        <InfoRow label="コメント" value={noteText} />
      </div>
    </div>
  );
}

// 共通の1行表示コンポーネント
function InfoRow({ label, value }) {
  return (
    <div className="flex">
      <h2 className="font-semibold text-gray-700 w-32 shrink-0">{label}</h2>
      <p className="text-gray-800 whitespace-pre-wrap">{value}</p>
    </div>
  );
}

export default PerformerDetail;
