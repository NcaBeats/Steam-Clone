"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Send, CheckCircle2 } from "lucide-react";

import { sendContactAction } from "@/actions/contact";
import {
  ContactSchema,
  type ContactInput,
} from "@/schemas/contact/contact.schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field"; // Se añade el FieldGroup de tus componentes

export const ContactForm = () => {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      comment: "",
    },
  });

  const onSubmit = async (values: ContactInput) => {
    setServerError(null);

    try {
      const result = await sendContactAction(values);

      if (!result.success) {
        setServerError(result.error);
        return;
      }

      form.reset();
      setSuccess(true);
    } catch {
      setServerError("Could not send your message. Please try again.");
    }
  };

  if (success) {
    return (
      <Card className="items-center gap-3 rounded-lg border border-white/6 bg-[#202024] p-8 text-center text-[#FAFAFA]">
        <CheckCircle2 size={56} className="text-[#26BBFF]" />

        <h2 className="text-xl font-bold tracking-[0.4px]">Message sent</h2>

        <p className="text-sm text-[#8A8A8A]">
          Thank you for reaching out. We will get back to you soon.
        </p>
      </Card>
    );
  }

  return (
    <Card className="gap-4 ring-0 rounded-lg bg-[#202024] p-6 text-[#FAFAFA]">
      <CardContent className="p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-6" // Se cambia gap-4 a gap-6 para igualar el ritmo visual de SignUp
          >
            {/* Se envuelven los campos dentro de FieldGroup para unificar el espaciado */}
            <FieldGroup>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Jhon"
                        className="border-0"
                      />
                    </FormControl>

                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="user@gmail.com"
                        className="border-0"
                      />
                    </FormControl>

                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    {" "}
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Your message"
                        rows={5}
                        className="min-h-32 rounded-lg border-0 bg-[#28282C] hover:bg-[#303036] placeholder:text-white/55"
                      />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
            </FieldGroup>

            {serverError && (
              <div
                role="alert"
                className="rounded-md border border-[#5C2A2A] bg-[#2A1A1A] p-3 text-sm text-[#FF6B6B]"
              >
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              size="lg"
              className="cursor-pointer gap-2 bg-[#007aff] py-5 font-semibold text-white hover:bg-[#2e92ff] focus-visible:ring-[#26BBFF]"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send message
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
