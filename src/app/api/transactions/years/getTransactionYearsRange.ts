import { auth } from "@clerk/nextjs/server";

export async function getTransactionYearsRange() {
  const { userId, getToken } = await auth();
  if (!userId) {
    return [];
  }

  const token = await getToken();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const res = await fetch(`${baseUrl}/api/transactions/years`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch years range:", res.statusText);
    return [];
  }

  const data = await res.json();

  if ("error" in data) {
    console.error("Error in response:", data.error);
    return [];
  }

  return data;
}
