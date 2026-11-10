// Run locally. The token is read from .env and never printed.
const token = process.env.VIPET_TELEGRAM_BOT_TOKEN;
if (!token || !/^\d+:[A-Za-z0-9_-]+$/.test(token)) {
  console.error('Set VIPET_TELEGRAM_BOT_TOKEN in the private .env file first.');
  process.exit(1);
}
try {
  const response = await fetch(`https://api.telegram.org/bot${token}/getUpdates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ allowed_updates: ['message'], timeout: 0 }),
    signal: AbortSignal.timeout(10000),
  });
  const data = await response.json();
  if (!response.ok || data.ok !== true) throw new Error('Telegram request failed');
  const chats = new Map();
  for (const update of data.result ?? []) {
    const chat = update.message?.chat;
    if (chat) chats.set(chat.id, chat.type);
  }
  if (!chats.size) {
    console.log('Open the bot in the owner’s Telegram, press Start and run this command again.');
  }
  for (const [id, type] of chats) console.log(`Chat ID: ${id} (${type})`);
} catch {
  console.error(
    'Could not retrieve chat IDs. Check the token, connection and that this is a dedicated bot without an existing webhook.',
  );
  process.exitCode = 1;
}
