import React from "react";
import StudentTable from "./StudentTable";
import Charts from "./Charts";

const students = [
  { name: "Rahul", marks: 85, attendance: 92 },
  { name: "Priya", marks: 78, attendance: 95 },
  { name: "Aman", marks: 92, attendance: 98 },
  { name: "Sneha", marks: 65, attendance: 85 },
  { name: "Kiran", marks: 88, attendance: 93 }
];

function Dashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Student Performance Dashboard</h1>
      <StudentTable students={students} />
      <Charts students={students} />
    </div>
  );
}

export default Dashboard;