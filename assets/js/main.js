const menuButton = document.getElementById('menu-btn');
const mobileNav = document.getElementById('mobile-nav');

if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    mobileNav.classList.toggle('hidden');
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.section-reveal').forEach((section) => observer.observe(section));

const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    const name = document.getElementById('name')?.value?.trim() || '';
    const email = document.getElementById('email')?.value?.trim() || '';
    const message = document.getElementById('message')?.value?.trim() || '';
    if (!name || !email || !message) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const subject = encodeURIComponent(`Buildora Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=Buildoradigitalonline@gmail.com&su=${subject}&body=${body}`;
    window.open(gmailComposeUrl, '_blank', 'noopener');
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') {
      return;
    }
    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', targetId);
  });
});

const chatbotConfig = {
  brandName: 'Buildora Assistant',
  phoneNumber: '919350884296',
  email: 'Buildoradigitalonline@gmail.com'
};

const chatbotStorageKeys = {
  customKnowledge: 'buildora.chatbot.customKnowledge.v1'
};

const defaultChatbotKnowledge = [
  {
    keys: ['hi', 'hello', 'hey'],
    reply: 'Hello. I can help with Buildora services, pricing, and project timelines. What do you need?'
  },
  {
    keys: ['services', 'service', 'offer'],
    reply: 'We provide AI Automation, Website Development, Digital Marketing, and Social Media Management.'
  },
  {
    keys: ['price', 'pricing', 'cost', 'budget'],
    reply: 'Pricing depends on scope and timeline. Share your goal and I can direct you to the fastest quote route.'
  },
  {
    keys: ['website', 'web development', 'site'],
    reply: 'We build responsive, conversion-focused websites. Typical first version timeline is 1 to 3 weeks based on scope.'
  },
  {
    keys: ['automation', 'ai'],
    reply: 'Our AI automation setups reduce repetitive work and improve lead response speed using practical workflows.'
  },
  {
    keys: ['marketing', 'ads', 'seo'],
    reply: 'Our marketing work focuses on lead quality, tracking, and revenue growth across channels.'
  },
  {
    keys: ['social', 'instagram', 'content'],
    reply: 'We handle content planning, posting consistency, and performance-based social growth strategy.'
  },
  {
    keys: ['contact', 'call', 'whatsapp'],
    reply: 'Best route is WhatsApp for quick response. You can also contact us by email if preferred.'
  },
  {
    keys: ['email'],
    reply: `You can email us at ${chatbotConfig.email}.`
  },
  {
    keys: ['thanks', 'thank you'],
    reply: 'You are welcome. If you share your business type, I can suggest the best starting service.'
  }
];

let chatbotKnowledgeBase = [...defaultChatbotKnowledge];

function normalizeKnowledgeEntries(entries) {
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries
    .map((entry) => {
      const keys = Array.isArray(entry?.keys)
        ? entry.keys.map((key) => String(key).trim().toLowerCase()).filter(Boolean)
        : [];
      const reply = typeof entry?.reply === 'string' ? entry.reply.trim() : '';
      if (!keys.length || !reply) {
        return null;
      }
      return { keys, reply };
    })
    .filter(Boolean);
}

function mergeKnowledge(entries) {
  const normalized = normalizeKnowledgeEntries(entries);
  if (!normalized.length) {
    return;
  }
  chatbotKnowledgeBase = [...chatbotKnowledgeBase, ...normalized];
}

function getStoredCustomKnowledge() {
  try {
    const raw = window.localStorage.getItem(chatbotStorageKeys.customKnowledge);
    if (!raw) {
      return [];
    }
    return normalizeKnowledgeEntries(JSON.parse(raw));
  } catch (error) {
    return [];
  }
}

function saveCustomKnowledge(entries) {
  try {
    window.localStorage.setItem(chatbotStorageKeys.customKnowledge, JSON.stringify(entries));
  } catch (error) {
    // Ignore storage errors and keep chatbot functional.
  }
}

