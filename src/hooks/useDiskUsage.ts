import axios from "axios";
import { useState, useEffect } from "react";

export function useDiskUsage() {
  const [diskUsage, setDiskUsage] = useState<{
    current?: number;
    max?: number;
    pct?: number | undefined;
  }>({});

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { current, max }
        }: { data: { current: number; max: number } } = await axios.get(
          process.env.NEXT_PUBLIC_API2 + "/size"
        );
        setDiskUsage({
          current,
          max,
          pct: (current / max) * 100
        });
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return diskUsage;
}
