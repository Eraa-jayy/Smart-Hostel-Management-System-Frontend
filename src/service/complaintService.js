import api from "./axios";

// =========================================================
// API-Backed Complaint Service
// Note: Removed all localStorage mock data and seed functions.
// Status Mapping:
// Backend: PENDING, FORWARDED, IN_PROGRESS, DECLINED, RESOLVED
// Frontend maps to lowercase versions for easier internal use if needed,
// but let's stick to backend exact statuses for simplicity.
// =========================================================

// --- Student Actions ---

export const getMyComplaints = async () => {
  try {
    const { data } = await api.get("/complaints/my-complaints");
    return data;
  } catch (error) {
    console.error("Failed to load complaints", error);
    throw error;
  }
};

export const submitComplaint = async (complaintData, photoFile) => {
  try {
    const formData = new FormData();
    
    // We only need to send title, description, category. studentId and roomId are derived from auth.
    const complaintDto = {
      title: complaintData.title,
      description: complaintData.description,
      category: complaintData.category,
    };

    formData.append(
      "complaint",
      new Blob([JSON.stringify(complaintDto)], { type: "application/json" })
    );

    // Also append form fields for maximum backend compatibility
    formData.append("title", complaintData.title);
    formData.append("description", complaintData.description);
    formData.append("category", complaintData.category);

    if (photoFile) {
      formData.append("photo", photoFile);
    }

    // In Axios, setting "Content-Type": undefined clears the default "application/json"
    // and lets the browser automatically set "multipart/form-data; boundary=----WebKit..."
    const { data } = await api.post("/complaints", formData, {
      headers: {
        "Content-Type": undefined,
      },
    });
    
    return data;
  } catch (error) {
    console.error("Failed to submit complaint", error);
    throw error;
  }
};


// --- Sub Warden Actions ---

export const getSubWardenComplaints = async () => {
  try {
    const { data } = await api.get("/complaints/subwarden");
    return data;
  } catch (error) {
    console.error("Failed to load Sub Warden complaints", error);
    throw error;
  }
};

export const forwardComplaintToApi = async (complaintId, remarks = "") => {
  try {
<<<<<<< Updated upstream
    const { data } = await api.put(`/complaints/${complaintId}/forward`, null, { params: { remarks } });
    return toPortalComplaint(data);
  } catch {
    const updated = forwardComplaint(complaintId, remarks);
    return updated.find((c) => c.id === complaintId) || null;
=======
    const { data } = await api.put(`/complaints/${complaintId}/forward`, null, {
      params: { remarks },
    });
    return data;
  } catch (error) {
    console.error("Failed to forward complaint", error);
    throw error;
>>>>>>> Stashed changes
  }
};

export const declineComplaintToApi = async (complaintId, remarks = "") => {
  try {
<<<<<<< Updated upstream
    const { data } = await api.put(`/complaints/${complaintId}/decline`, null, { params: { remarks } });
    return toPortalComplaint(data);
  } catch {
    const updated = declineComplaint(complaintId, remarks);
    return updated.find((c) => c.id === complaintId) || null;
=======
    const { data } = await api.put(`/complaints/${complaintId}/decline`, null, {
      params: { remarks },
    });
    return data;
  } catch (error) {
    console.error("Failed to decline complaint", error);
    throw error;
>>>>>>> Stashed changes
  }
};

// --- General (Admin/Student Affairs) Actions ---

export const getAllComplaints = async () => {
  try {
    const { data } = await api.get("/complaints");
    return data;
  } catch (error) {
    console.error("Failed to load all complaints", error);
    throw error;
  }
};

// Compatibility aliases
export const forwardComplaint = forwardComplaintToApi;
export const declineComplaint = declineComplaintToApi;

