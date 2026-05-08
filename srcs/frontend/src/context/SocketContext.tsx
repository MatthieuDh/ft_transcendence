import { Socket, io } from "socket.io-client";
import { useState, useEffect, useContext, createContext } from "react";


const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: React.ReactNode;
  currentUserId: number | undefined;
}

export function SocketProvider({ children, currentUserId }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!currentUserId) return;

    const newSocket = io(window.location.origin);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("identify", currentUserId);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUserId]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);