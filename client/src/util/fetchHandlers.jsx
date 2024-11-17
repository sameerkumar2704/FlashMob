export async function getDetails(url) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json", // Set content type if necessary
    },
    credentials: "include",
  });
  const userDetail = await res.json();
  return userDetail;
}
export async function postDetails(url, body) {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const result = await res.json();
  return result;
}
