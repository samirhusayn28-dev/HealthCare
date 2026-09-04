import type { Doctor, Branch, Service, Testimonial, Staff, Patient, Appointment, Invoice, QueueEntry, Report } from '@/types'

// ============================================================
// CLINIC DETAILS — Replace before deployment
// ============================================================
export const CLINIC_NAME = 'Medica Wellness Clinic'
export const CLINIC_TAGLINE = 'Expert Care, Closer to You'
export const CLINIC_DESCRIPTION = 'A trusted, multi-specialty wellness clinic dedicated to providing compassionate, evidence-based healthcare for every stage of life.'
export const CLINIC_WHATSAPP_NUMBER = '923240130267' // Format: country code + number without +
export const CLINIC_PHONE = '+92 324 0130267'
export const CLINIC_PHONE_TEL = '+923240130267'
export const CLINIC_PHONE_DISPLAY = '03240130267'
export const WHATSAPP_MESSAGE = encodeURIComponent("Hi, I'd like to book an appointment at Medica Wellness Clinic. Could you help me?")
export const CLINIC_EMAIL = 'hello@medicawellness.com'

// ============================================================
// BRANCHES
// ============================================================
export const BRANCHES: Branch[] = [
  {
    id: 'branch-1',
    name: 'Main Campus',
    address: '123 Wellness Blvd, Suite 100, San Francisco, CA 94102',
    phone: '+92 324 0130267',
    email: 'main@medicawellness.com',
    timezone: 'America/Los_Angeles',
  },
  {
    id: 'branch-2',
    name: 'Downtown Clinic',
    address: '456 Health Ave, Floor 3, San Francisco, CA 94105',
    phone: '+92 324 0130267',
    email: 'downtown@medicawellness.com',
    timezone: 'America/Los_Angeles',
  },
]

// ============================================================
// DOCTORS
// ============================================================
export const DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Chen',
    specialization: 'Cardiology',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    experience: 14,
    availableHours: ['09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00'],
    bio: 'Dr. Chen is a board-certified cardiologist with expertise in preventive cardiology and heart failure management. She trained at UCSF Medical Center and has published research on cardiac risk reduction.',
    rating: 4.9,
    reviewCount: 312,
    languages: ['English', 'Mandarin'],
    education: 'MD, Stanford University School of Medicine',
  },
  {
    id: 'doc-2',
    name: 'Dr. James Okafor',
    specialization: 'General Medicine',
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    experience: 9,
    availableHours: ['08:00', '08:30', '09:00', '11:00', '11:30', '16:00', '16:30'],
    bio: 'Dr. Okafor is a compassionate family physician focused on preventive care and chronic disease management. He believes in building long-term relationships with patients through honest, clear communication.',
    rating: 4.8,
    reviewCount: 278,
    languages: ['English', 'Yoruba', 'French'],
    education: 'MD, Johns Hopkins University',
  },
  {
    id: 'doc-3',
    name: 'Dr. Priya Sharma',
    specialization: 'Pediatrics',
    photoUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
    experience: 11,
    availableHours: ['09:00', '09:30', '10:30', '11:00', '13:00', '13:30', '14:00'],
    bio: 'Dr. Sharma is a dedicated pediatrician passionate about child development and preventive health. Her gentle approach helps children feel comfortable and parents feel heard.',
    rating: 4.9,
    reviewCount: 445,
    languages: ['English', 'Hindi', 'Punjabi'],
    education: 'MD, University of California, San Francisco',
  },
  {
    id: 'doc-4',
    name: 'Dr. Michael Torres',
    specialization: 'Orthopedics',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
    experience: 17,
    availableHours: ['10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30'],
    bio: 'Dr. Torres specializes in sports medicine and minimally invasive orthopedic surgery. He has treated professional athletes and believes in personalized rehabilitation programs.',
    rating: 4.7,
    reviewCount: 189,
    languages: ['English', 'Spanish'],
    education: 'MD, Harvard Medical School',
  },
  {
    id: 'doc-5',
    name: 'Dr. Amara Diallo',
    specialization: 'Dermatology',
    photoUrl: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face',
    experience: 8,
    availableHours: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
    bio: 'Dr. Diallo is a cosmetic and medical dermatologist specializing in skin of color, acne, eczema, and laser treatments. She creates personalized skincare plans tailored to each patient.',
    rating: 4.8,
    reviewCount: 203,
    languages: ['English', 'French', 'Wolof'],
    education: 'MD, Columbia University College of Physicians and Surgeons',
  },
  {
    id: 'doc-6',
    name: 'Dr. David Kim',
    specialization: 'Neurology',
    photoUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
    experience: 12,
    availableHours: ['08:30', '09:00', '10:00', '10:30', '15:00', '15:30'],
    bio: 'Dr. Kim is a neurologist with subspecialty training in headache medicine and movement disorders. He uses a multidisciplinary approach to diagnose and treat complex neurological conditions.',
    rating: 4.7,
    reviewCount: 156,
    languages: ['English', 'Korean'],
    education: 'MD, Yale School of Medicine',
  },
  {
    id: 'doc-7',
    name: 'Dr. Fatima Al-Rashid',
    specialization: 'Obstetrics & Gynecology',
    photoUrl: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop&crop=face',
    experience: 13,
    availableHours: ['09:00', '09:30', '10:00', '13:00', '13:30', '14:00'],
    bio: "Dr. Al-Rashid is a board-certified OB/GYN specializing in high-risk pregnancies and minimally invasive gynecologic surgery. She is passionate about women's health at every life stage.",
    rating: 4.9,
    reviewCount: 381,
    languages: ['English', 'Arabic'],
    education: 'MD, University of Michigan Medical School',
  },
  {
    id: 'doc-8',
    name: 'Dr. Lena Kova\u010d',
    specialization: 'Psychiatry',
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face',
    experience: 10,
    availableHours: ['10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00'],
    bio: 'Dr. Kova\u010d is a psychiatrist specializing in anxiety, depression, PTSD, and mood disorders. She integrates psychotherapy and medication management with a trauma-informed, patient-centered approach.',
    rating: 4.9,
    reviewCount: 227,
    languages: ['English', 'Croatian', 'German'],
    education: 'MD, NYU Grossman School of Medicine',
  },
]

