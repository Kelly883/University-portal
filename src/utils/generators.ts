export const generateMatricNumber = (faculty: string, department: string): string => {
  const year = new Date().getFullYear().toString().slice(-2);
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const randomNumber = Math.floor(10 + Math.random() * 90);
  return `${faculty.slice(0, 3).toUpperCase()}/${department.slice(0, 3).toUpperCase()}/${year}${month}${randomNumber}`;
};

export const generateStaffId = (faculty: string, department: string): string => {
  const year = new Date().getFullYear().toString();
  const date = new Date().getDate().toString().padStart(2, '0');
  const randomNumber = Math.floor(10 + Math.random() * 90);
  return `${faculty.slice(0, 3).toUpperCase()}/${department.slice(0, 3).toUpperCase()}/${date}/${year}/${randomNumber}`;
};
