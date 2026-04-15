"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import type { BackendBookingDetail } from "@/lib/backend-types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, MapPin, Stethoscope, Hash, Clock, CircleAlert, Loader2 } from "lucide-react";

const getStatusDetails = (status: string) => {
  switch (status) {
    case "PENDING":
      return { label: "Menunggu", color: "bg-blue-100 text-blue-700 border-blue-200" };
    case "CONFIRMED":
      return { label: "Dikonfirmasi", color: "bg-emerald-100 text-emerald-700 border-emerald-200" };
    case "DONE":
      return { label: "Selesai", color: "bg-muted text-muted-foreground border-border" };
    case "CANCELLED":
    case "NO_SHOW":
      return { label: "Batal", color: "bg-rose-100 text-rose-700 border-rose-200" };
    default:
      return { label: status, color: "bg-slate-100 text-slate-700 border-slate-200" };
  }
};

export default function BookingList() {
  const [bookings, setBookings] = useState<BackendBookingDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await api.bookings.list();
        setBookings(data || []);
      } catch (err: any) {
        setError(err.message || "Gagal memuat jadwal booking.");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl flex-1">
      {loading ? (
        <div className="flex h-[400px] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex w-full flex-col items-center justify-center space-y-3 py-12">
          <CircleAlert className="h-10 w-10 text-destructive" />
          <p className="text-muted-foreground">{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <>
          <div>
            <h1 className="text-xl font-bold text-foreground">Jadwal Pemeriksaan</h1>
            <p className="text-sm text-muted-foreground">Daftar booking dan riwayat kunjungan Anda</p>
          </div>
          <Card className="mt-6 border-dashed bg-card/50">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CalendarClock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Belum Ada Jadwal</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Anda belum memiliki jadwal pemeriksaan medis. Jadwal baru yang Anda buat akan muncul di sini.
              </p>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div>
            <h1 className="text-xl font-bold text-foreground">Jadwal Pemeriksaan</h1>
            <p className="text-sm text-muted-foreground">Daftar booking dan riwayat kunjungan Anda</p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
            {bookings.map((b) => {
              const st = getStatusDetails(b.status);
              const dateObj = new Date(b.schedule_date);
              const formattedDate = isNaN(dateObj.getTime())
                ? b.schedule_date
                : format(dateObj, "eeee, dd MMMM yyyy", { locale: id });

              return (
                <Card key={b.id} className="shadow-card hover-lift transition-all">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border/40">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Kode Booking
                      </span>
                      <CardTitle className="text-base font-bold flex items-center gap-2 mt-0.5">
                        {b.booking_code}
                      </CardTitle>
                    </div>
                    <Badge variant="outline" className={`${st.color}`}>
                      {st.label}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4 grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1 space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                        <CalendarClock className="h-3.5 w-3.5" /> Tanggal
                      </p>
                      <p className="text-sm font-medium">{formattedDate}</p>
                    </div>
                    
                    <div className="col-span-2 sm:col-span-1 space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                        <Clock className="h-3.5 w-3.5" /> Jam
                      </p>
                      <p className="text-sm font-medium">{b.schedule_time.slice(0, 5)} WIB</p>
                    </div>

                    <div className="col-span-2 h-px bg-border/40 my-1" />

                    <div className="col-span-2 sm:col-span-1 space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                        <MapPin className="h-3.5 w-3.5" /> Faskes
                      </p>
                      <p className="text-sm font-medium">{b.facility_name}</p>
                      <p className="text-xs text-muted-foreground">{b.facility_type}</p>
                    </div>

                    <div className="col-span-2 sm:col-span-1 space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                        <Stethoscope className="h-3.5 w-3.5" /> Dokter
                      </p>
                      <p className="text-sm font-medium">{b.doctor_name}</p>
                      <p className="text-xs font-medium text-primary bg-primary/10 inline-block px-1.5 py-0.5 rounded-md mt-0.5">
                        {b.speciality}
                      </p>
                    </div>

                    {b.queue_number && (
                      <div className="col-span-2 mt-2 flex items-center justify-between rounded-lg bg-muted/60 p-3">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">Nomor Antrian:</span>
                        </div>
                        <span className="text-lg font-bold text-foreground">{b.queue_number}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
