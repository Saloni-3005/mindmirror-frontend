export function VoiceWaveform({ bars = 32 }: { bars?: number }) {
  return (
    <div className="flex h-16 items-center justify-center gap-[3px]">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="wave-bar w-1 rounded-full bg-gradient-to-t from-primary to-accent"
          style={{
            height: `${20 + ((i * 13) % 70)}%`,
            animationDelay: `${(i % 8) * 0.08}s`,
            animationDuration: `${0.8 + ((i * 7) % 6) * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}
