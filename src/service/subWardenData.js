// Sub Warden Mock Data & Service

const DEFAULT_CONFIG = {
  blocksCount: 1,
  floorsCount: 4,
  roomsPerFloor: 28,
  roomCapacity: 4, // 4 students per room
};

const DEFAULT_STUDENTS_POOL = [
  { id: "S001", name: "Amal Silva", regNo: "UWU/AS/2022/001", academicYear: "Science - 2nd Year", status: "UNALLOCATED" },
  { id: "S002", name: "Nimal Perera", regNo: "UWU/AS/2022/002", academicYear: "Science - 2nd Year", status: "UNALLOCATED" },
  { id: "S003", name: "Sunil Fernando", regNo: "UWU/AS/2022/003", academicYear: "Management - 3rd Year", status: "UNALLOCATED" },
  { id: "S004", name: "Ruwan Jayasinghe", regNo: "UWU/AS/2022/004", academicYear: "Computing - 1st Year", status: "UNALLOCATED" },
  { id: "S005", name: "Kasun Rajapaksha", regNo: "UWU/AS/2022/005", academicYear: "Computing - 1st Year", status: "UNALLOCATED" },
  { id: "S006", name: "Pathum Herath", regNo: "UWU/AS/2022/006", academicYear: "Science - 3rd Year", status: "UNALLOCATED" },
  { id: "S007", name: "Chathura Bandara", regNo: "UWU/AS/2022/007", academicYear: "Management - 2nd Year", status: "UNALLOCATED" },
  { id: "S008", name: "Nuwan Sameera", regNo: "UWU/AS/2022/008", academicYear: "Computing - 4th Year", status: "UNALLOCATED" },
  { id: "S009", name: "Lahiru Madushanka", regNo: "UWU/AS/2022/009", academicYear: "Science - 1st Year", status: "UNALLOCATED" },
  { id: "S010", name: "Dinuka Perera", regNo: "UWU/AS/2022/010", academicYear: "Management - 4th Year", status: "UNALLOCATED" }
];

const INITIAL_ALLOCATIONS = [
  { id: "SA101_1", name: "Suresh Silva", regNo: "UWU/AS/2021/015", academicYear: "Computing - 3rd Year", roomNo: "101", block: "Block A" },
  { id: "SA101_2", name: "Gayan Perera", regNo: "UWU/AS/2021/022", academicYear: "Computing - 3rd Year", roomNo: "101", block: "Block A" },
  { id: "SA101_3", name: "Thilina Madushan", regNo: "UWU/AS/2021/089", academicYear: "Science - 3rd Year", roomNo: "101", block: "Block A" },
  { id: "SA102_1", name: "Roshan Kumara", regNo: "UWU/AS/2021/045", academicYear: "Management - 2nd Year", roomNo: "102", block: "Block A" },
  { id: "SA102_2", name: "Kavindu Jayawardena", regNo: "UWU/AS/2021/078", academicYear: "Management - 2nd Year", roomNo: "102", block: "Block A" },
  { id: "SA102_3", name: "Chathuranga Dilshan", regNo: "UWU/AS/2021/112", academicYear: "Computing - 2nd Year", roomNo: "102", block: "Block A" },
  { id: "SA102_4", name: "Isuru Ranasinghe", regNo: "UWU/AS/2021/063", academicYear: "Computing - 2nd Year", roomNo: "102", block: "Block A" },
  { id: "SA103_1", name: "Dasun Shanaka", regNo: "UWU/AS/2021/154", academicYear: "Science - 4th Year", roomNo: "103", block: "Block A" }
];

const INITIAL_COMPLAINTS = [
  {
    id: "COMP-101",
    studentName: "Suresh Silva",
    roomNo: "101",
    title: "Ceiling Fan Regulator Broken",
    category: "Electrical",
    priority: "medium",
    status: "pending",
    date: "2026-07-28",
    description: "The fan speed cannot be adjusted. It is stuck at maximum speed."
  },
  {
    id: "COMP-102",
    studentName: "Roshan Kumara",
    roomNo: "102",
    title: "Leaking Water Tap in bathroom",
    category: "Plumbing",
    priority: "high",
    status: "pending",
    date: "2026-07-30",
    description: "Water is continuously dripping from the wash basin faucet, causing a mess."
  },
  {
    id: "COMP-103",
    studentName: "Dasun Shanaka",
    roomNo: "103",
    title: "Study Chair Broken Leg",
    category: "Furniture",
    priority: "low",
    status: "pending",
    date: "2026-07-31",
    description: "One of the wooden chairs has a loose leg and is unsafe to sit on."
  },
  {
    id: "COMP-104",
    studentName: "Pasan Perera",
    roomNo: "204",
    title: "Fluorescent Light bulb Blown Out",
    category: "Electrical",
    priority: "medium",
    status: "in_progress", // Forwarded
    date: "2026-07-25",
    description: "Main tube light has blown. We are using table lamps currently."
  },
  {
    id: "COMP-105",
    studentName: "Malith Fernando",
    roomNo: "305",
    title: "Door Lock Jammed",
    category: "Security",
    priority: "high",
    status: "completed", // Resolved
    date: "2026-07-20",
    description: "The key gets stuck inside the lock cylinder while opening from outside."
  }
];

