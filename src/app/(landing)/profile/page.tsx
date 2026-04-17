"use client";

import { useState } from "react";
import { ArrowLeft, Upload, CheckCircle2, Loader2, User, Mail, Calendar, Shield, Camera } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";


  const RAW_API_URL = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL
  : 'http://localhost:8080/api/v1';
const API_BASE_URL = RAW_API_URL?.endsWith('/api/v1')
  ? RAW_API_URL
  : `${RAW_API_URL?.replace(/\/$/, '')}/api/v1`;
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  nik?: string;
  role: string;
  ktp_url?: string;
  created_at: string;
}

const ProfilePage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const isKtpUploaded = typeof window !== "undefined" && localStorage.getItem("ktp_uploaded") === "true";

  // Mock user (nantinya ganti dengan fetch ke /auth/me)
  const mockUser: UserProfile = {
    id: "usr_123",
    full_name: "Ghali Tsar",
    email: "ghali@example.com",
    phone: "081234567890",
    nik: "3275012345678901",
    role: "PATIENT",
    ktp_url: typeof window !== "undefined" ? localStorage.getItem("ktp_url") || undefined : undefined,
    created_at: "2026-01-15",
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (JPG, PNG, dll)");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Pilih file KTP terlebih dahulu");
      return;
    }
    const formData = new FormData();
    formData.append("ktp", selectedFile);

    setIsUploading(true);
    try {
      const res = await api.post("/uploads/ktp", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = res.data.data;
      localStorage.setItem("ktp_uploaded", "true");
      localStorage.setItem("ktp_url", data.url);
      setUploadSuccess(true);
      toast.success("KTP berhasil diunggah! Anda sekarang dapat melakukan booking.");
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      toast.error("Gagal mengunggah KTP: " + message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Kembali</span>
          </Link>
          <h1 className="text-lg font-bold text-foreground">Profil Saya</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-2xl">
        {/* Informasi Profil */}
        {/* <div className="rounded-3xl border border-border bg-card p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <User size={20} className="text-primary" />
            Informasi Akun
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4 py-2 border-b border-border/50">
              <Mail size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground w-24">Email</span>
              <span className="text-sm font-medium text-foreground">{mockUser.email}</span>
            </div>
            <div className="flex items-center gap-4 py-2 border-b border-border/50">
              <User size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground w-24">Nama Lengkap</span>
              <span className="text-sm font-medium text-foreground">{mockUser.full_name}</span>
            </div>
            <div className="flex items-center gap-4 py-2 border-b border-border/50">
              <Shield size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground w-24">NIK</span>
              <span className="text-sm font-medium text-foreground">{mockUser.nik || "Belum diisi"}</span>
            </div>
            <div className="flex items-center gap-4 py-2 border-b border-border/50">
              <Calendar size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground w-24">Terdaftar</span>
              <span className="text-sm font-medium text-foreground">
                {new Date(mockUser.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          </div>
        </div> */}

        {/* Upload KTP Section */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
            <Camera size={20} className="text-primary" />
            Verifikasi KTP
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Unggah foto KTP Anda untuk dapat melakukan booking. Data Anda aman dan hanya digunakan untuk verifikasi.
          </p>

          {isKtpUploaded || uploadSuccess ? (
            <div className="rounded-2xl bg-pastel-mint/30 border border-pastel-mint p-6 text-center">
              <CheckCircle2 size={48} className="mx-auto text-pastel-mint mb-3" />
              <h3 className="text-lg font-bold text-foreground mb-1">KTP Terverifikasi</h3>
              <p className="text-sm text-muted-foreground">
                Anda sudah dapat melakukan booking. Terima kasih telah melengkapi data.
              </p>
              {mockUser.ktp_url && (
                <img src={mockUser.ktp_url} alt="Preview KTP" className="mt-4 rounded-xl max-h-32 mx-auto border" />
              )}
            </div>
          ) : (
            <>
              <div
                className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                  selectedFile ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-muted/30"
                }`}
                onClick={() => document.getElementById("ktp-upload")?.click()}
              >
                <input id="ktp-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                {previewUrl ? (
                  <div className="space-y-3">
                    <img src={previewUrl} alt="Preview KTP" className="max-h-48 mx-auto rounded-xl border" />
                    <p className="text-xs text-muted-foreground">Klik untuk mengganti gambar</p>
                  </div>
                ) : (
                  <>
                    <Upload size={36} className="mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm font-medium text-foreground mb-1">Klik untuk pilih foto KTP</p>
                    <p className="text-xs text-muted-foreground">Format JPG, PNG (maks. 5MB)</p>
                  </>
                )}
              </div>

              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className={`mt-6 w-full py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${
                  !selectedFile
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : isUploading
                    ? "bg-primary/80 text-primary-foreground"
                    : "bg-primary text-primary-foreground hover-lift shadow-md shadow-primary/20"
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Mengunggah...
                  </>
                ) : (
                  <>
                    <Upload size={18} /> Unggah KTP
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;