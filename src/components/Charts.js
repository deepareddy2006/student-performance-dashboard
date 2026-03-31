import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

function Charts({ students }) {
  return (
    <BarChart width={500} height={300} data={students}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="marks" fill="#8884d8" />
    </BarChart>
  );
}

export default Charts;