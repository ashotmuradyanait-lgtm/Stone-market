import React, { useState, useRef } from "react";
import { login, register } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { Camera, Mail, Lock, UserPlus, LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Նկարի ընտրության ֆունկցիա
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return setError("Please fill in all fields");
    try {
      setLoading(true);
      setError("");
      await login(email, password);
      navigate("/chat");
    } catch (err: any) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) return setError("Please fill in all fields");
    try {
      setLoading(true);
      setError("");

      // 1. Ստեղծում ենք օգտատիրոջը
      const userCredential = await register(email, password, "");
      const user = userCredential.user;

      let photoURL = "";
      // 2. Եթե նկար ընտրված է, վերբեռնում ենք Storage
      if (file) {
        const storage = getStorage();
        const avatarRef = sRef(storage, `avatars/${user.uid}`);
        await uploadBytes(avatarRef, file);
        photoURL = await getDownloadURL(avatarRef);
      }

      // 3. Ուղարկում ենք դեպի չատ
      navigate("/chat");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 transform transition-all">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4 text-indigo-600">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-2">Join our secure community</p>
        </div>

        {/* Avatar Upload (Only for registration or profile feel) */}
        <div className="flex flex-col items-center mb-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative w-24 h-24 rounded-[2rem] bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-indigo-400 transition-all overflow-hidden"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <Camera size={24} />
                <span className="text-[10px] mt-1 font-bold">AVATAR</span>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 rounded-xl text-red-500 text-xs font-bold text-center animate-shake">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 space-y-3">
          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
          >
            <LogIn size={20} />
            {loading ? "Processing..." : "Sign In"}
          </button>

          <button 
            onClick={handleRegister}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-bold hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
          >
            <UserPlus size={20} />
            {loading ? "Processing..." : "Create Account"}
          </button>
        </div>

        <p className="text-center text-gray-400 text-[11px] mt-6">
          By continuing, you agree to our Terms and Service.
        </p>
      </div>
    </div>
  );
}