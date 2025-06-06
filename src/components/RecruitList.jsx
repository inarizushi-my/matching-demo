import { useState } from "react";
import { Link } from "react-router-dom";
import data from "../data/sample_recruit.json";
import { eventYearMap } from "../data/eventYears"; 

function RecruitList() {
  const [filter, setFilter] = useState("");

  const fullEventList = Object.entries(eventYearMap).map(
    ([name, year]) => `${name}${year}`
  );

  const filteredData = filter
    ? data.filter((item) => item.event === filter)
    : data;

  return (
    <div className="relative min-h-screen p-6 pt-16 max-w-3xl mx-auto">
      {/* 左上のホームボタン */}
      <div className="absolute top-4 left-4">
        <Link to="/">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            ホームに戻る
          </button>
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center">曲の募集一覧</h2>

      {/* フィルター選択 */}
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

      {/* スロット形式（スマホ2段・PC1段） */}
      <div className="flex flex-col gap-4 mb-16">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="border rounded shadow p-4 bg-white flex flex-col md:flex-row md:items-center md:justify-between"
          >
            {/* 曲名（共通） */}
            <Link
              to={`/recruit/${item.id}`}
              className="text-blue-600 underline text-lg font-semibold mb-2 md:mb-0 md:w-1/3"
            >
              {item.title}
            </Link>

            {/* イベント名 左 / 状況＋立候補ボタン 右 */}
            <div className="flex justify-between items-center w-full text-sm md:gap-6 md:w-auto">
              <span className="text-gray-700">{item.event}</span>
              <div className="flex items-center gap-4">
              <span className="text-gray-600">募集人数：{item.recruitCount}人</span>
                <button
                  onClick={() => alert(`${item.title} に立候補しました！（仮）`)}
                  className="w-fit bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  立候補
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ページトップへ戻る */}
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
