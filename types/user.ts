export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  status: string;
  dateOfBirth?: string;
  roles: string[];
  employeeId: string;
  position?: string;
  employmentEndDate?: string;
  employmentType?: string;
  createdAt?: string;
  updatedAt?: string;
}
