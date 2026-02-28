import { useMutation, useQuery } from "@tanstack/react-query";
import { signup, signin, createWorkflow, getWorkflow, getWorkflows } from "../api/client";

export const useSignup = () => {
  return useMutation({
    mutationFn: signup,
  });
};

export const useSignin = () => {
  return useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.token);
    },
  });
};

export const useCreateWorkflow = () => {
  return useMutation({
    mutationFn: createWorkflow,
  });
};

export const useGetWorkflow = (id: string) => {
  return useQuery({
    queryKey: ["workflow", id],
    queryFn: () => getWorkflow(id),
    enabled: !!id,
  });
};

export const useGetWorkflows = () => {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: getWorkflows,
  });
};
