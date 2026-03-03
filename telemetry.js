/**
 * GA4 telemetry: link clicks and scroll depth
 */

// Link click tracking – which links get the most engagement
document.addEventListener("click", function (e) {
  const link = e.target.closest("a[href]");
  if (!link || typeof gtag !== "function") return;

  const href = link.getAttribute("href") || "";
  const label = link.textContent.trim().slice(0, 100) || href;
  const isExternal =
    href.startsWith("http") && !href.includes(window.location.hostname);

  gtag("event", "link_click", {
    link_url: href,
    link_text: label,
    outbound: isExternal,
  });
});

// Scroll depth tracking – how far visitors scroll (25%, 50%, 75%, 90%)
(function () {
  if (typeof gtag !== "function") return;
  const thresholds = [25, 50, 75, 90];
  let maxReached = 0;

  function getScrollDepth() {
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return 0;
    return Math.round((window.scrollY / scrollHeight) * 100);
  }

  function checkScroll() {
    const depth = getScrollDepth();
    thresholds.forEach(function (t) {
      if (depth >= t && t > maxReached) {
        gtag("event", "scroll_depth", { value: t, depth_percent: t });
        maxReached = t;
      }
    });
  }

  window.addEventListener("scroll", checkScroll, { passive: true });
  checkScroll(); // In case already scrolled
})();
