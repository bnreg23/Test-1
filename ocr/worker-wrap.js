// Artifact hosting can't serve .gz files, so the English language data ships as
// base64 text. Serve it to the Tesseract worker when it asks for eng.traineddata.gz.
const base = self.location.href.replace(/[^/]*$/, "");
const realFetch = self.fetch.bind(self);
self.fetch = (url, opts) => {
  if (String(url).endsWith("/eng.traineddata.gz")) {
    return realFetch(base + "lang/eng.traineddata.gz.b64.txt")
      .then(r => { if (!r.ok) throw new Error("lang " + r.status); return r.text(); })
      .then(b64 => {
        const bin = atob(b64.trim());
        const u = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
        return new Response(u);
      });
  }
  return realFetch(url, opts);
};
importScripts(base + "worker.min.js");
