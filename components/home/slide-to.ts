/** Moves a pill's sliding indicator onto `button`. */
export function slideTo(indicator: HTMLElement | null, container: HTMLElement | null, button: HTMLElement | null) {
  if (!indicator || !container || !button) return;
  // Layout offsets, not on-screen rects: these ignore the entrance animation's transforms
  // and the pill's mid-animation width, so the highlight lands on the button's final spot.
  let x = 0;
  for (let el: HTMLElement | null = button; el && el !== container; el = el.offsetParent as HTMLElement | null) {
    x += el.offsetLeft;
  }
  const first = !indicator.style.width; // first placement: appear in place, don't grow in from zero
  if (first) indicator.style.transition = "none";
  indicator.style.width = `${button.offsetWidth}px`;
  indicator.style.transform = `translateX(${x}px)`;
  if (first) {
    void indicator.offsetWidth;
    indicator.style.transition = "";
  }
}
