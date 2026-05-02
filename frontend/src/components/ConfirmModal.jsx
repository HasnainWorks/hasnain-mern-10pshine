export default function ConfirmModal({ title, message, confirmText = "Confirm", cancelText = "Cancel", confirmColor = "lime", onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-[#1a1a1a] border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
          confirmColor === "red" ? "bg-red-500/10" : "bg-[#CAFF00]/10"
        }`}>
          <span className={`text-lg ${confirmColor === "red" ? "text-red-400" : "text-[#CAFF00]"}`}>
            {confirmColor === "red" ? "⊗" : "✦"}
          </span>
        </div>

        <h3 className="font-black text-base tracking-tight mb-1">{title}</h3>
        <p className="text-white/40 text-sm mb-6 leading-relaxed">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm text-white/40 hover:text-white border border-white/[0.08] rounded-xl transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 text-sm font-black rounded-xl transition-all ${
              confirmColor === "red"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-[#CAFF00] hover:bg-[#d4f95e] text-black"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}