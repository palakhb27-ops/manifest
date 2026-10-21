// Manifest chatbot (front end).
// 1) Tries your backend at /api/chat (add one on EC2 later; keep API keys on the server only).
// 2) If there is no backend (e.g. plain S3/CloudFront hosting), falls back to simple built-in answers.
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
if (!chatBox || !input || !sendBtn) {
  throw new Error("Chatbot elements not found on this page.");
}

const FAQ = [
  { k: ["register", "registration", "company", "incorporat"], a: "Choose a structure (sole proprietorship, LLP, private limited), then register with your local authority and get a tax ID. A CA or legal advisor can confirm the exact steps for your country." },
  { k: ["fund", "invest", "money", "capital"], a: "Start with bootstrapping or small grants, then consider angel investors once you have early customers. Prepare a short pitch deck and basic financials." },
  { k: ["market", "customer", "advertis", "promot"], a: "Define your target audience first, then test 1-2 channels (social media, referrals, content). Measure results before scaling spend." },
  { k: ["cofounder", "co-founder", "partner", "team"], a: "Look for co-founders with complementary skills and the same long-term goals. Agree on equity and roles in writing early." },
  { k: ["competitor", "competition"], a: "List your top 5 competitors, compare price, features and customers, and find the gap you can serve better." },
  { k: ["hello", "hi ", "hey"], a: "Hello! Ask me about registration, funding, marketing, co-founders or competitors." },
  { k: ["price", "pricing", "cost"], a: "Compare 3-5 competitors, estimate your costs per customer, then test two price points with real customers before settling." },
  { k: ["tax", "gst", "vat"], a: "Register for tax as required in your country once you cross the turnover threshold, and keep every invoice. A CA or tax advisor can confirm the details." },
  { k: ["thank"], a: "You're welcome! Anything else about your business?" }
];

function addMessage(who, text) {
  const p = document.createElement("p");
  const b = document.createElement("strong");
  b.textContent = who + ": ";
  p.appendChild(b);
  p.appendChild(document.createTextNode(text));
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function localAnswer(q) {
  const t = q.toLowerCase();
  for (const item of FAQ) {
    if (item.k.some((w) => t.includes(w))) return item.a;
  }
  return "Good question. Tell me your industry, stage and budget on the AI Advisor page for tailored advice, or post it in the Expert Q&A forum.";
}

async function getReply(q) {
  // Give the backend 4 seconds, then fall back to the built-in answers.
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: q }),
      signal: ctrl.signal
    });
    const type = res.headers.get("content-type") || "";
    // On S3/CloudFront a missing /api/chat may return the HTML 404 page with status 200, so check the type too.
    if (!res.ok || !type.includes("application/json")) throw new Error("no backend");
    const data = await res.json();
    return (data && data.reply) || localAnswer(q);
  } catch (e) {
    return localAnswer(q);
  } finally {
    clearTimeout(timer);
  }
}

let busy = false;
async function send() {
  const q = input.value.trim();
  if (!q || busy) return;
  busy = true;
  sendBtn.disabled = true;
  addMessage("You", q);
  input.value = "";
  try {
    addMessage("Manifest", await getReply(q));
  } finally {
    busy = false;
    sendBtn.disabled = false;
    input.focus();
  }
}

sendBtn.addEventListener("click", send);
input.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
addMessage("Manifest", "Hi! Ask me about registration, funding, marketing, co-founders or competitors.");
