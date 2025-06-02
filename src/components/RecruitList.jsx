import { Link } from "react-router-dom";
import data from "../data/sample_recruit.json";

function RecruitList() {
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

      <h2 className="text-2xl font-bold mb-6 text-center">🎵 募集一覧</h2>

      {/* スロット形式（スマホ2段・PC1段） */}
      <div className="flex flex-col gap-4 mb-16">
        {data.map((item) => (
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
              {/* イベント名（左） */}
              <span className="text-gray-700">{item.event}</span>

              {/* 募集状況＋ボタン（右） */}
              <div className="flex items-center gap-4">
                <span className="text-gray-600">{item.status}</span>
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
