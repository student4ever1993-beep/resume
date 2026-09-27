# 3D AI Avatar

The site's AI assistant is presented as an interactive 3D robot. It floats in the bottom
corner (bottom-left in Arabic) and expands into a voice-first assistant when clicked. The
conversation logic (system prompt, Groq models, offline fallback answers) is unchanged; the
avatar is only the visual and voice layer.

```
ChatWidget (UI)  ──handleSend()──▶  useAssistantChat  ──▶  /api/groq  (existing AI agent)
      │                                                         │
      │◀────────────────────── reply text ─────────────────────┘
      ├──▶ SpeechOutput ──▶ /api/tts ──▶ audio ──▶ Web Audio AnalyserNode
      │                                                   │ loudness + spectrum
      └──▶ AvatarDriver (state) ──▶ AvatarBrain ──▶ AvatarPose ──▶ AvatarRig (robot or GLB)
```

## Files

| File | Purpose |
|---|---|
| `src/components/ChatWidget.tsx` | Avatar UI: floating launcher, expanded stage, caption/transcript, mic, mute, stop. Same default export `App.tsx` already used. |
| `src/assistant/useAssistantChat.ts` | The existing chat logic, moved unchanged out of the old widget. `handleSend` now returns the reply. |
| `src/avatar/AvatarCanvas.tsx` | Lazy-loaded React wrapper around the WebGL scene. |
| `src/avatar/AvatarScene.ts` | Renderer, lights, camera framing, throttled render loop. |
| `src/avatar/AvatarBrain.ts` | Behaviour: blinking, saccades, pointer-following, breathing, head motion, gestures (wave, nod, explain, hand-to-chin), expressions and state lights. |
| `src/avatar/ProceduralRobot.ts` | Built-in robot (no asset download). The face is drawn by a shader. |
| `src/avatar/GLBAvatar.ts` | Adapter for custom `.glb` avatars (morph targets and bones). |
| `src/avatar/speech.ts` | TTS playback, lip-sync analysis and browser-voice fallback. |
| `src/avatar/useSpeechRecognition.ts` | Microphone input using the Web Speech API. |
| `src/avatar/config.ts` | Model URL, TTS endpoint and timeout. |
| `api/tts.js` | Vercel function: text → audio (Gemini / Groq / OpenAI). |
| `vite.config.ts` | The dev server now also runs `api/*.js` functions (`/api/tts`, `/api/gemini`) the same way Vercel does. |

No new npm dependencies. Everything uses the existing `three` package (GLTFLoader and the
meshopt decoder ship inside it).

## Avatar states

| State | When | What the avatar does |
|---|---|---|
| idle | nothing happening | breathing, blinking, eyes and head follow the pointer, small wander |
| listening | microphone on, or the user is typing | leans in, tilts head, wider eyes, teal lights |
| thinking | waiting for the AI, or preparing the voice | looks up and to the side, hand to chin, "…" on the visor, violet lights |
| speaking | audio playing | mouth driven by the audio, nodding, explaining gestures, gold lights |

On first open it waves and speaks the greeting. After each message it gives a small nod.

## Environment variables

| Variable | Where | Default | Notes |
|---|---|---|---|
| `TTS_PROVIDER` | server | `gemini` | `gemini`, `groq` or `openai` |
| `GEMINI_API_KEY` | server | – | already used by `/api/gemini` |
| `GEMINI_TTS_MODEL` | server | `gemini-2.5-flash-preview-tts` | |
| `GROQ_API_KEY` | server | – | already used by `/api/groq` |
| `OPENAI_API_KEY`, `OPENAI_TTS_MODEL` | server | –, `gpt-4o-mini-tts` | only for `TTS_PROVIDER=openai` |
| `TTS_VOICE` | server | provider default | e.g. `Kore` (Gemini), `hannah` / `fahad` (Groq), `alloy` (OpenAI) |
| `VITE_AVATAR_MODEL_URL` | build time | empty | custom `.glb` path; empty uses the built-in robot |

Set the server variables in Vercel → Project → Settings → Environment Variables as well as in `.env`.

