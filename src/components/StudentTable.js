import React from "react";

function StudentTable({ students }) {
  return (
    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>Name</th>
          <th>Marks</th>
          <th>Attendance</th>
        </tr>
      </thead>
      <tbody>
        {students.map((s, i) => (
          <tr key={i}>
            <td>{s.name}</td>
            <td>{s.marks}</td>
            <td>{s.attendance}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default StudentTable;