import React, { useState, useEffect, useRef } from "react";

const TODO_KEY = "dailyTodos";
const POSITION_KEY = "todoPosition";
const SNAP_MARGIN = 50;

export default function FloatingTodo() {
  const panelRef = useRef(null);
  const dragRef = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [showWins, setShowWins] = useState(true);
  const [position, setPosition] = useState({ top: 100, left: 100 });

  // Load todos and position
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(TODO_KEY) || "{}");
    const today = new Date().toDateString();
    if (stored.date !== today) {
      setTodos([]);
      localStorage.setItem(
        TODO_KEY,
        JSON.stringify({ date: today, todos: [] })
      );
    } else {
      setTodos(stored.todos || []);
    }

    const pos = JSON.parse(localStorage.getItem(POSITION_KEY) || "{}");
    if (pos.top != null && pos.left != null) setPosition(pos);
  }, []);

  // Save todos
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(TODO_KEY, JSON.stringify({ date: today, todos }));
  }, [todos]);

  // Save position
  useEffect(() => {
    localStorage.setItem(POSITION_KEY, JSON.stringify(position));
  }, [position]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([...todos, { text: input, done: false }]);
    setInput("");
  };

  const toggleDone = (index) => {
    setTodos((prev) =>
      prev.map((t, i) => (i === index ? { ...t, done: !t.done } : t))
    );
  };

  // Dragging
  const handleMouseDown = (e) => {
    dragRef.current = true;
    offset.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!dragRef.current) return;

    const newLeft = e.clientX - offset.current.x;
    const newTop = e.clientY - offset.current.y;

    setPosition({
      left: newLeft,
      top: newTop,
    });
  };

  const handleMouseUp = () => {
    dragRef.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);

    const panel = panelRef.current;
    if (!panel) return;
    const { innerWidth } = window;
    const width = panel.offsetWidth;

    let { top, left } = position;

    // Snap horizontally
    const distLeft = left;
    const distRight = innerWidth - (left + width);
    left = distLeft < distRight ? 0 : innerWidth - width;

    // Collapse after snapping
    setPosition({ top, left });
    setExpanded(false);
  };

  const activeTasks = todos.filter((t) => !t.done);
  const doneTasks = todos.filter((t) => t.done);

  // Collapsed icon
  if (!expanded) {
    return (
      <div
        onMouseDown={handleMouseDown} // for dragging
        onClick={() => setExpanded(true)} // expand when clicked
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          zIndex: 50,
        }}
        className="bg-yellow-300 p-2 rounded-full shadow-lg cursor-pointer"
      >
        📋
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      style={{ top: position.top, left: position.left }}
      className="absolute z-50 w-72 bg-yellow-100 rounded-xl shadow-lg select-none cursor-default"
    >
      {/* Header */}
      <div
        className="flex justify-between items-center p-3 bg-yellow-200 rounded-t-xl cursor-move"
        onMouseDown={handleMouseDown}
      >
        <h3
          className="font-bold text-yellow-900"
          onClick={() => setShowWins((s) => !s)}
        >
          Daily Todos
        </h3>
        <button
          className="text-yellow-900 font-bold"
          onClick={() => setExpanded(false)}
        >
          ✕
        </button>
      </div>

      {/* Input */}
      <form onSubmit={handleAdd} className="flex gap-2 p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a todo..."
          className="flex-1 px-2 py-1 rounded border border-yellow-300 focus:outline-yellow-400"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-yellow-300 rounded hover:bg-yellow-400 font-semibold"
        >
          +
        </button>
      </form>

      {/* Active Tasks */}
      <ul className="flex flex-col gap-1 px-3 pb-2 max-h-64 overflow-y-auto">
        {activeTasks.map((t, i) => (
          <li
            key={i}
            onClick={() => toggleDone(todos.indexOf(t))}
            className="cursor-pointer px-2 py-1 rounded hover:bg-yellow-200 transition-all"
          >
            {t.text}
          </li>
        ))}
      </ul>

      {/* Done Tasks / Today's Wins */}
      {showWins && doneTasks.length > 0 && (
        <div className="px-3 pb-2 border-t border-yellow-300 mt-2">
          <h4 className="font-semibold text-yellow-900 mb-1">
            Today's Wins 🎉
          </h4>
          <ul className="flex flex-col gap-1 max-h-40 overflow-y-auto">
            {doneTasks.map((t, i) => (
              <li
                key={i}
                onClick={() => toggleDone(todos.indexOf(t))}
                className="cursor-pointer px-2 py-1 rounded bg-yellow-200 text-gray-600 line-through hover:bg-yellow-300 transition-all"
              >
                {t.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
