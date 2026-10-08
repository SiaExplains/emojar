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
      'audio-converter',
      'audio-trimmer',
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
      'video-compressor',
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
  {
    slug: 'video-trimmer',
    category: 'audio-video-tools',
    name: 'Video Trimmer',
    icon: '✂️',
    shortDescription: 'Cut a clip out of a video without uploading it.',
    description:
      'Trim the start and end off a video, or cut out just the part you need, right in your browser. Fast mode copies the video without re-encoding, so quality is untouched and long files finish in seconds; precise mode re-encodes for a frame-exact cut. MP4 and WebM out, nothing uploaded.',
    title: 'Video Trimmer – Cut Videos Online Without Uploading',
    metaDescription:
      'Trim and cut videos online for free: set start and end, export MP4 or WebM with no quality loss (fast mode) or a frame-exact cut. Runs in your browser, no upload.',
    keywords: [
      'video trimmer',
      'trim video',
      'cut video',
      'video cutter',
      'shorten video',
      'clip video online',
    ],
    relatedTools: [
      'video-compressor',
      'video-to-gif',
      'mp4-to-mp3',
      'audio-trimmer',
      'screen-recorder',
    ],
    component: 'video-trimmer',
    handlesFiles: true,
    howTo: [
      'Choose a video (MP4, WebM, MOV or MKV).',
      'Drag the Start and End sliders, type exact times, or play the video and use “Start/End = current frame”.',
      'Pick Fast (no quality loss) or Precise (frame-exact, re-encodes).',
      'Press Trim video, check the preview and download the clip.',
    ],
    about: [
      'Video is stored as keyframes — complete pictures — with the frames in between saved as changes from them. That is why the fast mode, which copies the encoded video without decoding it, can only start a clip at a keyframe: your clip may begin up to a couple of seconds earlier than the start you set. It is lossless and very quick because nothing is re-compressed.',
      'Precise mode decodes and re-encodes the clip with your browser’s built-in encoder (WebCodecs), so the cut lands on the exact frame, at the cost of time and a small quality change. Both modes keep MP4 as MP4 and WebM as WebM; other inputs such as MOV are saved as MP4. Formats your browser can’t decode — some HEVC, AVI or WMV files — can’t be trimmed here.',
    ],
    faqs: [
      {
        q: 'Why does my clip start a little early?',
        a: 'Fast mode cuts at the keyframe before your start time so it can copy the video without re-encoding. Switch to Precise for an exact start.',
      },
      {
        q: 'Is there a file size limit?',
        a: 'There is no upload, so no server limit — the browser keeps the video in memory. Files of a few hundred MB work on most computers; phones may struggle with very large videos.',
      },
      {
        q: 'Does it work on iPhone?',
        a: 'Yes in Safari 17 or later, which supports WebCodecs. Older iOS versions show a message instead.',
      },
    ],
  },
  {
    slug: 'video-compressor',
    category: 'audio-video-tools',
    name: 'Video Compressor',
    icon: '🗜️',
    shortDescription: 'Make videos smaller without uploading them.',
    description:
      'Compress videos in your browser: choose quality, maximum resolution (1080p, 720p, 480p…) and MP4 or WebM, optionally remove the sound, and compare before and after. Uses your device’s hardware video encoder — the video is never uploaded.',
    title: 'Video Compressor – Reduce Video File Size Online (No Upload)',
    metaDescription:
      'Compress video online without uploading: lower the resolution and bitrate, export MP4 (H.264) or WebM (VP9), remove audio. Fast, private, uses your browser.',
    keywords: [
      'video compressor',
      'compress video',
      'reduce video size',
      'compress mp4',
      'video size reducer',
    ],
    relatedTools: [
      'video-to-gif',
      'mp4-to-mp3',
      'screen-recorder',
      'compress-image-to-size',
      'audio-converter',
    ],
    component: 'video-compressor',
    handlesFiles: true,
    popular: true,
    limitation:
      'Needs WebCodecs video encoding (recent Chrome, Edge, Safari 16.4+ or Firefox 130+). Very long or 4K videos need plenty of free memory.',
    howTo: [
      'Drop a video file.',
      'Choose the quality, maximum resolution and format (MP4 plays everywhere).',
      'Click “Compress video”, compare the result and download it.',
    ],
    about: [
      'File size depends mostly on resolution and bitrate. Phones record at high bitrates for quality; re-encoding a 4K or 1080p clip to 720p at a balanced bitrate often makes it 70–90 % smaller while still looking good on a phone or laptop — small enough to email or upload faster.',
      'The video is decoded and re-encoded on your device with the browser’s WebCodecs API (using mediabunny), so it never leaves your computer. MP4 with H.264 video and AAC audio is the most compatible choice; WebM with VP9 is often smaller at the same quality but doesn’t play in every app.',
    ],
    faqs: [
      {
        q: 'Why did my video not get smaller?',
        a: 'It may already be well compressed. Lower the quality or resolution, or remove the audio track.',
      },
      {
        q: 'Is there a file size limit?',
        a: 'No fixed limit, but the whole result is kept in memory — a few gigabytes may be too much for phones and older laptops.',
      },
    ],
  },
  {
    slug: 'audio-trimmer',
    category: 'audio-video-tools',
    name: 'Audio Trimmer / Cutter',
    icon: '✂️',
    shortDescription: 'Cut MP3, WAV and other audio — with fades.',
    description:
      'Trim audio online: load an MP3, WAV, M4A, OGG or video file, drag the start and end on the waveform, preview the selection, add fade-in and fade-out, and save as MP3 or WAV. Great for ringtones, podcast clips and samples.',
    title: 'Audio Trimmer – Cut MP3 & Audio Online with Fade In/Out',
    metaDescription:
      'Cut audio online: trim MP3, WAV, M4A or the sound of a video on a waveform, preview, add fades and save as MP3 or WAV. Free, private, no upload.',
    keywords: [
      'audio trimmer',
      'cut mp3',
      'audio cutter',
      'trim audio online',
      'mp3 cutter',
    ],
    relatedTools: [
      'audio-converter',
      'mp4-to-mp3',
      'voice-recorder',
      'microphone-test',
      'video-compressor',
    ],
    component: 'audio-trimmer',
    handlesFiles: true,
    howTo: [
      'Drop an audio or video file.',
      'Drag on the waveform (or type times) to set the start and end, and play the selection.',
      'Add fades if you like, choose MP3 or WAV and download.',
    ],
    about: [
      'Your browser decodes the file to raw audio, the selected part is cut out with sample accuracy, and short fades can be applied to avoid clicks at the cut points. MP3 is encoded with the LAME encoder at 192 kbps; WAV keeps the audio uncompressed at its original sample rate.',
      'For a phone ringtone, keep it under 30 seconds (iPhone’s limit is 40 s) and add a short fade-out. Everything runs locally, so the file is never uploaded.',
    ],
    faqs: [
      {
        q: 'Does trimming lower the quality?',
        a: 'WAV export is lossless. MP3 export re-encodes the audio, which is inaudible at 192 kbps for most material.',
      },
    ],
  },
  {
    slug: 'audio-converter',
    category: 'audio-video-tools',
    name: 'Audio Converter',
    icon: '🔄',
    shortDescription: 'Convert audio to MP3, WAV, M4A or OGG.',
    description:
      'Convert audio files between formats in your browser: any format your browser can play — including the sound of MP4 and WebM videos — to MP3, WAV, M4A (AAC) or OGG (Opus), with bitrate, sample rate and mono options.',
    title: 'Audio Converter – Convert to MP3, WAV, M4A & OGG Online',
    metaDescription:
      'Convert audio online to MP3, WAV, M4A (AAC) or OGG (Opus): choose bitrate, sample rate and mono. Works with WAV, M4A, FLAC, OGG and video files. No upload.',
    keywords: [
      'audio converter',
      'convert to mp3',
      'wav to mp3',
      'm4a to mp3',
      'audio file converter',
    ],
    relatedTools: [
      'mp4-to-mp3',
      'audio-trimmer',
      'voice-recorder',
      'video-compressor',
      'text-to-speech',
    ],
    component: 'audio-converter',
    handlesFiles: true,
    popular: true,
    howTo: [
      'Drop an audio or video file.',
      'Choose the output format and bitrate (and sample rate or mono for MP3/WAV).',
      'Click Convert, listen to the result and download it.',
    ],
    about: [
      'MP3 plays everywhere; WAV is uncompressed and lossless but large (about 10 MB per minute in stereo); M4A (AAC) and OGG (Opus) sound better than MP3 at the same bitrate. For speech, 64–96 kbps mono is plenty; for music, 192 kbps or more.',
      'Converting from one lossy format to another can’t restore lost detail, so choose a bitrate at least as high as the source. M4A and OGG use your browser’s built-in encoders (WebCodecs) and aren’t available in every browser; MP3 and WAV always work.',
    ],
    faqs: [
      {
        q: 'Can it convert FLAC or ALAC?',
        a: 'If your browser can play the file, it can convert it — FLAC works in all modern browsers; ALAC mainly in Safari.',
      },
    ],
  },
  {
    slug: 'voice-recorder',
    category: 'audio-video-tools',
    name: 'Voice Recorder',
    icon: '🎤',
    shortDescription: 'Record your voice and save it as MP3 or WAV.',
    description:
      'Record audio from your microphone in the browser with a live level meter, pause and resume, then play it back and download it as WebM/M4A, MP3 or WAV. No app, no sign-up, and the recording never leaves your device.',
    title: 'Online Voice Recorder – Record Audio & Save as MP3 (Free)',
    metaDescription:
      'Record your voice online: live level meter, pause and resume, playback, and download as MP3, WAV or WebM. Free, no sign-up — recordings stay on your device.',
    keywords: [
      'voice recorder',
      'online voice recorder',
      'record audio online',
      'audio recorder',
      'record my voice',
    ],
    relatedTools: [
      'microphone-test',
      'audio-trimmer',
      'audio-converter',
      'screen-recorder',
      'text-to-speech',
    ],
    component: 'voice-recorder',
    howTo: [
      'Click “Start recording” and allow microphone access.',
      'Speak — watch the level meter — and pause or stop when you’re done.',
      'Play it back and download it in the format you need.',
    ],
    about: [
      'Recording uses your browser’s MediaRecorder with echo cancellation and noise suppression, producing Opus audio in WebM (Chrome, Firefox) or AAC in M4A (Safari). “Save as MP3” or “Save as WAV” converts the recording in your browser for apps that need those formats.',
      'For the best sound, keep the microphone 15–30 cm away, record in a quiet room with soft furnishings, and aim for the level meter to stay in the green without hitting red. Test your setup first with the Microphone Test.',
    ],
    faqs: [
      {
        q: 'Is my recording saved online?',
        a: 'No. It exists only in this tab until you download it — closing the page deletes it.',
      },
    ],
  },
  {
    slug: 'screen-recorder',
    category: 'audio-video-tools',
    name: 'Screen Recorder',
    icon: '🖥️',
    shortDescription: 'Record your screen, a window or a tab — with audio.',
    description:
      'Record your screen, an app window or a browser tab right in the browser, with tab or system audio and your microphone. A countdown, pause and resume, preview and download — no extension or software to install.',
    title: 'Online Screen Recorder – Record Screen with Audio (No Install)',
    metaDescription:
      'Record your screen online: full screen, a window or a tab, with system audio and microphone. Countdown, pause, preview and download. Free, no extension.',
    keywords: [
      'screen recorder',
      'online screen recorder',
      'record screen',
      'screen recording with audio',
      'record my screen',
    ],
    relatedTools: [
      'video-compressor',
      'video-to-gif',
      'voice-recorder',
      'webcam-test',
      'screen-resolution-checker',
    ],
    component: 'screen-recorder',
    popular: true,
    limitation:
      'Works in desktop browsers. Most phones don’t allow screen capture from a web page; use the phone’s built-in screen recording instead.',
    howTo: [
      'Choose whether to include system/tab audio and your microphone.',
      'Click “Choose screen and record”, pick a screen, window or tab, and wait for the 3-second countdown.',
      'Stop when you’re done (or use the browser’s Stop sharing bar), preview and download.',
    ],
    about: [
      'The browser’s screen-capture API asks you each time which screen, window or tab to share, so a page can never record without your permission. Recording a single tab captures its sound in Chrome and Edge; system audio for a whole screen is available on Windows and ChromeOS.',
      'Recordings are WebM (Chrome, Edge, Firefox) or MP4 (Safari) and stay in memory until you download them. To share a long recording, shrink it with the Video Compressor, or turn a short clip into a GIF.',
    ],
    faqs: [
      {
        q: 'Why is there no sound in my recording?',
        a: 'Tick “Share tab audio” or “Share system audio” in the browser’s sharing dialog. macOS doesn’t offer system audio to browsers; record a tab instead.',
      },
      {
        q: 'Is there a time limit?',
        a: 'No, but long recordings use a lot of memory — around 1–3 GB per hour depending on resolution.',
      },
    ],
  },
];
