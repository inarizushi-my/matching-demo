import { useState, useEffect, useRef } from "react";
import Notice from "./Notice";
import { Link } from "react-router-dom";

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveTab(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (tab) => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        className="p-2 text-gray-700 text-2xl"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="メニューを開く"
      >
        ☰
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-md">
          {/* 登録履歴（リンク） */}
          <Link to="/history">
            <div className="w-full text-left px-4 py-2 hover:bg-gray-100">
              登録履歴
            </div>
          </Link>

          {/* お知らせ */}
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => handleToggle("notice")}
          >
            お知らせ
          </button>

          {/* バージョン情報 */}
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => handleToggle("version")}
          >
            バージョン情報
          </button>

          {/* 表示内容 */}
          {activeTab === "notice" && (
            <div className="px-4 py-3 text-sm text-gray-800 border-t">
              <Notice />
            </div>
          )}
          {activeTab === "version" && (
            <div className="px-4 py-3 text-sm text-gray-800 border-t">
              <ul className="list-disc list-inside space-y-1">
                <li>v1.0.0 - 2025/06/09</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HamburgerMenu;