async function loadKnowledgeFile() {
  try {
    const scriptElement = Array.from(document.scripts).find((script) =>
      script.src.endsWith('/assets/js/main.js') || script.src.endsWith('assets/js/main.js')
    );
    const knowledgeFileUrl = scriptElement
      ? new URL('../data/chatbot-knowledge.json', scriptElement.src).toString()
      : 'assets/data/chatbot-knowledge.json';
    const response = await fetch(knowledgeFileUrl, { cache: 'no-store' });
    if (!response.ok) {
      return [];
    }
    return normalizeKnowledgeEntries(await response.json());
  } catch (error) {
    return [];
  }
}

async function initializeChatbotKnowledge() {
  chatbotKnowledgeBase = [...defaultChatbotKnowledge];
  mergeKnowledge(await loadKnowledgeFile());
  mergeKnowledge(getStoredCustomKnowledge());
}

function getChatbotReply(message) {
  const normalizedMessage = message.toLowerCase();
  const matchedResponse = chatbotKnowledgeBase.find((entry) =>
    entry.keys.some((key) => normalizedMessage.includes(key))
  );

  if (matchedResponse) {
    return matchedResponse.reply;
  }

  return 'I can help with services, pricing, and timelines. For a fast response from the team, use the WhatsApp button below.';
}

function parseTrainingCommand(message) {
  const payload = message.replace(/^\/train\s+/i, '').trim();
  if (!payload.includes('|')) {
    return null;
  }

  const [rawKeys, ...rawReplyParts] = payload.split('|');
  const keys = rawKeys
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  const reply = rawReplyParts.join('|').trim();

  if (!keys.length || !reply) {
    return null;
  }

  return { keys, reply };
}

