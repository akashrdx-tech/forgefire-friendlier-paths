const BASE_TITLE_KEY = "__baseTitle";

let baseIcon: HTMLImageElement | null = null;

function getLink() {
  let link = document.querySelector<HTMLLinkElement>("link#app-favicon");
  if (!link) {
    link = document.createElement("link");
    link.id = "app-favicon";
    link.rel = "icon";
    link.type = "image/png";
    document.head.appendChild(link);
  }
  return link;
}

function draw(count: number) {
  if (!baseIcon) return;
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(baseIcon, 0, 0, size, size);
  if (count > 0) {
    ctx.beginPath();
    ctx.arc(size - 17, 17, 16, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  getLink().href = canvas.toDataURL("image/png");
}

export function setFaviconBadge(count: number) {
  if (typeof document === "undefined") return;

  const w = window as unknown as Record<string, string>;
  if (!w[BASE_TITLE_KEY]) w[BASE_TITLE_KEY] = document.title.replace(/^\(\d+\)\s*/, "");
  document.title = count > 0 ? `(${count}) ${w[BASE_TITLE_KEY]}` : w[BASE_TITLE_KEY]!;

  if (!baseIcon) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      baseIcon = img;
      draw(count);
    };
    img.src = "/favicon.png";
    return;
  }
  draw(count);
}
