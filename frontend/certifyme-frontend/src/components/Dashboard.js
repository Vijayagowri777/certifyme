import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technical");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName"); // display logged-in name

  const fetchCertificates = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/certificates", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCertificates(Array.isArray(data) ? data : []); // ensure it's an array
  } catch (err) {
    console.error(err);
    setCertificates([]); // fallback to empty array
  }
};

  useEffect(() => {
    if (token) fetchCertificates();
  }, []);

  // Upload certificate
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/certificates", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      setMessage(data.message || "Uploaded successfully!");
      setTitle("");
      setCategory("Technical");
      setFile(null);
      fetchCertificates(); // refresh list
    } catch (err) {
      setMessage("Error uploading certificate");
      console.error(err);
    }
  };

  // Delete certificate
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/certificates/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessage(data.message || "Deleted successfully!");
      fetchCertificates();
    } catch (err) {
      setMessage("Error deleting certificate");
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {userName}</h2>

      <form onSubmit={handleUpload} className="upload-form">
        <input
          type="text"
          placeholder="Certificate Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Technical">Technical</option>
          <option value="Non-Technical">Non-Technical</option>
          <option value="Academic">Academic</option>
        </select>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        <button type="submit">Upload Certificate</button>
      </form>

      {message && <p className="message">{message}</p>}

      <h3>Your Certificates</h3>
      <div className="certificate-list">
        {certificates?.length === 0 ? (
  <p>No certificates uploaded yet.</p>
) : (
  certificates?.map((cert) => (
    <div key={cert._id} className="certificate-item">
      <p><strong>{cert.title}</strong> ({cert.category})</p>
      {cert.image && (
        <img
          src={`http://localhost:5000/${cert.image.replace("\\", "/")}`}
          alt={cert.title}
        />
      )}
      <button onClick={() => handleDelete(cert._id)}>Delete</button>
    </div>
  ))
)}

      </div>
    </div>
  );
};

export default Dashboard;
