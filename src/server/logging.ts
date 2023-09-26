import fs from "fs/promises";

export enum ServerEventTypes {
  API_CALL = "API_CALL",
  API_ERROR = "API_ERROR"
}

interface ServerEvent {
  date?: Date;
  type: ServerEventTypes;
  metadata: Record<string, any>;
}

export async function logEvent(event: ServerEvent) {
  const date = event.date ? event.date : new Date().toLocaleString();
  const newEvent = !event.date ? { date, ...event } : event;
  try {
    await fs.mkdir("logs", { recursive: true });
    const data = await fs.readFile("logs/events.json");
    const json = JSON.parse(data.toString());
    json.push(newEvent);
    await fs.writeFile(
      "logs/events.json",
      "\n" + JSON.stringify(json, null, 2)
    );
  } catch (error: any) {
    error = error as {
      errno: number;
      code: string;
      syscall: string;
      path: string;
    };

    if (error.code === "ENOENT") {
      await fs.writeFile("logs/events.json", JSON.stringify([newEvent]));
    }
  }
}
