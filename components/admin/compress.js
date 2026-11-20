"use client";

/* Prepares a photo in the browser before upload:
   - fixes phone rotation, resizes to at most 2400px, converts to WebP
   - makes a tiny blurred placeholder for smooth loading on the website
   So office staff can upload straight from a phone camera without
   worrying about file size. */
const MAX = 2400;

async function bitmap(file) {
  if ("createImageBitmap" in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {}
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("This photo could not be read. Try a JPG or PNG."));
    img.src = URL.createObjectURL(file);
  });
}

function toBlob(canvas, type, q) {
  return new Promise((r) => canvas.toBlob(r, type, q));
}

export async function preparePhoto(file, { keepTransparent = false } = {}) {
  const src = await bitmap(file);
  const w0 = src.width, h0 = src.height;
  const scale = Math.min(1, MAX / Math.max(w0, h0));
  const w = Math.round(w0 * scale), h = Math.round(h0 * scale);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!keepTransparent) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src, 0, 0, w, h);
  let blob = await toBlob(c, "image/webp", 0.82);
  if (!blob || blob.type !== "image/webp") blob = await toBlob(c, keepTransparent ? "image/png" : "image/jpeg", 0.85);
  // Very detailed photos: step quality down until under 4.5 MB.
  for (let q = 0.72; blob.size > 4.5 * 1024 * 1024 && q > 0.4; q -= 0.12) blob = await toBlob(c, "image/jpeg", q);

  const t = document.createElement("canvas");
  const ts = 16 / Math.max(w, h);
  t.width = Math.max(1, Math.round(w * ts));
  t.height = Math.max(1, Math.round(h * ts));
  t.getContext("2d").drawImage(c, 0, 0, t.width, t.height);
  const blur = t.toDataURL("image/webp", 0.4);

  const ext = blob.type === "image/webp" ? "webp" : blob.type === "image/png" ? "png" : "jpg";
  const name = (file.name || "photo").replace(/\.[^.]+$/, "") + "." + ext;
  return { file: new File([blob], name, { type: blob.type }), width: w, height: h, blur: blur.startsWith("data:image/webp") ? blur : "" };
}

/* Upload with progress (XMLHttpRequest gives upload progress; fetch does not). */
export function uploadFile(file, extra = {}, onProgress) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);
    for (const [k, v] of Object.entries(extra)) if (v != null) form.append(k, String(v));
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/media");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(e.loaded / e.total);
    xhr.onload = () => {
      let data = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {}
      if (xhr.status === 401) {
        window.location.href = "/admin/login";
        return reject(new Error("Please sign in again."));
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new Error(data.error || "Upload failed. Please try again."));
    };
    xhr.onerror = () => reject(new Error("Upload failed — check your internet connection."));
    xhr.send(form);
  });
}

export async function uploadAny(file, opts = {}, onProgress) {
  const isImage = file.type.startsWith("image/") && !/svg/.test(file.type);
  if (isImage) {
    const p = await preparePhoto(file, opts);
    return uploadFile(p.file, { width: p.width, height: p.height, blur: p.blur, alt: opts.alt }, onProgress);
  }
  if (file.type !== "application/pdf") throw new Error("Please choose a photo or a PDF file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("This PDF is larger than 5 MB. Please compress it (for example at ilovepdf.com) and try again.");
  return uploadFile(file, {}, onProgress);
}
