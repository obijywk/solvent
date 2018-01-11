import { ErrorResponse } from "../api/error_response";

declare const gtag: any;

export function apiFetch<T>(url: string, body: any): Promise<T> {
  const startTime = Date.now();
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
        const description = errorDetails.join(", ");
        gtag("event", "exception", {
          description,
        });
        throw new Error(description);
      });
    } else {
      gtag("event", "timing_complete", {
        event_category: "api_fetch",
        name: url,
        value: Date.now() - startTime,
      });
      return response.json();
    }
  });
}
