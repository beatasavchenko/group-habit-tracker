import * as React from "react";
import { Html, render } from "@react-email/components";

type OtpProps = {
  code: string;
};

export function OtpTemplate(props: OtpProps) {
  const { code } = props;

  return (
    <Html lang="en">
      <div>{code}</div>
    </Html>
  );
}

export function renderOtpEmail(props: OtpProps) {
  const { code } = props;

  return render(<OtpTemplate code={code} />);
}