// ============================================================
// SERVICES
// ============================================================
export const SERVICES: Service[] = [
  {
    id: 'svc-1',
    title: 'Primary Care',
    description: 'Comprehensive preventive care, routine check-ups, and chronic disease management for all ages.',
    icon: 'Stethoscope',
    features: ['Annual physicals', 'Vaccinations', 'Chronic disease management', 'Health screenings'],
  },
  {
    id: 'svc-2',
    title: 'Specialist Consultations',
    description: 'Direct access to board-certified specialists across cardiology, neurology, orthopedics, and more.',
    icon: 'UserCheck',
    features: ['Cardiology', 'Neurology', 'Orthopedics', 'Dermatology'],
  },
  {
    id: 'svc-3',
    title: 'Diagnostic Imaging',
    description: 'State-of-the-art imaging including X-ray, MRI, CT scan, and ultrasound with rapid reporting.',
    icon: 'Scan',
    features: ['MRI & CT Scans', 'X-Ray', 'Ultrasound', 'Same-day results'],
  },
  {
    id: 'svc-4',
    title: 'Laboratory Services',
    description: 'Full-service in-house laboratory with rapid turnaround for blood work, cultures, and pathology.',
    icon: 'FlaskConical',
    features: ['Blood panels', 'Cultures', 'Pathology', 'Genetic testing'],
  },
  {
    id: 'svc-5',
    title: 'Mental Health',
    description: 'Compassionate psychiatric care and therapy, with a holistic approach to emotional wellbeing.',
    icon: 'Brain',
    features: ['Psychiatry', 'Therapy', 'Group sessions', 'Crisis support'],
  },
  {
    id: 'svc-6',
    title: 'Telehealth',
    description: 'Secure video consultations with your doctor from the comfort of your home, available 7 days a week.',
    icon: 'Video',
    features: ['Video consults', '7-day availability', 'Prescription delivery', 'Secure platform'],
  },
]

