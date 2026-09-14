import { Scene } from "@/components/kage/Scene";

export const metadata = {
  title: "Kage — Where stillness reveals the unseen",
  description: "A five-chapter night walk through a Kyoto mountain temple.",
};

export default function KagePage() {
  return (
    <main className="w-full min-h-screen bg-black">
      <Scene />
    </main>
  );
}
