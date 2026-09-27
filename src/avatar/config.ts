// Central place to swap the avatar model or TTS endpoint. See docs/AVATAR.md.
export const avatarConfig = {
  /** URL of a custom .glb avatar (e.g. '/models/avatar.glb'). Empty = built-in robot. */
  modelUrl: (import.meta.env.VITE_AVATAR_MODEL_URL as string | undefined) || '',
  /** Server endpoint that turns text into audio. */
  ttsEndpoint: '/api/tts',
  /** Give up on server TTS after this long and fall back to the browser voice. */
  ttsTimeoutMs: 15000,
};
