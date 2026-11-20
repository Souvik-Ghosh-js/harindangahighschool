/* Admin icons — simple, recognisable line icons. */
const P = {
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
  refresh: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  file: "M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5L14 3ZM14 3v4.5h4.5",
  up: "m6 15 6-6 6 6",
  down: "m6 9 6 6 6-6",
  left: "m15 6-6 6 6 6",
  right: "m9 6 6 6-6 6",
  plus: "M12 5v14M5 12h14",
  home: "M4 11 12 4l8 7M6 9.5V20h12V9.5",
  notice: "M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16ZM10 20a2 2 0 0 0 4 0",
  calendar: "M3.5 5h17v15h-17zM3.5 10h17M8 3v4M16 3v4",
  people: "M9 11.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM3 20c.6-3.6 3-5.5 6-5.5s5.4 1.9 6 5.5M17 11.6a2.6 2.6 0 1 0 0-5.2M16 14.6c2.6.1 4.4 1.8 5 4.9",
  photo: "M3.5 5h17v14h-17zM9 11.8a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6ZM4 17l5-4.5 4 3.5 3-2.5 4 3.5",
  download: "M12 4v11M7 10l5 5 5-5M5 20h14",
  pages: "M5 3.5h10l4 4V20.5H5zM15 3.5V8h4M8 12h8M8 16h8",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z",
  users: "M16 20c-.5-3-2.4-5-5-5s-4.5 2-5 5M11 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM18 8v6M15 11h6",
  activity: "M3 12h4l3-8 4 16 3-8h4",
  logout: "M15 4h4v16h-4M10 16l4-4-4-4M14 12H3",
  back: "M19 12H5M11 6l-6 6 6 6",
  eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  key: "M14.5 9.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM13.2 12.7 20 19.5M17 16.5l2-2",
  tree: "M12 3v6M12 9H6v4M12 9h6v4M4 13h4v4H4zM16 13h4v4h-4zM10 17h4v4h-4zM12 9v8",
  more: "M5 12h.01M12 12h.01M19 12h.01",
};

export function Icon({ name, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      <path d={P[name] || P.more} />
    </svg>
  );
}
