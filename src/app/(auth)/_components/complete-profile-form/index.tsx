"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { completeProfileSchema, CompleteProfileSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/db/schema";
import { Textarea } from "@/components/ui/textarea";
import { authClient, getErrorMessage } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AvatarUploader from "@/features/user-profile/components/avatar-uploader";

const CompleteProfileForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const form = useForm<CompleteProfileSchema>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      name: user.name,
      username: user.username || "",
      bio: user.bio || "",
    },
  });

  const onSubmit = async (values: CompleteProfileSchema) => {
    const { error } = await authClient.updateUser({
      name: values.name,
      username: user.username === values.username ? undefined : values.username,
    });

    if (error) {
      console.log(error.code);
      toast.error(getErrorMessage(error.code));
      return;
    }

    toast.success("Profil zaktualizowany");
    router.refresh();
    router.replace("/");
  };

  return (
    <div className="space-y-4">
      <AvatarUploader src={user.image} />
      <Form {...form}>
        <form className="gap-4 grid" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa profilu *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa użytkownika *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Pozwala na łatwiejsze znalezienie twojego profilu.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="bio"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button>Kontynuuj</Button>
        </form>
      </Form>
    </div>
  );
};

export default CompleteProfileForm;
