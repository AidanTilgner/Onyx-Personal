import { emitMessage } from "./socket-io";

export const globalLog = (out: any) => {
  console.log(JSON.stringify(out));
  emitMessage("console_message", JSON.stringify(out));
};
