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

  return (
    <div className="w-full aspect-video rounded-full  bg-black">
      <VideoPlayer poster={poster ?? undefined} title={title ?? undefined}>
        <VideoSkin className="w-full h-full rounded-lg">
          {/*
            preload="metadata" pide solo los bytes del indice: el navegador sabe
            duracion y dimensiones para pintar los controles, pero no baja los ~90 MB
            del trailer hasta que el usuario le da a reproducir. Con "auto" el
            movil descarga el archivo entero al abrir la ficha.
            El src va solo en <Video>: un <source> con la misma URL hace que el
            navegador pida el recurso dos veces.
          */}
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
