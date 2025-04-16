import {createSlice, configureStore} from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Function to generate multiple employees with unique IDs
const generateEmployees = (count) => {
  const employees = [];
  for (let i = 0; i < count; i++) {
    employees.push({
      id: `emp-${i + 1}`,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '555-123-4567',
      dateOfEmployment: '2020-01-01',
      dateOfBirth: '1990-01-01',
      department: 'Engineering',
      position: 'Senior Developer'
    });
  }
  return employees;
};

// Initial state
const initialState = {
  employees: generateEmployees(100)
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    addEmployee: (state, action) => {
      state.employees.push(action.payload);
      localStorage.setItem('employees', JSON.stringify(state.employees));
    },
    editEmployee: (state, action) => {
      const index = state.employees.findIndex(emp => emp.id === action.payload.id);
      if (index !== -1) {
        const newEmployees = [...state.employees];
        newEmployees[index] = { ...action.payload };
        state.employees = newEmployees;
        localStorage.setItem('employees', JSON.stringify(state.employees));
      }
    },
    deleteEmployee: (state, action) => {
      state.employees = state.employees.filter(emp => emp.id !== action.payload);
      localStorage.setItem('employees', JSON.stringify(state.employees));
    }
  }
});

export const {addEmployee, editEmployee, deleteEmployee} = employeesSlice.actions;

export const store = configureStore({
  reducer: employeesSlice.reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    })
});
