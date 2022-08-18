import { emitMessage } from "./socket-io";

export const globalLog = (prepend: string, out: any) => {
  console.log(JSON.stringify(out));
  emitMessage("console_message", `${prepend}: ${JSON.stringify(out)}`);
};
