"use client";

import React, { useRef, useState } from "react";
import { Printer, Calendar, MapPin, Clock, User, Phone, GraduationCap, Building2, Users, ShieldCheck, Ticket, Download, Loader2 } from "lucide-react";
import { StickerBadge } from "@/components/ui/StickerBadge";
import { toPng } from "html-to-image";

export interface TicketPassProps {
  registration: {
    id: number;
    token: string;
    qr_code?: string;
    status: string;
    timestamp: string;
    user_name?: string;
    user_email?: string;
    user_phone?: string;
    phone_number?: string;
    college?: string;
    user_college?: string;
    department?: string;
    year_of_study?: string;
    team_name?: string;
    team_members?: string;
    event_details?: {
      id: number;
      title: string;
      category?: string;
      event_date?: string;
      venue?: string;
      time?: string;
      requires_payment?: boolean;
      payment_amount?: string | number;
    };
    payment_details?: {
      status: string;
      amount: string;
      razorpay_payment_id?: string;
    };
  };
  showPrintButton?: boolean;
  compact?: boolean;
}

export function TicketPass({ registration, showPrintButton = true, compact = false }: TicketPassProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const event = registration.event_details || {
    id: 0,
    title: "ASTRA Event Pass",
    category: "EVENT",
    event_date: new Date().toISOString(),
    venue: "Main Campus",
    time: "TBA",
  };

  const name = registration.user_name || "Attendee";
  const email = registration.user_email || "";
  const phone = registration.phone_number || registration.user_phone || "N/A";
  const college = registration.college || registration.user_college || "N/A";
  const dept = registration.department || "N/A";
  const year = registration.year_of_study || "N/A";

  const formattedDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "TBA";

  const handleDownloadImage = async () => {
    if (!ticketRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const cleanTitle = (event.title || "Ticket").replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `ASTRA-Ticket-${registration.id}-${cleanTitle}.png`;

      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to generate ticket image:", err);
      // Fall back to print if image generation encounters any issue
      handlePrint();
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    if (!ticketRef.current) {
      window.print();
      return;
    }

    const printFrame = document.createElement("iframe");
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "0";
    printFrame.style.visibility = "hidden";
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (!frameDoc) {
      window.print();
      return;
    }

    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((el) => el.outerHTML)
      .join("\n");

    const ticketHtml = ticketRef.current.outerHTML;

    frameDoc.open();
    frameDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ASTRA Ticket Pass #${registration.id}</title>
          <meta charset="utf-8" />
          ${styles}
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            *, *::before, *::after {
              box-sizing: border-box !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              background: #ffffff !important;
              color: #000000 !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              height: auto !important;
              display: flex !important;
              justify-content: center !important;
              align-items: flex-start !important;
            }
            .print-container {
              width: 100% !important;
              max-width: 680px !important;
              margin: 10px auto !important;
              padding: 0 !important;
              box-shadow: none !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            .ticket-body-grid {
              display: grid !important;
              grid-template-columns: 2fr 1fr !important;
              border-top: none !important;
            }
            .ticket-left-side {
              grid-column: span 1 / span 1 !important;
              border-right: 4px solid #000000 !important;
              border-bottom: none !important;
            }
            .ticket-right-side {
              grid-column: span 1 / span 1 !important;
              border-top: none !important;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${ticketHtml}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.focus();
                window.print();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    frameDoc.close();

    setTimeout(() => {
      if (document.body.contains(printFrame)) {
        document.body.removeChild(printFrame);
      }
    }, 3000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      {/* Print Trigger Header */}
      {showPrintButton && (
        <div className="flex flex-wrap items-center justify-between mb-3 px-1 gap-2 print:hidden">
          <span className="font-mono text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-black" /> Digital Entry Pass
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadImage}
              disabled={downloading}
              type="button"
              className="flex items-center gap-2 px-3.5 py-1.5 bg-black text-white font-mono text-xs font-bold uppercase border-2 border-black hover:bg-th-yellow hover:text-black transition-colors shadow-[2px_2px_0px_#000] disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving PNG...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" /> Download Image (PNG)
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 bg-white text-black font-mono text-xs font-bold uppercase border-2 border-black hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_#000]"
            >
              <Printer className="w-3.5 h-3.5" /> Print PDF
            </button>
          </div>
        </div>
      )}

      {/* Main Printable Pass Container */}
      <div
        ref={ticketRef}
        id={`ticket-pass-${registration.id}`}
        className="print-target-ticket bg-white border-4 border-black text-black shadow-[6px_6px_0px_#000] overflow-hidden print:shadow-none print:border-2"
      >
        {/* Ticket Top Banner */}
        <div className="bg-black text-white px-6 py-4 flex flex-wrap items-center justify-between border-b-4 border-black gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-th-yellow text-black flex items-center justify-center font-pixel font-black text-sm border-2 border-white shadow-[2px_2px_0px_#fff]">
              A
            </div>
            <div>
              <p className="font-pixel text-[10px] text-th-yellow tracking-widest uppercase">ASTRA IETM 2026</p>
              <p className="font-display font-bold text-sm uppercase tracking-wider">Official Event Ticket Pass</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StickerBadge
              color={registration.status === "ATTENDED" ? "mint" : registration.status === "REGISTERED" ? "lime" : "yellow"}
              rotation={1}
            >
              {registration.status}
            </StickerBadge>
            <span className="font-mono text-xs bg-white/20 px-2 py-1 border border-white/30 text-white">
              #{registration.id.toString().padStart(4, "0")}
            </span>
          </div>
        </div>

        {/* Pass Body (Grid layout) */}
        <div className="ticket-body-grid grid grid-cols-1 sm:grid-cols-3 divide-y-4 sm:divide-y-0 sm:divide-x-4 divide-black">
          {/* Left Column (2 Cols wide on desktop): Event & Attendee info */}
          <div className="ticket-left-side col-span-1 sm:col-span-2 p-6 space-y-5">
            {/* Event Name & Category */}
            <div>
              <span className="inline-block px-2 py-0.5 bg-black text-white font-pixel text-[9px] uppercase tracking-wider mb-1">
                {event.category || "GENERAL"}
              </span>
              <h2 className="font-pixel text-xl sm:text-2xl font-black uppercase text-black leading-tight">
                {event.title}
              </h2>
            </div>

            {/* Event Specs Badges */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-gray-100 border-2 border-black font-mono text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-black shrink-0" />
                <div>
                  <span className="text-[9px] uppercase text-gray-500 block">Date</span>
                  <span className="font-bold text-black">{formattedDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-black shrink-0" />
                <div>
                  <span className="text-[9px] uppercase text-gray-500 block">Time</span>
                  <span className="font-bold text-black">{event.time || "10:00 AM"}</span>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-2 pt-2 border-t border-black/20">
                <MapPin className="w-4 h-4 text-black shrink-0" />
                <div>
                  <span className="text-[9px] uppercase text-gray-500 block">Venue</span>
                  <span className="font-bold text-black">{event.venue || "Main Auditorium"}</span>
                </div>
              </div>
            </div>

            {/* Attendee Metadata */}
            <div className="space-y-3 pt-2">
              <div className="border-b-2 border-dashed border-black/30 pb-2">
                <p className="font-pixel text-[10px] text-gray-500 uppercase">REGISTRANT DETAILS</p>
                <p className="font-display font-bold text-base text-black flex items-center gap-2 mt-0.5">
                  <User className="w-4 h-4 text-black" /> {name}
                </p>
                {email && <p className="font-mono text-xs text-gray-600 pl-6">{email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs pt-1">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Contact Phone
                  </span>
                  <span className="font-bold text-black block">{phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" /> Year of Study
                  </span>
                  <span className="font-bold text-black block">{year}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-gray-500 uppercase flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> College & Dept
                  </span>
                  <span className="font-bold text-black block">
                    {college} {dept !== "N/A" ? `(${dept})` : ""}
                  </span>
                </div>
              </div>

              {/* Team Information */}
              {registration.team_name && (
                <div className="mt-3 p-3 bg-th-yellow/20 border-2 border-black font-mono text-xs">
                  <span className="text-[10px] font-bold uppercase flex items-center gap-1 text-black">
                    <Users className="w-3.5 h-3.5" /> Team: {registration.team_name}
                  </span>
                  {registration.team_members && (
                    <p className="text-[11px] text-gray-700 mt-1 pl-4 border-l-2 border-black">
                      Members: {registration.team_members}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (1 Col wide): QR Code Stub */}
          <div className="ticket-right-side col-span-1 p-6 bg-gray-50 flex flex-col items-center justify-between text-center space-y-4">
            <div className="w-full">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white font-mono text-[9px] uppercase font-bold mb-3">
                <ShieldCheck className="w-3 h-3 text-th-lime" /> SCAN FOR ENTRY
              </span>

              {/* QR Code Container */}
              {registration.qr_code ? (
                <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_#000] inline-block">
                  <img
                    src={registration.qr_code}
                    alt="Scan Ticket QR"
                    className="w-40 h-40 object-contain mx-auto"
                  />
                </div>
              ) : (
                <div className="w-40 h-40 bg-gray-200 border-2 border-black flex items-center justify-center font-mono text-xs text-gray-500">
                  QR GENERATING...
                </div>
              )}
            </div>

            {/* Token ID & Verification Code */}
            <div className="w-full space-y-1 font-mono">
              <span className="text-[9px] text-gray-500 uppercase block tracking-wider">TICKET TOKEN ID</span>
              <p className="text-[10px] font-bold text-black bg-white px-2 py-1 border border-black truncate">
                {registration.token ? registration.token.substring(0, 16) + "..." : "ASTRA-PASS"}
              </p>
              <p className="text-[9px] text-gray-400 pt-1">Present this QR code at the event check-in desk.</p>
            </div>
          </div>
        </div>

        {/* Ticket Footer / Stub Divider */}
        <div className="bg-gray-100 px-6 py-2 border-t-2 border-black flex items-center justify-between font-mono text-[10px] text-gray-500">
          <span>GEN_DATE: {new Date(registration.timestamp || Date.now()).toLocaleDateString("en-IN")}</span>
          <span className="font-bold text-black">ASTRA IETM SECURE TICKET VERIFICATION SYSTEM</span>
        </div>
      </div>
    </div>
  );
}
