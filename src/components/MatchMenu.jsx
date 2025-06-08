import { Link } from "react-router-dom";

function MatchMenu() {
  return (
    <div className="relative min-h-screen p-6 pt-16 max-w-3xl mx-auto flex flex-col items-center justify-center space-y-10">
      {/* ホームに戻るボタン */}
      <div className="absolute top-4 left-4">
        <Link to="/">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            ホームに戻る
          </button>
        </Link>
      </div>

      {/* タイトル */}
      <h2 className="text-3xl font-bold mb-6">マッチングメニュー</h2>

      {/* ボタン */}
      <Link to="/matching/recruit" className="w-full max-w-xs">
        <button className="w-full bg-blue-600 text-white text-xl px-8 py-4 rounded-2xl shadow hover:bg-blue-700 transition">
          曲のマッチング
        </button>
      </Link>

      <Link to="/matching/performer" className="w-full max-w-xs">
        <button className="w-full bg-green-600 text-white text-xl px-8 py-4 rounded-2xl shadow hover:bg-green-700 transition">
          人のマッチング
        </button>
      </Link>
    </div>
  );
}

export default MatchMenu;
