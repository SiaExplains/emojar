import type { ToolDefinition } from '../types';

export const AUDIO_VIDEO_TOOLS: ToolDefinition[] = [
  {
    slug: 'mp4-to-mp3',
    category: 'audio-video-tools',
    name: 'MP4 to MP3',
    icon: '🎵',
    shortDescription: 'Extract the audio from a video as MP3.',
    description:
      'Extract the audio track from an MP4, MOV or WebM video and save it as an MP3. Choose the bitrate and download — the video is processed in your browser and never uploaded.',
    title: 'MP4 to MP3 Converter – Extract Audio From Video, No Upload',
    metaDescription:
      'Convert MP4 to MP3 online: extract audio from videos (MP4, MOV, WebM) and download an MP3. Choose bitrate. Your video never leaves your device.',
    keywords: [
      'mp4 to mp3',
      'video to mp3',
      'extract audio from video',
      'convert mp4 to mp3',
      'mov to mp3',
    ],
    relatedTools: [
      'video-to-gif',
      'microphone-test',
      'text-to-speech',
      'compress-pdf',
    ],
    component: 'mp4-to-mp3',
    handlesFiles: true,
    popular: true,
    limitation:
      'Works with videos your browser can play (MP4/H.264 + AAC, WebM, and MOV in Safari). Very long videos need a lot of memory because the audio is decoded in full before encoding.',
    howTo: [
      'Choose a video file.',
      'Pick the MP3 bitrate (192 kbps is a good default) and whether to trim the start or end.',
      'Click Convert and download the MP3.',
    ],
    about: [
      'The browser decodes the video’s audio track and a LAME-based MP3 encoder compresses it, running in a background worker so the page stays responsive.',
      '128 kbps is fine for speech and podcasts, 192 kbps for most music, and 320 kbps if you want the highest MP3 quality.',
    ],
    faqs: [
      {
        q: 'Can I convert YouTube videos?',
        a: 'Only files you have on your device. Downloading videos from YouTube is against its terms unless the creator allows it.',
      },
      {
        q: 'Does converting improve the audio quality?',
        a: 'No. MP3 is lossy, so choose a bitrate at least as high as the source (videos commonly use 128–256 kbps AAC).',
      },
    ],
  },
  {
    slug: 'video-to-gif',
    category: 'audio-video-tools',
    name: 'Video to GIF',
    icon: '🎞️',
    shortDescription: 'Turn a video clip into an animated GIF.',
    description:
      'Turn a short video clip into an animated GIF. Choose the start time and length, frame rate and width, preview the result and download — all in your browser, no upload needed.',
    title: 'Video to GIF Converter – MP4 to GIF Online, No Upload',
    metaDescription:
      'Convert video to GIF online: trim the clip, set frame rate and size, and download an animated GIF. MP4, WebM and MOV supported. Private and free.',
    keywords: [
      'video to gif',
      'mp4 to gif',
      'make a gif from video',
      'gif maker',
      'convert video to gif',
    ],
    relatedTools: [
      'mp4-to-mp3',
      'image-compressor',
      'meme-generator',
      'image-resizer',
    ],
    component: 'video-to-gif',
    handlesFiles: true,
    popular: true,
    limitation:
      'GIFs are limited to 256 colours and get large quickly — keep clips short (under ~10 seconds) and narrow (≤ 480 px) for sharing.',
    howTo: [
      'Choose a video file.',
      'Set the start time, clip length (up to 400 frames), frame rate and width.',
      'Click “Create GIF”, preview it and download.',
    ],
    about: [
      'The tool plays your video in a hidden player, captures frames at the chosen rate onto a canvas and encodes them with a small GIF encoder, choosing a 256-colour palette for each frame.',
      'File size grows with width × height × frames. A 5-second clip at 10 fps and 480 px wide is usually 1–4 MB.',
    ],
    faqs: [
      {
        q: 'Why is my GIF so big?',
        a: 'GIF compression is old and inefficient. Lower the frame rate, reduce the width or shorten the clip — each cuts the size substantially.',
      },
    ],
  },
];
