"use client";

import React, { useRef, useState } from "react";
import {
  Printer,
  Calendar,
  MapPin,
  Clock,
  User,
  Phone,
  GraduationCap,
  Building2,
  Users,
  ShieldCheck,
  Ticket,
  Download,
  Loader2,
  Sparkles,
} from "lucide-react";
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

  const event = registration?.event_details || {
    id: 0,
    title: "ASTRA Event Pass",
    category: "EVENT",
    event_date: new Date().toISOString(),
    venue: "Main Campus",
    time: "TBA",
  };

  const name = registration?.user_name || "Attendee";
  const email = registration?.user_email || "";
  const phone = registration?.phone_number || registration?.user_phone || "N/A";
  const college = registration?.college || registration?.user_college || "N/A";
  const dept = registration?.department || "N/A";
  const year = registration?.year_of_study || "N/A";

  const formattedDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Oct 6, 2026";

  const formattedTime = event.event_date
    ? new Date(event.event_date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "10:00 AM";

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

      const passId = registration?.id != null ? String(registration.id) : "0";
      const cleanTitle = (event.title || "Ticket").replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `ASTRA-Pass-${passId}-${cleanTitle}.png`;

      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to generate ticket image:", err);
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
          <title>ASTRA Ticket Pass #${registration?.id ?? ""}</title>
          <meta charset="utf-8" />
          ${styles}
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm;
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
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
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
    <div className="w-full max-w-2xl mx-auto my-4 font-sans">
      {/* Action Header */}
      {showPrintButton && (
        <div className="flex flex-wrap items-center justify-between mb-3 px-1 gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 text-white text-xs font-medium shadow-sm">
              <Ticket className="w-3.5 h-3.5 text-amber-300" />
              <span>Digital Entry Pass</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadImage}
              disabled={downloading}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-medium hover:bg-black transition-all shadow-sm hover:shadow disabled:opacity-50 cursor-pointer"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Save PNG</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-neutral-300 bg-white text-neutral-800 text-xs font-medium hover:bg-neutral-50 hover:border-neutral-400 transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-600" />
              <span>Print PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Printable Pass Container */}
      <div
        ref={ticketRef}
        id={`ticket-pass-${registration?.id ?? "0"}`}
        className="print-target-ticket bg-white rounded-3xl border border-neutral-200/90 shadow-xl shadow-neutral-900/5 overflow-hidden text-neutral-900 print:shadow-none print:border print:rounded-2xl"
      >
        {/* Ticket Top Banner */}
        <div className="bg-neutral-950 text-white px-6 py-4 sm:px-8 sm:py-5 flex flex-wrap items-center justify-between border-b border-neutral-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-neutral-950 flex items-center justify-center font-bold text-sm shadow-sm">
              A
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-neutral-300">ASTRA 2026</p>
              <p className="text-sm sm:text-base font-bold text-white tracking-tight">Official Entry Pass</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                registration?.status === "ATTENDED"
                  ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                  : registration?.status === "REGISTERED"
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-300 border-amber-500/30"
              }`}
            >
              {registration?.status || "PENDING"}
            </span>
            <span className="text-xs font-medium text-neutral-400 bg-neutral-900 px-2.5 py-0.5 rounded-full border border-neutral-800">
              #{registration?.id != null ? String(registration.id).padStart(4, "0") : "0000"}
            </span>
          </div>
        </div>

        {/* Pass Body (Grid layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200/80">
          {/* Left Column (2 Cols wide): Event & Attendee info */}
          <div className="col-span-1 sm:col-span-2 p-6 sm:p-7 space-y-5">
            {/* Event Name & Category */}
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-semibold tracking-wide mb-1.5">
                {event.category || "GENERAL EVENT"}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight leading-snug">
                {event.title}
              </h2>
            </div>

            {/* Event Specs Card */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-neutral-50/80 rounded-2xl border border-neutral-200/70 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white border border-neutral-200/80 flex items-center justify-center flex-shrink-0 text-neutral-700">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-neutral-400 font-medium block">Date</span>
                  <span className="font-semibold text-neutral-900">{formattedDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white border border-neutral-200/80 flex items-center justify-center flex-shrink-0 text-neutral-700">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-neutral-400 font-medium block">Time</span>
                  <span className="font-semibold text-neutral-900">{formattedTime}</span>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-2.5 pt-2.5 border-t border-neutral-200/60">
                <div className="w-7 h-7 rounded-lg bg-white border border-neutral-200/80 flex items-center justify-center flex-shrink-0 text-neutral-700">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-neutral-400 font-medium block">Venue</span>
                  <span className="font-semibold text-neutral-900">{event.venue || "Main Auditorium, KMCT Calicut"}</span>
                </div>
              </div>
            </div>

            {/* Attendee Details */}
            <div className="space-y-3 pt-1">
              <div className="border-b border-neutral-100 pb-2.5">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Attendee</p>
                <p className="font-bold text-base text-neutral-950 flex items-center gap-2 mt-0.5">
                  <User className="w-4 h-4 text-neutral-600" /> {name}
                </p>
                {email && <p className="text-xs text-neutral-500 pl-6">{email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-medium flex items-center gap-1">
                    <Phone className="w-3 h-3 text-neutral-500" /> Contact Phone
                  </span>
                  <span className="font-semibold text-neutral-800 block mt-0.5">{phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-medium flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-neutral-500" /> Semester / Year
                  </span>
                  <span className="font-semibold text-neutral-800 block mt-0.5">{year}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-neutral-400 uppercase font-medium flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-neutral-500" /> Institution &amp; Branch
                  </span>
                  <span className="font-semibold text-neutral-800 block mt-0.5">
                    {college} {dept !== "N/A" ? `(${dept})` : ""}
                  </span>
                </div>
              </div>

              {/* Team Information */}
              {registration.team_name && (
                <div className="mt-3 p-3 rounded-xl bg-purple-50/70 border border-purple-100 text-xs">
                  <span className="text-[11px] font-bold text-purple-950 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-600" /> Team: {registration.team_name}
                  </span>
                  {registration.team_members && (
                    <p className="text-[11px] text-purple-800 mt-1 pl-4 border-l border-purple-300">
                      Members: {registration.team_members}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (1 Col wide): QR Code Stub */}
          <div className="col-span-1 p-6 sm:p-7 bg-neutral-50/50 flex flex-col items-center justify-between text-center space-y-4">
            <div className="w-full flex flex-col items-center">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900 text-white text-[10px] font-semibold mb-3.5 shadow-sm">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Entry QR Pass</span>
              </span>

              {/* QR Code Container */}
              {registration.qr_code ? (
                <div className="p-3 bg-white rounded-2xl border border-neutral-200 shadow-sm inline-block">
                  <img
                    src={registration.qr_code}
                    alt="Scan Ticket QR"
                    className="w-36 h-36 sm:w-40 sm:h-40 object-contain mx-auto"
                  />
                </div>
              ) : (
                <div className="w-36 h-36 sm:w-40 sm:h-40 bg-neutral-100 rounded-2xl border border-neutral-200 flex items-center justify-center text-xs text-neutral-400 font-medium">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Token ID */}
            <div className="w-full space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase font-medium block tracking-wider">
                Verification Token
              </span>
              <p className="text-xs font-mono font-bold text-neutral-800 bg-white px-2.5 py-1 rounded-lg border border-neutral-200 truncate">
                {registration.token ? registration.token.substring(0, 16) + "..." : "ASTRA-PASS"}
              </p>
              <p className="text-[10px] text-neutral-400 pt-0.5">Present this QR code at the event check-in desk.</p>
            </div>
          </div>
        </div>

        {/* Ticket Footer / Stub Divider */}
        <div className="bg-neutral-50 px-6 py-2.5 sm:px-8 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-400">
          <span>Issued: {new Date(registration.timestamp || Date.now()).toLocaleDateString("en-IN")}</span>
          <span className="font-medium text-neutral-600">ASTRA 2026 • Verified Credential</span>
        </div>
      </div>
    </div>
  );
}
