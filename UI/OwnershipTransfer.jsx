"use client";

import React, { useState } from "react";

const OwnershipTransfer: React.FC = () => {
  const [warrantyId, setWarrantyId] = useState<string>("");
  const [newOwner, setNewOwner] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleTransfer = async () => {
    if (!warrantyId.trim() || !newOwner.trim()) {
      alert("Please enter a valid Warranty ID and new owner address.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/api/transfer-ownership/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ warrantyId, newOwner }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Ownership transferred successfully to ${newOwner}`);
      } else {
        setMessage(data.error || "Failed to transfer ownership.");
      }
    } catch (error) {
      setMessage("Error connecting to the backend.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Transfer Warranty Ownership</h2>
      <input
        type="text"
        placeholder="Enter Warranty ID"
        value={warrantyId}
        onChange={(e) => setWarrantyId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter New Owner Address"
        value={newOwner}
        onChange={(e) => setNewOwner(e.target.value)}
      />
      <button onClick={handleTransfer} disabled={loading}>
        {loading ? "Processing..." : "Transfer Ownership"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default OwnershipTransfer;
