import { Link } from "react-router-dom";

function RegisterMenu() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-10 p-6">
      {/* タイトル */}
      <h2 className="text-3xl font-bold mb-6">新規登録メニュー</h2>

      {/* 登録ボタン：演奏者 */}
      <Link to="/entry/performer" className="w-full max-w-xs">
        <button className="w-full bg-blue-600 text-white text-xl px-8 py-4 rounded-2xl shadow hover:bg-blue-700 transition">
          演奏者を登録する
        </button>
      </Link>

      {/* 登録ボタン：曲の募集 */}
      <Link to="/entry/recruit" className="w-full max-w-xs">
        <button className="w-full bg-green-600 text-white text-xl px-8 py-4 rounded-2xl shadow hover:bg-green-700 transition">
          曲の募集を登録する
        </button>
      </Link>
    </div>
  );
}

export default RegisterMenu;
