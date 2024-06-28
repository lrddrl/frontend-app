export interface Invoice {
    id: string;
    date: string;
    payee: string;
    description: string;
    dueDate: string;
    amount: number;
    status: string;
    vendor_name: string; 
    due_date: string; 
    paid: boolean; 
  }
  
  export interface User {
    id: string;
    email: string;
    username: string;
  }
  