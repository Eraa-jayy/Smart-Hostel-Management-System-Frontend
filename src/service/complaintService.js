import api from "./axios";

// Shared Complaint Service
// This service is the single source of truth for complaints across
// both the Student and Sub Warden modules. Data is persisted in localStorage.

const STORAGE_KEY = "sw_complaints";

const INITIAL_COMPLAINTS = [
  {
    id: "COMP-101",
    studentName: "Suresh Silva",
    studentRegNo: "UWU/AS/2021/015",
    roomNo: "101",
    title: "Ceiling Fan Regulator Broken",
    category: "Electrical",
    priority: "medium",
    status: "pending",
    date: "2026-07-28",
    description:
      "The fan speed cannot be adjusted. It is stuck at maximum speed.",
    subWardenRemarks: "",
  },
  {
    id: "COMP-102",
    studentName: "Roshan Kumara",
    studentRegNo: "UWU/AS/2021/045",
    roomNo: "102",
    title: "Leaking Water Tap in bathroom",
    category: "Plumbing",
    priority: "high",
    status: "pending",
    date: "2026-07-30",
    description:
      "Water is continuously dripping from the wash basin faucet, causing a mess.",
    subWardenRemarks: "",
  },
  {
    id: "COMP-103",
    studentName: "Dasun Shanaka",
    studentRegNo: "UWU/AS/2021/154",
    roomNo: "103",
    title: "Study Chair Broken Leg",
    category: "Furniture",
    priority: "low",
    status: "pending",
    date: "2026-07-31",
    description:
      "One of the wooden chairs has a loose leg and is unsafe to sit on.",
    subWardenRemarks: "",
  },
  {
    id: "COMP-104",
    studentName: "Pasan Perera",
    studentRegNo: "UWU/AS/2022/044",
    roomNo: "204",
    title: "Fluorescent Light bulb Blown Out",
    category: "Electrical",
    priority: "medium",
    status: "in_progress",
    date: "2026-07-25",
    description:
      "Main tube light has blown. We are using table lamps currently.",
    subWardenRemarks: "Forwarded to maintenance unit.",
  },
  {
    id: "COMP-105",
    studentName: "Malith Fernando",
    studentRegNo: "UWU/AS/2022/061",
    roomNo: "305",
    title: "Door Lock Jammed",
    category: "Security",
    priority: "high",
    status: "completed",
    date: "2026-07-20",
    description:
      "The key gets stuck inside the lock cylinder while opening from outside.",
    subWardenRemarks: "Fixed by maintenance on Jul 22.",
  },
];

// ─── Seed ────────────────────────────────────────────────────────────
const seed = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COMPLAINTS));
  }
};
seed();

// ─── Read ────────────────────────────────────────────────────────────

export const getAllComplaints = () => {
  seed();
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
};

export const getComplaintById = (id) => {
  return getAllComplaints().find((c) => c.id === id) || null;
};

export const getComplaintsByStudent = (regNo) => {
  return getAllComplaints().filter((c) => c.studentRegNo === regNo);
};

export const getComplaintsByStatus = (status) => {
  return getAllComplaints().filter((c) => c.status === status);
};

// ─── Student Actions ─────────────────────────────────────────────────

export const submitComplaint = ({
  title,
  category,
  priority,
  description,
  studentName,
  studentRegNo,
  roomNo,
}) => {
  const complaints = getAllComplaints();
  const newComplaint = {
    id: `COMP-${Date.now().toString().slice(-6)}`,
    title,
    category,
    priority: priority || "medium",
    description,
    studentName: studentName || "Current Student",
    studentRegNo: studentRegNo || "",
    roomNo: roomNo || "",
    status: "pending",
    date: new Date().toISOString().split("T")[0],
    subWardenRemarks: "",
  };
  complaints.unshift(newComplaint);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  return newComplaint;
};

// ─── Sub Warden Actions ──────────────────────────────────────────────

export const forwardComplaint = (complaintId, remarks = "") => {
  const complaints = getAllComplaints();
  const updated = complaints.map((c) => {
    if (c.id === complaintId) {
      return {
        ...c,
        status: "in_progress",
        subWardenRemarks: remarks || "Forwarded to maintenance department.",
      };
    }
    return c;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const declineComplaint = (complaintId, remarks = "") => {
  const complaints = getAllComplaints();
  const updated = complaints.map((c) => {
    if (c.id === complaintId) {
      return {
        ...c,
        status: "rejected",
        subWardenRemarks: remarks || "Declined by sub warden.",
      };
    }
    return c;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const resolveComplaint = (complaintId, maintenanceRemarks = "") => {
  const complaints = getAllComplaints();
  const updated = complaints.map((c) => {
    if (c.id === complaintId) {
      return {
        ...c,
        status: "completed",
        maintenanceRemarks: maintenanceRemarks || c.maintenanceRemarks || "Completed by maintenance.",
        completedAt: new Date().toISOString(),
      };
    }
    return c;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

// API-backed workflow used by the Sub Warden and Maintenance portals.
// Keeping these separate preserves the demo data currently used by the student UI.
const toPortalComplaint = (complaint) => ({
  id: String(complaint.id),
  title: complaint.title,
  description: complaint.description,
  category: complaint.category,
  priority: "medium",
  status: ({ PENDING: "pending", FORWARDED: "in_progress", IN_PROGRESS: "in_progress", RESOLVED: "completed", DECLINED: "rejected" })[complaint.status] || "pending",
  studentName: complaint.studentName,
  studentRegNo: complaint.studentIndexNumber,
  roomNo: complaint.roomNumber,
  date: complaint.createdAt ? complaint.createdAt.slice(0, 10) : "",
  subWardenRemarks: complaint.subWardenRemarks || "",
});

export const getSubWardenComplaints = async () => {
  try {
    const { data } = await api.get("/complaints");
    return data.length ? data.map(toPortalComplaint) : getAllComplaints();
  } catch {
    return getAllComplaints();
  }
};

export const forwardComplaintToApi = async (complaintId, remarks = "") => {
  try {
    const { data } = await api.put(`/complaints/${complaintId}/forward`, null, { params: { remarks } });
    return toPortalComplaint(data);
  } catch {
    const updated = forwardComplaint(complaintId, remarks);
    return updated.find((c) => c.id === complaintId) || null;
  }
};

export const declineComplaintToApi = async (complaintId, remarks = "") => {
  try {
    const { data } = await api.put(`/complaints/${complaintId}/decline`, null, { params: { remarks } });
    return toPortalComplaint(data);
  } catch {
    const updated = declineComplaint(complaintId, remarks);
    return updated.find((c) => c.id === complaintId) || null;
  }
};
