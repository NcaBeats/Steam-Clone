"use client";

import "@videojs/react/video/skin.css";

import { Video, VideoPlayer, VideoSkin } from "@videojs/react/video";
import type { CSSProperties } from "react";

type Props = Readonly<{
  src: string;
  poster?: string | null;
  title?: string | null;
}>;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:9090/api/v1";
const ORIGIN = new URL(API_BASE).origin;

function resolveVideoUrl(src: string): string {
  if (src.startsWith("http")) return src;
  return new URL(src, ORIGIN).href;
}

export function GameVideo({ src, poster, title }: Props) {
  const heroStyle = { "--media-object-fit": "cover" } as CSSProperties;
  const absoluteSrc = resolveVideoUrl(src);

  return (
    <div className="w-full aspect-video rounded-full  bg-black">
      <VideoPlayer poster={poster ?? undefined} title={title ?? undefined}>
        <VideoSkin className="w-full h-full rounded-lg">
          <Video
            style={{ borderRadius: "inherit" }}
            src={absoluteSrc}
            playsInline
          />
          <source src={absoluteSrc} type="video/mp4" />
        </VideoSkin>
      </VideoPlayer>
    </div>
  );
}
