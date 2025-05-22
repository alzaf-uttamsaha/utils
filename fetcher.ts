"use server";
import { auth } from "@/auth";
// export async function fetcher(url: string, method = "GET", data?: any) {
//   const formData = data
//     ? data instanceof FormData
//       ? data
//       : JSON.stringify(data)
//     : null;
//   const session = await auth();

//   console.log("Session: ", session);

//   const headers: Record<string, string> = {
//     authorization: `Bearer ${session?.user?.access_token || ""}`
//   };

//   if (!(data instanceof FormData)) {
//     headers["Content-Type"] = "application/json";
//   }

//   const res = await fetch(url, {
//     method: method,
//     headers: headers,
//     body: formData,
//     cache: "no-store"
//   });
//   try {
//     return await res.json();
//   } catch (e) {
//     return {
//       success: false,
//       status: res.status,
//       message: "Something went wrong"
//     };
//   }
// }

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: object | FormData;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

// Define a response type that includes all possible return properties
type ApiResponse = {
  status: number;
  success?: boolean;
  error?: any;
  [key: string]: any;
};

export async function fetcher(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse> {
  const session = await auth();

  // Merge default headers with provider-specific headers and custom headers
  const headers: Record<string, string> = {
    Authorization: `Bearer ${session?.user?.access_token}`,
    ...options.headers
  };

  // If the body is FormData, don't set Content-Type to application/json
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const url = `${process.env.API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: options.method || "GET",
      headers,
      body:
        options.body instanceof FormData
          ? options.body
          : options.body
          ? JSON.stringify(options.body)
          : undefined,
      cache: options.cache,
      next: options.next
    });

    if (
      !response.ok ||
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      const errorText = await response.json();
      return {
        success: false,
        error:
          errorText?.errors || errorText?.error || errorText?.message || "Something went wrong",
        status: response.status,
      };
    }

    const data = await response.json();

    return {
      ...data,
      status: response.status,
      success: true
    };
  } catch (error: any) {
    return {
      status: 500,
      success: false,
      error: error.message || "Something went wrong"
    };
  }
}
