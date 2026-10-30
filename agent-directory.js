// The list of team member names shown in every "Your name" dropdown across
// the Case Board (logging a case, marking it Done/Pending, adding an update,
// editing details). Editable from the "Manage names" button on either case
// board page -- changes save to this browser's localStorage and update every
// dropdown immediately.

const AGENT_DIRECTORY_KEY = 'dic_agent_directory_v1';
const agentDirectoryBus = new EventTarget();

const AGENT_DIRECTORY_SEED = [
  'Aj Dela Cruz',
  'Judy Tolentino',
  'Melvin Lagrosa',
  'Kristian Ong',
  'Zachary Jeremy Payabyab',
  'Christian Mark Patdu',
  'Glory Barbacena',
  'Gemmalyn Silvestre',
  'Raven Guasis',
  'Harold Reyes',
  'Remond Licayan',
];

function readAgentDirectory() {
  try {
    const raw = localStorage.getItem(AGENT_DIRECTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    /* fall through to seed */
  }
  const sorted = AGENT_DIRECTORY_SEED.slice().sort((a, b) => a.localeCompare(b));
  localStorage.setItem(AGENT_DIRECTORY_KEY, JSON.stringify(sorted));
  return sorted;
}

function writeAgentDirectory(names) {
  localStorage.setItem(AGENT_DIRECTORY_KEY, JSON.stringify(names));
  agentDirectoryBus.dispatchEvent(new CustomEvent('change'));
}

function getAgentDirectory() {
  return readAgentDirectory();
}

function addAgentName(name) {
  const trimmed = (name || '').trim();
  if (!trimmed) return;
  const names = readAgentDirectory();
  const exists = names.some((n) => n.toLowerCase() === trimmed.toLowerCase());
  if (exists) return;
  names.push(trimmed);
  names.sort((a, b) => a.localeCompare(b));
  writeAgentDirectory(names);
}

function removeAgentName(name) {
  const names = readAgentDirectory().filter((n) => n !== name);
  writeAgentDirectory(names);
}

// Returns an unsubscribe function.
function subscribeAgentDirectory(callback) {
  const emit = () => callback(getAgentDirectory());
  emit();
  const handler = () => emit();
  agentDirectoryBus.addEventListener('change', handler);
  window.addEventListener('storage', handler);
  return () => {
    agentDirectoryBus.removeEventListener('change', handler);
    window.removeEventListener('storage', handler);
  };
}
