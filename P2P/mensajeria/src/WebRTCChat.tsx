import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://192.168.0.83:3001");

export default function P2PChat() {
  const [yourId, setYourId] = useState("");
  const [users, setUsers] = useState<string[]>([]);
  const [peers, setPeers] = useState<{ [id: string]: any }>({});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ [id: string]: string[] }>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleConnect = () => {
      console.log("✅ Conectado con ID:", socket.id);
      if (socket.id) setYourId(socket.id);
    };

    const handleUsers = (userList: string[]) => {
      console.log("📥 Usuarios recibidos:", userList);
      setUsers(userList);
    };

    const handleSignal = ({ from, data }: { from: string; data: any }) => {
      console.log("📶 Señal recibida de:", from);

      let newPeer = peers[from];

      if (!newPeer) {
        newPeer = new Peer({ initiator: false, trickle: false });

        newPeer.on("signal", (signalData) => {
          socket.emit("signal", {
            to: from,
            from: socket.id,
            data: signalData,
          });
        });

        newPeer.on("connect", () => {
          console.log("🎉 Conexión P2P establecida con", from);
        });

        newPeer.on("data", (data) => {
          const text = data.toString();
          console.log(`💬 Mensaje recibido de ${from}:`, text);
          setMessages((prev) => ({
            ...prev,
            [from]: [...(prev[from] || []), `👤 ${from}: ${text}`],
          }));

          // Si no está en el chat actual, lo seleccionamos automáticamente
          if (!selectedUser) setSelectedUser(from);
        });

        setPeers((prev) => ({ ...prev, [from]: newPeer }));
      }

      newPeer.signal(data);
    };

    socket.on("connect", handleConnect);
    socket.on("users", handleUsers);
    socket.on("signal", handleSignal);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("users", handleUsers);
      socket.off("signal", handleSignal);
    };
  }, [peers, selectedUser]);

  const connectAndChat = (targetId: string) => {
    if (peers[targetId]) {
      setSelectedUser(targetId); // Ya conectado, simplemente chatear
      return;
    }

    const newPeer = new Peer({ initiator: true, trickle: false });

    newPeer.on("signal", (signalData) => {
      socket.emit("signal", {
        to: targetId,
        from: socket.id,
        data: signalData,
      });
    });

    newPeer.on("connect", () => {
      console.log("🎉 Conexión P2P establecida con", targetId);
      setSelectedUser(targetId); // Establecemos el usuario al conectar
    });

    newPeer.on("data", (data) => {
      const text = data.toString();
      console.log(`💬 Mensaje recibido de ${targetId}:`, text);
      setMessages((prev) => ({
        ...prev,
        [targetId]: [...(prev[targetId] || []), `👤 ${targetId}: ${text}`],
      }));

      // Si no está en el chat actual, lo seleccionamos automáticamente
      if (!selectedUser) setSelectedUser(targetId);
    });

    setPeers((prev) => ({ ...prev, [targetId]: newPeer }));
  };

  const sendMessage = () => {
    if (selectedUser && peers[selectedUser] && message.trim()) {
      peers[selectedUser].send(message);
      setMessages((prev) => ({
        ...prev,
        [selectedUser]: [...(prev[selectedUser] || []), `🧑‍💻 Tú: ${message}`],
      }));
      setMessage("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Tu ID: {yourId}</h2>

      <h3>Usuarios disponibles:</h3>
      <ul>
        {users
          .filter((id) => id !== yourId)
          .map((id) => (
            <li key={id}>
              {id}
              <button
                onClick={() => connectAndChat(id)}
                style={{ marginLeft: 10 }}
              >
                {peers[id] ? "Chatear" : "Conectar y Chatear"}
              </button>
            </li>
          ))}
      </ul>

      {selectedUser && (
        <>
          <h3>Hablando con: {selectedUser}</h3>
          <div
            style={{
              border: "1px solid #ccc",
              padding: 10,
              height: 200,
              overflowY: "scroll",
              marginBottom: 10,
            }}
          >
            {(messages[selectedUser] || []).map((msg, idx) => (
              <div key={idx}>{msg}</div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            placeholder="Escribe un mensaje"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={{ width: "80%", marginRight: 10 }}
          />
          <button onClick={sendMessage}>Enviar</button>
        </>
      )}
    </div>
  );
}
