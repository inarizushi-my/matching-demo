import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { eventYearMap } from "../data/eventYears";

function MatchMusic() {
  const [email, setEmail] = useState("");
  const [event, setEvent] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [matchedResults, setMatchedResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    setErrorMessage("");
    setMatchedResults([]);
    setSubmittedEmail("");

    if (!email.trim() || !event) {
      setErrorMessage("イベントとメールアドレスの両方を入力してください。");
      return;
    }

    // 自分の情報取得
    const { data: performer, error: performerError } = await supabase
      .from("performers")
      .select("*")
      .eq("email", email.trim())
      .eq("event", event)
      .single();

    if (performerError || !performer) {
      setErrorMessage("該当する演奏者情報が見つかりませんでした。");
      return;
    }

    // 募集と招待の取得
    const [{ data: recruits }, { data: invitations }] = await Promise.all([
      supabase.from("recruits").select("*").eq("event", event),
      supabase.from("invitations").select("*").eq("performer_id", performer.id),
    ]);

    const matched = [];

    for (const rec of recruits) {
      if (rec.email === performer.email) continue;

      const genreMatch =
        Array.isArray(rec.genres) && Array.isArray(performer.genres)
          ? rec.genres.some((g) => performer.genres.includes(g))
          : false;

      const artistMatch =
        rec.artist && Array.isArray(performer.artists)
          ? performer.artists.includes(rec.artist)
          : false;

      const invited = invitations.find((inv) => inv.recruit_id === rec.id);

      if (invited) {
        matched.push({
          title: rec.title,
          leader: rec.leader,
          generation: rec.generation,
          reason: "招待",
          message: invited.message,
        });
      } else if (genreMatch) {
        matched.push({
          title: rec.title,
          leader: rec.leader,
          generation: rec.generation,
          reason: "ジャンル一致",
          message: null,
        });
      } else if (artistMatch) {
        matched.push({
          title: rec.title,
          leader: rec.leader,
          generation: rec.generation,
          reason: "アーティスト一致",
          message: null,
        });
      }
    }

    setMatchedResults(matched);
    setSubmittedEmail(email.trim());
  };

  return (
    <div className="relative min-h-screen p-6 pt-16 max-w-3xl mx-auto">
      <div className="absolute top-4 left-4">
        <Link to="/matching">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            マッチングメニューに戻る
          </button>
        </Link>
      </div>

      <h2 className="text-2xl font-bold text-center mb-6">曲のマッチング</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="space-y-4 mb-4"
      >
        <div>
          <h3 className="text-lg font-semibold mb-1">① イベントを選んでください</h3>
          <select
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            required
          >
            <option value="">選択してください</option>
            {Object.entries(eventYearMap).map(([name, year]) => (
              <option key={name + year} value={name + year}>
                {name + year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-1">② メールアドレスを入力してください</h3>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border px-3 py-2 rounded w-full"
              placeholder="example@example.com"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              検索
            </button>
          </div>
        </div>
      </form>

      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">
          {errorMessage}
        </div>
      )}

      {submittedEmail && matchedResults.length === 0 && !errorMessage && (
        <p className="text-center text-gray-500 mt-8">
          一致する募集が見つかりませんでした。
        </p>
      )}

      {matchedResults.length > 0 && (
        <ul className="space-y-4">
          {matchedResults.map((rec, i) => (
            <li
              key={i}
              className="border rounded p-4 bg-white shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-1">{rec.title}</h3>
              <p className="text-gray-700 mb-1">
                アンサリーダー：{rec.leader}（{rec.generation}代）
              </p>
              <p className="text-sm text-gray-800">
                ヒット理由：{rec.reason}
              </p>
              {rec.reason === "招待" && rec.message && (
                <p className="text-sm text-gray-600 mt-1">メッセージ：{rec.message}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MatchMusic;
