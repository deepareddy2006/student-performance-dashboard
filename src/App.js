import React, { useMemo, useState } from "react";
import Papa from "papaparse";
import jsPDF from "jspdf";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

export default function App() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState("all");
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("all");

  const mentorOptions = useMemo(
    () => [...new Set(students.map((s) => s.mentor).filter(Boolean))],
    [students]
  );

  const filtered = useMemo(() => {
    let data = [...students];

    if (selectedMentor !== "all") {
      data = data.filter((s) => s.mentor === selectedMentor);
    }

    if (activeView === "improved") {
      data = data.filter((s) => s.sem2 > s.sem1);
    } else if (activeView === "attention") {
      data = data.filter((s) => s.sem2 < s.sem1 || s.attendance < 75);
    }

    return data.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, selectedMentor, activeView, search]);

  const avgSem1 = filtered.length ? (filtered.reduce((a, s) => a + s.sem1, 0) / filtered.length).toFixed(1) : 0;
  const avgSem2 = filtered.length ? (filtered.reduce((a, s) => a + s.sem2, 0) / filtered.length).toFixed(1) : 0;
  const improved = filtered.filter((s) => s.sem2 > s.sem1).length;
  const attention = filtered.filter((s) => s.sem2 < s.sem1 || s.attendance < 75).length;

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => String(h).trim().toLowerCase(),
      complete: (res) => {
        const data = (res.data || [])
          .map((r) => ({
            mentor: String(r.mentor || "General Mentor").trim(),
            name: String(r.student || r.name || "").trim(),
            sem1: parseFloat(r.sem1 || 0),
            sem2: parseFloat(r.sem2 || 0),
            attendance: parseFloat(r.attendance || 0),
          }))
          .filter((s) => s.name);
        setStudents(data);
      },
    });
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("MENTORVISION - Multi Mentor Report", 20, 20);
    filtered.forEach((s, i) => {
      doc.text(`${s.mentor} | ${s.name} | ${s.sem1} | ${s.sem2} | ${s.attendance}%`, 20, 35 + i * 10);
    });
    doc.save("mentorvision_multi_mentor_report.pdf");
  };

  const glass = {
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.35)",
    borderRadius: 24,
    padding: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  };

  return (
    <div style={{ minHeight: "100vh", padding: 24, background: "linear-gradient(135deg,#dbeafe,#ede9fe,#fae8ff)", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center", fontSize: "2.6rem", color: "#312e81", marginBottom: 8 }}>MENTORVISION</h1>
      <p style={{ textAlign: "center", color: "#334155", marginBottom: 24 }}>Multi-Mentor Student Performance Analytics Dashboard</p>

      <div style={{ ...glass, marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <input type="file" accept=".csv" onChange={handleFile} />
        <select value={selectedMentor} onChange={(e) => setSelectedMentor(e.target.value)}>
          <option value="all">All Mentors</option>
          {mentorOptions.map((m, i) => <option key={i} value={m}>{m}</option>)}
        </select>
        <input placeholder="Search student" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={() => setActiveView("all")}>All</button>
        <button onClick={() => setActiveView("improved")}>🚀 Improved</button>
        <button onClick={() => setActiveView("attention")}>🚨 Attention</button>
        <button onClick={exportPDF}>📥 PDF</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginBottom: 20 }}>
        <div style={glass}>📘 Avg Prev: {avgSem1}</div>
        <div style={glass}>📗 Avg Curr: {avgSem2}</div>
        <div style={glass}>👨‍🏫 Mentors: {mentorOptions.length}</div>
        <div style={glass}>👥 Students: {filtered.length}</div>
      </div>

      {filtered.length > 0 && (
        <>
          <div style={glass}>
            <h2>📋 Multi-Mentor Comparison</h2>
            <table style={{ width: "100%", textAlign: "center" }}>
              <thead>
                <tr><th>Mentor</th><th>Student</th><th>Sem1</th><th>Sem2</th><th>Attendance</th></tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={i} style={{ cursor: "pointer" }} onClick={() => setSelectedStudent(s)}>
                    <td>{s.mentor}</td><td>{s.name}</td><td>{s.sem1}</td><td>{s.sem2}</td><td>{s.attendance}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 20, marginTop: 24 }}>
            <div style={glass}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filtered}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sem1" fill="#6366f1" />
                  <Bar dataKey="sem2" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={glass}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={filtered} dataKey="sem2" nameKey="name" outerRadius={100} label>
                    {filtered.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {selectedStudent && (
        <div onClick={() => setSelectedStudent(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ ...glass, width: 400 }} onClick={(e) => e.stopPropagation()}>
            <h2>👤 Student Profile</h2>
            <p><b>Mentor:</b> {selectedStudent.mentor}</p>
            <p><b>Name:</b> {selectedStudent.name}</p>
            <p><b>Sem1:</b> {selectedStudent.sem1}</p>
            <p><b>Sem2:</b> {selectedStudent.sem2}</p>
            <p><b>Attendance:</b> {selectedStudent.attendance}%</p>
            <button onClick={() => setSelectedStudent(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