// ============================================================
// TESTIMONIALS
// ============================================================
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Rachel Nguyen',
    role: 'Patient since 2021',
    content: 'Dr. Chen identified my heart condition during what I thought was a routine check-up. The care and follow-through here are genuinely exceptional. The staff remembered my name on every visit.',
    rating: 5,
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    date: '2024-06-12',
  },
  {
    id: 'test-2',
    name: 'Marcus Webb',
    role: 'Patient since 2022',
    content: "Booking an appointment took less than 2 minutes online. Dr. Okafor listened to everything I said without rushing, explained my diagnosis clearly, and the follow-up care was excellent. Best clinic I've visited.",
    rating: 5,
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    date: '2024-07-03',
  },
  {
    id: 'test-3',
    name: 'Sophie Andersson',
    role: 'Parent of a patient',
    content: "Dr. Sharma put my anxious 6-year-old completely at ease. She's incredibly skilled and genuinely warm. My daughter now actually looks forward to her check-ups.",
    rating: 5,
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    date: '2024-05-28',
  },
  {
    id: 'test-4',
    name: 'Tariq Hassan',
    role: 'Patient since 2020',
    content: 'The telehealth option has been a lifesaver during busy weeks. Same high quality of care as in-person, and the platform is smooth and intuitive. Medica genuinely cares about patient convenience.',
    rating: 5,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    date: '2024-08-15',
  },
  {
    id: 'test-5',
    name: 'Isabelle Fontaine',
    role: 'Patient since 2023',
    content: 'The lab results came back within hours, and the doctor called me personally to discuss them. That level of attentiveness is rare. I refer everyone I know here.',
    rating: 5,
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    date: '2024-07-20',
  },
]

// ============================================================
// MOCK DATA — Patients
// ============================================================
export const MOCK_PATIENTS: Patient[] = [
  { id: 'pat-1', name: 'Alice Johnson', phone: '+1 (555) 201-3344', email: 'alice@example.com', dateOfBirth: '1988-03-14', gender: 'female', bloodGroup: 'A+', address: '22 Oak St, SF, CA', allergies: ['Penicillin'], medicalHistory: 'Hypertension, managed with lisinopril. No surgeries.', lastVisit: '2024-08-02', registeredAt: '2021-06-10' },
  { id: 'pat-2', name: 'Brian Lee', phone: '+1 (555) 302-5566', email: 'brian@example.com', dateOfBirth: '1975-11-22', gender: 'male', bloodGroup: 'B-', address: '45 Pine Ave, Oakland, CA', allergies: ['Sulfa drugs'], medicalHistory: 'Type 2 diabetes, controlled. Right knee ACL repair (2019).', lastVisit: '2024-07-15', registeredAt: '2020-02-28' },
  { id: 'pat-3', name: 'Clara Mwangi', phone: '+1 (555) 403-7788', email: 'clara@example.com', dateOfBirth: '1993-07-08', gender: 'female', bloodGroup: 'O+', address: '8 Elm Rd, Berkley, CA', allergies: [], medicalHistory: 'No significant history. Annual physicals only.', lastVisit: '2024-09-01', registeredAt: '2022-09-15' },
  { id: 'pat-4', name: 'Daniel Reeves', phone: '+1 (555) 504-9900', email: 'daniel@example.com', dateOfBirth: '1960-01-30', gender: 'male', bloodGroup: 'AB+', address: '101 Market St, SF, CA', allergies: ['Aspirin', 'Ibuprofen'], medicalHistory: 'CAD, post-MI (2020). On dual antiplatelet therapy.', lastVisit: '2024-08-20', registeredAt: '2019-11-05' },
  { id: 'pat-5', name: 'Elena Popescu', phone: '+1 (555) 605-1122', email: 'elena@example.com', dateOfBirth: '2001-05-17', gender: 'female', bloodGroup: 'A-', address: '33 Valencia St, SF, CA', allergies: ['Latex'], medicalHistory: 'Asthma (mild, intermittent). On salbutamol PRN.', lastVisit: '2024-06-28', registeredAt: '2023-01-20' },
]

