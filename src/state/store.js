import {createSlice, configureStore} from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

// Function to generate multiple employees with unique IDs
const generateEmployees = (count) => {
  const departments = ['Analytics', 'Tech'];
  const positions = ['Junior', 'Medior', 'Senior'];
  
  const employees = [];
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const phoneNumber = faker.phone.number();
    const dateOfEmployment = faker.date.past({ years: 5 }).toISOString().split('T')[0];
    const dateOfBirth = faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0];
    const department = faker.helpers.arrayElement(departments);
    const position = faker.helpers.arrayElement(positions);

    employees.push({
      id: `emp-${i + 1}`,
      firstName,
      lastName,
      email,
      phoneNumber,
      dateOfEmployment,
      dateOfBirth,
      department,
      position
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
