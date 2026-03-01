const BASE_URL = "http://localhost:2000";

const getToken = () => localStorage.getItem("token");

export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
};

export const signup = (data: { username: string; password: string }) =>
  apiClient<{
    message: string;
    data: { user: { id: string; username: string } };
  }>("/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const signin = (data: { username: string; password: string }) =>
  apiClient<{ message: string; data: { token: string } }>("/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const createWorkflow = (data: { nodes: any[]; edges: any[] }) =>
  apiClient<{ message: string; data: { workflow: any } }>("/workflow", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getWorkflow = (id: string) =>
  apiClient<{ data: { existingworkflow: any } }>(`/workflow/${id}`);

export const getWorkflows = () =>
  apiClient<{ data: { existingworkflows: any[] } }>("/workflows");

export const getExecutions = (workflowId: string) =>
  apiClient<{ data: { executions: any[] } }>(`/executions/${workflowId}`);

export const getGoogleAuthStatus = () =>
  apiClient<{ data: { oauth: boolean } }>("/auth/google/status");
