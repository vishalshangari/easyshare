export const publicURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:4000/`
    : process.env.REACT_APP_PUBLIC_URL;
