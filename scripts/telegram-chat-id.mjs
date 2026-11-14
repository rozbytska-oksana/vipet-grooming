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
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.ok !== true) {
    // Telegram descriptions never contain the token.
    const reason = `HTTP ${response.status}${data?.description ? `: ${data.description}` : ''}`;
    const hints = {
      401: 'The token is wrong or was revoked. Copy it again from @BotFather into .env.',
      404: 'The token is wrong. Copy it again from @BotFather into .env.',
      409: 'A webhook is set for this bot. Remove it or use a dedicated bot.',
    };
    console.error(`Telegram refused the request (${reason}).`);
    if (hints[response.status]) console.error(hints[response.status]);
    process.exit(1);
  }
  const chats = new Map();
  for (const update of data.result ?? []) {
    const chat = update.message?.chat;
    if (chat) chats.set(chat.id, chat.type);
  }
  if (!chats.size) {
    console.log('Open the bot in the owner’s Telegram, press Start and run this command again.');
  }
  for (const [id, type] of chats) console.log(`Chat ID: ${id} (${type})`);
} catch (error) {
  const code = error?.cause?.code || error?.name || 'unknown';
  console.error(
    `Could not reach api.telegram.org (${code}). Check the internet connection or VPN.`,
  );
  process.exitCode = 1;
}