> **Quota note:** the Gemini free tier allows only a handful of TTS requests (the current key
> hit `limit: 10` during testing). When the quota runs out, the avatar automatically switches
> to the browser's built-in voice with simulated lip movement, and the text is always shown.
> For production, enable billing on the Gemini key, or switch to Groq (see below).

## Run locally

```bash
npm install
cp .env.example .env   # add GROQ_API_KEY and GEMINI_API_KEY
npm run dev            # http://localhost:5173
```

Click the robot in the bottom-right corner. Microphone input needs Chrome, Edge or Safari,
on `localhost` or HTTPS. In other browsers the mic button is hidden and typing works as before.

## Replace the avatar model

1. Build or download a humanoid in Blender (or with Avaturn, Mixamo, Character Creator, etc.).
2. For lip sync and blinking, give the face mesh **shape keys** with ARKit names
   (`jawOpen`, `eyeBlinkLeft`, `eyeBlinkRight`, `mouthSmileLeft`, `mouthSmileRight`, `mouthFunnel`, …)
   or Oculus visemes (`viseme_aa`, `viseme_E`, `viseme_O`, …). Missing ones are skipped.
3. Name the bones `Head`, `Neck` and `Spine` (Mixamo `mixamorig:` prefixes work). Eye bones
   `LeftEye` and `RightEye` are optional.
4. Optional: add an animation named `Idle`. It loops, and the head/neck are layered on top procedurally.
5. Export as glTF Binary (`.glb`) with shape keys and animations on, then compress:
   ```bash
   npx gltfpack -i avatar.glb -o public/models/avatar.glb -cc   # meshopt compression
   ```
   Keep it under about 3 MB, and resize textures to 1024 px or less before exporting. (Don't use
   `-tc`: KTX2 textures would also need a KTX2Loader, which isn't set up.) It downloads only after the page has loaded.
6. Set `VITE_AVATAR_MODEL_URL=/models/avatar.glb` and rebuild.

If the model fails to load, the built-in robot stays. Camera framing is worked out from the
`Head` bone. To adjust it, edit `computeFraming()` in `src/avatar/GLBAvatar.ts`. To change the
built-in robot's look, edit the materials in `src/avatar/ProceduralRobot.ts`.

## Change the TTS provider

- **Switch between the built-in providers:** set `TTS_PROVIDER` (and `TTS_VOICE`) and redeploy.
  - `groq`: Orpheus voices for English and Saudi Arabic, low latency. An org admin must
    accept the model terms once in the Groq console (playground → `canopylabs/orpheus-v1-english`
    and `canopylabs/orpheus-arabic-saudi`).
  - `openai`: needs `OPENAI_API_KEY`.
- **Add a new provider** (ElevenLabs, Azure, …): add a function to `api/tts.js` that takes
  `(text, lang)` and returns `{ audio: Buffer, contentType }`, then register it in `providers`.
  The client plays any audio format the browser can decode, and the lip sync works from the
  audio itself, so nothing else needs to change.

## Performance

- The avatar code (7 KB gzipped) is lazy-loaded when the browser is idle after page load,
  or on hover/focus of the launcher. The GLB loader (23 KB gzipped) loads only if a custom
  model is set.
- One WebGL canvas is used for both the launcher and the expanded view, so opening doesn't
  create a new scene.
- 30 fps as a launcher, 60 fps when expanded. Rendering stops when the tab is hidden or the
  canvas is off-screen. Pixel ratio is capped at 1.5 on phones and 2 on desktop, and phones
  use lower-poly geometry.
- `prefers-reduced-motion` reduces head/body motion and turns off the wave.

## Accessibility

- The launcher and every control are real buttons with labels, reachable with the keyboard.
- `Esc` closes the assistant and returns focus to the launcher. The input is focused on open.
- The state (listening / thinking / speaking) is shown as a coloured status pill and announced
  through an `aria-live` region. Replies are announced as captions.
- Mute (remembered between visits), **Stop speaking**, and a full text transcript are available.
- Text chat works without WebGL, audio or a microphone.
