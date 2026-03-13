import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { chatService } from "../../services/chatService";
import ChatWindow from "../../components/chat/ChatWindow";
import ChatSidebar from "../../components/chat/ChatSidebar";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import PageLoader from "../../components/common/PageLoader";
import EmptyState from "../../components/common/EmptyState";

function ChatPage() {
  const { claimId } = useParams();
  const [chatData, setChatData] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let active = true;

    chatService
      .getByClaim(claimId)
      .then((data) => {
        if (active) setChatData(data);
      })
      .catch((error) => toast.error(error.message));

    return () => {
      active = false;
    };
  }, [claimId]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;

    try {
      setSending(true);
      setChatData(await chatService.sendMessage(claimId, { message }));
      setMessage("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSending(false);
    }
  };

  if (!chatData) {
    return <PageLoader label="Loading secure conversation..." />;
  }

  if (!chatData?.chat) {
    return (
      <EmptyState
        description="The conversation is not available yet. Try refreshing in a moment."
        title="Chat unavailable"
      />
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[320px,1fr]">
      <ChatSidebar chatData={chatData} />

      <div className="space-y-6">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xl font-semibold text-white">Claim conversation</p>
              <p className="mt-2 text-sm text-slate-300">
                Keep communication secure, timestamped, and tied to the claim record.
              </p>
            </div>
            <StatusBadge status={chatData.claimStatus} />
          </div>

          <div className="mt-5 rounded-[24px] bg-slate-950/60 p-4 text-sm text-slate-300">
            {chatData.contactUnlocked ? (
              <p>Call Owner: {chatData.contact?.phone || "Phone number unavailable"}</p>
            ) : (
              <p>Owner phone unlocks after claim approval. Use secure chat until then.</p>
            )}
          </div>
        </div>

        {Array.isArray(chatData.chat.messages) && chatData.chat.messages.length > 0 ? (
          <ChatWindow messages={chatData.chat.messages} />
        ) : (
          <EmptyState
            description="Start the conversation to coordinate verification and handoff."
            title="No messages yet"
          />
        )}

        <form className="rounded-[28px] border border-white/10 bg-white/5 p-4" onSubmit={sendMessage}>
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              className="flex-1 rounded-full border border-white/10 bg-slate-950/70 px-5 py-3 text-white outline-none transition focus:border-cyan-400/50"
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Type your message..."
              value={message}
            />
            <Button className="min-w-40 justify-center" disabled={sending} type="submit">
              {sending ? "Sending..." : "Send message"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;
