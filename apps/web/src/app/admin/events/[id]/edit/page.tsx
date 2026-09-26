"use client";

import React from "react";
import { useParams } from "next/navigation";
import EventEditorForm from "@/components/admin/EventEditorForm";

export default function EditEventPage() {
  const params = useParams();
  const eventId = params?.id as string;

  return <EventEditorForm eventId={eventId} />;
}