function createChatbotWidget() {
  if (document.getElementById('buildora-chatbot-root')) {
    return;
  }

  const style = document.createElement('style');
  style.textContent = `
    #buildora-chatbot-root { position: fixed; left: 1rem; bottom: 1rem; z-index: 60; font-family: Inter, sans-serif; }
    #buildora-chat-toggle { border: 0; border-radius: 9999px; padding: 0.75rem 1rem; background: linear-gradient(135deg,#22d3ee,#3b82f6); color: #020617; font-weight: 700; cursor: pointer; box-shadow: 0 12px 32px rgba(15,23,42,.35); }
    #buildora-chat-panel { width: min(22rem, calc(100vw - 2rem)); height: 26rem; margin-top: 0.75rem; border: 1px solid rgba(51,65,85,.9); border-radius: 1rem; background: #0f172a; display: none; overflow: hidden; box-shadow: 0 18px 44px rgba(2,6,23,.5); }
    #buildora-chat-panel.open { display: flex; flex-direction: column; }
    .buildora-chat-header { padding: 0.85rem 1rem; background: #020617; color: #e2e8f0; border-bottom: 1px solid rgba(51,65,85,.8); font-weight: 600; font-size: 0.95rem; }
    .buildora-chat-messages { flex: 1; padding: 0.85rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.6rem; background: linear-gradient(180deg,rgba(15,23,42,.85),rgba(2,6,23,.95)); }
    .buildora-msg { max-width: 84%; padding: 0.65rem 0.8rem; border-radius: 0.75rem; font-size: 0.9rem; line-height: 1.35; }
    .buildora-msg.bot { align-self: flex-start; background: #1e293b; color: #e2e8f0; border: 1px solid rgba(71,85,105,.8); }
    .buildora-msg.user { align-self: flex-end; background: #22d3ee; color: #082f49; font-weight: 600; }
    .buildora-chat-input-wrap { padding: 0.7rem; border-top: 1px solid rgba(51,65,85,.8); display: grid; grid-template-columns: 1fr auto; gap: 0.5rem; background: #0b1220; }
    #buildora-chat-input { border: 1px solid #334155; border-radius: 0.65rem; background: #020617; color: #e2e8f0; padding: 0.62rem 0.7rem; outline: none; }
    #buildora-chat-input:focus { border-color: #22d3ee; }
    #buildora-chat-send { border: 0; border-radius: 0.65rem; padding: 0.6rem 0.8rem; background: #06b6d4; color: #082f49; font-weight: 700; cursor: pointer; }
    .buildora-chat-actions { display: flex; gap: 0.5rem; padding: 0.55rem 0.7rem 0.75rem; background: #0b1220; border-top: 1px solid rgba(51,65,85,.8); }
    .buildora-chat-link { text-decoration: none; font-size: 0.78rem; border: 1px solid #334155; color: #a5f3fc; padding: 0.35rem 0.55rem; border-radius: 0.55rem; }
    @media (max-width: 640px) {
      #buildora-chatbot-root { left: 0.75rem; right: 0.75rem; bottom: 0.75rem; }
      #buildora-chat-toggle { width: 100%; }
      #buildora-chat-panel { width: 100%; height: 22rem; }
    }
  `;
  document.head.appendChild(style);

  const whatsappLink = `https://wa.me/${chatbotConfig.phoneNumber}`;
  const emailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(chatbotConfig.email)}`;

  const root = document.createElement('div');
  root.id = 'buildora-chatbot-root';
  root.innerHTML = `
    <button id="buildora-chat-toggle" type="button" aria-expanded="false" aria-controls="buildora-chat-panel">Chat with us</button>
    <section id="buildora-chat-panel" aria-label="Buildora chatbot panel">
      <div class="buildora-chat-header">${chatbotConfig.brandName}</div>
      <div id="buildora-chat-messages" class="buildora-chat-messages" aria-live="polite"></div>
      <div class="buildora-chat-input-wrap">
        <input id="buildora-chat-input" type="text" placeholder="Type your message..." maxlength="220" />
        <button id="buildora-chat-send" type="button">Send</button>
      </div>
      <div class="buildora-chat-actions">
        <a class="buildora-chat-link" href="${whatsappLink}" target="_blank" rel="noopener">WhatsApp</a>
        <a class="buildora-chat-link" href="${emailLink}" target="_blank" rel="noopener">Email</a>
      </div>
    </section>
  `;
  document.body.appendChild(root);

  const panel = document.getElementById('buildora-chat-panel');
  const toggleButton = document.getElementById('buildora-chat-toggle');
  const input = document.getElementById('buildora-chat-input');
  const sendButton = document.getElementById('buildora-chat-send');
  const messagesContainer = document.getElementById('buildora-chat-messages');

  if (!panel || !toggleButton || !input || !sendButton || !messagesContainer) {
    return;
  }

  const appendMessage = (text, role) => {
    const message = document.createElement('div');
    message.className = `buildora-msg ${role}`;
    message.textContent = text;
    messagesContainer.appendChild(message);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  appendMessage('Hi, welcome to Buildora Digital. Ask me about services, price, or timelines.', 'bot');
  appendMessage('Training: use /train key1,key2 | your reply text', 'bot');

  toggleButton.addEventListener('click', () => {
    panel.classList.toggle('open');
    const expanded = panel.classList.contains('open');
    toggleButton.setAttribute('aria-expanded', String(expanded));
    toggleButton.textContent = expanded ? 'Close chat' : 'Chat with us';
    if (expanded) {
      input.focus();
    }
  });

  const sendMessage = async () => {
    const text = input.value.trim();
    if (!text) {
      return;
    }
    appendMessage(text, 'user');
    input.value = '';

    if (text.toLowerCase().startsWith('/train ')) {
      const trainedEntry = parseTrainingCommand(text);
      if (!trainedEntry) {
        appendMessage('Invalid format. Use /train key1,key2 | your reply text', 'bot');
        return;
      }

      const customKnowledge = getStoredCustomKnowledge();
      customKnowledge.push(trainedEntry);
      saveCustomKnowledge(customKnowledge);
      mergeKnowledge([trainedEntry]);
      appendMessage('Saved. I learned that response.', 'bot');
      return;
    }

    if (text.toLowerCase() === '/help') {
      appendMessage('Use /train key1,key2 | reply to teach me custom responses.', 'bot');
      return;
    }

    await initializePromise;
    window.setTimeout(() => {
      appendMessage(getChatbotReply(text), 'bot');
    }, 260);
  };

  sendButton.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  });
}

const initializePromise = initializeChatbotKnowledge();

if (document.body) {
  createChatbotWidget();
}
