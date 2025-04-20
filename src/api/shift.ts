import { toast } from "react-toastify";
import axios from "axios";

const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export async function startShift(startCash: number) {
  try {
    const response = await axios.post(
      `${base_url}/shift/start`,
      { startCash },
      getAuthHeader()
    );

    toast.success("Shift Started!");
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const errorMessage =
        err.response?.data?.message || "Failed to start the shift.";

      if (err.response?.status === 400) {
        toast.error(errorMessage);
      } else if (err.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("An error occurred while starting the shift.");
      }
    } else {
      toast.error("An unexpected error occurred.");
    }

    console.error("Start shift failed:", err);
    throw err;
  }
}

export async function checkActiveShift() {
  try {
    const response = await axios.get(
      `${base_url}/shift/check-active`,
      getAuthHeader()
    );

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      toast.error("Failed to check shift status.");
      console.error(
        "Check active shift failed:",
        err.response?.data || err.message
      );
    } else {
      toast.error("An unexpected error occurred.");
      console.error("Check active shift failed:", err);
    }

    throw err;
  }
}

export async function getShift() {
  try {
    const response = await axios.get(`${base_url}/shift`, getAuthHeader());
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      toast.error("Failed to retrieve shift data.");
      console.error("Get shift failed:", err.response?.data || err.message);
    } else {
      toast.error("An unexpected error occurred.");
      console.error("Get shift failed:", err);
    }

    throw err;
  }
}

export async function endShift(endCash: number) {
  try {
    const response = await axios.post(
      `${base_url}/shift/end`,
      { endCash },
      getAuthHeader()
    );

    toast.success("Shift ended successfully.");
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const errorMessage =
        err.response?.data?.message || "Failed to end shift.";

      if (err.response?.status === 400) {
        toast.error(errorMessage);
      } else if (err.response?.status === 500) {
        toast.error("Server error occurred. Please try again later.");
      } else {
        toast.error("An error occurred while ending the shift.");
      }
    } else {
      toast.error("An unexpected error occurred.");
    }

    console.error("End shift failed:", err);
    throw err;
  }
}
