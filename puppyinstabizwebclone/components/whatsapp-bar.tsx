import { WHATSAPP } from "@/lib/data";
import { WhatsApp } from "./icons";

export default function WhatsAppBar() {
  return (
    <div className="tp-fab flex items-center gap-3 md:hidden">
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-whatsapp w-full"
      >
        <WhatsApp className="size-5" />
        Enquire on WhatsApp
      </a>
    </div>
  );
}