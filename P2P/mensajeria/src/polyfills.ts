import process from "process";
import { Buffer } from "buffer";

if (typeof window !== "undefined") {
  window.global = window;
  window.process = process;
  window.Buffer = Buffer;
}
