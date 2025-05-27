"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import React, {
  useRef,
  useState,
  type ChangeEvent,
  type RefObject,
} from "react";

const codeLength = 6;

const formSchema = z.object({
  code: z.string().length(codeLength),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const [code, setCode] = useState("");

  const inputRefs: RefObject<HTMLInputElement | null>[] = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  function handleInput(e: ChangeEvent<HTMLInputElement>, index: number) {
    const input = e.target;
    const previousInput = inputRefs[index - 1];
    const nextInput = inputRefs[index + 1];

    const newCode = [...code];
    if (/^[a-z]+$/.test(input.value)) {
      const uc = input.value.toUpperCase();
      newCode[index] = uc;
      if (inputRefs[index]?.current) {
        inputRefs[index].current.value = uc;
      }
    } else {
      newCode[index] = input.value;
    }
    setCode(newCode.join(""));

    input.select();

    if (input.value === "" && previousInput && previousInput.current) {
      previousInput.current.focus();
    } else if (nextInput && nextInput.current) {
      nextInput.current.select();
    }
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.select();
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) {
    const input = e.currentTarget;
    const previousInput = inputRefs[index - 1];
    const nextInput = inputRefs[index + 1];

    if ((e.keyCode === 8 || e.keyCode === 46) && input.value === "") {
      e.preventDefault();
      setCode(
        (prevCode) => prevCode.slice(0, index) + prevCode.slice(index + 1),
      );
      if (previousInput && previousInput.current) {
        previousInput.current.focus();
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedCode = e.clipboardData.getData("text");
    if (pastedCode.length === 6) {
      setCode(pastedCode);
      inputRefs.forEach(
        (inputRef: RefObject<HTMLInputElement | null>, index: number) => {
          if (inputRef.current) {
            inputRef.current.value = pastedCode.charAt(index);
          }
        },
      );
    }
  };

  return (
    <div className="mx-4 flex h-fit items-center justify-center pt-14">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl">Verify</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 text-right"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {Array.from({ length: codeLength }).map((_, index) => (
                          <Input
                            {...field}
                            key={index}
                            ref={inputRefs[index]}
                            value={code[index] || ""}
                            type="text"
                            maxLength={1}
                            onChange={(e) => handleInput(e, index)}
                            className="h-16 w-14 text-center"
                            autoFocus={index === 0}
                            onFocus={handleFocus}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button
                  variant={"outline"}
                  className="w-24 hover:cursor-pointer"
                  type="button"
                >
                  Resend
                </Button>
                <Button className="w-24 hover:cursor-pointer" type="submit">
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
