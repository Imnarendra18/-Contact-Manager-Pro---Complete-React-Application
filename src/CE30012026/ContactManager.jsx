import React, { useState, useRef } from "react";

const ContactManager = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    mobile: "",
    email: "",
    profileImage: null,
    imagePreview: null,
  });

  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    firstname: "",
    lastname: "",
    mobile: "",
    email: "",
    profileImage: null,
    imagePreview: null,
  });

  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (editingId) {
          setEditForm({
            ...editForm,
            profileImage: file,
            imagePreview: reader.result,
          });
        } else {
          setForm({
            ...form,
            profileImage: file,
            imagePreview: reader.result,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    if (editingId) {
      setEditForm({
        ...editForm,
        profileImage: null,
        imagePreview: null,
      });
    } else {
      setForm({
        ...form,
        profileImage: null,
        imagePreview: null,
      });
    }
  };

  const handleSubmit = () => {
    if (!form.firstname || !form.lastname || !form.mobile) {
      alert("Please fill all required fields!");
      return;
    }

    const newRecord = {
      ...form,
      id: Date.now(),
      showDetails: false,
      imageUrl: form.imagePreview || `https://ui-avatars.com/api/?name=${form.firstname}+${form.lastname}&background=646cff&color=fff`,
    };

    setRecords([...records, newRecord]);
    setForm({
      firstname: "",
      lastname: "",
      mobile: "",
      email: "",
      profileImage: null,
      imagePreview: null,
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startEdit = (record) => {
    setEditingId(record.id);
    setEditForm({
      firstname: record.firstname,
      lastname: record.lastname,
      mobile: record.mobile,
      email: record.email || "",
      imagePreview: record.imageUrl,
    });
  };

  const handleUpdate = () => {
    if (!editForm.firstname || !editForm.lastname || !editForm.mobile) {
      alert("Please fill all required fields!");
      return;
    }

    setRecords(
      records.map((r) =>
        r.id === editingId
          ? {
              ...r,
              ...editForm,
              showDetails: false,
              imageUrl: editForm.imagePreview || `https://ui-avatars.com/api/?name=${editForm.firstname}+${editForm.lastname}&background=646cff&color=fff`,
            }
          : r
      )
    );

    setEditingId(null);
    setEditForm({
      firstname: "",
      lastname: "",
      mobile: "",
      email: "",
      profileImage: null,
      imagePreview: null,
    });

    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      firstname: "",
      lastname: "",
      mobile: "",
      email: "",
      profileImage: null,
      imagePreview: null,
    });

    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  };

  const toggleView = (id) => {
    setRecords(
      records.map((r) =>
        r.id === id ? { ...r, showDetails: !r.showDetails } : r
      )
    );
  };

  const deleteRecord = (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      setRecords(records.filter((r) => r.id !== id));
    }
  };

  const getInitials = (firstname, lastname) => {
    return `${firstname?.charAt(0) || ""}${lastname?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ color: "#646cff", textAlign: "center", marginBottom: "30px" }}>
        👥 Contact Manager with Profiles
      </h1>

      {/* Add/Edit Form */}
      <div
        style={{
          padding: "25px",
          border: "1px solid #444",
          borderRadius: "15px",
          marginBottom: "30px",
          backgroundColor: "#1a1a1a",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginTop: 0, display: "flex", alignItems: "center", gap: "10px" }}>
          {editingId ? "✏️ Edit Contact" : "➕ Add New Contact"}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "25px" }}>
          {/* Left Column - Profile Image */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <div
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid #646cff",
                position: "relative",
                backgroundColor: "#2a2a2a",
              }}
            >
              {(editingId ? editForm.imagePreview : form.imagePreview) ? (
                <img
                  src={editingId ? editForm.imagePreview : form.imagePreview}
                  alt="Profile Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "48px",
                    color: "#646cff",
                    fontWeight: "bold",
                  }}
                >
                  {getInitials(
                    editingId ? editForm.firstname : form.firstname,
                    editingId ? editForm.lastname : form.lastname
                  ) || "👤"}
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={editingId ? editFileInputRef : fileInputRef}
                style={{ display: "none" }}
              />
              <button
                onClick={() =>
                  editingId
                    ? editFileInputRef.current?.click()
                    : fileInputRef.current?.click()
                }
                style={{
                  padding: "10px",
                  backgroundColor: "#535bf2",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                📷 Upload Image
              </button>
              {(editingId ? editForm.imagePreview : form.imagePreview) && (
                <button
                  onClick={removeImage}
                  style={{
                    padding: "10px",
                    backgroundColor: "#ff4444",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  🗑️ Remove Image
                </button>
              )}
              <p style={{ fontSize: "12px", color: "#888", textAlign: "center" }}>
                Max 5MB • JPG, PNG, GIF
              </p>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#aaa" }}>
                  First Name *
                </label>
                <input
                  name="firstname"
                  placeholder="Enter first name"
                  value={editingId ? editForm.firstname : form.firstname}
                  onChange={editingId ? handleEditChange : handleChange}
                  style={{ padding: "12px", fontSize: "16px", borderRadius: "8px", width: "100%" }}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#aaa" }}>
                  Last Name *
                </label>
                <input
                  name="lastname"
                  placeholder="Enter last name"
                  value={editingId ? editForm.lastname : form.lastname}
                  onChange={editingId ? handleEditChange : handleChange}
                  style={{ padding: "12px", fontSize: "16px", borderRadius: "8px", width: "100%" }}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#aaa" }}>
                  Mobile Number *
                </label>
                <input
                  name="mobile"
                  placeholder="Enter mobile number"
                  value={editingId ? editForm.mobile : form.mobile}
                  onChange={editingId ? handleEditChange : handleChange}
                  style={{ padding: "12px", fontSize: "16px", borderRadius: "8px", width: "100%" }}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#aaa" }}>
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={editingId ? editForm.email : form.email}
                  onChange={editingId ? handleEditChange : handleChange}
                  style={{ padding: "12px", fontSize: "16px", borderRadius: "8px", width: "100%" }}
                />
              </div>
            </div>

            <div style={{ marginTop: "10px" }}>
              {editingId ? (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={handleUpdate}
                    style={{
                      flex: 1,
                      padding: "14px",
                      fontSize: "16px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    ✅ Update Contact
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      flex: 1,
                      padding: "14px",
                      fontSize: "16px",
                      backgroundColor: "#ff9800",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: "14px",
                    fontSize: "16px",
                    backgroundColor: "#646cff",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    width: "100%",
                  }}
                >
                  ➕ Add Contact
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact List */}
      <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        📋 Contacts ({records.length})
        {editingId && (
          <span style={{ color: "#ff9800", fontSize: "14px", marginLeft: "10px" }}>
            (Editing mode active)
          </span>
        )}
      </h2>

      {records.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            border: "2px dashed #444",
            borderRadius: "15px",
            color: "#888",
            backgroundColor: "#1a1a1a",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>👥</div>
          <p style={{ fontSize: "20px", marginBottom: "10px" }}>No contacts yet</p>
          <p>Add your first contact with a profile picture!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
          {records.map((r) => (
            <div
              key={r.id}
              style={{
                padding: "20px",
                border: editingId === r.id ? "3px solid #4CAF50" : "1px solid #444",
                borderRadius: "15px",
                backgroundColor: editingId === r.id ? "#1e2a1e" : "#1a1a1a",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                {/* Profile Image */}
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid #646cff",
                    flexShrink: 0,
                    backgroundColor: "#2a2a2a",
                  }}
                >
                  {r.imageUrl ? (
                    <img
                      src={r.imageUrl}
                      alt={`${r.firstname} ${r.lastname}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        color: "#646cff",
                        fontWeight: "bold",
                        backgroundColor: "#2a2a2a",
                      }}
                    >
                      {getInitials(r.firstname, r.lastname)}
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <strong style={{ fontSize: "18px", color: editingId === r.id ? "#4CAF50" : "inherit" }}>
                        {r.firstname} {r.lastname}
                      </strong>
                      <div style={{ marginTop: "5px", color: "#aaa" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          📱 {r.mobile}
                        </div>
                        {r.email && (
                          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "3px" }}>
                            ✉️ {r.email}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => toggleView(r.id)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#535bf2",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        {r.showDetails ? "👁️ Hide" : "👁️ View"}
                      </button>
                      <button
                        onClick={() => startEdit(r)}
                        disabled={editingId && editingId !== r.id}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: editingId === r.id ? "#4CAF50" : "#ff9800",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: editingId && editingId !== r.id ? "not-allowed" : "pointer",
                          opacity: editingId && editingId !== r.id ? 0.5 : 1,
                          fontSize: "12px",
                        }}
                      >
                        {editingId === r.id ? "✏️ Editing..." : "✏️ Edit"}
                      </button>
                      <button
                        onClick={() => deleteRecord(r.id)}
                        disabled={editingId !== null}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#ff4444",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: editingId !== null ? "not-allowed" : "pointer",
                          opacity: editingId !== null ? 0.5 : 1,
                          fontSize: "12px",
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  {r.showDetails && (
                    <div
                      style={{
                        marginTop: "15px",
                        padding: "15px",
                        backgroundColor: "#242424",
                        borderRadius: "10px",
                        borderLeft: "4px solid #646cff",
                      }}
                    >
                      <h4 style={{ marginTop: 0, display: "flex", alignItems: "center", gap: "5px" }}>
                        📄 Details
                      </h4>
                      <div style={{ display: "grid", gap: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#aaa" }}>Full Name:</span>
                          <span>{r.firstname} {r.lastname}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#aaa" }}>Mobile:</span>
                          <span>{r.mobile}</span>
                        </div>
                        {r.email && (
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#aaa" }}>Email:</span>
                            <span>{r.email}</span>
                          </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#aaa" }}>ID:</span>
                          <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#888" }}>
                            {r.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Stats */}
      {records.length > 0 && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "#2a2a2a",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <h4 style={{ margin: 0, color: "#646cff" }}>📊 Contact Statistics</h4>
            <p style={{ margin: "5px 0 0 0", color: "#aaa", fontSize: "14px" }}>
              Total Contacts: <strong>{records.length}</strong> • 
              With Email: <strong>{records.filter(r => r.email).length}</strong> • 
              With Images: <strong>{records.filter(r => r.imageUrl && !r.imageUrl.includes('ui-avatars')).length}</strong>
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => {
                if (records.length > 0) {
                  alert(`You have ${records.length} contact${records.length > 1 ? 's' : ''} in your address book.`);
                }
              }}
              style={{
                padding: "10px 15px",
                backgroundColor: "#646cff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              📊 View Stats
            </button>
            <button
              onClick={() => {
                if (editingId) cancelEdit();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                padding: "10px 15px",
                backgroundColor: "#535bf2",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              ⬆️ Back to Top
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManager;