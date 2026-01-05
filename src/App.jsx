import { useState } from "react";
import GameWorld from "./components/GameWorld";
import Cafe from "./components/Cafe";
import StudyRoom from "./components/StudyRoom";
import TodoList from "./components/TodoList";

export default function App() {
  const [room, setRoom] = useState("town");
  const [todos, setTodos] = useState([]);

  return (
    <>
      <TodoList todos={todos} setTodos={setTodos} />
      {room === "town" && <GameWorld setRoom={setRoom} />}
      {room === "cafe" && <Cafe setRoom={setRoom} />}
      {room === "study" && <StudyRoom setRoom={setRoom} />}
    </>
  );
}
