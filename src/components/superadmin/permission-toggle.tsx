
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { toggleAdmissionPermission } from "@/actions/permissions";
import { useTransition } from "react";
import { toast } from "@/components/ui/use-toast";

interface PermissionToggleProps {
  adminId: string;
  initialState: boolean;
  permission: "MANAGE_ADMISSIONS" | "VIEW_ADMISSION_DASHBOARD";
}

export function PermissionToggle({ adminId, initialState, permission }: PermissionToggleProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      const result = await toggleAdmissionPermission(adminId, checked, permission);
      if (!result.success) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Permission updated successfully" });
      }
    });
  };

  return (
    <div className="flex justify-center">
      <Checkbox 
        checked={initialState} 
        onCheckedChange={handleToggle} 
        disabled={isPending}
      />
    </div>
  );
}
