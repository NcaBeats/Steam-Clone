"use client";

import "@videojs/react/video/skin.css";

import { Video, VideoPlayer, VideoSkin } from "@videojs/react/video";
import { resolveVideoUrl } from "@/lib/media";

type Props = Readonly<{
  src: string;
  poster?: string | null;
  title?: string | null;
}>;

function videoType(src: string): string {
  const ext = src.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase();
  if (ext === "webm") return "video/webm";
  if (ext === "mov") return "video/quicktime";
  return "video/mp4";
}

export function GameVideo({ src, poster, title }: Props) {
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
          <source src={absoluteSrc} type={videoType(src)} />
        </VideoSkin>
      </VideoPlayer>
    </div>
  );
}
