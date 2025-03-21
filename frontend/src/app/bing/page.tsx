"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const API_KEY = "YOUR_BING_API_KEY"; // Replace with your Bing Search API Key

interface Warranty {
  id: number;
  product_name: string;
  user_uid: string;
  ipfs_hash: string;
  uploaded_at: string;
  warranty_start_date: string;
  warranty_end_date: string;
  brand: string;
  model: string;
  serialNumber: string;
  status: string;
  image: string;
  reminderSet: boolean;
}

export default function WarrantyList({ user }: { user: any }) {
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchBingImage = async (query: string) => {
      try {
        const response = await fetch(
          `https://api.bing.microsoft.com/v7.0/images/search?q=${encodeURIComponent(query)}&count=1`,
          {
            headers: {
              "Ocp-Apim-Subscription-Key": API_KEY,
            },
          }
        );

        if (!response.ok) throw new Error("Bing API request failed");

        const data = await response.json();
        return data.value?.[0]?.contentUrl || null;
      } catch (error) {
        console.error("Error fetching Bing image:", error);
        return null;
      }
    };

    const fetchWarranties = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`http://127.0.0.1:5000/api/slip/?user_uid=${user.uid}`);

        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

        const data = await response.json();

        const processedData = await Promise.all(
          data.map(async (item: Warranty, index: number) => {
            const firstImage = await fetchBingImage(item.product_name);
            return {
              id: index + 1,
              product_name: item.product_name,
              user_uid: item.user_uid,
              ipfs_hash: item.ipfs_hash,
              uploaded_at: item.uploaded_at,
              warranty_start_date: item.warranty_start_date,
              warranty_end_date: item.warranty_end_date,
              brand: "Not specified",
              model: "Not specified",
              serialNumber: "Not specified",
              status: determineWarrantyStatus(item.warranty_end_date),
              image: firstImage || "/placeholder.svg?height=200&width=300",
              reminderSet: false,
            };
          })
        );

        setWarranties(processedData);
      } catch (err) {
        console.error("Error fetching warranty data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWarranties();
  }, [user]);

  const determineWarrantyStatus = (endDate: string) => {
    const today = new Date();
    const expiryDate = new Date(endDate);
    return expiryDate > today ? "active" : "expired";
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading warranties...</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warranties.map((warranty) => (
            <li key={warranty.id} className="border p-4 rounded-md shadow">
              <h3 className="text-lg font-semibold">{warranty.product_name}</h3>
              <div className="w-full h-40 relative">
                <Image
                  src={warranty.image}
                  alt={warranty.product_name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
              <p className="mt-2 text-sm">Status: <span className="font-bold">{warranty.status}</span></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
