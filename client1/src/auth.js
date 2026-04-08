export const isAuthenticated = () => {
  return sessionStorage.getItem("isLoggedIn") === "true";
};

export const loginUser = () => {
  sessionStorage.setItem("isLoggedIn", "true");
};

export const logoutUser = () => {
  sessionStorage.removeItem("isLoggedIn");
};
