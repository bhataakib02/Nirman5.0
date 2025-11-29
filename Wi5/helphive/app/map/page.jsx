"use client";

import dynamic from "next/dynamic";
const Map = dynamic(() => import("./map-component"), { ssr: false });

export default function Page() {
  return <div className="h-screen"><Map /></div>;
}
