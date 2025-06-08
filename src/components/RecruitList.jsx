import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { eventYearMap } from "../data/eventYears";
import { supabase } from "../lib/supabaseClient";

function RecruitList() {
  const [filter, setFilter] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormId, setShowFormId] = useState(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const fullEventList = Object.entries(eventYearMap).map(
    ([name, year]) => `${name}${year}`
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("recruits").select("*");
      if (error) {
        console.error("Supabase取得エラー:", error);
      } else {
        setData(data);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleApply = async (recruitId, title) => {
    if (!email.trim()) {
      alert("メールアドレスは必須です。\n送信前に入力してください。");
      return;
    }

    // 🔍 performers に登録されているか確認
    const { data: performerCheck, error: performerError } = await supabase
      .from("performers")
      .select("*")
      .eq("email", email.trim());

    if (performerError) {
      alert("演奏者確認中にエラーが発生しました。");
      return;
    }

    if (!performerCheck || performerCheck.length === 0) {
      alert("このメールアドレスは演奏者として登録されていません。");
      return;
    }

    const { data: existing, error: checkError } = await supabase
      .from("applications")
      .select("*")
      .eq("recruit_id", recruitId)
      .eq("performer_email", email.trim());

    if (checkError) {
      alert("確認中にエラーが発生しました。");
      return;
    }

    if (existing.length > 0) {
      alert("すでに立候補しています。");
      return;
    }

    const { error } = await supabase.from("applications").insert([
      {
        recruit_id: recruitId,
        performer_email: email.trim(),
        message: message.trim(),
      },
    ]);

    if (error) {
      alert("送信に失敗しました。もう一度お試しください。");
    } else {
      alert(`${title} に立候補を送信しました！`);
      setShowFormId(null);
      setEmail("");
      setMessage("");
    }
  };

  const filteredData = filter
    ? data.filter((item) => item.event === filter)
    : data;

  return (
    <div className="relative min-h-screen p-6 pt-16 max-w-3xl mx-auto">
      <div className="absolute top-4 left-4">
        <Link to="/">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            ホームに戻る
          </button>
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center">曲の募集一覧</h2>

      <div className="mb-6 text-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">全てのイベント</option>
          {fullEventList.map((event) => (
            <option key={event} value={event}>
              {event}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">読み込み中...</p>
      ) : (
        <div className="flex flex-col gap-4 mb-16">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="border rounded shadow p-4 bg-white flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <Link
                to={`/recruit/${item.id}`}
                className="text-blue-600 underline text-lg font-semibold mb-2 md:mb-0 md:w-1/3"
              >
                {item.title}
              </Link>

              <div className="flex justify-between items-center w-full text-sm md:gap-6 md:w-auto">
                <span className="text-gray-700">{item.event}</span>
                <div className="flex items-center gap-4 ml-auto">
                  <span className="text-gray-600">
                    募集人数：{item.capacity}人
                  </span>
                  <button
                    onClick={() =>
                      setShowFormId(showFormId === item.id ? null : item.id)
                    }
                    className="w-fit bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    立候補
                  </button>
                </div>
              </div>

              {showFormId === item.id && (
                <div className="mt-3 space-y-2">
                  <input
                    type="email"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                  />
                  <input
                    type="text"
                    placeholder="メッセージ（30字以内）"
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value.slice(0, 30))
                    }
                    className="border p-2 rounded w-full"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApply(item.id, item.title)}
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                    >
                      送信
                    </button>
                    <button
                      onClick={() => setShowFormId(null)}
                      className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-center mb-4">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition"
        >
          ↑ ページトップへ戻る
        </button>
      </div>
    </div>
  );
}

export default RecruitList;
