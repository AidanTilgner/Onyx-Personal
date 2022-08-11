import { emitMessage } from "../utils/socket-io";

export const display_action_output = (out: any) => {
  console.log("Output:", JSON.stringify(out));
  emitMessage("message", JSON.stringify(out));
};
