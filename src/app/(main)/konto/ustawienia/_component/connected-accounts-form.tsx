"use client";

import { Icons } from "@/components/global/icons";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import React from "react";
import { toast } from "sonner";

const providers = [
  {
    icon: Icons.google,
    name: "google",
  },
  {
    icon: Icons.github,
    name: "github",
  },
] as const;

const ConnectedAccountsForm = ({
  accounts,
}: {
  accounts: {
    id: string;
    provider: string;
    createdAt: Date;
    updatedAt: Date;
    accountId: string;
    scopes: string[];
  }[];
}) => {
  return (
    <div className="rounded-lg border">
      {providers.map((provider, index) => {
        const isConnected = accounts.some(
          (account) => account.provider === provider.name
        );

        const onClick = async () => {
          if (isConnected) {
            const { error } = await authClient.unlinkAccount({
              providerId: provider.name,
            });

            if (error) {
              toast.error(error.message);
            }
          } else {
            const { error } = await authClient.linkSocial({
              provider: provider.name,
              callbackURL: "/kucharze/ustawienia",
            });

            if (error) {
              toast.error(error.message);
            }
          }
        };

        return (
          <div
            key={provider.name}
            className={cn("px-7 py-5 flex gap-4 items-center", {
              "border-b": index !== providers.length - 1,
            })}
          >
            <provider.icon className="w-6 h-6 flex-shrink-0" />
            <div className="w-full">
              <h4 className="text-sm font-semibold capitalize">
                {provider.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isConnected ? "Połaczone" : "Niepołączone"}
              </p>
            </div>
            <Button
              size="sm"
              variant={isConnected ? "destructive" : "outline"}
              onClick={onClick}
            >
              {isConnected ? "Rozłącz" : "Połącz"}
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default ConnectedAccountsForm;
