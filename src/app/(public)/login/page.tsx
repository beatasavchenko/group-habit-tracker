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
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type RefObject,
} from "react";
import { api } from "~/trpc/react";

const codeLength = 6;

export default function Login() {
  const router = useRouter();

  const verify = api.auth.verify.useMutation({
    onSuccess: (data) => {
      setStep(2);
      form.reset();
    },
    onError: (error) => {
      console.error("Error during verification:", error);
    },
  });

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

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (index !== 0) return;

    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    setCode(pasted);

    inputRefs.forEach((ref, i) => {
      if (ref.current) {
        ref.current.value = pasted[i] || "";
      }
    });

    // Focus next input after paste
    const focusRef = inputRefs[pasted.length - 1];
    if (pasted.length > 0 && focusRef?.current) {
      focusRef.current.focus();
    }
  };

  const [step, setStep] = useState(1);

  const email = form.watch("step1.email");

  const handleNextStep = async () => {
    const isValid = await form.trigger("step1.email");
    if (!isValid) return;
    await verify.mutateAsync({ email });
  };

  useEffect(() => {
    form.setValue("step2.code", code);
  }, [code, form]);

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
                type="button"
                className="w-full"
                onClick={() => signIn("github")}
              >
                Sign in with GitHub
              </Button>
              <Button
                variant="outline"
                type="button"
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
                if (step === 2 && code.length === 6) {
                  signIn("credentials", {
                    email,
                    code,
                    redirect: true,
                  });
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
                                onPaste={(e) => handlePaste(e, index)}
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
                  <div>
                    <Button variant={"ghost"} type="button" onClick={() => {}}>
                      Resend the code
                    </Button>
                    <Button
                      variant={"ghost"}
                      type="button"
                      onClick={() => {
                        setStep(1);
                        form.reset();
                      }}
                    >
                      Choose another method
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
