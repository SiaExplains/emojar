import type { ToolDefinition } from '../types';

export const DEVICE_TESTS: ToolDefinition[] = [
  {
    slug: 'webcam-test',
    category: 'device-tests',
    name: 'Webcam Test',
    icon: '📷',
    shortDescription: 'Check your camera, resolution and frame rate.',
    description:
      'Test your webcam before a video call: see the live picture, the resolution and frame rate it delivers, switch between cameras and take a snapshot. Nothing is recorded or sent anywhere.',
    title: 'Webcam Test Online – Check Camera, Resolution & FPS',
    metaDescription:
      'Test your webcam online: live preview, real resolution and frame rate, camera switching and snapshot. Works on laptop and phone. Nothing is recorded or uploaded.',
    keywords: [
      'webcam test',
      'camera test',
      'test my webcam',
      'check camera online',
      'webcam resolution test',
    ],
    relatedTools: [
      'microphone-test',
      'qr-code-scanner',
      'video-to-gif',
      'color-picker',
    ],
    component: 'webcam-test',
    popular: true,
    howTo: [
      'Click “Start camera” and allow camera access.',
      'Check the picture, resolution and frame rate; switch cameras or mirror the view if needed.',
      'Optionally take a snapshot, then stop the camera.',
    ],
    about: [
      'The test uses your browser’s camera access to show the stream locally. The resolution shown is what the camera actually delivers to apps — often lower than the marketing figure in dim light.',
      'If the picture is black, another app (Zoom, Teams, OBS) may be using the camera, or access may be blocked in your browser or operating system privacy settings.',
    ],
    faqs: [
      {
        q: 'Is my video recorded?',
        a: 'No. The stream is displayed on this page only and stops when you click Stop or leave the page.',
      },
      {
        q: 'How do I allow camera access again after blocking it?',
        a: 'Click the camera or lock icon in the address bar and set Camera to Allow, then reload the page.',
      },
    ],
  },
  {
    slug: 'microphone-test',
    category: 'device-tests',
    name: 'Microphone Test',
    icon: '🎙️',
    shortDescription: 'Check your mic level and hear yourself back.',
    description:
      'Test your microphone online: watch the live input level, choose between microphones, and record a short clip to play back how you sound. The recording stays on your device.',
    title: 'Microphone Test Online – Check Mic Level & Record Playback',
    metaDescription:
      'Test your microphone online: live input level meter, device selection and a short record-and-playback check. Nothing is uploaded or stored.',
    keywords: [
      'mic test',
      'microphone test',
      'test my mic',
      'check microphone online',
      'mic check',
    ],
    relatedTools: ['webcam-test', 'text-to-speech', 'mp4-to-mp3'],
    component: 'microphone-test',
    popular: true,
    howTo: [
      'Click “Start test” and allow microphone access.',
      'Speak — the level meter should move into the green zone.',
      'Record a few seconds and play it back to hear how you sound.',
    ],
    about: [
      'The level meter shows the loudness of your microphone input in real time. Normal speech should reach the middle of the meter without hitting the red “clipping” zone.',
      'Browser echo cancellation and noise suppression are applied by default, just like in most video-call apps; you can turn them off to hear the raw microphone.',
    ],
    faqs: [
      {
        q: 'The meter doesn’t move — what now?',
        a: 'Check that the right microphone is selected, that it is not muted in hardware or in the operating system, and that no other app has exclusive access.',
      },
    ],
  },
];
