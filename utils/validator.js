export const validate = (credentials) => {
  if (!credentials.name) {
    setError("Name is required");
    return false;
  }
  if (!credentials.email) {
    setError("Email is required");
    return false;
  }
  if (!credentials.password) {
    setError("Password is required");
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(credentials.email)) {
    setError("Please enter a valid email address");
    return false;
  }
  if (credentials.password.length < 6) {
    setError("Password must be at least 6 characters long");
    return false;
  }
  return true;
}