// ============================================================
// MOCK DATA — Appointments
// ============================================================
export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'apt-1', patientId: 'pat-1', patientName: 'Alice Johnson', doctorId: 'doc-1', doctorName: 'Dr. Sarah Chen', date: '2024-09-10', timeSlot: '09:00', reason: 'Follow-up on hypertension management', status: 'confirmed', type: 'booked', createdAt: '2024-09-01T10:23:00Z' },
  { id: 'apt-2', patientId: 'pat-2', patientName: 'Brian Lee', doctorId: 'doc-4', doctorName: 'Dr. Michael Torres', date: '2024-09-11', timeSlot: '14:00', reason: 'Knee pain evaluation', status: 'pending', type: 'booked', createdAt: '2024-09-02T08:15:00Z' },
  { id: 'apt-3', patientId: 'pat-3', patientName: 'Clara Mwangi', doctorId: 'doc-2', doctorName: 'Dr. James Okafor', date: '2024-09-04', timeSlot: '09:00', reason: 'Annual physical', status: 'completed', type: 'booked', createdAt: '2024-08-20T14:00:00Z' },
  { id: 'apt-4', patientId: 'pat-4', patientName: 'Daniel Reeves', doctorId: 'doc-1', doctorName: 'Dr. Sarah Chen', date: '2024-09-12', timeSlot: '10:30', reason: 'Cardiology check-up', status: 'confirmed', type: 'booked', createdAt: '2024-09-03T09:00:00Z' },
  { id: 'apt-5', patientId: 'pat-5', patientName: 'Elena Popescu', doctorId: 'doc-2', doctorName: 'Dr. James Okafor', date: '2024-09-05', timeSlot: '11:00', reason: 'Asthma management', status: 'cancelled', type: 'booked', createdAt: '2024-08-28T16:30:00Z' },
]

// ============================================================
// MOCK DATA — Queue
// ============================================================
export const MOCK_QUEUE: QueueEntry[] = [
  { id: 'q-1', patientId: 'pat-3', patientName: 'Clara Mwangi', type: 'booked', doctorId: 'doc-2', doctorName: 'Dr. James Okafor', arrivalTime: '08:55', status: 'in-progress', position: 1 },
  { id: 'q-2', patientId: 'pat-1', patientName: 'Alice Johnson', type: 'booked', doctorId: 'doc-1', doctorName: 'Dr. Sarah Chen', arrivalTime: '09:05', status: 'waiting', position: 2 },
  { id: 'q-3', patientId: 'pat-6', patientName: 'Frank Gibson', type: 'walk-in', doctorId: 'doc-2', doctorName: 'Dr. James Okafor', arrivalTime: '09:10', status: 'waiting', position: 3 },
  { id: 'q-4', patientId: 'pat-4', patientName: 'Daniel Reeves', type: 'booked', doctorId: 'doc-1', doctorName: 'Dr. Sarah Chen', arrivalTime: '09:20', status: 'waiting', position: 4 },
  { id: 'q-5', patientId: 'pat-7', patientName: 'Grace Kim', type: 'walk-in', doctorId: 'doc-3', doctorName: 'Dr. Priya Sharma', arrivalTime: '09:30', status: 'waiting', position: 5 },
]

