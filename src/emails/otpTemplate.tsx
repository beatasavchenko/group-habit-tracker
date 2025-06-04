import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Tailwind,
  Text,
  render,
} from "@react-email/components";
import * as React from "react";

type OtpProps = {
  code: string;
};

export function OtpTemplate({ code }: OtpProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Your one-time login code</Preview>
      <Tailwind>
        <Body className="bg-gray-50 py-10 font-sans">
          <Container className="mx-auto max-w-md rounded-lg bg-white px-6 py-10 shadow-md">
            <Text className="text-center text-xl font-semibold text-gray-900">
              🔐 Your Login Code
            </Text>
            <Text className="mt-2 mb-2 text-center text-sm text-gray-600">
              Use this code to log in to your account
            </Text>

            <Text className="mt-2 mb-6 text-center text-sm text-gray-600">
              This code is valid for 5 minutes. If you did not request this
              code, please ignore this email.
            </Text>

            <div className="mb-4 flex items-center justify-center rounded-md bg-gray-100 py-4 text-center">
              <span className="text-3xl font-bold tracking-widest text-gray-800">
                {code}
              </span>
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export function renderOtpEmail(props: OtpProps) {
  return render(<OtpTemplate {...props} />);
}
