import fs from "fs/promises";

export enum ServerEventTypes {
  API_CALL = "API_CALL"
}

interface ServerEvent {
  date?: Date;
  type: ServerEventTypes;
  metadata: Record<string, any>;
}

export async function logEvent(event: ServerEvent) {
  const newEvent = !event.date ? { date: new Date(), ...event } : event;
  try {
    await fs.mkdir("logs", { recursive: true });
    const data = await fs.readFile("logs/events.json");
    const json = JSON.parse(data.toString());
    json.push(newEvent);
    await fs.writeFile("logs/events.json", JSON.stringify(json));
  } catch (error) {
    await fs.writeFile("logs/events.json", JSON.stringify(newEvent));
  }
}
