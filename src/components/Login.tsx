import React, { useState } from "react";
import { login, register } from "../firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await login(email, password);
      navigate("/chat");
    } catch (err: any) {
      // Firebase-ի սխալները սովորաբար ունենում են message դաշտ
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");
     await register(email, password, ""); // Ավելացրինք "" որպես displayName
      navigate("/chat");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Welcome</h2>
        <p style={styles.subtitle}>Login or create an account</p>

        <input
          style={styles.input}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button 
          style={styles.loginBtn} 
          onClick={handleLogin} 
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <button 
          style={styles.registerBtn} 
          onClick={handleRegister} 
          disabled={loading}
        >
          {loading ? "Loading..." : "Register"}
        </button>
      </div>
    </div>
  );
}

// Սահմանում ենք ստայլերի տիպը, որպեսզի TypeScript-ը հասկանա CSS հատկությունները
const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "sans-serif",
  },
  card: {
    width: "320px",
    padding: "30px",
    borderRadius: "16px",
    background: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    textAlign: "center" as const, // TS-ի համար պետք է հստակեցնել
  },
  title: {
    marginBottom: "5px",
  },
  subtitle: {
    fontSize: "12px",
    color: "#666",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    boxSizing: "border-box", // Որպեսզի padding-ը չմեծացնի input-ը
  },
  loginBtn: {
    width: "100%",
    padding: "10px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  registerBtn: {
    width: "100%",
    padding: "10px",
    background: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginBottom: "10px",
  },
};