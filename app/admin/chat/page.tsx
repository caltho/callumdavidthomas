import { requireAdmin } from "@/lib/auth";
import { ChatConsole } from "@/components/admin/chat-console";

export const dynamic = "force-dynamic";

export default async function AdminChatPage() {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">§ Live</p>
        <h1 className="font-display mt-4 text-5xl leading-none text-bone-50 md:text-7xl">
          Counter-AI<span className="text-ember">.</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm text-bone-400">
          Visitors think they&apos;re talking to a bot. Keep this open and they&apos;re talking to
          you. When it&apos;s closed, callum-nano covers. Nothing is saved.
        </p>
      </header>

      <ChatConsole />
    </div>
  );
}
