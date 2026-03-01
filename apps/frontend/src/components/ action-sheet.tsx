import type { Nodekind, NodeMetadata } from "@/routes/create-flow";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useRef } from "react";
import { Input } from "./ui/input";
import { SUPPORTED_ACTIONS } from "common/types";
import type { ActionCredentials, GmailCredentials } from "common/types";
import { useGoogleAuthStatus } from "@/api/hooks";

const BASE_URL = "http://localhost:2000";

export const ActionSheet = ({
  onSelect,
}: {
  onSelect: (kind: Nodekind, metadata: NodeMetadata, credentials: ActionCredentials | GmailCredentials) => void;
}) => {
  const [selectedAction, setSelectedAction] = useState(SUPPORTED_ACTIONS[0]!);
  const [metadata, setMetadata] = useState<Record<string, unknown>>(
    selectedAction.defaultMetadata,
  );
  const [credentials, setCredentials] = useState<ActionCredentials | GmailCredentials>(
    selectedAction.defaultCredentials,
  );

  const { data: googleStatus, refetch: refetchGoogleStatus } = useGoogleAuthStatus();
  const isGmailConnected = googleStatus?.data?.oauth === true;
  const popupRef = useRef<Window | null>(null);

  const openGoogleOAuth = () => {
    const token = localStorage.getItem("token");
    popupRef.current = window.open(
      `${BASE_URL}/auth/google?token=${token}`,
      "google-oauth",
      "width=500,height=600,left=400,top=150",
    );

    const timer = setInterval(() => {
      if (popupRef.current?.closed) {
        clearInterval(timer);
        refetchGoogleStatus();
      }
    }, 500);
  };

  return (
    <Sheet open={true}>
      <SheetContent className="bg-card border-l-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">Select Action</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Choose an exchange and configure your trade
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Exchange
            </label>
            <Select
              value={selectedAction.id}
              onValueChange={(value) => {
                const action = SUPPORTED_ACTIONS.find((a) => a.id === value)!;
                setSelectedAction(action);
                setMetadata(action.defaultMetadata);
                setCredentials(action.defaultCredentials);
              }}
            >
              <SelectTrigger className="w-full bg-secondary border-border text-foreground">
                <SelectValue placeholder="Select an exchange" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectGroup>
                  <SelectLabel className="text-muted-foreground">Exchanges</SelectLabel>
                  {SUPPORTED_ACTIONS.map((action) => (
                    <SelectItem
                      key={action.id}
                      value={action.id}
                      className="text-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {action.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {selectedAction.fields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {field.label}
              </label>
              {field.type === "number" ? (
                <Input
                  type="number"
                  placeholder={field.placeholder}
                  value={(metadata[field.key] as number) ?? ""}
                  onChange={(e) =>
                    setMetadata((m) => ({ ...m, [field.key]: Number(e.target.value) }))
                  }
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/60"
                />
              ) : field.type === "string" ? (
                <Input
                  type="text"
                  placeholder={field.placeholder}
                  value={(metadata[field.key] as string) ?? ""}
                  onChange={(e) =>
                    setMetadata((m) => ({ ...m, [field.key]: e.target.value }))
                  }
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/60"
                />
              ) : (
                <Select
                  value={metadata[field.key] as string}
                  onValueChange={(value) =>
                    setMetadata((m) => ({ ...m, [field.key]: value }))
                  }
                >
                  <SelectTrigger className="w-full bg-secondary border-border text-foreground">
                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectGroup>
                      <SelectLabel className="text-muted-foreground">{field.label}</SelectLabel>
                      {field.options.map((option) => (
                        <SelectItem
                          key={option}
                          value={option}
                          className="text-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}

          {selectedAction.credentials?.map((cred, i) =>
            cred.type === "oauth" ? (
              <div key={i} className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Google Account
                </label>
                {isGmailConnected ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 border border-primary/20">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-xs text-primary font-medium">Gmail connected</span>
                    <button
                      type="button"
                      onClick={openGoogleOAuth}
                      className="ml-auto text-[10px] text-muted-foreground hover:text-foreground underline"
                    >
                      Reconnect
                    </button>
                  </div>
                ) : (
                  <>
                    <Button
                      type="button"
                      onClick={openGoogleOAuth}
                      className="w-full bg-secondary hover:bg-accent border border-border text-foreground font-medium flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Connect with Google
                    </Button>
                    <p className="text-[10px] text-muted-foreground">
                      A popup will open to authorize Gmail access. It will auto-detect when you're done.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div key={cred.key} className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {cred.label}
                </label>
                <Input
                  type="password"
                  placeholder={cred.placeholder}
                  value={(credentials as ActionCredentials)[cred.key]}
                  onChange={(e) =>
                    setCredentials((c) => ({ ...c, [cred.key]: e.target.value }))
                  }
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/60"
                />
              </div>
            )
          )}
        </div>

        <SheetFooter className="px-4">
          <Button
            onClick={() => {
              onSelect(selectedAction.id as Nodekind, metadata as NodeMetadata, credentials);
            }}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium cursor-pointer"
          >
            Add Action
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
