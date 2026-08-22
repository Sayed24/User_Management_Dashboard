import { demoUsers } from "./demoUsers.js";
import { state, setUsers, setActivity } from "./state.js";

const USERS_KEY = "userflow_users_v2";
const ACTIVITY_KEY = "userflow_activity_v2";
const SESSION_KEY = "userflow_session_v2";
const SETTINGS_KEY = "userflow_settings_v2";

export function loadUsers() {
  try {
    const stored = JSON.parse(localStorage.getItem(USERS_KEY) || "null");
    const users = Array.isArray(stored) ? stored : structuredClone(demoUsers);
    setUsers(users);
    if (!stored) saveUsers();
  } catch {
    setUsers(structuredClone(demoUsers));
    saveUsers();
  }
  return state.users;
}

export function saveUsers() {
  localStorage.setItem(USERS_KEY, JSON.stringify(state.users));
}

export function restoreDemoUsers() {
  setUsers(structuredClone(demoUsers));
  saveUsers();
  return state.users;
}

export function clearUsers() {
  setUsers([]);
  saveUsers();
}

export function loadActivity() {
  try {
    const items = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "[]");
    setActivity(Array.isArray(items) ? items : []);
  } catch {
    setActivity([]);
  }
  return state.activity;
}

export function saveActivity() {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(state.activity));
}

export function clearActivity() {
  setActivity([]);
  saveActivity();
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSettings() {
  try {
    return {
      theme: "system",
      density: "comfortable",
      directoryView: "table",
      ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}")
    };
  } catch {
    return { theme: "system", density: "comfortable", directoryView: "table" };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...getSettings(), ...settings }));
}
