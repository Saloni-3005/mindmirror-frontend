import { Brain } from "lucide-react";

export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="grid place-items-center rounded-2xl gradient-primary glow-primary"
        style={{ width: size, height: size }}
      >
        <Brain className="text-primary-foreground" size={size * 0.55} />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-semibold tracking-tight text-foreground">MindMirror</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          AI · Wellness OS
        </span>
      </div>
    </div>
  );
}
