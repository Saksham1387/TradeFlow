import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useGetWorkflows, useGetExecutions } from "@/api/hooks";
import { Button } from "@/components/ui/button";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetWorkflows();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: executionsData, isLoading: executionsLoading } =
    useGetExecutions(selectedId || "");

  const workflows = data?.data?.existingworkflows ?? [];
  const selectedWorkflow = workflows.find((w: any) => w._id === selectedId);
  const executions = executionsData?.data?.executions ?? [];

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-72 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6Z"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-foreground">
              Workflows
            </span>
          </div>
          <Button
            onClick={() => navigate({ to: "/create-flow" })}
            className="w-full h-8 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium rounded-md transition-colors cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            New Workflow
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <svg
                className="animate-spin h-5 w-5 text-muted-foreground"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}

          {error && (
            <div className="p-3 text-sm text-destructive text-center">
              Failed to load workflows
            </div>
          )}

          {!isLoading && workflows.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                <svg
                  className="w-5 h-5 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">No workflows yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Create your first workflow to get started
              </p>
            </div>
          )}

          {workflows.map((workflow: any) => (
            <button
              key={workflow._id}
              onClick={() => setSelectedId(workflow._id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 transition-colors cursor-pointer ${
                selectedId === workflow._id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedId === workflow._id ? "bg-primary" : "bg-muted-foreground/40"}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">Workflow</div>
                  <div className="text-[11px] text-muted-foreground/60 mt-0.5">
                    {workflow.nodes?.length ?? 0} nodes &middot;{" "}
                    {workflow.edges?.length ?? 0} edges
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-border">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate({ to: "/signin" });
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {selectedWorkflow ? (
          <>
            <div className="h-12 border-b border-border bg-card flex items-center justify-between px-5">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-medium text-foreground">
                  Workflow
                </h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                  {selectedWorkflow.nodes?.length ?? 0} nodes
                </span>
              </div>
              <Button
                onClick={() =>
                  navigate({
                    to: "/workflow/$id",
                    params: { id: selectedWorkflow._id },
                  })
                }
                className="h-7 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md transition-colors cursor-pointer"
              >
                Open Editor
              </Button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-2xl space-y-4">
                <div className="bg-card border border-border rounded-lg p-5">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Nodes
                  </h3>
                  {selectedWorkflow.nodes?.length > 0 ? (
                    <div className="space-y-2">
                      {selectedWorkflow.nodes.map((node: any, i: number) => (
                        <div
                          key={node.id || i}
                          className="flex items-center gap-3 p-3 rounded-md bg-secondary"
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${node.data?.kind === "TRIGGER" ? "bg-chart-4" : "bg-primary"}`}
                          />
                          <div>
                            <div className="text-sm text-foreground font-medium capitalize">
                              {(node.type || "unknown").replace(/-/g, " ")}
                            </div>
                            <div className="text-[11px] text-muted-foreground mt-0.5">
                              {node.data?.kind ?? "node"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No nodes in this workflow
                    </p>
                  )}
                </div>

                <div className="bg-card border border-border rounded-lg p-5">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Executions
                  </h3>
                  {executionsLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <svg
                        className="animate-spin h-5 w-5 text-muted-foreground"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                  ) : executions.length > 0 ? (
                    <div className="space-y-2">
                      {executions.map((execution: any, i: number) => (
                        <div
                          key={execution._id || i}
                          className="flex items-center justify-between p-3 rounded-md bg-secondary"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                execution.status === "SUCCESS"
                                  ? "bg-green-500"
                                  : execution.status === "FAILED"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                              }`}
                            />
                            <div>
                              <div className="text-sm text-foreground font-medium capitalize">
                                {execution.status?.toLowerCase() || "unknown"}
                              </div>
                              <div className="text-[11px] text-muted-foreground mt-0.5">
                                {execution.startTime
                                  ? new Date(
                                      execution.startTime,
                                    ).toLocaleString()
                                  : "No start time"}
                              </div>
                            </div>
                          </div>
                          {execution.endTime && (
                            <span className="text-[11px] text-muted-foreground">
                              {Math.round(
                                (new Date(execution.endTime).getTime() -
                                  new Date(execution.startTime).getTime()) /
                                  1000,
                              )}
                              s
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No executions yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-7 h-7 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">
                Select a workflow
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Choose a workflow from the sidebar to view its details
              </p>
              <Button
                onClick={() => navigate({ to: "/create-flow" })}
                variant="outline"
                className="h-8 text-xs cursor-pointer"
              >
                <svg
                  className="w-3.5 h-3.5 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Create New Workflow
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
