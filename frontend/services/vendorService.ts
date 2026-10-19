import apiClient from "./apiClient";
import type { Vendor, VendorListResponse } from "@/types/vendor";

export const getInventory = () => apiClient.get("/vendor/inventory");
export const getAnalytics = () => apiClient.get("/vendor/analytics");
export const getEarnings = () => apiClient.get("/vendor/earnings");

// TEMP (per team lead): the backend /vendors endpoint isn't ready yet, so
// getVendors() serves ~10 dummy vendors matching the Figma design instead
// of surfacing a fetch error on the Select Vendor page. The function
// signature and return shape already match the real API contract below,
// so switching back later is a one-line change.
const MOCK_VENDORS: Vendor[] = [
  {
    id: "v1",
    name: "BlueFlame Gas",
    badge: "Top Rated",
    rating: 4.9,
    reviewCount: 257,
    distanceKm: 1.2,
    etaMinutes: 20,
    pricePerUnit: 14950,
    weightKg: 12.5,
    available: true,
  },
  {
    id: "v2",
    name: "GasHub Station",
    badge: "High risk",
    rating: 1.5,
    reviewCount: 20,
    distanceKm: 2.5,
    etaMinutes: 20,
    pricePerUnit: 14950,
    weightKg: 12.5,
    available: true,
  },
  {
    id: "v3",
    name: "GasPro Energy",
    badge: "Verified",
    rating: 4.9,
    reviewCount: 257,
    distanceKm: 1.2,
    etaMinutes: 20,
    pricePerUnit: 14950,
    weightKg: 12.5,
    available: true,
  },
  {
    id: "v4",
    name: "MegaGas Hub",
    badge: "Verified",
    rating: 4.9,
    reviewCount: 257,
    distanceKm: 2.5,
    etaMinutes: 20,
    pricePerUnit: 14950,
    weightKg: 12.5,
    available: false,
  },
  {
    id: "v5",
    name: "BlueFlame Gas",
    badge: "Verified",
    rating: 4.9,
    reviewCount: 257,
    distanceKm: 1.2,
    etaMinutes: 20,
    pricePerUnit: 14950,
    weightKg: 12.5,
    available: true,
  },
  {
    id: "v6",
    name: "MegaGas Hub",
    badge: "Top Rated",
    rating: 4.9,
    reviewCount: 257,
    distanceKm: 1.2,
    etaMinutes: 20,
    pricePerUnit: 14950,
    weightKg: 12.5,
    available: true,
  },
  {
    id: "v7",
    name: "QuickGas Supply",
    badge: "Verified",
    rating: 4.7,
    reviewCount: 138,
    distanceKm: 3.1,
    etaMinutes: 25,
    pricePerUnit: 15200,
    weightKg: 12.5,
    available: true,
  },
  {
    id: "v8",
    name: "SafeGas Ltd",
    badge: "Top Rated",
    rating: 4.8,
    reviewCount: 302,
    distanceKm: 1.8,
    etaMinutes: 18,
    pricePerUnit: 14800,
    weightKg: 12.5,
    available: true,
  },
  {
    id: "v9",
    name: "CityGas Depot",
    rating: 4.2,
    reviewCount: 64,
    distanceKm: 4.0,
    etaMinutes: 30,
    pricePerUnit: 15500,
    weightKg: 12.5,
    available: true,
  },
  {
    id: "v10",
    name: "PrimeFlame Vendors",
    badge: "Verified",
    rating: 4.6,
    reviewCount: 95,
    distanceKm: 2.0,
    etaMinutes: 22,
    pricePerUnit: 14950,
    weightKg: 12.5,
    available: true,
  },
];

export const getVendors = async (params?: {
  page?: number;
  limit?: number;
}): Promise<{ data: VendorListResponse }> => {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 6;
  const start = (page - 1) * limit;
  const end = start + limit;

  // Small simulated delay so the existing loading state still renders.
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    data: {
      vendors: MOCK_VENDORS.slice(start, end),
      hasMore: end < MOCK_VENDORS.length,
    },
  };

  // Real implementation, once the backend route exists:
  // return apiClient.get<VendorListResponse>("/vendors", { params });
};
