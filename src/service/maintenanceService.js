import api from "./axios";
import { getAllComplaints, resolveComplaint } from "./complaintService";

const DEMO_QUEUE_KEY = "maintenance_demo_queue";
const DEMO_HISTORY_KEY = "maintenance_demo_history";

const demoQueue = [
  {
    id: "demo-201",
    title: "Leaking shower tap",
    description: "The shower tap in the shared bathroom continues to drip after it is closed.",
    category: "Plumbing",
    status: "FORWARDED",
    studentName: "Nimal Perera",
    studentIndexNumber: "UWU/AS/2023/041",
    roomNumber: "B-204",
    hostelName: "Rathnayake Hostel",
    subWardenRemarks: "Please inspect during the morning maintenance round.",
    createdAt: "2026-08-01T08:30:00",
    demo: true,
  },
  {
    id: "demo-202",
    title: "Ceiling fan not working",
    description: "The ceiling fan does not start even after checking the wall regulator.",
    category: "Electrical",
    status: "FORWARDED",
    studentName: "Kasun Silva",
    studentIndexNumber: "UWU/AS/2022/118",
    roomNumber: "A-107",
    hostelName: "Wijesinghe Hostel",
    subWardenRemarks: "Student reports the room becomes very warm at night.",
    createdAt: "2026-08-01T09:15:00",
    demo: true,
  },
  {
    id: "demo-203",
    title: "Broken study desk drawer",
    description: "The drawer rail is detached and the drawer cannot be opened safely.",
    category: "Furniture",
    status: "FORWARDED",
    studentName: "Tharushi Fernando",
    studentIndexNumber: "UWU/AS/2023/067",
    roomNumber: "C-312",
    hostelName: "Rathnayake Hostel",
    subWardenRemarks: "Repair if possible; replace only if the rail is damaged.",
    createdAt: "2026-07-31T14:20:00",
    demo: true,
  },
];

const demoHistory = [
  {
    id: "demo-190",
    title: "Tube light replacement",
    description: "The main tube light had stopped working.",
    category: "Electrical",
    status: "RESOLVED",
    studentName: "Ayesha Jayasinghe",
    studentIndexNumber: "UWU/AS/2022/093",
    roomNumber: "A-215",
    hostelName: "Wijesinghe Hostel",
    maintenanceRemarks: "Replaced the faulty tube light and tested the switch.",
    createdAt: "2026-07-29T10:10:00",
    completedAt: "2026-07-29T11:05:00",
    demo: true,
  },
  {
    id: "demo-191",
    title: "Door lock adjustment",
    description: "The room key was difficult to turn in the lock.",
    category: "Security",
    status: "RESOLVED",
    studentName: "Ruwan Madushanka",
    studentIndexNumber: "UWU/AS/2021/156",
    roomNumber: "B-109",
    hostelName: "Rathnayake Hostel",
    maintenanceRemarks: "Aligned the strike plate and lubricated the lock cylinder.",
    createdAt: "2026-07-28T13:40:00",
    completedAt: "2026-07-28T14:10:00",
    demo: true,
  },
];

const loadDemo = (key, seed) => JSON.parse(localStorage.getItem(key) || JSON.stringify(seed));
const saveDemo = (key, items) => localStorage.setItem(key, JSON.stringify(items));

const getLocalForwardedComplaints = () => getAllComplaints()
  .filter((complaint) => complaint.status === "in_progress")
  .map((complaint) => ({
    id: complaint.id,
    title: complaint.title,
    description: complaint.description,
    category: complaint.category,
    status: "FORWARDED",
    studentName: complaint.studentName,
    studentIndexNumber: complaint.studentRegNo,
    roomNumber: complaint.roomNo,
    hostelName: complaint.hostelName || "Hostel information unavailable",
    subWardenRemarks: complaint.subWardenRemarks,
    createdAt: complaint.date,
    local: true,
  }));

const getLocalCompletedComplaints = () => getAllComplaints()
  .filter((complaint) => complaint.status === "completed")
  .map((complaint) => ({
    id: complaint.id,
    title: complaint.title,
    description: complaint.description,
    category: complaint.category,
    status: "RESOLVED",
    studentName: complaint.studentName,
    studentIndexNumber: complaint.studentRegNo,
    roomNumber: complaint.roomNo,
    hostelName: complaint.hostelName || "Hostel information unavailable",
    maintenanceRemarks: complaint.maintenanceRemarks || "Completed by maintenance.",
    createdAt: complaint.date,
    completedAt: complaint.completedAt,
    local: true,
  }));

export const getMaintenanceQueue = async () => {
  let apiItems = [];
  try {
    const { data } = await api.get("/complaints/maintenance/queue");
    apiItems = data;
  } catch {
    // During demo mode, Sub Warden forwarding is stored locally.
  }

  const localForwarded = getLocalForwardedComplaints();
  const combined = [...apiItems, ...localForwarded.filter((item) => !apiItems.some((apiItem) => String(apiItem.id) === String(item.id)))];
  return combined.length ? combined : loadDemo(DEMO_QUEUE_KEY, demoQueue);
};

export const getMaintenanceHistory = async () => {
  try {
    const { data } = await api.get("/complaints/maintenance/history");
    if (data.length) return data;
  } catch {
    // Use the shared local workflow while the API is unavailable.
  }
  const localCompleted = getLocalCompletedComplaints();
  return localCompleted.length ? localCompleted : loadDemo(DEMO_HISTORY_KEY, demoHistory);
};

export const completeMaintenanceComplaint = async (id, remarks) => {
  if (String(id).startsWith("demo-")) {
    const queue = loadDemo(DEMO_QUEUE_KEY, demoQueue);
    const completed = queue.find((item) => item.id === id);
    if (!completed) throw new Error("Demo work order was not found.");

    saveDemo(DEMO_QUEUE_KEY, queue.filter((item) => item.id !== id));
    const history = loadDemo(DEMO_HISTORY_KEY, demoHistory);
    saveDemo(DEMO_HISTORY_KEY, [{ ...completed, status: "RESOLVED", maintenanceRemarks: remarks, completedAt: new Date().toISOString() }, ...history]);
    return completed;
  }

  if (String(id).startsWith("COMP-")) {
    resolveComplaint(id, remarks);
    return { id, maintenanceRemarks: remarks };
  }

  const { data } = await api.put(`/complaints/${id}/complete`, { remarks });
  return data;
};
