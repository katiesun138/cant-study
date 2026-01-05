import Avatar from "./Avatar";

export default function Player({ position, direction, isMoving, avatarStyle }) {
  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        pointerEvents: "none",
      }}
    >
      <Avatar
        direction={direction}
        isMoving={isMoving}
        size={100}
        style={avatarStyle}
      />
    </div>
  );
}
