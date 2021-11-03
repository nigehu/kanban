export default async function fetchUrl<T = any>(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body?: any
): Promise<T> {
  const response = await new Promise<T>(async (resolve, reject) => {
    const options = {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(`/api/${url}/`, options);
    if (response.status === 401 || response.status === 204) {
      console.log("Success!");
      return;
    }
    try {
      const data: T = await response.json();
      if (response.ok) {
        resolve(data);
      } else {
        reject(data);
      }
    } catch (err) {
      console.error(err);
      if (response.ok) {
        reject(err);
      }
    }
  });
  return response;
}
