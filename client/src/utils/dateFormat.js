export const formatDate = (date) => {
    try {
      const options = {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      };
  
      // Ensure the input date is in ISO format (e.g., "2023-09-17")
      const isoDate = new Date(date).toISOString().split('T')[0];
  
      return (new Date(isoDate)).toLocaleDateString("en-US", options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };
  