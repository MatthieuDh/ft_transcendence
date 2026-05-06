import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

export function useOnlineUsers() {
  const [onlineUserIds, setOnlineUserIds] = useState<Set<number>>(new Set());
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("initial_online_users", (userIds: number[]) => {
      setOnlineUserIds(new Set(userIds));
    });

    socket.on("user_status_change", ({ userId, status }: { userId: number; status: "ONLINE" | "OFFLINE" }) => {
      setOnlineUserIds(prev => {
        const next = new Set(prev);
        status === "ONLINE" ? next.add(userId) : next.delete(userId);
        return next;
      });
    });

    return () => {
      socket.off("initial_online_users");
      socket.off("user_status_change");
    };
  }, [socket]);

  return onlineUserIds;
}