import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://192.168.0.83:3001");
export default function P2PChat() {
  const [yourId, setYourId] = useState("");
  const [users, setUsers] = useState<string[]>([]);
  const [targetId, setTargetId] = useState("");
  const [peer, setPeer] = useState<any>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleConnect = () => {
      console.log("✅ Conectado con ID:", socket.id);
      if (socket.id) {
        setYourId(socket.id);
      } else {
        console.error("Socket ID is undefined");
      }
    };

    const handleUsers = (userList: string[]) => {
      console.log("📥 Usuarios recibidos:", userList);
      setUsers(userList);
    };

    const handleSignal = ({ from, data }: { from: string; data: any }) => {
      console.log("📶 Señal recibida de:", from);

      if (!peer) {
        const newPeer = new Peer({ initiator: false, trickle: false });

        newPeer.on("signal", (signalData) => {
          console.log("📡 Enviando respuesta de señal a:", from);
          socket.emit("signal", {
            to: from,
            from: socket.id,
            data: signalData,
          });
        });

        newPeer.on("data", (data) => {
          setMessages((prev) => [...prev, `👤 ${from}: ${data.toString()}`]);
        });

        newPeer.on("connect", () => {
          console.log("🎉 Conexión P2P establecida (receptor)");
          //socket.emit("ready-to-disconnect"); // <--- Notifica al servidor
        });

        newPeer.signal(data);
        setPeer(newPeer);
      } else {
        peer.signal(data);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("users", handleUsers);
    socket.on("signal", handleSignal);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("users", handleUsers);
      socket.off("signal", handleSignal);
    };
  }, [peer]);

  const startConnection = () => {
    if (!targetId) return;

    console.log("🚀 Iniciando conexión con:", targetId);

    const newPeer = new Peer({ initiator: true, trickle: false });

    newPeer.on("signal", (signalData) => {
      console.log("📡 Enviando señal a:", targetId);
      socket.emit("signal", {
        to: targetId,
        from: socket.id,
        data: signalData,
      });
    });
    newPeer.on("connect", () => {
      console.log("🎉 Conexión P2P establecida");
      // Aquí podrías notificar al servidor que puede "liberar" recursos o incluso apagarse
    });
    newPeer.on("data", (data) => {
      setMessages((prev) => [...prev, `👤 ${targetId}: ${data.toString()}`]);
    });

    setPeer(newPeer);
  };

  const sendMessage = () => {
    if (peer && message.trim()) {
      peer.send(message);
      setMessages((prev) => [...prev, `🧑‍💻 Tú: ${message}`]);
      setMessage("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Tu ID: {yourId}</h2>

      <h3>Usuarios disponibles:</h3>
      <ul>
        {users
          .filter((id) => id !== yourId) // filtro aquí, no antes
          .map((id) => (
            <li key={id}>
              {id} <button onClick={() => setTargetId(id)}>Chatear</button>
            </li>
          ))}
      </ul>

      {targetId && (
        <>
          <p>Hablando con: {targetId}</p>
          <button onClick={startConnection}>Conectar</button>
        </>
      )}

      <div style={{ marginTop: 20 }}>
        <h3>Chat</h3>
        <div
          style={{
            border: "1px solid #ccc",
            padding: 10,
            height: 200,
            overflowY: "scroll",
          }}
        >
          {messages.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </div>
        <input
          type="text"
          value={message}
          placeholder="Escribe un mensaje"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}
