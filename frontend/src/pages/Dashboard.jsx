import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("w12_token");
  const userJson = localStorage.getItem("w12_user");
  const initialUser = userJson ? JSON.parse(userJson) : null;

  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState("profile");

  // State for Personal Details Form
  const [profileForm, setProfileForm] = useState({
    name: "",
    address: "",
    city: "",
    birthdate: "",
    mobile_number: "",
    bsn_number: "",
  });

  // State for Password Change Form
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  // Booking details & history states (Customer)
  const [packages, setPackages] = useState([]);
  const [spots, setSpots] = useState([]);
  const [instructorsList, setInstructorsList] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [newBooking, setNewBooking] = useState({
    package_id: "",
    location: "",
    lessons: [],
    duo_name: "",
    duo_address: "",
    duo_city: "",
  });
  const [bookingLessonsCount, setBookingLessonsCount] = useState(0);

  // Instructor specific states
  const [instructorLessons, setInstructorLessons] = useState([]);
  const [calendarView, setCalendarView] = useState("month"); // 'day', 'week', 'month', 'list'
  const [selectedInstructorId, setSelectedInstructorId] = useState("");

  // Owner specific states
  const [usersList, setUsersList] = useState([]);
  const [unpaidBookings, setUnpaidBookings] = useState([]);
  const [adminUserForm, setAdminUserForm] = useState({
    id: "",
    email: "",
    name: "",
    role: "customer",
    address: "",
    city: "",
    birthdate: "",
    mobile_number: "",
    bsn_number: "",
    password: "",
  });
  const [isEditingUser, setIsEditingUser] = useState(false);

  // Content management states
  const [locationsList, setLocationsList] = useState([]);
  const [photosList, setPhotosList] = useState([]);
  const [contentSubTab, setContentSubTab] = useState("packages");

  // Admin Forms State
  const [adminPackageForm, setAdminPackageForm] = useState({
    id: "",
    name: "",
    duration_hours: "",
    price: "",
    max_persons: "",
    lessons_count: "",
  });
  const [isEditingPackage, setIsEditingPackage] = useState(false);

  const [adminLocationForm, setAdminLocationForm] = useState({
    id: "",
    name: "",
    difficulty: "beginner",
    difficulty_label: "",
    water_type: "",
    wind_directions: "",
    crowd_level: "",
    description: "",
    safety_tips: "",
    icon: "🏄‍♂️",
  });
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  const [adminPhotoForm, setAdminPhotoForm] = useState({
    id: "",
    title: "",
    spot: "",
    kiter: "",
    wind: "",
    gear: "",
    description: "",
    img_url: "",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
    icon: "📸",
  });
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);

  // Messages & Errors
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
      return;
    }
    fetchMe();
    fetchMetadata();
    if (user.role === "customer") {
      fetchMyBookings();
    } else if (user.role === "instructor") {
      fetchInstructorSchedule();
    } else if (user.role === "owner") {
      fetchAdminData();
    }
  }, [token]);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback({ type: "", text: "" }), 5000);
  };

  const fetchMe = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/me", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("w12_user", JSON.stringify(data.user));
        
        // Populate profile form
        if (data.user.profile) {
          setProfileForm({
            name: data.user.profile.name || "",
            address: data.user.profile.address || "",
            city: data.user.profile.city || "",
            birthdate: data.user.profile.birthdate ? data.user.profile.birthdate.substring(0, 10) : "",
            mobile_number: data.user.profile.mobile_number || "",
            bsn_number: data.user.profile.bsn_number || "",
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMetadata = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/metadata");
      if (res.ok) {
        const data = await res.json();
        setPackages(data.packages);
        setSpots(data.spots);
        setInstructorsList(data.instructors);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/bookings/my", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMyBookings(data.bookings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInstructorSchedule = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/lessons/instructor-schedule", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInstructorLessons(data.lessons);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminData = async () => {
    try {
      // 1. Fetch Users
      const uRes = await fetch("http://127.0.0.1:8000/api/admin/users", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (uRes.ok) {
        const uData = await uRes.json();
        setUsersList(uData.users);
      }

      // 2. Fetch Unpaid Bookings
      const bRes = await fetch("http://127.0.0.1:8000/api/admin/unpaid-bookings", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (bRes.ok) {
        const bData = await bRes.json();
        setUnpaidBookings(bData.bookings);
      }

      // 3. Fetch Locations
      const lRes = await fetch("http://127.0.0.1:8000/api/locations");
      if (lRes.ok) {
        const lData = await lRes.json();
        setLocationsList(lData.locations);
      }

      // 4. Fetch Photos
      const pRes = await fetch("http://127.0.0.1:8000/api/photos");
      if (pRes.ok) {
        const pData = await pRes.json();
        setPhotosList(pData.photos);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Change Profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback("success", data.message);
        fetchMe();
      } else {
        showFeedback("danger", data.message || "Fout bij opslaan.");
      }
    } catch (err) {
      showFeedback("danger", "Serverfout.");
    } finally {
      setLoading(false);
    }
  };

  // Change Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/change-password", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordForm),
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback("success", data.message);
        setPasswordForm({ current_password: "", new_password: "", new_password_confirmation: "" });
      } else {
        showFeedback("danger", data.message || "Fout bij wijzigen.");
      }
    } catch (err) {
      showFeedback("danger", "Serverfout.");
    } finally {
      setLoading(false);
    }
  };

  // Booking Package Selection
  const handlePackageChange = (pkgId) => {
    const pkg = packages.find((p) => p.id === parseInt(pkgId));
    if (pkg) {
      setBookingLessonsCount(pkg.lessons_count);
      const emptyLessons = Array.from({ length: pkg.lessons_count }, () => ({
        date: "",
        timeslot: "morning",
      }));
      setNewBooking({ ...newBooking, package_id: pkgId, lessons: emptyLessons });
    } else {
      setBookingLessonsCount(0);
      setNewBooking({ ...newBooking, package_id: "", lessons: [] });
    }
  };

  // New Booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/bookings", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBooking),
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback("success", data.message);
        setNewBooking({
          package_id: "",
          location: "",
          lessons: [],
          duo_name: "",
          duo_address: "",
          duo_city: "",
        });
        setBookingLessonsCount(0);
        fetchMyBookings();
        setActiveTab("bookings");
      } else {
        showFeedback("danger", data.message || "Boeking mislukt.");
      }
    } catch (err) {
      showFeedback("danger", "Netwerkfout.");
    } finally {
      setLoading(false);
    }
  };

  // Confirm booking payment (Client)
  const handleClientMarkPaid = async (bookingId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/bookings/pay/${bookingId}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback("success", data.message);
        fetchMyBookings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Cancel lesson Customer
  const handleCustomerCancelLesson = async (lessonId, reason) => {
    if (!reason || reason.trim().length < 5) {
      alert("Voer een geldige reden in van minimaal 5 tekens.");
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/lessons/cancel/${lessonId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback("success", data.message);
        fetchMyBookings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reschedule lesson Customer
  const handleRescheduleSubmit = async (lessonId, date, timeslot) => {
    if (!date) {
      alert("Kies een geldige datum.");
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/lessons/reschedule/${lessonId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, timeslot }),
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback("success", data.message);
        fetchMyBookings();
      } else {
        alert(data.message || "Fout bij inplannen.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Staff (Instructor / Owner) cancels a lesson
  const handleStaffCancelLesson = async (lessonId, type) => {
    const confirmText = type === "sickness" 
      ? "Weet je zeker dat je deze les wilt annuleren wegens ZIEKTE? Er wordt een standaard e-mail gestuurd naar de klant."
      : "Weet je zeker dat je deze les wilt annuleren wegens WIND > 10 BFT? Er wordt een standaard e-mail gestuurd naar de klant.";
    
    if (!window.confirm(confirmText)) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/lessons/staff-cancel/${lessonId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback("success", data.message);
        if (user.role === "instructor") {
          fetchInstructorSchedule();
        } else {
          handleInstructorSelect(selectedInstructorId);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Owner confirms booking payment
  const handleOwnerConfirmPayment = async (bookingId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/bookings/confirm/${bookingId}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback("success", data.message);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Owner loads instructor schedule
  const handleInstructorSelect = async (instId) => {
    setSelectedInstructorId(instId);
    if (!instId) {
      setInstructorLessons([]);
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/instructor-lessons/${instId}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInstructorLessons(data.lessons);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Block/Unblock user
  const handleToggleBlock = async (userId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/users/block/${userId}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback("success", data.message);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Change user role
  const handleChangeRole = async (userId, currentRole) => {
    const newRole = currentRole === "customer" ? "instructor" : "customer";
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/users/role/${userId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback("success", data.message);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // User CRUD submissions (Owner)
  const handleAdminUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = isEditingUser 
      ? `http://127.0.0.1:8000/api/admin/users/${adminUserForm.id}`
      : "http://127.0.0.1:8000/api/admin/users";
    
    const method = isEditingUser ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminUserForm),
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback("success", data.message);
        setAdminUserForm({
          id: "", email: "", name: "", role: "customer", address: "", city: "", birthdate: "", mobile_number: "", bsn_number: "", password: "",
        });
        setIsEditingUser(false);
        fetchAdminData();
      } else {
        showFeedback("danger", data.message || "Fout bij opslaan.");
      }
    } catch (err) {
      showFeedback("danger", "Netwerkfout.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUserClick = (u) => {
    setIsEditingUser(true);
    setAdminUserForm({
      id: u.id,
      email: u.email,
      name: u.profile?.name || "",
      role: u.role,
      address: u.profile?.address || "",
      city: u.profile?.city || "",
      birthdate: u.profile?.birthdate ? u.profile.birthdate.substring(0, 10) : "",
      mobile_number: u.profile?.mobile_number || "",
      bsn_number: u.profile?.bsn_number || "",
      password: "DummyPassword123!", // standard placeholder for edit
    });
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Weet je zeker dat je deze gebruiker wilt verwijderen?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        showFeedback("success", "Gebruiker succesvol verwijderd.");
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- PACKAGES CRUD handlers ---
  const handleAdminPackageSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = isEditingPackage
      ? `http://127.0.0.1:8000/api/admin/packages/${adminPackageForm.id}`
      : "http://127.0.0.1:8000/api/admin/packages";
    const method = isEditingPackage ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminPackageForm),
      });
      const data = await res.json();
      if (res.ok || res.status === 210 || res.status === 201) {
        showFeedback("success", data.message || "Pakket succesvol opgeslagen!");
        setAdminPackageForm({ id: "", name: "", duration_hours: "", price: "", max_persons: "", lessons_count: "" });
        setIsEditingPackage(false);
        fetchMetadata();
      } else {
        showFeedback("danger", data.message || "Fout bij opslaan pakket.");
      }
    } catch (err) {
      showFeedback("danger", "Netwerkfout.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPackageClick = (pkg) => {
    setIsEditingPackage(true);
    setAdminPackageForm({
      id: pkg.id,
      name: pkg.name,
      duration_hours: pkg.duration_hours,
      price: pkg.price,
      max_persons: pkg.max_persons,
      lessons_count: pkg.lessons_count,
    });
  };

  const handleDeletePackage = async (pkgId) => {
    if (!window.confirm("Weet je zeker dat je dit pakket wilt verwijderen? Dit kan invloed hebben op bestaande boekingen.")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/packages/${pkgId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        showFeedback("success", "Pakket succesvol verwijderd.");
        fetchMetadata();
      } else {
        const data = await res.json();
        showFeedback("danger", data.message || "Fout bij verwijderen.");
      }
    } catch (err) {
      console.error(err);
      showFeedback("danger", "Netwerkfout.");
    }
  };

  // --- LOCATIONS CRUD handlers ---
  const handleAdminLocationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = isEditingLocation
      ? `http://127.0.0.1:8000/api/admin/locations/${adminLocationForm.id}`
      : "http://127.0.0.1:8000/api/admin/locations";
    const method = isEditingLocation ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminLocationForm),
      });
      const data = await res.json();
      if (res.ok || res.status === 210 || res.status === 201) {
        showFeedback("success", data.message || "Locatie succesvol opgeslagen!");
        setAdminLocationForm({
          id: "", name: "", difficulty: "beginner", difficulty_label: "", water_type: "", wind_directions: "", crowd_level: "", description: "", safety_tips: "", icon: "🏄‍♂️"
        });
        setIsEditingLocation(false);
        fetchAdminData();
        fetchMetadata();
      } else {
        showFeedback("danger", data.message || "Fout bij opslaan locatie.");
      }
    } catch (err) {
      showFeedback("danger", "Netwerkfout.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditLocationClick = (loc) => {
    setIsEditingLocation(true);
    setAdminLocationForm({
      id: loc.id,
      name: loc.name,
      difficulty: loc.difficulty,
      difficulty_label: loc.difficulty_label,
      water_type: loc.water_type,
      wind_directions: loc.wind_directions,
      crowd_level: loc.crowd_level,
      description: loc.description,
      safety_tips: loc.safety_tips,
      icon: loc.icon || "🏄‍♂️",
    });
  };

  const handleDeleteLocation = async (locId) => {
    if (!window.confirm("Weet je zeker dat je deze locatie wilt verwijderen?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/locations/${locId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        showFeedback("success", "Locatie succesvol verwijderd.");
        fetchAdminData();
        fetchMetadata();
      } else {
        const data = await res.json();
        showFeedback("danger", data.message || "Fout bij verwijderen.");
      }
    } catch (err) {
      console.error(err);
      showFeedback("danger", "Netwerkfout.");
    }
  };

  // --- PHOTOS CRUD handlers ---
  const handleAdminPhotoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = isEditingPhoto
      ? `http://127.0.0.1:8000/api/admin/photos/${adminPhotoForm.id}`
      : "http://127.0.0.1:8000/api/admin/photos";
    const method = isEditingPhoto ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminPhotoForm),
      });
      const data = await res.json();
      if (res.ok || res.status === 210 || res.status === 201) {
        showFeedback("success", data.message || "Foto succesvol opgeslagen!");
        setAdminPhotoForm({
          id: "", title: "", spot: "", kiter: "", wind: "", gear: "", description: "", img_url: "", gradient: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)", icon: "📸"
        });
        setIsEditingPhoto(false);
        fetchAdminData();
      } else {
        showFeedback("danger", data.message || "Fout bij opslaan foto.");
      }
    } catch (err) {
      showFeedback("danger", "Netwerkfout.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPhotoClick = (p) => {
    setIsEditingPhoto(true);
    setAdminPhotoForm({
      id: p.id,
      title: p.title,
      spot: p.spot,
      kiter: p.kiter,
      wind: p.wind,
      gear: p.gear,
      description: p.description,
      img_url: p.img_url || "",
      gradient: p.gradient || "",
      icon: p.icon || "",
    });
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm("Weet je zeker dat je deze foto wilt verwijderen?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/photos/${photoId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        showFeedback("success", "Foto succesvol verwijderd.");
        fetchAdminData();
      } else {
        const data = await res.json();
        showFeedback("danger", data.message || "Fout bij verwijderen.");
      }
    } catch (err) {
      console.error(err);
      showFeedback("danger", "Netwerkfout.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ flex: 1, padding: "40px 24px" }}>
        
        {/* Dynamic Global Toast feedback */}
        {feedback.text && (
          <div style={{
            position: "fixed",
            top: "90px",
            right: "24px",
            background: feedback.type === "success" ? "#d1fae5" : "#fee2e2",
            border: `1.5px solid ${feedback.type === "success" ? "#10b981" : "#fca5a5"}`,
            color: feedback.type === "success" ? "#065f46" : "#b91c1c",
            borderRadius: "12px",
            padding: "16px 24px",
            zIndex: 9999,
            boxShadow: "var(--shadow-lg)",
            fontWeight: "600",
          }}>
            {feedback.text}
          </div>
        )}

        <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", alignItems: "flex-start" }}>
          
          {/* Sidebar Menu Panel */}
          <div className="card glass" style={{ width: "260px", flexShrink: 0, padding: "20px" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "16px", color: "var(--text-title)", borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
              📋 Menu
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                className={`btn btn-sm ${activeTab === "profile" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setActiveTab("profile")}
                style={{ justifyContent: "flex-start" }}
              >
                👤 Persoonsgegevens
              </button>

              {user?.role === "customer" && (
                <>
                  <button
                    className={`btn btn-sm ${activeTab === "new_booking" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setActiveTab("new_booking")}
                    style={{ justifyContent: "flex-start" }}
                  >
                    🏄‍♂️ Les Boeken
                  </button>
                  <button
                    className={`btn btn-sm ${activeTab === "bookings" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setActiveTab("bookings")}
                    style={{ justifyContent: "flex-start" }}
                  >
                    📁 Mijn Reserveringen
                  </button>
                </>
              )}

              {user?.role === "instructor" && (
                <button
                  className={`btn btn-sm ${activeTab === "schedule" ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setActiveTab("schedule")}
                  style={{ justifyContent: "flex-start" }}
                >
                  📅 Mijn Lesschema
                </button>
              )}

              {user?.role === "owner" && (
                <>
                  <button
                    className={`btn btn-sm ${activeTab === "admin_users" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setActiveTab("admin_users")}
                    style={{ justifyContent: "flex-start" }}
                  >
                    👥 Ledenbeheer
                  </button>
                  <button
                    className={`btn btn-sm ${activeTab === "unpaid" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setActiveTab("unpaid")}
                    style={{ justifyContent: "flex-start" }}
                  >
                    💰 Onbetaalde Invoices
                  </button>
                  <button
                    className={`btn btn-sm ${activeTab === "admin_schedule" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setActiveTab("admin_schedule")}
                    style={{ justifyContent: "flex-start" }}
                  >
                    📅 Instructeurs Schema's
                  </button>
                  <button
                    className={`btn btn-sm ${activeTab === "manage_content" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setActiveTab("manage_content")}
                    style={{ justifyContent: "flex-start" }}
                  >
                    ⚙️ Beheer Content
                  </button>
                </>
              )}

              <button
                className={`btn btn-sm ${activeTab === "password" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setActiveTab("password")}
                style={{ justifyContent: "flex-start" }}
              >
                🔒 Wachtwoord Wijzigen
              </button>
            </div>
          </div>

          {/* Main Dashboard Screen Panel */}
          <div style={{ flex: 1, minWidth: "300px" }}>
            
            {/* TAB: Personal Details Profile */}
            {activeTab === "profile" && (
              <div className="card animate-slide">
                <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>Mijn Persoonsgegevens</h2>
                <p style={{ color: "var(--text)", marginBottom: "24px" }}>
                  Houd je contactgegevens actueel zodat we je altijd kunnen bereiken voor surflessen.
                </p>

                <form onSubmit={handleProfileSubmit} style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label className="form-label">Volledige Naam</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Adres</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Woonplaats</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Geboortedatum</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={profileForm.birthdate}
                      onChange={(e) => setProfileForm({ ...profileForm, birthdate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mobiel nummer</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={profileForm.mobile_number}
                      onChange={(e) => setProfileForm({ ...profileForm, mobile_number: e.target.value })}
                    />
                  </div>

                  {/* BSN Number only for Instructors and Owner */}
                  {(user?.role === "instructor" || user?.role === "owner") && (
                    <div className="form-group" style={{ gridColumn: "span 2" }}>
                      <label className="form-label">BSN-Nummer (Privacy Gevoelig)</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="Voer BSN in..."
                        value={profileForm.bsn_number}
                        onChange={(e) => setProfileForm({ ...profileForm, bsn_number: e.target.value })}
                      />
                    </div>
                  )}

                  <div style={{ gridColumn: "span 2", textAlign: "right" }}>
                    <button type="submit" disabled={loading} className="btn btn-primary">
                      {loading ? "Opslaan..." : "Persoonsgegevens opslaan"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: Password Change */}
            {activeTab === "password" && (
              <div className="card animate-slide" style={{ maxWidth: "520px" }}>
                <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>Wachtwoord Wijzigen</h2>
                <p style={{ color: "var(--text)", marginBottom: "24px" }}>
                  Verander je huidige wachtwoord voor een sterke nieuwe variant.
                </p>

                <form onSubmit={handlePasswordSubmit}>
                  <div className="form-group">
                    <label className="form-label">Huidig Wachtwoord</label>
                    <input
                      type="password"
                      required
                      className="form-control"
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nieuw Wachtwoord</label>
                    <input
                      type="password"
                      required
                      placeholder="Minimaal 12 tekens..."
                      className="form-control"
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Herhaal Nieuw Wachtwoord</label>
                    <input
                      type="password"
                      required
                      placeholder="Herhaal wachtwoord..."
                      className="form-control"
                      value={passwordForm.new_password_confirmation}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", marginTop: "12px" }}>
                    Wachtwoord opslaan
                  </button>
                </form>
              </div>
            )}

            {/* TAB: Client - Book a Lesson */}
            {activeTab === "new_booking" && (
              <div className="card animate-slide">
                <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>Nieuwe Kiteles Boeken</h2>
                <p style={{ color: "var(--text)", marginBottom: "24px" }}>
                  Kies een pakket, locatie en plan direct je lesdata in!
                </p>

                <form onSubmit={handleBookingSubmit} style={{ display: "grid", gap: "20px" }}>
                  <div className="grid grid-2" style={{ gap: "20px" }}>
                    <div className="form-group">
                      <label className="form-label">Selecteer Pakket</label>
                      <select
                        required
                        className="form-control"
                        value={newBooking.package_id}
                        onChange={(e) => handlePackageChange(e.target.value)}
                      >
                        <option value="">-- Kies een lespakket --</option>
                        {packages.map((pkg) => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name} (&euro; {number_format(pkg.price, 2, ",", ".")} {pkg.max_persons > 1 ? "p.p." : ""})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Kies Locatie (Spot)</label>
                      <select
                        required
                        className="form-control"
                        value={newBooking.location}
                        onChange={(e) => setNewBooking({ ...newBooking, location: e.target.value })}
                      >
                        <option value="">-- Kies een kitespot --</option>
                        {spots.map((spot) => (
                          <option key={spot} value={spot}>{spot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Duo details form conditionally rendered */}
                  {newBooking.package_id && packages.find((p) => p.id === parseInt(newBooking.package_id))?.max_persons > 1 && (
                    <div style={{ background: "var(--secondary-light)", border: "1px solid var(--secondary)", borderRadius: "12px", padding: "20px", textAlign: "left" }}>
                      <h4 style={{ margin: "0 0 12px", color: "hsl(var(--hue-secondary), 95%, 42%)" }}>👥 Duo Deelnemer NAW-gegevens</h4>
                      <div className="grid grid-3" style={{ gap: "12px" }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Naam Duo Deelnemer</label>
                          <input
                            type="text"
                            required
                            className="form-control"
                            value={newBooking.duo_name}
                            onChange={(e) => setNewBooking({ ...newBooking, duo_name: e.target.value })}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Adres Duo Deelnemer</label>
                          <input
                            type="text"
                            required
                            className="form-control"
                            value={newBooking.duo_address}
                            onChange={(e) => setNewBooking({ ...newBooking, duo_address: e.target.value })}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Woonplaats Duo Deelnemer</label>
                          <input
                            type="text"
                            required
                            className="form-control"
                            value={newBooking.duo_city}
                            onChange={(e) => setNewBooking({ ...newBooking, duo_city: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Selection of individual Lesson dates */}
                  {bookingLessonsCount > 0 && (
                    <div style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", textAlign: "left" }}>
                      <h4 style={{ margin: "0 0 16px" }}>📅 Selecteer je {bookingLessonsCount} Lesdata</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {newBooking.lessons.map((lesson, idx) => (
                          <div key={idx} className="grid grid-2" style={{ gap: "16px", paddingBottom: "16px", borderBottom: idx < bookingLessonsCount - 1 ? "1px solid var(--border)" : "none" }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Datum voor Les {idx + 1}</label>
                              <input
                                type="date"
                                required
                                className="form-control"
                                value={lesson.date}
                                onChange={(e) => {
                                  const updated = [...newBooking.lessons];
                                  updated[idx].date = e.target.value;
                                  setNewBooking({ ...newBooking, lessons: updated });
                                }}
                              />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Dagdeel</label>
                              <select
                                required
                                className="form-control"
                                value={lesson.timeslot}
                                onChange={(e) => {
                                  const updated = [...newBooking.lessons];
                                  updated[idx].timeslot = e.target.value;
                                  setNewBooking({ ...newBooking, lessons: updated });
                                }}
                              >
                                <option value="morning">Ochtend (09:00 - 12:30)</option>
                                <option value="afternoon">Middag (13:30 - 17:00)</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ textAlign: "right", marginTop: "12px" }}>
                    <button type="submit" disabled={loading || !newBooking.package_id || !newBooking.location} className="btn btn-primary">
                      {loading ? "Boeking verwerken..." : "Reservering afronden"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: Client - My Bookings List */}
            {activeTab === "bookings" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <h2 style={{ fontSize: "24px", margin: 0, textAlign: "left" }}>Mijn Gereserveerde Pakketten</h2>

                {myBookings.length === 0 ? (
                  <div className="card" style={{ padding: "40px", color: "var(--slate-400)", textAlign: "center" }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏄‍♂️</div>
                    Je hebt nog geen surflessen geboekt. Klik op <b>Les Boeken</b> in het menu om te starten!
                  </div>
                ) : (
                  myBookings.map((b) => (
                    <div key={b.id} className="card animate-slide" style={{ padding: "24px", textAlign: "left" }}>
                      
                      {/* Booking Header bar */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", borderBottom: "1.5px solid var(--border)", paddingBottom: "14px", marginBottom: "18px" }}>
                        <div>
                          <span style={{ fontSize: "13px", fontWeight: "bold", color: "var(--primary)" }}>Reservering #W12-{b.id}</span>
                          <h3 style={{ margin: "2px 0 0", fontSize: "20px" }}>{b.package.name}</h3>
                          <span style={{ fontSize: "14px", color: "var(--slate-400)" }}>Spot: <b>{b.location}</b></span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                          <span className={`badge badge-${b.status}`} style={{ marginBottom: "6px" }}>
                            {b.status}
                          </span>
                          <span style={{ fontSize: "16px", fontWeight: "bold", color: "var(--text-title)" }}>
                            &euro; {number_format(b.package.price * (b.duo_name ? 2 : 1), 2, ",", ".")}
                          </span>
                        </div>
                      </div>

                      {/* Payment Actions */}
                      {b.status === "voorlopig" && (
                        <div style={{ background: "var(--slate-50)", border: "1px dashed var(--border)", borderRadius: "10px", padding: "12px 18px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                          <span style={{ fontSize: "14px" }}>
                            📢 Deze boeking is <b>voorlopig</b> tot betaling. Heb je het bedrag overgemaakt?
                          </span>
                          {b.customer_marked_paid ? (
                            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--success)" }}>
                              ✓ Gemeld als betaald! Wacht op bevestiging.
                            </span>
                          ) : (
                            <button onClick={() => handleClientMarkPaid(b.id)} className="btn btn-secondary btn-sm">
                              Ik heb betaald 💰
                            </button>
                          )}
                        </div>
                      )}

                      {/* Duo companion details display */}
                      {b.duo_name && (
                        <div style={{ fontSize: "14px", background: "var(--primary-light)", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px" }}>
                          👥 <b>Duo-lesser:</b> {b.duo_name} ({b.duo_address}, {b.duo_city})
                        </div>
                      )}

                      {/* Lessons schedule display inside this booking */}
                      <h4 style={{ margin: "0 0 10px", fontSize: "15px" }}>📅 Lesdagen:</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {b.lessons.map((lesson) => {
                          const dateObj = new Date(lesson.lesson_date);
                          const formattedDate = dateObj.toLocaleDateString("nl-NL", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                          return (
                            <div key={lesson.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--slate-50)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", flexWrap: "wrap", gap: "10px" }}>
                              <div>
                                <span style={{ fontWeight: "700", display: "block", color: "var(--text-title)" }}>
                                  {formattedDate}
                                </span>
                                <span style={{ fontSize: "13px" }}>
                                  Dagdeel: <b>{lesson.timeslot === "morning" ? "Ochtend (09:00 - 12:30)" : "Middag (13:30 - 17:00)"}</b> • Instructeur: <b>{lesson.instructor?.profile?.name || "Nader te bepalen"}</b>
                                </span>
                                {lesson.status === "cancelled" && (
                                  <div style={{ color: "var(--danger)", fontSize: "13px", fontWeight: "700", marginTop: "4px" }}>
                                    ✕ Geannuleerd: {lesson.cancellation_reason}
                                  </div>
                                )}
                              </div>

                              <div>
                                {lesson.status === "scheduled" ? (
                                  <button
                                    onClick={() => {
                                      const reason = window.prompt("Voer de reden voor de annulering in:");
                                      if (reason) handleCustomerCancelLesson(lesson.id, reason);
                                    }}
                                    className="btn btn-danger btn-sm"
                                  >
                                    Annuleren ✕
                                  </button>
                                ) : (
                                  /* Reschedule Form rendered inline */
                                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <input
                                      type="date"
                                      id={`resch-date-${lesson.id}`}
                                      className="form-control"
                                      style={{ padding: "4px 8px", width: "130px", fontSize: "12px" }}
                                    />
                                    <select
                                      id={`resch-slot-${lesson.id}`}
                                      className="form-control"
                                      style={{ padding: "4px 8px", width: "100px", fontSize: "12px" }}
                                    >
                                      <option value="morning">Ochtend</option>
                                      <option value="afternoon">Middag</option>
                                    </select>
                                    <button
                                      onClick={() => {
                                        const dateVal = document.getElementById(`resch-date-${lesson.id}`).value;
                                        const slotVal = document.getElementById(`resch-slot-${lesson.id}`).value;
                                        handleRescheduleSubmit(lesson.id, dateVal, slotVal);
                                      }}
                                      className="btn btn-primary btn-sm"
                                      style={{ padding: "6px 10px" }}
                                    >
                                      Inplannen
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: Instructor - Personal Schedule */}
            {activeTab === "schedule" && (
              <div className="card animate-slide" style={{ textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h2 style={{ fontSize: "24px", margin: 0 }}>Mijn Surflessen Agenda</h2>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => setCalendarView("month")} className={`btn btn-sm ${calendarView === "month" ? "btn-primary" : "btn-outline"}`}>Maand</button>
                    <button onClick={() => setCalendarView("list")} className={`btn btn-sm ${calendarView === "list" ? "btn-primary" : "btn-outline"}`}>Lijst</button>
                  </div>
                </div>

                {calendarView === "list" ? (
                  /* Schedule List View */
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {instructorLessons.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "30px", color: "var(--slate-400)" }}>
                        Geen lessen gepland in de agenda.
                      </div>
                    ) : (
                      instructorLessons.map((l) => (
                        <div key={l.id} style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", background: l.status === "cancelled" ? "#fee2e2" : "var(--card-bg)", flexWrap: "wrap", gap: "10px" }}>
                          <div>
                            <span style={{ fontSize: "14px", fontWeight: "bold", color: "var(--primary)" }}>{l.lesson_date}</span>
                            <span style={{ fontSize: "12px", background: "var(--slate-100)", padding: "2px 6px", borderRadius: "4px", marginLeft: "8px", fontWeight: "600" }}>
                              {l.timeslot === "morning" ? "Ochtend" : "Middag"}
                            </span>
                            <h4 style={{ margin: "6px 0 2px" }}>Klant: {l.booking.customer.profile?.name} ({l.booking.customer.email})</h4>
                            <span style={{ fontSize: "13px" }}>Spot: <b>{l.booking.location}</b> • Pakket: <b>{l.booking.package.name}</b></span>
                            
                            {l.status === "cancelled" && (
                              <div style={{ color: "var(--danger)", fontWeight: "bold", fontSize: "12px", marginTop: "4px" }}>
                                Geannuleerd: {l.cancellation_reason}
                              </div>
                            )}
                          </div>

                          {l.status === "scheduled" && (
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button onClick={() => handleStaffCancelLesson(l.id, "sickness")} className="btn btn-danger btn-sm">
                                🤒 Ziekte
                              </button>
                              <button onClick={() => handleStaffCancelLesson(l.id, "weather")} className="btn btn-secondary btn-sm" style={{ padding: "6px 12px" }}>
                                💨 Storm
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  /* Calendar Monthly Grid View */
                  <div className="calendar-container">
                    <div className="calendar-grid">
                      {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((h) => (
                        <div key={h} className="calendar-day-header" style={{ textAlign: "center" }}>{h}</div>
                      ))}
                      
                      {/* Simple mock render of standard May 2026 Calendar Grid (Starts on Friday, 31 days) */}
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={`empty-${i}`} className="calendar-cell" style={{ opacity: 0.3 }} />
                      ))}

                      {Array.from({ length: 31 }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const dateStr = `2026-05-${dayNum.toString().padStart(2, "0")}`;
                        const dayLessons = instructorLessons.filter((l) => l.lesson_date === dateStr);

                        return (
                          <div key={dayNum} className="calendar-cell active-month">
                            <span className="calendar-date-number">{dayNum}</span>
                            <div className="calendar-events">
                              {dayLessons.map((l) => (
                                <div
                                  key={l.id}
                                  className={`calendar-event ${l.status === "cancelled" ? "calendar-event-red" : "calendar-event-blue"}`}
                                  title={`${l.booking.customer.profile?.name} - ${l.timeslot}`}
                                >
                                  {l.timeslot === "morning" ? "🌅" : "☀️"} {l.booking.customer.profile?.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Owner - Ledenbeheer (Users CRUD & Roles) */}
            {activeTab === "admin_users" && (
              <div className="card animate-slide" style={{ textAlign: "left" }}>
                <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>Ledenbeheer (CRUD)</h2>
                
                {/* CRUD Form */}
                <div style={{ background: "var(--slate-50)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "32px" }}>
                  <h4 style={{ margin: "0 0 16px" }}>
                    {isEditingUser ? "✏️ Gebruiker bewerken" : "➕ Nieuwe gebruiker toevoegen"}
                  </h4>
                  <form onSubmit={handleAdminUserSubmit} style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                    <div className="form-group">
                      <label className="form-label">E-mail (Gebruikersnaam)</label>
                      <input
                        type="email"
                        required
                        className="form-control"
                        value={adminUserForm.email}
                        onChange={(e) => setAdminUserForm({ ...adminUserForm, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Wachtwoord</label>
                      <input
                        type="password"
                        required={!isEditingUser}
                        placeholder={isEditingUser ? "Onveranderd laten..." : "Kies wachtwoord..."}
                        className="form-control"
                        value={adminUserForm.password}
                        onChange={(e) => setAdminUserForm({ ...adminUserForm, password: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Volledige Naam</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={adminUserForm.name}
                        onChange={(e) => setAdminUserForm({ ...adminUserForm, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gebruikersrol</label>
                      <select
                        required
                        className="form-control"
                        value={adminUserForm.role}
                        onChange={(e) => setAdminUserForm({ ...adminUserForm, role: e.target.value })}
                      >
                        <option value="customer">Klant</option>
                        <option value="instructor">Instructeur</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Adres</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={adminUserForm.address}
                        onChange={(e) => setAdminUserForm({ ...adminUserForm, address: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Woonplaats</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={adminUserForm.city}
                        onChange={(e) => setAdminUserForm({ ...adminUserForm, city: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Geboortedatum</label>
                      <input
                        type="date"
                        required
                        className="form-control"
                        value={adminUserForm.birthdate}
                        onChange={(e) => setAdminUserForm({ ...adminUserForm, birthdate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mobiel nummer</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={adminUserForm.mobile_number}
                        onChange={(e) => setAdminUserForm({ ...adminUserForm, mobile_number: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: "span 2" }}>
                      <label className="form-label">BSN-nummer (Verplicht voor Instructeurs)</label>
                      <input
                        type="text"
                        required={adminUserForm.role === "instructor"}
                        className="form-control"
                        value={adminUserForm.bsn_number}
                        onChange={(e) => setAdminUserForm({ ...adminUserForm, bsn_number: e.target.value })}
                      />
                    </div>

                    <div style={{ gridColumn: "span 2", textAlign: "right", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                      {isEditingUser && (
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => {
                            setIsEditingUser(false);
                            setAdminUserForm({ id: "", email: "", name: "", role: "customer", address: "", city: "", birthdate: "", mobile_number: "", bsn_number: "", password: "" });
                          }}
                        >
                          Annuleren
                        </button>
                      )}
                      <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? "Opslaan..." : "Gebruiker opslaan"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Users List */}
                <h4 style={{ margin: "0 0 12px" }}>Geregistreerde Gebruikers:</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {usersList.map((u) => (
                    <div key={u.id} style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", background: "var(--card-bg)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                      <div>
                        <h4 style={{ margin: "0 0 4px" }}>
                          {u.profile?.name || u.email}
                          <span className="badge badge-voorlopig" style={{ fontSize: "10px", marginLeft: "10px" }}>{u.role === "customer" ? "Klant" : "Instructeur"}</span>
                          {u.is_blocked && <span className="badge badge-cancelled" style={{ fontSize: "10px", marginLeft: "10px" }}>Geblokkeerd</span>}
                        </h4>
                        <span style={{ fontSize: "13px", display: "block" }}>E-mail: <b>{u.email}</b> • Mobiel: <b>{u.profile?.mobile_number || "Niet ingevuld"}</b></span>
                        <span style={{ fontSize: "12px", color: "var(--slate-400)" }}>Adres: {u.profile?.address}, {u.profile?.city}</span>
                      </div>

                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <button onClick={() => handleEditUserClick(u)} className="btn btn-outline btn-sm">✏️ Edit</button>
                        <button onClick={() => handleToggleBlock(u.id)} className="btn btn-secondary btn-sm" style={{ padding: "6px 12px" }}>
                          {u.is_blocked ? "🔓 Deblokkeren" : "🔒 Blokkeren"}
                        </button>
                        <button onClick={() => handleChangeRole(u.id, u.role)} className="btn btn-outline btn-sm" style={{ padding: "6px 12px" }}>
                          🔄 Rol Wijzigen
                        </button>
                        <button onClick={() => handleDeleteUser(u.id)} className="btn btn-danger btn-sm">✕ Verwijder</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Owner - Unpaid Bookings */}
            {activeTab === "unpaid" && (
              <div className="card animate-slide" style={{ textAlign: "left" }}>
                <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>Onbetaalde Pakketten</h2>
                <p style={{ color: "var(--text)", marginBottom: "24px" }}>
                  Overzicht van reserveringen met de status <b>voorlopig</b>. Bevestig de betaling om de lessen definitief in te plannen.
                </p>

                {unpaidBookings.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px", color: "var(--slate-400)" }}>
                    Er zijn momenteel geen openstaande onbetaalde reserveringen! 🎉
                  </div>
                ) : (
                  unpaidBookings.map((b) => (
                    <div key={b.id} style={{ border: "1.5px dashed var(--border)", borderRadius: "12px", padding: "16px", background: "var(--slate-50)", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                      <div>
                        <span style={{ fontSize: "12px", fontWeight: "bold", color: "var(--primary)" }}>Reservering #W12-{b.id}</span>
                        <h4 style={{ margin: "2px 0 4px", fontSize: "16px" }}>{b.package.name}</h4>
                        <span style={{ fontSize: "14px", display: "block" }}>Klant: <b>{b.customer.profile?.name}</b> ({b.customer.email})</span>
                        <span style={{ fontSize: "13px", color: "var(--slate-700)" }}>Total bedrag: <b>&euro; {number_format(b.package.price * (b.duo_name ? 2 : 1), 2, ",", ".")}</b></span>
                        {b.customer_marked_paid && (
                          <div style={{ color: "var(--success)", fontSize: "13px", fontWeight: "bold", marginTop: "4px" }}>
                            💰 Klant heeft aangegeven te hebben betaald!
                          </div>
                        )}
                      </div>

                      <button onClick={() => handleOwnerConfirmPayment(b.id)} className="btn btn-primary btn-sm">
                        Betaling Bevestigen (Definitief) ✓
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: Owner - Instructor Schedule Viewer */}
            {activeTab === "admin_schedule" && (
              <div className="card animate-slide" style={{ textAlign: "left" }}>
                <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>Instructeurs Schema's</h2>
                <p style={{ color: "var(--text)", marginBottom: "20px" }}>
                  Selecteer een instructeur om hun geplande surflessen dag-, week- en maandrooster in te zien.
                </p>

                <div className="form-group" style={{ maxWidth: "340px", marginBottom: "24px" }}>
                  <label className="form-label">Kies Instructeur</label>
                  <select
                    className="form-control"
                    value={selectedInstructorId}
                    onChange={(e) => handleInstructorSelect(e.target.value)}
                  >
                    <option value="">-- Selecteer een instructeur --</option>
                    {instructorsList.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.profile?.name || inst.email}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedInstructorId ? (
                  /* Display Calendar Grid for selected instructor */
                  <div>
                    <h4 style={{ margin: "0 0 12px" }}>Agenda Rooster:</h4>
                    
                    <div className="calendar-container">
                      <div className="calendar-grid">
                        {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((h) => (
                          <div key={h} className="calendar-day-header" style={{ textAlign: "center" }}>{h}</div>
                        ))}
                        
                        {/* Friday start mock offset */}
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={`empty-${i}`} className="calendar-cell" style={{ opacity: 0.3 }} />
                        ))}

                        {Array.from({ length: 31 }).map((_, idx) => {
                          const dayNum = idx + 1;
                          const dateStr = `2026-05-${dayNum.toString().padStart(2, "0")}`;
                          const dayLessons = instructorLessons.filter((l) => l.lesson_date === dateStr);

                          return (
                            <div key={dayNum} className="calendar-cell active-month">
                              <span className="calendar-date-number">{dayNum}</span>
                              <div className="calendar-events">
                                {dayLessons.map((l) => (
                                  <div
                                    key={l.id}
                                    className={`calendar-event ${l.status === "cancelled" ? "calendar-event-red" : "calendar-event-blue"}`}
                                    title={`${l.booking.customer.profile?.name} - ${l.timeslot}`}
                                    style={{ display: "flex", justifyContent: "between", alignItems: "center" }}
                                  >
                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                                      {l.timeslot === "morning" ? "🌅" : "☀️"} {l.booking.customer.profile?.name}
                                    </span>
                                    {l.status === "scheduled" && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const type = window.confirm("Annuleren wegens Ziekte (OK) of Slecht Weer (Cancel)?") ? "sickness" : "weather";
                                          handleStaffCancelLesson(l.id, type);
                                        }}
                                        style={{ background: "transparent", border: "none", color: "#b91c1c", cursor: "pointer", fontSize: "8px", padding: 0 }}
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px", color: "var(--slate-400)", border: "1px dashed var(--border)", borderRadius: "12px" }}>
                    Selecteer een instructeur uit de lijst om de agenda weer te geven.
                  </div>
                )}
              </div>
            )}

            {/* TAB: Owner - Content Management (CRUD for Packages, Locations, Photos) */}
            {activeTab === "manage_content" && (
              <div className="card animate-slide" style={{ textAlign: "left" }}>
                <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>⚙️ Content Beheer</h2>
                <p style={{ color: "var(--text)", marginBottom: "24px" }}>
                  Beheer hier alle lespakketten, kitespot locaties en de foto galerij.
                </p>

                {/* Sub-tabs for content types */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "24px", borderBottom: "1.5px solid var(--border)", paddingBottom: "12px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => setContentSubTab("packages")}
                    className={`btn btn-sm ${contentSubTab === "packages" ? "btn-primary" : "btn-outline"}`}
                  >
                    📦 Lespakketten ({packages.length})
                  </button>
                  <button
                    onClick={() => setContentSubTab("locations")}
                    className={`btn btn-sm ${contentSubTab === "locations" ? "btn-primary" : "btn-outline"}`}
                  >
                    📍 Locaties/Spots ({locationsList.length})
                  </button>
                  <button
                    onClick={() => setContentSubTab("photos")}
                    className={`btn btn-sm ${contentSubTab === "photos" ? "btn-primary" : "btn-outline"}`}
                  >
                    🖼️ Galerij Foto's ({photosList.length})
                  </button>
                </div>

                {/* SUBTAB: PACKAGES */}
                {contentSubTab === "packages" && (
                  <div>
                    {/* Form for Package */}
                    <div style={{ background: "var(--slate-50)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "32px" }}>
                      <h4 style={{ margin: "0 0 16px" }}>
                        {isEditingPackage ? "✏️ Pakket bewerken" : "➕ Nieuw lespakket toevoegen"}
                      </h4>
                      <form onSubmit={handleAdminPackageSubmit} style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                        <div className="form-group" style={{ gridColumn: "span 2" }}>
                          <label className="form-label">Naam Pakket</label>
                          <input
                            type="text"
                            required
                            className="form-control"
                            placeholder="Bijv. Basic Surfer, Duo Master..."
                            value={adminPackageForm.name}
                            onChange={(e) => setAdminPackageForm({ ...adminPackageForm, name: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Duur (Uren)</label>
                          <input
                            type="number"
                            step="0.1"
                            required
                            min="0.1"
                            className="form-control"
                            placeholder="Bijv. 3.5, 10..."
                            value={adminPackageForm.duration_hours}
                            onChange={(e) => setAdminPackageForm({ ...adminPackageForm, duration_hours: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Prijs (&euro;)</label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            min="0"
                            className="form-control"
                            placeholder="Bijv. 150.00..."
                            value={adminPackageForm.price}
                            onChange={(e) => setAdminPackageForm({ ...adminPackageForm, price: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Max Personen</label>
                          <input
                            type="number"
                            required
                            min="1"
                            className="form-control"
                            placeholder="1 voor Privé, 2 voor Duo..."
                            value={adminPackageForm.max_persons}
                            onChange={(e) => setAdminPackageForm({ ...adminPackageForm, max_persons: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Aantal Lessen</label>
                          <input
                            type="number"
                            required
                            min="1"
                            className="form-control"
                            placeholder="Bijv. 1, 3, 5..."
                            value={adminPackageForm.lessons_count}
                            onChange={(e) => setAdminPackageForm({ ...adminPackageForm, lessons_count: e.target.value })}
                          />
                        </div>

                        <div style={{ gridColumn: "span 2", textAlign: "right", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                          {isEditingPackage && (
                            <button
                              type="button"
                              className="btn btn-outline"
                              onClick={() => {
                                setIsEditingPackage(false);
                                setAdminPackageForm({ id: "", name: "", duration_hours: "", price: "", max_persons: "", lessons_count: "" });
                              }}
                            >
                              Annuleren
                            </button>
                          )}
                          <button type="submit" disabled={loading} className="btn btn-primary">
                            {loading ? "Opslaan..." : "Pakket opslaan"}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Packages List */}
                    <h4 style={{ margin: "0 0 12px" }}>Bestaande Pakketten:</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {packages.map((pkg) => (
                        <div key={pkg.id} style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", background: "var(--card-bg)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                          <div>
                            <h4 style={{ margin: "0 0 4px" }}>
                              {pkg.name}
                              <span className="badge badge-definitief" style={{ fontSize: "10px", marginLeft: "10px" }}>
                                {pkg.lessons_count} {pkg.lessons_count === 1 ? 'les' : 'lessen'}
                              </span>
                            </h4>
                            <span style={{ fontSize: "14px", display: "block" }}>
                              Duur: <b>{pkg.duration_hours} uur</b> • Prijs: <b>&euro; {number_format(pkg.price, 2, ",", ".")}</b> • Type: <b>{pkg.max_persons === 1 ? "Privé (1 pers.)" : `Groep (max. ${pkg.max_persons} pers.)`}</b>
                            </span>
                          </div>

                          <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => handleEditPackageClick(pkg)} className="btn btn-outline btn-sm">✏️ Edit</button>
                            <button onClick={() => handleDeletePackage(pkg.id)} className="btn btn-danger btn-sm">✕ Verwijder</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUBTAB: LOCATIONS */}
                {contentSubTab === "locations" && (
                  <div>
                    {/* Form for Location */}
                    <div style={{ background: "var(--slate-50)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "32px" }}>
                      <h4 style={{ margin: "0 0 16px" }}>
                        {isEditingLocation ? "✏️ Locatie bewerken" : "➕ Nieuwe locatie toevoegen"}
                      </h4>
                      <form onSubmit={handleAdminLocationSubmit} style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                        <div className="form-group" style={{ gridColumn: "span 2" }}>
                          <label className="form-label">Naam Locatie</label>
                          <input
                            type="text"
                            required
                            className="form-control"
                            placeholder="Bijv. Schellinkhout, Medemblik..."
                            value={adminLocationForm.name}
                            onChange={(e) => setAdminLocationForm({ ...adminLocationForm, name: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Niveau (Difficulty)</label>
                          <select
                            required
                            className="form-control"
                            value={adminLocationForm.difficulty}
                            onChange={(e) => setAdminLocationForm({ ...adminLocationForm, difficulty: e.target.value })}
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Niveau Label (Zichtbaar)</label>
                          <input
                            type="text"
                            required
                            className="form-control"
                            placeholder="Bijv. Geschikt voor beginners, Enkel gevorderden..."
                            value={adminLocationForm.difficulty_label}
                            onChange={(e) => setAdminLocationForm({ ...adminLocationForm, difficulty_label: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Type water</label>
                          <input
                            type="text"
                            required
                            className="form-control"
                            placeholder="Bijv. Vlak water en ondiep, Golven..."
                            value={adminLocationForm.water_type}
                            onChange={(e) => setAdminLocationForm({ ...adminLocationForm, water_type: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Windrichtingen</label>
                          <input
                            type="text"
                            required
                            className="form-control"
                            placeholder="Bijv. Z, ZO, W, NW..."
                            value={adminLocationForm.wind_directions}
                            onChange={(e) => setAdminLocationForm({ ...adminLocationForm, wind_directions: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Drukte niveau</label>
                          <input
                            type="text"
                            required
                            className="form-control"
                            placeholder="Bijv. Rustig, Gemiddeld, Druk..."
                            value={adminLocationForm.crowd_level}
                            onChange={(e) => setAdminLocationForm({ ...adminLocationForm, crowd_level: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Emoji / Icon</label>
                          <input
                            type="text"
                            required
                            className="form-control"
                            placeholder="Bijv. 🏄‍♂️, 🌾, 🏖️..."
                            value={adminLocationForm.icon}
                            onChange={(e) => setAdminLocationForm({ ...adminLocationForm, icon: e.target.value })}
                          />
                        </div>
                        <div className="form-group" style={{ gridColumn: "span 2" }}>
                          <label className="form-label">Beschrijving</label>
                          <textarea
                            required
                            rows="3"
                            className="form-control"
                            placeholder="Uitgebreide beschrijving van de spot..."
                            value={adminLocationForm.description}
                            onChange={(e) => setAdminLocationForm({ ...adminLocationForm, description: e.target.value })}
                          />
                        </div>
                        <div className="form-group" style={{ gridColumn: "span 2" }}>
                          <label className="form-label">Veiligheidsinstructies / Tips</label>
                          <textarea
                            required
                            rows="2"
                            className="form-control"
                            placeholder="Veiligheidstips voor kiters op deze spot..."
                            value={adminLocationForm.safety_tips}
                            onChange={(e) => setAdminLocationForm({ ...adminLocationForm, safety_tips: e.target.value })}
                          />
                        </div>

                        <div style={{ gridColumn: "span 2", textAlign: "right", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                          {isEditingLocation && (
                            <button
                              type="button"
                              className="btn btn-outline"
                              onClick={() => {
                                setIsEditingLocation(false);
                                setAdminLocationForm({ id: "", name: "", difficulty: "beginner", difficulty_label: "", water_type: "", wind_directions: "", crowd_level: "", description: "", safety_tips: "", icon: "🏄‍♂️" });
                              }}
                            >
                              Annuleren
                            </button>
                          )}
                          <button type="submit" disabled={loading} className="btn btn-primary">
                            {loading ? "Opslaan..." : "Locatie opslaan"}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Locations List */}
                    <h4 style={{ margin: "0 0 12px" }}>Bestaande Locaties:</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {locationsList.map((loc) => (
                        <div key={loc.id} style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", background: "var(--card-bg)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                          <div>
                            <h4 style={{ margin: "0 0 4px" }}>
                              {loc.icon} {loc.name}
                              <span className="badge badge-voorlopig" style={{ fontSize: "10px", marginLeft: "10px" }}>
                                {loc.difficulty}
                              </span>
                            </h4>
                            <span style={{ fontSize: "13px", display: "block" }}>
                              Niveau: <b>{loc.difficulty_label}</b> • Water: <b>{loc.water_type}</b> • Wind: <b>{loc.wind_directions}</b>
                            </span>
                            <span style={{ fontSize: "12px", color: "var(--slate-400)" }}>{loc.description.substring(0, 100)}...</span>
                          </div>

                          <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => handleEditLocationClick(loc)} className="btn btn-outline btn-sm">✏️ Edit</button>
                            <button onClick={() => handleDeleteLocation(loc.id)} className="btn btn-danger btn-sm">✕ Verwijder</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUBTAB: PHOTOS */}
                {contentSubTab === "photos" && (
                  <div>
                    {/* Form for Photo */}
                    <div style={{ background: "var(--slate-50)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "32px" }}>
                      <h4 style={{ margin: "0 0 16px" }}>
                        {isEditingPhoto ? "✏️ Foto bewerken" : "➕ Nieuwe foto toevoegen"}
                      </h4>
                      <form onSubmit={handleAdminPhotoSubmit} style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                        <div className="form-group" style={{ gridColumn: "span 2" }}>
                          <label className="form-label">Titel Foto</label>
                          <input
                            type="text"
                            required
                            className="form-control"
                            placeholder="Bijv. Big Air in Sunset, Eerste meters..."
                            value={adminPhotoForm.title}
                            onChange={(e) => setAdminPhotoForm({ ...adminPhotoForm, title: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Spot / Locatie</label>
                          <input
                            type="text"
                            required
                            className="form-control"
                            placeholder="Bijv. Schellinkhout, Medemblik..."
                            value={adminPhotoForm.spot}
                            onChange={(e) => setAdminPhotoForm({ ...adminPhotoForm, spot: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Kiter (Persoon op foto)</label>
                          <input
                            type="text"
                            required
                            className="form-control"
                            placeholder="Bijv. Terence Olieslager, Jasper..."
                            value={adminPhotoForm.kiter}
                            onChange={(e) => setAdminPhotoForm({ ...adminPhotoForm, kiter: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Windkracht / Richting</label>
                          <input
                            type="text"
                            required
                            className="form-control"
                            placeholder="Bijv. 22 kts WNW, 18 kts Z..."
                            value={adminPhotoForm.wind}
                            onChange={(e) => setAdminPhotoForm({ ...adminPhotoForm, wind: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Gebruikte Gear</label>
                          <input
                            type="text"
                            required
                            className="form-control"
                            placeholder="Bijv. Duotone Rebel 10m, Core XR7..."
                            value={adminPhotoForm.gear}
                            onChange={(e) => setAdminPhotoForm({ ...adminPhotoForm, gear: e.target.value })}
                          />
                        </div>

                        <div className="form-group" style={{ gridColumn: "span 2" }}>
                          <label className="form-label">Afbeelding URL (Optioneel: Geef URL óf vul verloop/icon in)</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Bijv. https://images.unsplash.com/... (Laat leeg voor gradient placeholder)"
                            value={adminPhotoForm.img_url}
                            onChange={(e) => setAdminPhotoForm({ ...adminPhotoForm, img_url: e.target.value })}
                          />
                        </div>

                        {!adminPhotoForm.img_url && (
                          <>
                            <div className="form-group">
                              <label className="form-label">Gradient verloop (Als URL leeg is)</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Bijv. linear-gradient(135deg, #f97316 0%, #ef4444 100%)"
                                value={adminPhotoForm.gradient}
                                onChange={(e) => setAdminPhotoForm({ ...adminPhotoForm, gradient: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Emoji / Icon (Als URL leeg is)</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Bijv. 🤙, 💨, 🌅, 🛹..."
                                value={adminPhotoForm.icon}
                                onChange={(e) => setAdminPhotoForm({ ...adminPhotoForm, icon: e.target.value })}
                              />
                            </div>
                          </>
                        )}

                        <div className="form-group" style={{ gridColumn: "span 2" }}>
                          <label className="form-label">Omschrijving / Foto-caption</label>
                          <textarea
                            required
                            rows="2"
                            className="form-control"
                            placeholder="Bijv. Terence laat zien hoe je een perfecte trick landt bij zonsondergang..."
                            value={adminPhotoForm.description}
                            onChange={(e) => setAdminPhotoForm({ ...adminPhotoForm, description: e.target.value })}
                          />
                        </div>

                        <div style={{ gridColumn: "span 2", textAlign: "right", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                          {isEditingPhoto && (
                            <button
                              type="button"
                              className="btn btn-outline"
                              onClick={() => {
                                setIsEditingPhoto(false);
                                setAdminPhotoForm({ id: "", title: "", spot: "", kiter: "", wind: "", gear: "", description: "", img_url: "", gradient: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)", icon: "📸" });
                              }}
                            >
                              Annuleren
                            </button>
                          )}
                          <button type="submit" disabled={loading} className="btn btn-primary">
                            {loading ? "Opslaan..." : "Foto opslaan"}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Photos List */}
                    <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                      {photosList.map((p) => (
                        <div key={p.id} style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", background: "var(--card-bg)", display: "flex", flexDirection: "column" }}>
                          {p.img_url ? (
                            <img src={p.img_url} alt={p.title} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                          ) : (
                            <div style={{ background: p.gradient || "var(--slate-100)", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>
                              {p.icon || "📸"}
                            </div>
                          )}
                          <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <div>
                              <h4 style={{ margin: "0 0 6px", fontSize: "16px" }}>{p.title}</h4>
                              <span style={{ fontSize: "12px", display: "block", color: "var(--slate-400)", marginBottom: "8px" }}>
                                Spot: <b>{p.spot}</b> • Kiter: <b>{p.kiter}</b>
                              </span>
                              <p style={{ fontSize: "13px", margin: "0 0 12px" }}>{p.description}</p>
                            </div>
                            <div style={{ display: "flex", gap: "8px", borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                              <button onClick={() => handleEditPhotoClick(p)} className="btn btn-outline btn-sm" style={{ flex: 1 }}>✏️ Edit</button>
                              <button onClick={() => handleDeletePhoto(p.id)} className="btn btn-danger btn-sm" style={{ flex: 1 }}>✕ Verwijder</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

// PHP-like helper function for formatting monetary values
function number_format(number, decimals, dec_point, thousands_sep) {
  number = (number + "").replace(/[^0-9+\-Ee.]/g, "");
  const n = !isFinite(+number) ? 0 : +number;
  const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  const sep = typeof thousands_sep === "undefined" ? "," : thousands_sep;
  const dec = typeof dec_point === "undefined" ? "." : dec_point;
  let s = "";
  const toFixedFix = function (n, prec) {
    const k = Math.pow(10, prec);
    return "" + (Math.round(n * k) / k).toFixed(prec);
  };
  s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }
  return s.join(dec);
}

export default Dashboard;
