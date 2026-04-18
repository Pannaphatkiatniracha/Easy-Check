import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000";

// ── กำหนดสีตาม shift_id 
const SHIFT_COLORS = {
  1: { bg: "bg-sky-100",    text: "text-sky-700",    border: "border-sky-300",    dot: "bg-sky-500"    },
  2: { bg: "bg-violet-100", text: "text-violet-700", border: "border-violet-300", dot: "bg-violet-500" },
  3: { bg: "bg-amber-100",  text: "text-amber-700",  border: "border-amber-300",  dot: "bg-amber-500"  },
};

// ── แปลง "HH:MM:SS" → "H:MM AM/PM" 
const formatTime = (t) => {
  if (!t) return "-";
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
};

// ── Badge แสดงกะปัจจุบันของ user
const ShiftBadge = ({ shift, shiftId }) => {
  if (!shiftId || !shift) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-400 border border-gray-200">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block" />
        ยังไม่มีกะ
      </span>
    );
  }
  const c = SHIFT_COLORS[shiftId] || SHIFT_COLORS[1];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
        ${c.bg} ${c.text} border ${c.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} inline-block`} />
      {formatTime(shift.start_time)} – {formatTime(shift.end_time)}
    </span>
  );
};

// ── Main Component 
const ShiftSelection = () => {
  const [users,    setUsers]    = useState([]);
  const [shifts,   setShifts]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(null); // userId ที่กำลัง save อยู่
  const [search,   setSearch]   = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [toast,    setToast]    = useState(null);

  // ── อ่านข้อมูล approver จาก sessionStorage 
  const approver = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("user") || "{}"); }
    catch { return {}; }
  }, []);

  const token     = sessionStorage.getItem("token") || "";
  const authHeader = { Authorization: `Bearer ${token}` };

  // ── Toast helper 
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // ── โหลดข้อมูลจาก backend
  const loadData = async () => {
    try {
      setLoading(true);
      const [shiftsRes, usersRes] = await Promise.all([
        axios.get(`${API}/shifts/shifts`, { headers: authHeader }),
        axios.get(`${API}/shifts/users-with-shifts`, {
          headers: authHeader,
          params: { branch_id: approver.branch_id },
        }),
      ]);

      setShifts(shiftsRes.data || []);
      // กรองเฉพาะ role_id = 1 (user ธรรมดา) ไม่เอา approver / admin
      setUsers((usersRes.data || []).filter((u) => u.role_id === 1));
    } catch (err) {
      console.error(err);
      showToast("โหลดข้อมูลไม่สำเร็จ", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Assign กะ — save ทันทีเมื่อเลือก dropdown 
  const handleAssign = async (userId, shiftId) => {
    setSaving(userId);
    try {
      await axios.post(
        `${API}/shifts/assign-shift`,
        { userId, shiftId: shiftId === "" ? null : Number(shiftId) },
        { headers: authHeader }
      );

      // Optimistic UI update
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, shift_id: shiftId === "" ? null : Number(shiftId) }
            : u
        )
      );
      showToast("บันทึกกะเรียบร้อยแล้ว ✓");
    } catch (err) {
      showToast(err.response?.data?.message || "เกิดข้อผิดพลาด", "error");
    } finally {
      setSaving(null);
    }
  };

  // ── Derived state 
  const departments = useMemo(() => {
    const depts = [...new Set(users.map((u) => u.department).filter(Boolean))];
    return depts.sort();
  }, [users]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const hay = `${u.firstname} ${u.lastname} ${u.id_employee}`.toLowerCase();
      return (
        hay.includes(search.toLowerCase()) &&
        (filterDept === "all" || u.department === filterDept)
      );
    });
  }, [users, search, filterDept]);

  // shiftId → shift object (for ShiftBadge)
  const shiftMap = useMemo(() => {
    const m = {};
    shifts.forEach((s) => (m[s.shift_id] = s));
    return m;
  }, [shifts]);

  // ── Render 
  return (
    <div className="app-container min-h-screen bg-gradient-to-b from-[#3C467B] to-[#1F224F]
                    flex flex-col items-center py-10 px-4">

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl
            shadow-xl text-sm font-semibold text-white transition-all
            ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}
        >
          {toast.msg}
        </div>
      )}

      <div className="max-w-md w-full space-y-5">

        {/* ── Header ── */}
        <div className="flex items-center justify-center relative mb-2">
          <Link to="/home" className="absolute left-0 text-white text-2xl">
            <i className="bi bi-chevron-left" />
          </Link>
          <h2 className="text-xl font-bold text-white text-center">SHIFT MANAGEMENT</h2>
        </div>

        {/* ── Branch badge ── */}
        <div className="flex justify-center">
          <div className="bg-white/10 border border-white/20 rounded-full px-4 py-1.5
                          text-white text-xs font-medium flex items-center gap-2">
            <i className="bi bi-geo-alt-fill text-[#A5ADFF]" />
            สาขาของคุณ: Branch {approver.branch_id || "-"}
          </div>
        </div>

        {/* ── Shift Legend ── */}
        <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
          <div className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
            <i className="bi bi-clock-fill text-[#A5ADFF]" />
            กะงานทั้งหมด
          </div>

          {loading ? (
            <div className="text-white/50 text-xs">กำลังโหลด...</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {shifts.map((s) => {
                const c = SHIFT_COLORS[s.shift_id] || SHIFT_COLORS[1];
                return (
                  <div
                    key={s.shift_id}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border
                      ${c.bg} ${c.border}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                    <span className={`text-xs font-semibold ${c.text}`}>
                      กะ {s.shift_id}: {formatTime(s.start_time)} – {formatTime(s.end_time)}
                    </span>
                  </div>
                );
              })}

              {/* ป้าย "ยังไม่ได้กำหนดกะ" */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border
                              bg-gray-100 border-gray-200">
                <span className="w-2 h-2 rounded-full bg-gray-300" />
                <span className="text-xs font-semibold text-gray-400">ยังไม่ได้กำหนดกะ</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Search + Filter ── */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2
                          text-white/40 text-sm" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ / รหัสพนักงาน..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/20
                         rounded-xl text-white text-sm placeholder-white/40
                         focus:outline-none focus:border-white/50"
            />
          </div>

          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-xl text-white text-sm
                       px-3 py-2.5 focus:outline-none focus:border-white/50"
          >
            <option value="all" className="bg-[#3C467B]">ทุกแผนก</option>
            {departments.map((d) => (
              <option key={d} value={d} className="bg-[#3C467B]">{d}</option>
            ))}
          </select>
        </div>

        {/* ── Summary count ── */}
        {!loading && (
          <div className="text-white/60 text-xs text-center">
            แสดง {filtered.length} จาก {users.length} คน
            {filterDept !== "all" && ` • แผนก ${filterDept}`}
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="text-white text-center py-10 flex flex-col items-center gap-3">
            <i className="bi bi-arrow-repeat animate-spin text-3xl text-white/60" />
            <span className="text-white/60 text-sm">กำลังโหลดข้อมูล...</span>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && filtered.length === 0 && (
          <div className="bg-white/10 rounded-2xl p-10 border border-white/20
                          flex flex-col items-center gap-3">
            <i className="bi bi-people text-4xl text-white/30" />
            <div className="text-white/50 text-sm text-center">
              {search
                ? `ไม่พบพนักงานที่ค้นหา "${search}"`
                : "ไม่มีพนักงานในสาขานี้"}
            </div>
          </div>
        )}

        {/* ── User Cards ── */}
        <div className="space-y-3 pb-10">
          {filtered.map((user) => (
            <div
              key={user.id}
              className="bg-white/10 backdrop-blur rounded-2xl p-4 border
                         border-white/20 flex flex-col gap-3"
            >
              {/* ── User info row ── */}
              <div className="flex items-center gap-3">
                <img
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      `${user.firstname} ${user.lastname}`
                    )}&background=636CCB&color=fff`
                  }
                  alt={user.firstname}
                  className="w-12 h-12 rounded-full object-cover
                             border-2 border-white/20 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm truncate">
                    {user.firstname} {user.lastname}
                  </div>
                  <div className="text-white/50 text-xs">
                    {user.id_employee} • {user.position || user.department}
                  </div>
                  <div className="mt-1">
                    <ShiftBadge
                      shift={shiftMap[user.shift_id]}
                      shiftId={user.shift_id}
                    />
                  </div>
                </div>
              </div>

              {/* ── Shift dropdown (save ทันที) ── */}
              <div className="flex items-center gap-2">
                <select
                  value={user.shift_id ?? ""}
                  onChange={(e) => handleAssign(user.id, e.target.value)}
                  disabled={saving === user.id}
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl
                             text-white text-sm px-3 py-2 focus:outline-none
                             focus:border-white/50 disabled:opacity-50"
                >
                  <option value="" className="bg-[#3C467B] text-gray-300">
                    — ยังไม่กำหนดกะ —
                  </option>
                  {shifts.map((s) => (
                    <option key={s.shift_id} value={s.shift_id} className="bg-[#3C467B]">
                      กะ {s.shift_id}: {formatTime(s.start_time)} – {formatTime(s.end_time)}
                    </option>
                  ))}
                </select>

                {/* ── Indicator: กำลัง save / บันทึกแล้ว ── */}
                {saving === user.id ? (
                  <div className="text-white/60 text-sm flex-shrink-0">
                    <i className="bi bi-arrow-repeat animate-spin" />
                  </div>
                ) : user.shift_id ? (
                  <div className="text-green-400 text-sm flex-shrink-0">
                    <i className="bi bi-check-circle-fill" />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ShiftSelection;