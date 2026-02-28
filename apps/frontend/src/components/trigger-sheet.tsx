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
import { SUPPORTED_TRIGGERS } from "common/types";

export const TriggerSheet = ({
  onSelect,
}: {
  onSelect: (kind: Nodekind, metadata: NodeMetadata) => void;
}) => {
  const [selectedTrigger, setSelectedTrigger] = useState(SUPPORTED_TRIGGERS[0]!);
  const [metadata, setMetadata] = useState<Record<string, unknown>>(
    selectedTrigger.defaultMetadata,
  );

  return (
    <Sheet open={true}>
      <SheetContent className="bg-card border-l-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">Select Trigger</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Choose what starts your workflow
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Trigger Type
            </label>
            <Select
              value={selectedTrigger.id}
              onValueChange={(value) => {
                const trigger = SUPPORTED_TRIGGERS.find((t) => t.id === value)!;
                setSelectedTrigger(trigger);
                setMetadata(trigger.defaultMetadata);
              }}
            >
              <SelectTrigger className="w-full bg-secondary border-border text-foreground">
                <SelectValue placeholder="Select a trigger" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectGroup>
                  <SelectLabel className="text-muted-foreground">Triggers</SelectLabel>
                  {SUPPORTED_TRIGGERS.map((trigger) => (
                    <SelectItem
                      key={trigger.id}
                      value={trigger.id}
                      className="text-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {trigger.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {selectedTrigger.fields.map((field) => (
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
                    <SelectValue placeholder={`Select a ${field.label.toLowerCase()}`} />
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
        </div>

        <SheetFooter className="px-4">
          <Button
            onClick={() => {
              onSelect(selectedTrigger.id as Nodekind, metadata as NodeMetadata);
            }}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium cursor-pointer"
          >
            Add Trigger
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
