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
import { useState } from "react";
import { Input } from "./ui/input";
import { SUPPORTED_ACTIONS } from "common/types";
import type { ActionCredentials } from "common/types";

export const ActionSheet = ({
  onSelect,
}: {
  onSelect: (kind: Nodekind, metadata: NodeMetadata, credentials: ActionCredentials) => void;
}) => {
  const [selectedAction, setSelectedAction] = useState(SUPPORTED_ACTIONS[0]!);
  const [metadata, setMetadata] = useState<Record<string, unknown>>(
    selectedAction.defaultMetadata,
  );
  const [credentials, setCredentials] = useState<ActionCredentials>(
    selectedAction.defaultCredentials,
  );

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

          {selectedAction.credentials?.map((cred) => (
            <div key={cred.key} className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {cred.label}
              </label>
              <Input
                type="password"
                placeholder={cred.placeholder}
                value={credentials[cred.key]}
                onChange={(e) =>
                  setCredentials((c) => ({ ...c, [cred.key]: e.target.value }))
                }
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/60"
              />
            </div>
          ))}
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
