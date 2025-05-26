import type { ReactElement } from "react";

export type Tag = {
  value: string;
  label: string;
  icon: ReactElement;
};

export type Friend = {
  id: number;
  name: string;
  image: string;
};

export type Community = {
  id: number;
  name: string;
  url: string;
  image: string;
}
