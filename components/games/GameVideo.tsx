"use client";

import "@videojs/react/video/skin.css";

import { Video, VideoPlayer, VideoSkin } from "@videojs/react/video";
import { resolveVideoUrl } from "@/lib/media";

type Props = Readonly<{
  src: string;
  poster?: string | null;
  title?: string | null;
}>;

export function GameVideo({ src, poster, title }: Props) {
  const absoluteSrc = resolveVideoUrl(src);

  if (!absoluteSrc) return null;

  return (
    <div className="w-full aspect-video rounded-full  bg-black">
      <VideoPlayer poster={poster ?? undefined} title={title ?? undefined}>
        <VideoSkin className="w-full h-full rounded-lg">
          <Video
            style={{ borderRadius: "inherit" }}
            src={absoluteSrc}
            playsInline
            preload="metadata"
          />
        </VideoSkin>
      </VideoPlayer>
    </div>
  );
}
