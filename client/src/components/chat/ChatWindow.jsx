import { useEffect, useMemo, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { formatRelativeTime } from "../../utils/formatters";

function ChatWindow({ messages }) {
  const { user } = useAuth();
  const endRef = useRef(null);
  const safeMessages = useMemo(
    () => (Array.isArray(messages) ? messages : []),
    [messages]
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [safeMessages]);

  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5">
      <div className="max-h-[420px] space-y-4 overflow-y-auto pr-2">
        {safeMessages.map((message) => {
          const mine = message.sender?._id === user?._id;

          return (
            <div
              key={message._id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-3xl px-4 py-3 ${
                  mine
                    ? "bg-[var(--color-primary)] text-slate-950"
                    : "bg-white/10 text-white"
                }`}
              >
                <p className="text-sm leading-6">{message.message}</p>
                <p className={`mt-2 text-[11px] ${mine ? "text-slate-700" : "text-slate-400"}`}>
                  {formatRelativeTime(message.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
    </div>
  );
}

export default ChatWindow;
