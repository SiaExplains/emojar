# Device QA Checklist — Media, Timer and Flag Tools

Run this on real hardware before a release that touches these tools. Use the production or preview URL (HTTPS is required for camera, microphone and screen capture; `localhost` is fine only on the dev machine). Open each tool in a fresh tab (ideally a private window, so earlier permission decisions don't hide the prompts), allow camera/microphone/notification access when asked, and keep the device volume up and the iPhone silent switch off (it mutes Web Audio). Tick each step, then fill in the results table with Pass, Fail or N/A. Paths below are relative to the site root.

## Results

| Device / browser | Webcam | Mic test | Voice rec | Screen rec | Video comp | Morse | Alarm | Timer / Countdown / Pomodoro | Flags | Video trim | Touch & export |
| ---------------- | ------ | -------- | --------- | ---------- | ---------- | ----- | ----- | ---------------------------- | ----- | ---------- | -------------- |
| macOS Safari     |        |          |           |            |            |       |       |                              |       |            |                |
| macOS Chrome     |        |          |           |            |            |       |       |                              |       |            |                |
| Windows Edge     |        |          |           |            |            |       |       |                              |       |            |                |
| Windows Chrome   |        |          |           |            |            |       |       |                              |       |            |                |
| Android Chrome   |        |          |           |            |            |       |       |                              |       |            |                |
| iOS Safari       |        |          |           |            |            |       |       |                              |       |            |                |

Browser versions tested: \_\_\_\_\_\_\_\_\_\_ Date: \_\_\_\_\_\_\_\_\_\_

---

## 1. Webcam Test

**URL:** `/online-tool/device-tests/webcam-test`
**Prerequisites:** a camera (phones: front and back). Close Zoom/Teams/OBS.

- [ ] Load the page. Expected: dark preview box with "Camera is off" and a "📷 Start camera" button.
- [ ] Click "📷 Start camera" and allow access. Expected: live, mirrored picture; info rows for Camera, Resolution, Frame rate (measured), Aspect ratio. Frame rate shows "measuring…" briefly, then a number.
- [ ] Untick "Mirror view". Expected: preview flips to unmirrored.
- [ ] On devices with more than one camera (phones, Mac with iPhone Continuity), use the "Camera" dropdown. Expected: stream switches; labels are real names, not "Camera 1". If only one camera exists, no dropdown is shown.
- [ ] Cover the lens or dim the room. Expected: if fps drops below 15, an amber "The frame rate is low…" notice appears.
- [ ] Click "Take snapshot", then "⬇ Download snapshot". Expected: thumbnail appears; `webcam-snapshot.png` downloads and matches the mirror setting. iOS: file goes to Files/Downloads or opens a share sheet.
- [ ] Click "Stop camera". Expected: preview goes back to "Camera is off"; the OS camera indicator (green dot / LED) turns off.
- [ ] Block camera permission in the address bar and click "Start camera" again. Expected: red error "Camera access was blocked. Click the icon in the address bar…".
- [ ] Start the camera in another app first (Windows especially), then here. Expected: "The camera is in use by another app…" error (macOS often allows sharing, so it may simply work).

## 2. Microphone Test

**URL:** `/online-tool/device-tests/microphone-test`
**Prerequisites:** a microphone; headphones help avoid feedback.

- [ ] Click "🎙️ Start test" and allow access. Expected: "Input level" bar, zone label, Stop button, echo-cancellation checkbox (ticked), "Device: <name>".
- [ ] Stay silent, then speak normally, then shout close to the mic. Expected: label goes "Silent / very quiet" → "Quiet"/"Good level" → "Too loud (clipping)"; the black peak marker follows the loudest point and slowly falls back.
- [ ] Untick "Echo cancellation & noise suppression…". Expected: stream restarts within a second, meter keeps working (background noise usually rises).
- [ ] If several mics exist, use the "Microphone" dropdown. Expected: device line updates to the chosen mic. (iOS usually lists one built-in mic.)
- [ ] Click "⏺ Record 5 seconds". Expected: button reads "● Recording 5 s…" and is disabled; after 5 s an audio player appears under "Your recording (stays on this device)" and plays back your voice.
- [ ] Click "Stop". Expected: back to "🎙️ Start test"; OS mic indicator turns off.
- [ ] Deny permission and start again. Expected: "Microphone access was blocked…" error.

## 3. Voice Recorder

**URL:** `/online-tool/audio-video-tools/voice-recorder`
**Prerequisites:** a microphone.

- [ ] Click "● Start recording" and allow access. Expected: timer counts from 0:00; green level bar moves when you speak (red when very loud); "Pause" and "■ Stop" buttons appear.
- [ ] Record ~10 s, click "Pause", wait 5 s, click "Resume", record ~5 s more. Expected: timer freezes while paused (the level bar may keep moving) and continues from the paused value.
- [ ] Click "■ Stop". Expected: green panel with an audio player; playback is ~15 s with no audio from the paused gap.
- [ ] Click "Download (…)". Expected: file `recording-YYYY-MM-DD-HH-MM-SS.<ext>`; ext is WEBM on Chrome/Edge/Android, M4A on Safari/iOS. Size in the label matches the file.
- [ ] Click "Save as MP3". Expected: `.mp3` downloads after a short wait, plays in the OS player at normal speed and pitch.
- [ ] Click "Save as WAV". Expected: `.wav` downloads and plays; noticeably larger than the MP3.
- [ ] Record a long take (~5 min) and export MP3. Expected: completes without freezing the tab (slower on phones is fine).
- [ ] iOS/Android: lock the screen mid-recording for 10 s. Expected: note the result — recording may stop or contain a gap; the page must not crash.

## 4. Screen Recorder

**URL:** `/online-tool/audio-video-tools/screen-recorder`
**Prerequisites:** desktop only; a mic for the mixing step; a tab or video playing sound.

**Android Chrome and iOS Safari: N/A.** Expected instead: amber notice "Screen recording isn't available in this browser… use the phone's built-in screen recorder instead." and the "● Choose screen and record" button is disabled. Confirm this, then skip the rest.

- [ ] Leave "Record system / tab audio (when offered)" ticked and "Add my microphone" unticked. Click "● Choose screen and record". Expected: browser share picker opens.
- [ ] Pick a Chrome tab playing audio (tick "Share tab audio"). Expected: big display shows "3…", "2…", "1…", then the timer runs; "Pause" and "■ Stop" appear.
- [ ] Pause for 5 s, then Resume. Expected: timer freezes and resumes; the final video has no paused section.
- [ ] Click "■ Stop". Expected: green panel with a video player and "Download (WEBM, …)" on Chrome/Edge, "Download (MP4, …)" on Safari. File name `screen-recording-<timestamp>.<ext>`. Video plays with the tab sound.
- [ ] Start again and stop sharing using the browser's own "Stop sharing" bar. Expected: recording finishes cleanly and the download panel appears.
- [ ] Mic mixing: tick "Add my microphone", start, choose a tab with sound, talk while it plays. Expected: a mic prompt appears after the share picker; the recording contains both tab audio and your voice. **macOS Safari: check carefully that your voice is actually audible** (see Notes).
- [ ] Mic mixing, mic denied: block mic access and start. Expected: recording continues without mic. (Code also sets a "…Recording without it." message — record whether it stays visible.)
- [ ] Whole screen on Windows with system audio. Expected: "Share system audio" offered and audible in the result. macOS: no system audio for whole screen (only Chrome tab audio); Safari: no audio capture — video only.
- [ ] Cancel the share picker. Expected: no error message, button returns to ready.
- [ ] MP3/WAV export: **N/A** — the Screen Recorder only offers the WebM/MP4 download. (MP3/WAV export is in the Voice Recorder, section 3.)

## 5. Video Compressor

**URL:** `/online-tool/audio-video-tools/video-compressor`
**Prerequisites:** a short MP4 (H.264, with audio, ~30–100 MB), a phone-recorded MOV/HEVC clip, and a WebM.

- [ ] Load the page. Expected: no amber WebCodecs notice on current Chrome, Edge, Safari 16.4+ (incl. iOS 16.4+). If the notice appears, the "Compress video" button is disabled — record browser version.
- [ ] Drop/select the MP4. Expected: "<name> · <size>" line, Quality (default Balanced), Max resolution (default 720p), Format (default MP4), "Remove audio" checkbox.
- [ ] Click "Compress video". Expected: button shows "Compressing… N %" with a progress bar and a "Cancel" button; finishes with "X MB → Y MB (Z % smaller)", side-by-side Original and Compressed players.
- [ ] Play the compressed video. Expected: picture and sound in sync, at 720p.
- [ ] Click "Download compressed video". Expected: `<name>-compressed.mp4` downloads and plays in the OS player (QuickTime / Films & TV / Photos).
- [ ] Repeat with Format "WebM (VP9 + Opus)". Expected: `.webm` output plays in the browser (not in QuickTime — that's normal).
- [ ] Repeat with "Remove audio" ticked. Expected: output has no sound track.
- [ ] Start a long compression and click "Cancel". Expected: progress stops, no error message, button returns to "Compress video".
- [ ] Compress the iPhone MOV/HEVC clip. Expected: works on Safari and on Windows/Android devices with HEVC decoding; otherwise a readable error "This video could not be compressed…", not a frozen tab.
- [ ] Phones: compress a 1–2 min clip. Expected: completes; tab doesn't reload from memory pressure (record if it does).

## 6. Morse Code Converter (audio)

**URL:** `/online-tool/text-tools/morse-code-converter`
**Prerequisites:** sound on (iOS: silent switch off).

- [ ] Load the page. Expected: "SOS Hello World" in Text, Morse in the output, "Listen and see" section with dots/dashes, Speed (18 WPM) and Tone (600 Hz) sliders.
- [ ] Click "▶ Play". Expected: tone plays without clicks; status reads "Playing…"; button changes to "▶ Restart"; Pause and Stop become enabled.
- [ ] Click "❚❚ Pause" mid-way, wait, then "▶ Resume". Expected: sound stops instantly, status "Paused"; resumes from the same spot.
- [ ] Click "■ Stop". Expected: silence, status returns to the PARIS-standard hint, Pause/Stop disabled.
- [ ] Set Speed to 5 WPM, Play; then 40 WPM, Play. Expected: clearly slower / faster. Note: moving the slider during playback only applies after "▶ Restart".
- [ ] Change Tone to 300 Hz and 1000 Hz and play. Expected: pitch changes.
- [ ] Let a full playback finish. Expected: controls reset to "▶ Play" automatically.
- [ ] Paste `.... .. ` into the input. Expected: auto-detects Morse, output "HI", Play plays the pasted code.
- [ ] Switch to another tab during playback (desktop). Expected: audio keeps playing to the end.

## 7. Alarm Clock (background tab)

**URL:** `/online-tool/date-time-tools/alarm-clock`
**Prerequisites:** sound on; device plugged in; screen-lock timeout raised on phones.

- [ ] Load the page. Expected: large live clock, date, "Set an alarm" form, amber "Keep this tab open…" notice.
- [ ] Click "▶ Test sound" for each Sound option. Expected: ~1 s of each sound.
- [ ] Tick "Also show a notification", set Time to 2 minutes from now, click "Add alarm". Expected: notification permission prompt (desktop, Android); alarm appears in the list with "rings in 2 min"; header shows "next alarm in …". iOS Safari (not installed as PWA): no prompt — notifications N/A.
- [ ] Switch to another tab (desktop) or app (phone, screen on) and wait. Expected (desktop): sound plays on time and a system notification "Alarm — It's HH:MM" appears; returning shows the red "⏰ Alarm — HH:MM" banner with Stop / Snooze 5 min / Snooze 10 min. Phones: record whether it rings while the browser is in the background — iOS usually won't; Android may not. **Android Chrome: no system notification expected** (see Notes); check the console for an error.
- [ ] Click "Snooze 5 min". Expected: banner closes; alarm rings again ~5 min later.
- [ ] Click "Stop". Expected: sound stops; a one-off alarm is now switched off ("On" unticked).
- [ ] Add a repeating alarm (tick today's day). Expected: list shows the day name; after ringing it stays On.
- [ ] Reload the page. Expected: alarms are still listed (saved in this browser).
- [ ] After a reload, do NOT click anything, switch tabs and let an alarm fire. Expected: banner/notification appear; sound may be silent because audio was never unlocked — record result per browser (the notice tells users to click "Test sound" first).
- [ ] Lock the phone screen during an alarm wait. Expected: likely no ring (no Wake Lock is used) — record behaviour.

## 8. Timer / Countdown / Pomodoro (background tab)

**URLs:**

- Timer: `/online-tool/date-time-tools/online-timer`
- Pomodoro: `/online-tool/date-time-tools/pomodoro-timer`
- Countdown to a date: `/online-tool/date-time-tools/countdown-generator`

**Prerequisites:** sound on.

Timer:

- [ ] Click the "1 min" preset, then "Start". Expected: notification permission prompt (desktop/Android); ring animates; tab title becomes "⏲ 0:59…"; "+1 min" button visible.
- [ ] Press Space. Expected: pauses ("Resume" shown); Space again resumes.
- [ ] Start a 1 min timer and switch to another tab. Expected: the tab title keeps counting down; at zero a beep plays and a "Timer finished — Your countdown has ended." notification shows (desktop). Back on the tab: time in red, pulsing, with a "Dismiss" button. The title reverts to the normal page title (no flashing).
- [ ] Repeat with a 6+ minute timer left in the background (Chrome throttles hidden tabs after 5 min). Expected: finishes within about a minute of the target; note the delay.
- [ ] Android Chrome / iOS Safari: same test. Expected: no notification (unsupported there); beep may be silent until you return to the tab; time is still correct on return.
- [ ] Click "⛶ Full screen" (desktop, Android). Expected: timer fills the screen; "Exit full screen" returns. iOS Safari: button hidden.

Pomodoro:

- [ ] Set Focus to 1 and Short break to 1, click "Start", switch tabs. Expected: tab title "🍅 0:59…"; at zero, beep + notification "Focus finished — Time for: short break."; returning shows the "Short break" phase selected and ready (does not auto-start).
- [ ] Start the break and let it finish. Expected: notification "Short break finished — Time for: focus."; round text becomes "Round 2 · Focus".
- [ ] After the 4th focus round. Expected: next phase is "Long break".

Countdown to a date:

- [ ] Set "Date and time" 2 minutes ahead, switch tabs, come back after it passes. Expected: header reads "<name> started", numbers count up with "ago ·". No sound or notification (by design).
- [ ] Click "Copy link", open it in another browser. Expected: same event name and target time.

## 9. Flag Explorer (Windows fallback)

**URL:** `/online-tool/reference-tools/flag-explorer`
**Prerequisites:** none.

- [ ] macOS, iOS, Android: load the page. Expected: grid of flag emoji with country name and ISO code.
- [ ] Windows Edge and Chrome: load the page. Expected: tiles show the ISO code instead of a flag; an amber note says the system shows flag emoji as two letters, so the quiz is turned off. Layout must not break (codes fit the tile, no tofu boxes).
- [ ] Search "Oslo", "KR" and "Brazil". Expected: Norway, South Korea, Brazil respectively; result count updates.
- [ ] Switch View to "☰ Compact list". Expected: table with Flag (letters on Windows), Country, Capital, ISO-2, ISO-3, Calling, Continent; scrolls horizontally on phones.
- [ ] Click a country. Expected: detail dialog opens; closes with Esc or the close button.
- [ ] Windows: hover "🎯 Quiz me". Expected: the button is disabled with the tooltip "Your system can’t display flag emoji".
- [ ] macOS, iOS, Android: click "🎯 Quiz me". Expected: 10 questions with four options each, score shown, "Back to the flags" at the end.
- [ ] Filter Continent then Region. Expected: Region options narrow to that continent; grid filters.

---

## 10. Video Trimmer

**URL:** `/online-tool/audio-video-tools/video-trimmer`
**Prerequisites:** a short MP4 (H.264, with audio), an iPhone MOV/HEVC clip, and a WebM made with the Screen Recorder.

- [ ] Load the page. Expected: no amber WebCodecs notice on current Chrome, Edge, Safari 17+ or Firefox 130+.
- [ ] Choose the MP4. Expected: the video preview plus Start and End sliders, time fields and "Clip: 0:00.0 → … " line.
- [ ] Set Start ≈ 2 s and End ≈ 6 s, Cut mode "Fast", click "✂️ Trim video". Expected: progress, then "Trimmed clip ready" with a player; the clip plays with sound and is about 4 s (it may start a little earlier, at a keyframe).
- [ ] Switch to "Precise" and trim again. Expected: the clip is 4.0 s and starts exactly at the start time.
- [ ] Trim the Screen Recorder WebM in Fast mode. Expected: the sliders appear (its length is read from the file), and an amber note explains if the cut starts more than 0.5 s early.
- [ ] Trim the iPhone MOV. Expected: works on Safari and on devices that decode HEVC; otherwise a readable error, never a blank result or frozen tab.
- [ ] Start a long precise trim and click "Cancel". Expected: progress stops with no error message.
- [ ] Click "⬇ Download clip". Expected: `<name>-trimmed.<ext>` downloads and plays in the OS player (WebM may only play in a browser — that's normal).

---

## 11. Interactive tools: touch and exports

**URLs:** `/online-tool/productivity-tools/kanban-board`, `/online-tool/productivity-tools/eisenhower-matrix`, `/online-tool/image-tools/pixel-art-editor`, `/online-tool/developer-tools/svg-path-editor`, `/online-tool/developer-tools/clip-path-generator`, `/online-tool/color-tools/gradient-mesh-generator`, `/online-tool/color-tools/color-blindness-simulator`, `/online-tool/productivity-tools/timeline-maker`
**Prerequisites:** phones and tablets for the touch steps; any device for the downloads.

- [ ] Kanban Board: drag a card by its ⠿ handle to another column with a finger. Expected: the card moves and the board scrolls sideways near the edge; the page doesn't scroll instead.
- [ ] Kanban Board: use the card's "Move to…" menu and ↑ ↓ buttons. Expected: same result without dragging. Reload: the card is still there.
- [ ] Eisenhower Matrix: drag a task between quadrants with a finger, then with "Move to…". Expected: both work; quadrants stack on a phone.
- [ ] Pixel Art Editor: draw a fast diagonal stroke with a finger. Expected: no gaps, and the page doesn't scroll while drawing.
- [ ] Pixel Art Editor: export "⬇ PNG", "⬇ SVG", "⬇ Sprite sheet" and "⬇ Animated GIF" with two frames. Expected: each file downloads (iOS: opens the share sheet or Files) and opens; the GIF animates with a transparent background.
- [ ] SVG Path Editor and Clip-Path Generator: drag points with a finger. Expected: points follow the finger; the page doesn't scroll. Pinch on the SVG Path Editor canvas zooms it.
- [ ] Mesh Gradient Generator: drag a point, then "Download SVG" and "⬇ Download PNG" at 1920×1080. Expected: both download; the PNG matches the preview.
- [ ] Color Blindness Simulator: choose a photo from the camera roll, switch Vision type, then "⬇ Download simulated PNG". Expected: the photo is processed (no upload), and the PNG downloads.
- [ ] Timeline Maker: "⬇ Download SVG" and "⬇ Download PNG". Expected: both open and match the preview; text uses the system font.

---

## Reporting a failure

For each Fail, note:

- Device model, OS and version (e.g. Windows 11 23H2, iOS 18.1).
- Browser and exact version (Chrome: `chrome://version`, Safari: Safari → About).
- Tool URL, the step that failed, expected vs. actual.
- Screenshot or screen recording of the page.
- Console screenshot: desktop DevTools (F12 / ⌥⌘I) → Console; Android via `chrome://inspect` on a desktop; iOS via Safari Web Inspector on a Mac (Settings → Safari → Advanced → Web Inspector).
- Permission state (address-bar icon / site settings) and whether it was a private window.

## Notes from the code (things to watch)

Fixed in v0.13.0, but worth re-checking on real devices:

- The Screen Recorder resumes its mic-mixing `AudioContext` after the share picker closes and shows a warning when the microphone can't be added (Safari could otherwise record a silent mic).
- Timer/Pomodoro unlock their `AudioContext` on the Start click, so the finish beep should play on Safari/iOS.
- The Alarm Clock wraps `new Notification()` in a try/catch (Android Chrome throws on that constructor); the on-page alarm still rings.
- Still open: no tool uses the Wake Lock API, so a phone that sleeps will pause alarms and timers.
