const PROFILE_KEY = "amys-hairlab-profile";
const PROFILE_EVENT = "amys-hairlab-profile-change";
export const PROFILE_PENDING = "\u0000";

export type CustomerProfile = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
};

export const emptyProfile: CustomerProfile = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  state: "",
};

export function subscribeProfile(onStoreChange: () => void) {
  const notify = () => onStoreChange();
  window.addEventListener("storage", notify);
  window.addEventListener(PROFILE_EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(PROFILE_EVENT, notify);
  };
}

export function readProfileRaw() {
  return localStorage.getItem(PROFILE_KEY) ?? "";
}

export function profileServerSnapshot() {
  return PROFILE_PENDING;
}

export function parseProfile(raw: string): CustomerProfile {
  if (!raw || raw === PROFILE_PENDING) return emptyProfile;
  try {
    const parsed = JSON.parse(raw) as Partial<CustomerProfile>;
    return {
      fullName: typeof parsed.fullName === "string" ? parsed.fullName : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      phone: typeof parsed.phone === "string" ? parsed.phone : "",
      city: typeof parsed.city === "string" ? parsed.city : "",
      state: typeof parsed.state === "string" ? parsed.state : "",
    };
  } catch {
    return emptyProfile;
  }
}

export function saveProfile(profile: CustomerProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event(PROFILE_EVENT));
}
