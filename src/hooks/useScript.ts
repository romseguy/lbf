import { useEffect } from "react";

export const useScript = (src: string) => {
  useEffect(() => {
    // var _mtm = (window._mtm = window._mtm || []);
    // _mtm.push({
    //   "mtm.startTime": new Date().getTime(),
    //   event: "mtm.Start"
    // });
    var d = document,
      g = d.createElement("script"),
      s = d.getElementsByTagName("script")[0];
    g.async = true;
    g.src = `${src}`;
    s.parentNode?.insertBefore(g, s);
  }, []);
};
