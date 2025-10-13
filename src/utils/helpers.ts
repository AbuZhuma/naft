export function respond(status: number, data: any) {
  return { __type: "response", status, data };
}