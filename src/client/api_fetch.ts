import { ErrorResponse } from "../api/error_response";

export function apiFetch<T>(url: string, body: any): Promise<T> {
  return fetch(url, {
    body: JSON.stringify(body),
    headers: new Headers({ "Content-Type": "application/json" }),
    method: "POST",
  }).then((response) => {
    if (!response.ok) {
      return response.json().then((errorResponse: ErrorResponse) => {
        const errorDetails = [];
        for (const error of errorResponse.errors) {
          errorDetails.push(error.detail);
        }
        throw new Error(errorDetails.join(", "));
      });
    } else {
      return response.json();
    }
  });
}
