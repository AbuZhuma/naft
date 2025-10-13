export function respond(status, data) {
    return { __type: "response", status, data };
}
