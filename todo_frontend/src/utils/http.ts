export const handleApiError = (error: any) => {
    console.error("API Error:", error);
    throw error;
  };