// Helper to seed localStorage
export const seedSubWardenData = () => {
  if (!localStorage.getItem("sw_config")) {
    localStorage.setItem("sw_config", JSON.stringify(DEFAULT_CONFIG));
  }

  const config = JSON.parse(localStorage.getItem("sw_config"));

  if (!localStorage.getItem("sw_students_pool")) {
    localStorage.setItem("sw_students_pool", JSON.stringify(DEFAULT_STUDENTS_POOL));
  }

  if (!localStorage.getItem("sw_allocations")) {
    localStorage.setItem("sw_allocations", JSON.stringify(INITIAL_ALLOCATIONS));
  }

  if (!localStorage.getItem("sw_complaints")) {
    localStorage.setItem("sw_complaints", JSON.stringify(INITIAL_COMPLAINTS));
  }

  // Generate Inventory if not present
  if (!localStorage.getItem("sw_inventory")) {
    const inventory = {};
    // Seed default inventory structure for each room
    for (let f = 1; f <= config.floorsCount; f++) {
      for (let r = 1; r <= config.roomsPerFloor; r++) {
        const roomNo = `${f}${r < 10 ? "0" + r : r}`;
        inventory[roomNo] = {
          beds: { count: config.roomCapacity, working: config.roomCapacity, damaged: 0 },
          fans: { count: 1, working: 1, damaged: 0 },
          bulbs: { count: 2, working: 2, damaged: 0 },
          chairs: { count: config.roomCapacity, working: config.roomCapacity - (Math.random() > 0.95 ? 1 : 0), damaged: 0 },
          desks: { count: config.roomCapacity, working: config.roomCapacity, damaged: 0 },
          cupboards: { count: config.roomCapacity, working: config.roomCapacity, damaged: 0 },
          mattresses: { count: config.roomCapacity, working: config.roomCapacity, damaged: 0 },
          bed_boards: { count: config.roomCapacity, working: config.roomCapacity, damaged: 0 }
        };
        // Introduce small random damages for realistic data
        if (roomNo === "101" || roomNo === "102") {
          inventory[roomNo].fans.damaged = 1;
          inventory[roomNo].fans.working = 0;
        }
        if (roomNo === "102") {
          inventory[roomNo].bulbs.damaged = 1;
          inventory[roomNo].bulbs.working = 1;
        }
        if (roomNo === "103") {
          inventory[roomNo].chairs.damaged = 1;
          inventory[roomNo].chairs.working = config.roomCapacity - 1;
        }
      }
    }
    localStorage.setItem("sw_inventory", JSON.stringify(inventory));
  }
};

// Seeding trigger
seedSubWardenData();

// Get config
export const getHostelConfig = () => {
  seedSubWardenData();
  return JSON.parse(localStorage.getItem("sw_config"));
};

// Set config and adjust inventory / room layout
export const updateHostelConfig = (newConfig) => {
  localStorage.setItem("sw_config", JSON.stringify(newConfig));
  
  // Re-generate or expand inventory to match new configuration structure
  const inventory = JSON.parse(localStorage.getItem("sw_inventory") || "{}");
  
  for (let f = 1; f <= newConfig.floorsCount; f++) {
    for (let r = 1; r <= newConfig.roomsPerFloor; r++) {
      const roomNo = `${f}${r < 10 ? "0" + r : r}`;
      if (!inventory[roomNo]) {
        inventory[roomNo] = {
          beds: { count: newConfig.roomCapacity, working: newConfig.roomCapacity, damaged: 0 },
          fans: { count: 1, working: 1, damaged: 0 },
          bulbs: { count: 2, working: 2, damaged: 0 },
          chairs: { count: newConfig.roomCapacity, working: newConfig.roomCapacity, damaged: 0 },
          desks: { count: newConfig.roomCapacity, working: newConfig.roomCapacity, damaged: 0 },
          cupboards: { count: newConfig.roomCapacity, working: newConfig.roomCapacity, damaged: 0 },
          mattresses: { count: newConfig.roomCapacity, working: newConfig.roomCapacity, damaged: 0 },
          bed_boards: { count: newConfig.roomCapacity, working: newConfig.roomCapacity, damaged: 0 }
        };
      } else {
        // Adjust capacities to match the new setting
        inventory[roomNo].beds.count = newConfig.roomCapacity;
        inventory[roomNo].chairs.count = newConfig.roomCapacity;
        inventory[roomNo].desks.count = newConfig.roomCapacity;
        inventory[roomNo].cupboards.count = newConfig.roomCapacity;
        inventory[roomNo].mattresses.count = newConfig.roomCapacity;
        inventory[roomNo].bed_boards.count = newConfig.roomCapacity;
      }
    }
  }
  
  localStorage.setItem("sw_inventory", JSON.stringify(inventory));
  return newConfig;
};

