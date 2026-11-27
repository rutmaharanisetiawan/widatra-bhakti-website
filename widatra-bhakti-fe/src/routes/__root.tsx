import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { SiteNav } from "../components/site-nav";
import { SiteFooter } from "../components/site-footer";
import { SitePreloader } from "../components/ui/site-preloader";
import { WidaBotWidget } from "../components/chatbot/wida-bot-widget";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-light text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-medium text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-brand-deep rounded"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-medium tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please refresh the page or go back home.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground rounded"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  component: RootComponent,
});

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isBare =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/applicant");

  if (isBare) {
    return (
      <>
        <SitePreloader initialDurationMs={1200} />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <SitePreloader initialDurationMs={1600} />
      <SiteNav />
      <main className="pt-20 overflow-x-clip w-full">
        <Outlet />
      </main>
      <SiteFooter />
      <WidaBotWidget />
    </>
  );
}
