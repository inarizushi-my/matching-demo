import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function RegisterHistoryPage() {
  const [entries, setEntries] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const fetchEntries = async (email) => {
    if (!email || email.trim() === "") {
      setError("メールアドレスを入力してください。");
      return;
    }

    setError("");
    setEntries([]);

    try {
      const { data: recruits, error: recruitError } = await supabase
        .from("recruits")
        .select("*")
        .eq("email", email.trim());

      const { data: performers, error: performerError } = await supabase
        .from("performers")
        .select("*")
        .eq("email", email.trim());

      if (recruitError || performerError) {
        console.error(recruitError || performerError);
        setError("データ取得に失敗しました。");
        return;
      }

      const combined = [
        ...recruits.map((r) => ({ ...r, type: "曲" })),
        ...performers.map((p) => ({ ...p, type: "演奏者" })),
      ];

      combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setEntries(combined);
      setHasSearched(true);
    } catch (e) {
      console.error(e);
      setError("予期しないエラーが発生しました。");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchEntries(searchEmail);
  };

  return (
    <div className="relative max-w-2xl mx-auto p-4">
      {/* ホームに戻るボタン */}
      <div className="absolute top-4 left-4">
        <Link to="/">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            ホームに戻る
          </button>
        </Link>
      </div>

      {/* 一段下げたタイトル */}
      <div className="mt-16 mb-4 text-center">
        <h1 className="text-xl font-bold">登録履歴</h1>
      </div>

      {/* 検索フォーム（横並び） */}
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="email"
          placeholder="メールアドレスを入力"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap"
        >
          検索
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {hasSearched && entries.length === 0 && !error && (
        <p className="text-gray-500">登録履歴が見つかりません。</p>
      )}

      {/* 登録内容一覧 */}
      {entries.map((entry) => (
        <div key={entry.id} className="border p-4 mb-4 rounded shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">
                {entry.type}：{entry.type === "曲" ? entry.title : entry.name}
              </p>
              <p className="text-sm text-gray-500">{entry.event}</p>
              <p className="text-xs text-gray-400">
                最終更新日：{new Date(entry.created_at).toLocaleString()}
              </p>
            </div>
            <Link to={`/edit/${entry.type}/${entry.id}`}>
              <button className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">
                編集
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RegisterHistoryPage;
