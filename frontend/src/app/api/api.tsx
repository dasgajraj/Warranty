export interface Warranty {
    product_name: string;
    user_uid: string;
    ipfs_hash: string;
    uploaded_at: string;
    warranty_end_date: string;
}

export const fetchWarranties = async (): Promise<Warranty[]> => {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/slip/");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Warranty[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching warranties:", error);
        return [];
    }
};
