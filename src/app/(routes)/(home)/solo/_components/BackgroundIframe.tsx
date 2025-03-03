"use client";
import { useSoloContext } from "@/hooks/useSoloContext";
import { UrlToEmbeded } from "@/util/urlToEmbed";
import React, { useCallback, useEffect, useRef } from "react";

/**
 * YouTube Embed Parameters:
 *
 * - start=0               // Bắt đầu video từ giây 0.
 * - loop=1                // Lặp lại video khi kết thúc.
 * - playlist=h2fPDCzNvFo  // Bắt buộc để video có thể lặp lại.
 * - showinfo=0            // Ẩn tiêu đề và thông tin video (không còn hoạt động từ 2018).
 * - controls=0            // Ẩn thanh điều khiển video.
 * - disablekb=0           // Không vô hiệu hóa bàn phím (người dùng vẫn có thể dùng phím để điều khiển).
 * - fs=0                  // Không cho phép xem ở chế độ toàn màn hình.
 * - rel=0                 // Không hiển thị video liên quan khi video kết thúc (từ 2018 chỉ hiển thị video từ cùng kênh).
 * - iv_load_policy=3      // Ẩn chú thích (annotations) trên video.
 * - autoplay=1            // Tự động phát video ngay khi tải trang.
 * - mute=1                // Video tự động tắt tiếng khi phát.
 * - modestbranding=1      // Ẩn logo YouTube trong trình phát video.
 * - playsinline=1         // Phát video trong trang thay vì toàn màn hình trên di động.
 * - enablejsapi=1         // Cho phép điều khiển video qua JavaScript API.
 * - origin=your_url // Chỉ định trang web nhúng video (bảo mật).
 * - widgetid=2            // ID widget để phân biệt trình phát nếu có nhiều video trên trang.
 */

function BackgroundIframe() {
  const [state, _] = useSoloContext();
  const playerRef = useRef<any>(null);

  const handleVolumeChange = useCallback(() => {
    if (state.volume === 0) {
      playerRef.current.mute();
    } else {
      playerRef.current.unMute();
      playerRef.current.setVolume(state.volume);
    }
  }, [state.volume]);

  useEffect(() => {
    // Load the YouTube IFrame API script
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player("video-player", {
        height: "390",
        width: "640",
        videoId: `${state.backgroundURL}`,
        playerVars: {
          playsinline: 1,
          mute: 1,
          enablejsapi: 1,
          autoplay: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          loop: 1,
          playlist: `${state.backgroundURL}`,
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo();
          },
        },
      });
    };

    return () => {
      delete (window as any).onYouTubeIframeAPIReady;
    };
  }, []);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.loadVideoById({
        videoId: `${state.backgroundURL}`,
        startSeconds: 0,
        endSeconds: 0,
        suggestedQuality: "large",
      });
    }
  }, [state.backgroundURL]);

  useEffect(() => {
    if (playerRef.current) {
      console.log("playerRef.current", playerRef.current.getVolume());
      handleVolumeChange();
    }
  }, [state.volume]);

  return (
    <div>
      <div
        id="video-player"
        className="aspect-video min-w-full w-screen object-cover min-h-full
      box-border h-[56.25vw] pointer-events-none absolute top-1/2 left-1/2
      -translate-x-1/2 -translate-y-1/2"
      ></div>
    </div>
  );
}

export default React.memo(BackgroundIframe);
