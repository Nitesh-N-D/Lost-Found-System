import StatusBadge from "../common/StatusBadge";
import { Icon } from "../common/Icons";
import icons from "../common/iconPaths";

function ChatSidebar({ chatData }) {
  const participants = Array.isArray(chatData?.chat?.participants)
    ? chatData.chat.participants
    : [];

  return (
    <aside className="space-y-4 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(15,23,42,0.82))] p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
          Chat sidebar
        </p>
        <h3 className="mt-3 text-xl font-semibold text-white">Claim workspace</h3>
      </div>

      <div className="rounded-[22px] bg-slate-950/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium text-white">Claim status</p>
          <StatusBadge status={chatData.claimStatus} />
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {chatData.contactUnlocked
            ? "Owner contact has been unlocked for this approved claim."
            : "Owner contact remains protected until the claim is approved."}
        </p>
      </div>

      <div className="rounded-[22px] bg-slate-950/60 p-4">
        <p className="font-medium text-white">Participants</p>
        <div className="mt-4 space-y-3">
          {participants.map((participant) => (
            <div className="flex items-center gap-3" key={participant._id}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                {participant.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{participant.name}</p>
                <p className="truncate text-xs text-slate-400">{participant.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[22px] bg-slate-950/60 p-4">
        <p className="font-medium text-white">Contact owner</p>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <div className="flex items-center gap-3">
            <Icon className="h-4 w-4" path={icons.phone} />
            <span>{chatData.contactUnlocked ? chatData.contact?.phone || "Phone unavailable" : "Unlocks after approval"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Icon className="h-4 w-4" path={icons.chat} />
            <span>Use secure in-app messaging for all pre-approval communication.</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default ChatSidebar;
