# Trackify - Frontend & UI/UX Features Questionnaire

This document focuses entirely on the visual, interactive, and UI/UX-specific questions an examiner might ask during your viva. It deeply explores the frontend feature implementation in React.

---

## 1. Export to Excel Feature

**Q1. In the Dashboard, you have an "Export Excel" feature. How exactly is the data converted from a web view to an Excel file?**
**Answer:** I utilized two libraries: `xlsx` (SheetJS) and `file-saver`. When the user clicks export, I programmatically construct multidimensional arrays (`aoa` - array of arrays) representing a summary table and a list of all transactions for the current month. I pass this into `XLSX.utils.aoa_to_sheet()`. Next, I set column widths (`!cols`) for better readability. Both sheets are appended to a new workbook (`book_new()`). Finally, `XLSX.write()` generates an array buffer that `file-saver` downloads to the user's local machine as `<Month_Year>.xlsx`.

**Q2. Does the Export Excel feature ping the backend?**
**Answer:** No. Since the `ExpenseContext` has already fetched and cached the user's transactions upon login, the export logic runs 100% on the client side. This ensures zero network latency and immediately creates the file.

---

## 2. Landing Page & 3D Animations

**Q3. The landing page has a dynamic Typewriter effect for the main headings. Did you use an external library for this?**
**Answer:** No, I built a custom hook called `useTypewriter`. It uses standard React `useState` and `useEffect` with `setTimeout` to control typing speed, erasing speed, and pause durations. It sequentially slices a string, rendering the characters one by one. I also built logic to highlight specific phrases (e.g., turning "financial goals" violet) by detecting substrings during the rendering phase.

**Q4. Explain the 3D tilting card effect present on the landing page.**
**Answer:** The tilting card relies on `framer-motion` (specifically, `motion/react`). It utilizes `useMotionValue` to track the user's exact mouse coordinates (`e.clientX`, `e.clientY`) relative to the card's boundaries using `getBoundingClientRect`.  Using `useTransform` and `useSpring`, these coordinates are mapped to a subtle `rotateX` (from -14 to 14 degrees) and `rotateY` scale based on physics springs. This achieves a butter-smooth 3D hover projection.

**Q5. The background has moving stars. How is that rendered efficiently?**
**Answer:** I used a dedicated `<canvas>` element for the `StarfieldBackground`. Instead of animating hundreds of React DOM elements (which would destroy framerates), I use vanilla Javascript's `requestAnimationFrame`. The stars are simple objects containing `(x, y, z)` coordinates. On every frame, the `z` value decreases, simulating flying forward. 

---

## 3. UI Interactions & Framer Motion

**Q6. When adding a transaction or opening models, elements slide in smoothly. How is the exit animation handled when an element is removed from the DOM?**
**Answer:** React normally destroys elements instantly, abruptly skipping exit animations. To solve this, I surround dynamic UI elements with framer-motion’s `<AnimatePresence>` wrapper. This intercepts the component unmounting and allows my custom `exit={{ opacity: 0, scale: 0.9 }}` rules to finish running before the node is removed from the DOM.

**Q7. On the Dashboard, how do the total money numbers physically "count up" when the page loads?**
**Answer:** I implemented an `AnimatedStat` component. It uses `performance.now()` inside a custom `requestAnimationFrame` loop to interpolate a value from 0 up to the target transaction amount over ~900 milliseconds. It modifies the `<p>` element's `textContent` directly using a React `useRef`, avoiding expensive React state re-renders on every single frame count.

---

## 4. Visual Feedback & Forms

**Q8. How does the UI indicate that a description is being auto-categorized?**
**Answer:** In the `ExpenseForm.tsx`, I use a debounce timer. After 500 milliseconds of no typing, a request is sent to the backend. While waiting, a `detecting` boolean state is set to `true`. This boolean conditionally renders a spinning `Refresh` icon (`lucide-react`) inside the input field, utilizing Tailwind's `animate-spin` utility to provide clear visual feedback to the user.

**Q9. How are the interactive charts on the Dashboard constructed?**
**Answer:** Using the `Recharts` library, I implemented interactive `<PieChart>` and `<BarChart>` components wrapped in `<ResponsiveContainer>` elements. These containers listen to window resize events and automatically rescale SVG coordinates to ensure the charts remain perfectly sized on both mobile and large screens. They also heavily utilize custom `<Tooltip>` wrappers configured with Tailwind and CSS variables for theming.

---

## 5. Media & Profile UI

**Q10. On the Profile Page, users can take pictures with their camera to set as a profile photo. How is this achieved visually in the browser?**
**Answer:** When the "Take Photo" button is clicked, an asynchronous call is made to `navigator.mediaDevices.getUserMedia({ video: true })`. This returns a video stream which is injected into the `srcObject` of an HTML `<video>` element, rendering a live camera feed. When the user hits "Capture", a hidden `<canvas>` draws the current video frame (`context.drawImage(...)`), converts it to a base64 encoded JPG data URL, saves it to `localStorage`, and instantly updates the UI avatar.

---

## 6. CSS, Styling, and Dark Mode Variables

**Q11. You mentioned glassmorphism elements. How did you create those styles?**
**Answer:** Glassmorphism is heavily used in the "glass-card" components. The visual illusion is accomplished using the CSS `backdrop-filter: blur(x)` property over slightly transparent backgrounds (e.g., `bg-white/[0.03]`), coupled with subtle, semi-transparent borders.

**Q12. The project features dynamic styling. Are you hardcoding Tailwind hex colors everywhere?**
**Answer:** While Tailwind color utilities are used for specific colored highlights (like `text-violet-500`), the core layout uses custom CSS variables defined in global css like `var(--bg-card)`, `var(--bg-input)`, `var(--text-primary)`, and `var(--border-input)`. This architecture ensures changing the theme (light to dark) can impact hundreds of components globally just by shifting the CSS root variables.