// Get unallocated students pool
export const getStudentsPool = () => {
  seedSubWardenData();
  return JSON.parse(localStorage.getItem("sw_students_pool"));
};

// Get current allocations
export const getAllocations = () => {
  seedSubWardenData();
  return JSON.parse(localStorage.getItem("sw_allocations"));
};

// Allocate a student to a room
export const allocateStudentToRoom = (student, roomNo, block = "Block A") => {
  const pool = getStudentsPool();
  const allocations = getAllocations();
  const config = getHostelConfig();

  // Check room occupancy limits
  const roomAllocationsCount = allocations.filter(a => a.roomNo === roomNo && a.block === block).length;
  if (roomAllocationsCount >= config.roomCapacity) {
    throw new Error(`Room ${roomNo} is already at its full capacity of ${config.roomCapacity} students!`);
  }

  // Remove from pool
  const updatedPool = pool.filter(s => s.id !== student.id);
  localStorage.setItem("sw_students_pool", JSON.stringify(updatedPool));

  // Add to allocations
  const newAllocation = {
    id: `SA_${Date.now()}`,
    name: student.name,
    regNo: student.regNo,
    academicYear: student.academicYear,
    roomNo: roomNo,
    block: block
  };
  allocations.push(newAllocation);
  localStorage.setItem("sw_allocations", JSON.stringify(allocations));

  return newAllocation;
};

// Remove student allocation
export const releaseStudentFromRoom = (allocationId) => {
  const pool = getStudentsPool();
  const allocations = getAllocations();

  const allocIndex = allocations.findIndex(a => a.id === allocationId);
  if (allocIndex === -1) return;

  const released = allocations[allocIndex];

  // Put back in unallocated pool
  pool.push({
    id: `S_${Date.now()}`,
    name: released.name,
    regNo: released.regNo,
    academicYear: released.academicYear,
    status: "UNALLOCATED"
  });

  // Remove from allocations
  const updatedAllocations = allocations.filter(a => a.id !== allocationId);

  localStorage.setItem("sw_students_pool", JSON.stringify(pool));
  localStorage.setItem("sw_allocations", JSON.stringify(updatedAllocations));
};

// Edit student details in a room allocation
export const editStudentAllocation = (id, updatedDetails) => {
  const allocations = getAllocations();
  const updatedAllocations = allocations.map(a => {
    if (a.id === id) {
      return { ...a, ...updatedDetails };
    }
    return a;
  });
  localStorage.setItem("sw_allocations", JSON.stringify(updatedAllocations));
};

// Get Inventory
export const getInventory = () => {
  seedSubWardenData();
  return JSON.parse(localStorage.getItem("sw_inventory"));
};

// Update item count/condition for room inventory
export const updateRoomInventory = (roomNo, itemKey, workingCount, damagedCount) => {
  const inventory = getInventory();
  if (!inventory[roomNo]) return;

  const item = inventory[roomNo][itemKey];
  if (!item) return;

  inventory[roomNo][itemKey] = {
    ...item,
    working: Number(workingCount),
    damaged: Number(damagedCount),
    count: Number(workingCount) + Number(damagedCount)
  };

  localStorage.setItem("sw_inventory", JSON.stringify(inventory));
  return inventory[roomNo];
};

// Get complaints
export const getComplaints = () => {
  seedSubWardenData();
  return JSON.parse(localStorage.getItem("sw_complaints"));
};

// Forward complaint to Maintenance Department (Set status to 'in_progress')
export const forwardComplaint = (complaintId) => {
  const complaints = getComplaints();
  const updated = complaints.map(c => {
    if (c.id === complaintId) {
      return { ...c, status: "in_progress" };
    }
    return c;
  });
  localStorage.setItem("sw_complaints", JSON.stringify(updated));
  return updated;
};

// Decline complaint (Set status to 'rejected')
export const declineComplaint = (complaintId) => {
  const complaints = getComplaints();
  const updated = complaints.map(c => {
    if (c.id === complaintId) {
      return { ...c, status: "rejected" };
    }
    return c;
  });
  localStorage.setItem("sw_complaints", JSON.stringify(updated));
  return updated;
};

// Add custom complaint (for student simulation or warden logging)
export const addComplaint = (newComplaint) => {
  const complaints = getComplaints();
  const complaint = {
    id: `COMP-${Date.now().toString().slice(-4)}`,
    date: new Date().toISOString().split('T')[0],
    status: "pending",
    ...newComplaint
  };
  complaints.unshift(complaint);
  localStorage.setItem("sw_complaints", JSON.stringify(complaints));
  return complaint;
};
