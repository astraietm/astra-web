import React from "react";
import { EvervaultCard, Icon } from "../ui/evervault-card";

export default function EvervaultCardDemo() {
  return (
    <div className="border border-white/10 bg-white/[0.02] backdrop-blur-sm rounded-2xl flex flex-col items-start max-w-sm mx-auto p-4 relative h-[30rem] overflow-hidden group">
      <Icon className="absolute h-6 w-6 -top-3 -left-3 text-primary/50" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-primary/50" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 text-primary/50" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-primary/50" />

      <EvervaultCard text="ASTRA" />

      <div className="relative z-10">
        <h2 className="text-white mt-4 text-sm font-light tracking-widest uppercase">
          Neural Uplink Active
        </h2>
        <p className="text-sm border font-light border-white/10 rounded-full mt-4 text-gray-400 px-3 py-1 bg-white/5">
          Scan to reveal
        </p>
      </div>
    </div>
  );
}
