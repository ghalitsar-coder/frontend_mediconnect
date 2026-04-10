const patients = [
  { name: "Budi Santoso", poli: "Poli Umum", time: "08:12", progress: 85 },
  { name: "Siti Nurhaliza", poli: "Poli Gigi", time: "08:25", progress: 60 },
  { name: "Ahmad Fauzi", poli: "Poli KIA", time: "08:38", progress: 40 },
  { name: "Dewi Lestari", poli: "Poli Umum", time: "08:45", progress: 20 },
  { name: "Reza Pratama", poli: "Poli Mata", time: "08:52", progress: 10 },
];

const RecentPatients = () => {
  return (
    <div className="card-dashboard">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-foreground">
          Pasien Check-in Terbaru (QR)
        </h3>
        <a href="#" className="text-xs font-medium text-primary hover:underline">
          See All
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 text-xs font-medium text-muted-foreground">Nama Pasien</th>
              <th className="pb-3 text-xs font-medium text-muted-foreground">Poli Tujuan</th>
              <th className="pb-3 text-xs font-medium text-muted-foreground">Waktu</th>
              <th className="pb-3 text-xs font-medium text-muted-foreground">Status Layanan</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.name} className="border-b border-border/50 last:border-0">
                <td className="py-3 font-medium text-foreground">{p.name}</td>
                <td className="py-3 text-muted-foreground">{p.poli}</td>
                <td className="py-3 text-muted-foreground">{p.time}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full gradient-purple transition-all"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{p.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentPatients;
