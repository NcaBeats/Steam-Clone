"use client";

import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui";
import { useForm } from "react-hook-form";

export default function SignUp() {
  const form = useForm();

  return (
    <Card>
      <Form {...form}>
        <form className="flex flex-col gap-2">
          <label htmlFor="Email"></label>
          <input type="text" />
          <label htmlFor="Password"></label>
          <input type="text" />
        </form>
      </Form>
    </Card>
  );
}
