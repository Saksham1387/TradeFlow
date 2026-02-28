import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
} from "@tanstack/react-router";
import "@xyflow/react/dist/style.css";
import { CreateFlowPage } from "./routes/create-flow";
import { SignupPage } from "./routes/auth/signup";
import { SigninPage } from "./routes/auth/signin";
import { DashboardPage } from "./routes/dashboard";

const isAuthenticated = () => !!localStorage.getItem("token");

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: "/dashboard" });
    }
    throw redirect({ to: "/signin" });
  },
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: function Signup() {
    return <SignupPage />;
  },
});

const signinRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signin",
  component: function Signin() {
    return <SigninPage />;
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/signin" });
    }
  },
  component: function Dashboard() {
    return <DashboardPage />;
  },
});

const createFlowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/create-flow",
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/signin" });
    }
  },
  component: function NewFlow() {
    return <CreateFlowPage />;
  },
});

const workflowEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workflow/$id",
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/signin" });
    }
  },
  component: function WorkflowEditor() {
    const { id } = workflowEditorRoute.useParams();
    return <CreateFlowPage workflowId={id} />;
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  signupRoute,
  signinRoute,
  dashboardRoute,
  createFlowRoute,
  workflowEditorRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
