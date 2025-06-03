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
import { signIn } from "next-auth/react";
import { signInSchema } from "~/lib/signInSchema";
import { useRouter } from "next/navigation";
import React, {
  useRef,
  useState,
  type ChangeEvent,
  type RefObject,
} from "react";

const codeLength = 6;

export default function Login() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      step1: { email: "" },
      step2: { code: "" },
    },
    mode: "onChange",
  });

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

  const [step, setStep] = useState(1);

  const handleNextStep = async () => {
    const isValid = await form.trigger("step1.email");
    if (!isValid) return;
    setStep(2);
    form.reset();
  };

  return (
    <div className="mx-4 flex h-fit items-center justify-center pt-14">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signIn("github")}
              >
                Sign in with GitHub
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signIn("google")}
              >
                Sign in with Google
              </Button>
            </>
          )}
          <Form {...form}>
            <form
              className="space-y-6 text-right"
              onSubmit={(e) => {
                e.preventDefault();
                if (step === 2) {
                  console.log("Submitted code:", code);
                }
              }}
            >
              {step === 1 ? (
                <FormField
                  control={form.control}
                  name="step1.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          className="w-96"
                          placeholder="example@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-left" />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="step2.code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          {Array.from({ length: codeLength }).map(
                            (_, index) => (
                              <Input
                                {...field}
                                key={index}
                                ref={inputRefs[index]}
                                value={code[index] || ""}
                                type="number"
                                maxLength={1}
                                onChange={(e) => handleInput(e, index)}
                                className="h-16 w-14 text-center"
                                autoFocus={index === 0}
                                onFocus={handleFocus}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onPaste={handlePaste}
                              />
                            ),
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-left" />
                    </FormItem>
                  )}
                />
              )}
              <div className="flex items-center justify-between">
                {step === 2 ? (
                  <Button
                    className="w-24 hover:cursor-pointer"
                    type="submit"
                    // disabled={!form.formState.isValid}
                  >
                    Login
                  </Button>
                ) : (
                  <Button
                    className="w-24 hover:cursor-pointer"
                    type="button"
                    onClick={handleNextStep}
                    // disabled={!form.formState.isValid}
                  >
                    Continue
                  </Button>
                )}
                {step === 2 && (
                  <Button
                    variant={"ghost"}
                    onClick={() => {
                      setStep(1);
                      form.reset();
                    }}
                  >
                    Choose another method
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
