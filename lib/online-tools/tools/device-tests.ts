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
      'keyboard-tester',
      'qr-code-scanner',
      'video-to-gif',
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
    relatedTools: [
      'webcam-test',
      'keyboard-tester',
      'text-to-speech',
      'mp4-to-mp3',
    ],
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
  {
    slug: 'keyboard-tester',
    category: 'device-tests',
    name: 'Keyboard Tester',
    icon: '⌨️',
    shortDescription: 'Check every key, ghosting and key rollover.',
    description:
      'Test your keyboard online: press each key and watch it light up on a full-size on-screen keyboard (US layout; extra ISO, JIS and media keys are detected too). Find keys that don’t register, see the key name and code, and check how many keys work at once (rollover and ghosting). Works with laptop, desktop and gaming keyboards.',
    title: 'Keyboard Tester – Check Every Key, Ghosting & Rollover Online',
    metaDescription:
      'Free online keyboard tester: press keys to see them light up, find dead keys, read key codes and test rollover and ghosting. Works for laptop and mechanical keyboards.',
    keywords: [
      'keyboard tester',
      'keyboard test',
      'key tester',
      'test my keyboard',
      'keyboard ghosting test',
    ],
    relatedTools: [
      'screen-resolution-checker',
      'dead-pixel-test',
      'webcam-test',
      'microphone-test',
      'what-is-my-browser',
    ],
    component: 'keyboard-tester',
    popular: true,
    howTo: [
      'Click the keyboard area so it has focus.',
      'Press each key — it turns blue while held and green once it has worked.',
      'Hold several keys at once to check rollover, then press Reset to start over.',
    ],
    about: [
      'Each press is matched by its physical position (the KeyboardEvent code, such as KeyA or ShiftRight), so the test works with any language layout: on an AZERTY or QWERTZ keyboard the key in the A position still lights up the A position. The panel also shows the character the key produced, its legacy keyCode, whether it is the left or right copy of a key, active modifiers and whether the press is an auto-repeat.',
      '“Most keys at once” is your keyboard’s rollover. Many cheap keyboards only register two or three keys in some combinations — that is ghosting or blocking — while gaming keyboards often handle six or more (“6KRO” or “NKRO”). Some keys never reach a web page at all: the Fn key and shortcuts the operating system keeps for itself, such as Win + L or ⌘ + Tab.',
    ],
    faqs: [
      {
        q: 'Why doesn’t the Fn key light up?',
        a: 'Fn is handled inside the keyboard itself and never sends a key to the computer, so no website can detect it. Press Fn together with another key instead — the result (for example volume or brightness) may show up as an extra key.',
      },
      {
        q: 'A key does nothing here — is it broken?',
        a: 'Check another app first. If the key fails everywhere, clean under the keycap or test the keyboard on another computer. If it works elsewhere, a program or the operating system may be capturing it.',
      },
      {
        q: 'Does the tester record what I type?',
        a: 'No. Key presses are shown on this page only and are not stored or sent anywhere.',
      },
    ],
  },
  {
    slug: 'screen-resolution-checker',
    category: 'device-tests',
    name: 'Screen Resolution Checker',
    icon: '🖥️',
    shortDescription:
      'What is my screen resolution, viewport and refresh rate?',
    description:
      'See your screen resolution instantly, plus the physical pixel count, device pixel ratio, aspect ratio, browser window size, estimated refresh rate (Hz), colour depth and HDR support. Values update live when you resize the window or rotate your phone.',
    title: 'What Is My Screen Resolution? Screen Size & Refresh Rate Checker',
    metaDescription:
      'Check your screen resolution, physical pixels, pixel ratio, viewport size, aspect ratio and refresh rate (Hz) instantly, with live updates as you resize or rotate.',
    keywords: [
      'what is my screen resolution',
      'screen resolution checker',
      'my screen size',
      'viewport size',
      'refresh rate test',
    ],
    relatedTools: [
      'dead-pixel-test',
      'aspect-ratio-calculator',
      'what-is-my-browser',
      'keyboard-tester',
      'image-resizer',
    ],
    component: 'screen-info',
    popular: true,
    howTo: [
      'Open the page — your resolution is shown at the top straight away.',
      'Resize the window or rotate your device to watch the viewport values update.',
      'Click “Copy all details” to paste the information into a support request.',
    ],
    about: [
      'Websites see your screen in CSS pixels, which are scaled by your operating system’s display scaling and by browser zoom. A 4K laptop panel at 200 % scaling therefore reports 1920 × 1080; multiplying by the device pixel ratio gives the physical pixels, which is usually the panel’s native resolution. At 100 % browser zoom (Ctrl/⌘ + 0) the estimate is most accurate.',
      'The viewport is the part of the browser window that shows the page — the size that matters for responsive web design. The refresh rate is estimated from the browser’s animation frames and rounded to common values such as 60, 120 or 144 Hz; battery saver, background tabs and some browsers cap animations, so a 120 Hz screen can measure as 60 Hz.',
    ],
    faqs: [
      {
        q: 'Why is the resolution lower than my monitor’s specification?',
        a: 'Display scaling makes everything bigger and reduces the number of CSS pixels the browser reports. Check the “Physical pixels” row, or set scaling to 100 % in your system settings.',
      },
      {
        q: 'Why does my 144 Hz monitor show 60 Hz?',
        a: 'Make sure the monitor is set to 144 Hz in your display settings, the cable supports it, and the browser window is on that monitor. Some browsers also limit animations to 60 fps when on battery.',
      },
      {
        q: 'Can a website see my physical screen size in inches?',
        a: 'No. Browsers don’t expose the physical size of the display, only pixel counts, so inches can’t be measured from a web page.',
      },
    ],
  },
  {
    slug: 'dead-pixel-test',
    category: 'device-tests',
    name: 'Dead Pixel Test',
    icon: '🟥',
    shortDescription: 'Full-screen colours to find dead and stuck pixels.',
    description:
      'Find dead and stuck pixels on any monitor, laptop, TV or phone: the screen fills with solid black, white, red, green, blue and more, one colour at a time, so faulty pixels stand out. Includes an optional stuck-pixel fixer.',
    title: 'Dead Pixel Test – Find Dead & Stuck Pixels (Full-Screen Colours)',
    metaDescription:
      'Free dead pixel test: full-screen black, white, red, green, blue and more to spot dead and stuck pixels on monitors, laptops, TVs and phones. Optional stuck-pixel fixer.',
    keywords: [
      'dead pixel test',
      'dead pixel checker',
      'stuck pixel test',
      'stuck pixel fixer',
      'monitor test',
    ],
    relatedTools: [
      'screen-resolution-checker',
      'keyboard-tester',
      'webcam-test',
      'color-picker',
      'contrast-checker',
    ],
    component: 'dead-pixel',
    howTo: [
      'Clean the screen, then click “Start full-screen test”.',
      'Look over the whole screen for dots that don’t match the colour; click or press Space or → for the next colour, ← to go back.',
      'Press Esc to exit. If you found a coloured stuck pixel, you can try the optional fixer.',
    ],
    about: [
      'A dead pixel never lights up, so it shows as a black dot on white and bright colours. A stuck pixel has one or more sub-pixels stuck on, so it shows as a red, green, blue or white dot on black or on the other colours. Checking each colour in full screen makes both easy to see; a magnifying glass or your phone’s camera zoom helps on high-resolution screens.',
      'Stuck pixels sometimes recover when flashed with rapidly changing colours for 10–20 minutes — that is what the optional fixer does (about 10 colour changes per second, with a running timer), after a photosensitivity warning. Dead pixels are a hardware fault and usually cannot be repaired; check the manufacturer’s pixel policy (often based on ISO 9241-307 classes), because many warranties replace a screen only above a certain number of faulty pixels.',
    ],
    faqs: [
      {
        q: 'How do I test a new monitor for dead pixels?',
        a: 'Run this test within the return period, in a dim room, at the monitor’s native resolution. Look at each colour from normal viewing distance and then up close.',
      },
      {
        q: 'Is it a dead pixel or dust?',
        a: 'Dust usually looks blurry and moves when you wipe the screen; a dead or stuck pixel is a sharp dot that stays in the same place on every colour.',
      },
      {
        q: 'Does the test work on phones and TVs?',
        a: 'Yes — open the page in the device’s browser. Phones that don’t support full screen still show the colour across the whole visible page.',
      },
    ],
  },
  {
    slug: 'what-is-my-browser',
    category: 'device-tests',
    alsoIn: ['developer-tools'],
    name: 'What Is My Browser',
    icon: '🧭',
    shortDescription: 'Your browser, version, OS and user agent.',
    description:
      'See which browser and version you are using, your operating system, device type, user agent string, languages, time zone, screen and graphics card, and which web features your browser supports — with one-click copy for support tickets.',
    title: 'What Is My Browser? Browser Version, OS & User Agent Checker',
    metaDescription:
      'See your browser name and version, operating system, device, user agent string, GPU and supported features. Copy a full report for support — nothing is sent anywhere.',
    keywords: [
      'what is my browser',
      'what browser am i using',
      'browser version check',
      'my browser info',
      'what version of chrome do i have',
    ],
    relatedTools: [
      'screen-resolution-checker',
      'keyboard-tester',
      'webcam-test',
      'timezone-converter',
      'jwt-decoder',
    ],
    component: 'browser-info',
    popular: true,
    howTo: [
      'Open the page — your browser and operating system are shown at the top.',
      'Scroll for the user agent string, device details and supported features.',
      'Click “Copy full report” to paste everything into a support ticket or bug report.',
    ],
    about: [
      'Browsers describe themselves to websites with a user agent string, but modern browsers deliberately simplify it for privacy: Chrome and Edge report Windows 11 as “Windows NT 10.0”, and Safari always reports macOS 10.15.7. Where your browser supports User-Agent Client Hints, this page asks the browser directly for the exact version, operating system version, architecture and device model.',
      'Everything shown is read by the page in your browser and is never sent to a server. It is the same information any website can read, which is why it is useful to check what you are sharing — and why support teams ask for it when something doesn’t work.',
    ],
    faqs: [
      {
        q: 'How do I update my browser?',
        a: 'In Chrome and Edge open Settings → About; in Firefox open Settings → General → Firefox updates; Safari updates with macOS or iOS through Software Update.',
      },
      {
        q: 'Why does it say Windows 10 when I have Windows 11?',
        a: 'The user agent string cannot tell Windows 10 and 11 apart. Chromium browsers (Chrome, Edge, Opera) report the real version through Client Hints and this page uses it; Firefox does not, so it shows “10 or 11”.',
      },
      {
        q: 'Can websites identify me from this information?',
        a: 'On its own, rarely — but combined with other signals it can contribute to “fingerprinting”. Browsers such as Firefox, Safari and Brave reduce or randomise some of these values to make that harder.',
      },
    ],
    variants: [
      {
        slug: 'what-is-my-user-agent',
        name: 'What Is My User Agent',
        title: 'What Is My User Agent? See & Copy Your User Agent String',
        metaDescription:
          'See your browser’s user agent string and copy it in one click, with the browser, version, operating system and device it describes. Free, nothing is sent anywhere.',
        description:
          'Your user agent string is shown below, ready to copy — together with what it means: browser and version, rendering engine, operating system and device type.',
        config: { init_focus: 'user-agent' },
        keywords: [
          'what is my user agent',
          'my user agent',
          'user agent string',
          'user agent checker',
        ],
      },
    ],
  },
];