// ============================================================
// MOCK DATA — Invoices
// ============================================================
export const MOCK_INVOICES: Invoice[] = [
  { id: 'inv-1', patientId: 'pat-1', patientName: 'Alice Johnson', date: '2024-08-02', dueDate: '2024-08-16', items: [{ description: 'Cardiology Consultation', quantity: 1, unitPrice: 350, total: 350 }, { description: 'ECG', quantity: 1, unitPrice: 80, total: 80 }], total: 430, status: 'paid' },
  { id: 'inv-2', patientId: 'pat-2', patientName: 'Brian Lee', date: '2024-07-15', dueDate: '2024-07-29', items: [{ description: 'Orthopedic Consultation', quantity: 1, unitPrice: 320, total: 320 }, { description: 'X-Ray (Knee)', quantity: 2, unitPrice: 120, total: 240 }], total: 560, status: 'paid' },
  { id: 'inv-3', patientId: 'pat-4', patientName: 'Daniel Reeves', date: '2024-09-12', dueDate: '2024-09-26', items: [{ description: 'Cardiology Follow-up', quantity: 1, unitPrice: 250, total: 250 }, { description: 'Blood Panel (Comprehensive)', quantity: 1, unitPrice: 150, total: 150 }], total: 400, status: 'pending' },
  { id: 'inv-4', patientId: 'pat-5', patientName: 'Elena Popescu', date: '2024-06-28', dueDate: '2024-07-12', items: [{ description: 'General Medicine Consult', quantity: 1, unitPrice: 200, total: 200 }], total: 200, status: 'overdue' },
]

// ============================================================
// MOCK DATA — Staff
// ============================================================
export const MOCK_STAFF: Staff[] = [
  { id: 'staff-1', name: 'Dr. Sarah Chen', role: 'doctor', email: 'sarah.chen@medicawellness.com', phone: '+1 (555) 101-0001', department: 'Cardiology', joinDate: '2010-03-15', status: 'active', photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face' },
  { id: 'staff-2', name: 'Maria Santos', role: 'nurse', email: 'maria.santos@medicawellness.com', phone: '+1 (555) 101-0002', department: 'General', joinDate: '2018-06-01', status: 'active', photoUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=200&h=200&fit=crop&crop=face' },
  { id: 'staff-3', name: 'Kevin Park', role: 'receptionist', email: 'kevin.park@medicawellness.com', phone: '+1 (555) 101-0003', department: 'Front Desk', joinDate: '2021-01-10', status: 'active', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face' },
  { id: 'staff-4', name: 'Janet Osei', role: 'admin', email: 'janet.osei@medicawellness.com', phone: '+1 (555) 101-0004', department: 'Administration', joinDate: '2016-09-22', status: 'active', photoUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop&crop=face' },
  { id: 'staff-5', name: 'Thomas Blake', role: 'technician', email: 'thomas.blake@medicawellness.com', phone: '+1 (555) 101-0005', department: 'Radiology', joinDate: '2019-04-14', status: 'active', photoUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face' },
  { id: 'staff-6', name: 'Dr. James Okafor', role: 'doctor', email: 'james.okafor@medicawellness.com', phone: '+1 (555) 101-0006', department: 'General Medicine', joinDate: '2015-11-01', status: 'active', photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face' },
]

// ============================================================
// MOCK DATA — Reports
// ============================================================
export const MOCK_REPORTS: Report[] = [
  { id: 'rep-1', patientId: 'pat-1', title: 'Cardiac Stress Test Report', date: '2024-08-02', type: 'lab', pdfUrl: '#' },
  { id: 'rep-2', patientId: 'pat-1', title: 'Lipid Panel Results', date: '2024-07-15', type: 'lab', pdfUrl: '#' },
  { id: 'rep-3', patientId: 'pat-2', title: 'Right Knee MRI Report', date: '2024-07-15', type: 'imaging', pdfUrl: '#' },
  { id: 'rep-4', patientId: 'pat-3', title: 'Annual Health Checkup Report', date: '2024-09-01', type: 'discharge', pdfUrl: '#' },
]

// ============================================================
// DASHBOARD STATS (mock)
// ============================================================
export const MOCK_DASHBOARD_STATS = {
  todayPatients: 24,
  totalAppointments: 1842,
  revenueThisMonth: 48600,
  pendingApprovals: 7,
  patientsTrend: [
    { date: 'Aug 26', count: 18 },
    { date: 'Aug 27', count: 22 },
    { date: 'Aug 28', count: 19 },
    { date: 'Aug 29', count: 25 },
    { date: 'Aug 30', count: 21 },
    { date: 'Aug 31', count: 14 },
    { date: 'Sep 01', count: 11 },
    { date: 'Sep 02', count: 28 },
    { date: 'Sep 03', count: 23 },
    { date: 'Sep 04', count: 24 },
  ],
}
