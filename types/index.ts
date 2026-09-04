export interface Doctor {
  id: string
  name: string
  specialization: string
  photoUrl: string
  experience: number // years
  availableHours: string[] // e.g. ["09:00", "09:30", "10:00"]
  bio: string
  rating: number
  reviewCount: number
  languages: string[]
  education: string
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  date: string // ISO date string
  timeSlot: string
  reason: string
  status: AppointmentStatus
  type: AppointmentType
  notes?: string
  createdAt: string
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled'
export type AppointmentType = 'booked' | 'walk-in'

export interface Patient {
  id: string
  name: string
  phone: string
  email: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  bloodGroup: string
  address: string
  allergies: string[]
  medicalHistory: string
  lastVisit: string
  registeredAt: string
}

export interface Prescription {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  date: string
  medicines: Medicine[]
  instructions: string
  followUpDate?: string
}

export interface Medicine {
  name: string
  dosage: string
  frequency: string
  duration: string
  notes?: string
}

export interface Invoice {
  id: string
  patientId: string
  patientName: string
  date: string
  dueDate: string
  items: InvoiceItem[]
  total: number
  status: InvoiceStatus
  pdfUrl?: string
}

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export type InvoiceStatus = 'paid' | 'pending' | 'overdue'

export interface Staff {
  id: string
  name: string
  role: StaffRole
  email: string
  phone: string
  department: string
  joinDate: string
  status: 'active' | 'inactive'
  photoUrl: string
}

export type StaffRole = 'doctor' | 'nurse' | 'receptionist' | 'admin' | 'technician' | 'pharmacist'

export interface Branch {
  id: string
  name: string
  address: string
  phone: string
  email: string
  timezone: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface QueueEntry {
  id: string
  patientId: string
  patientName: string
  type: AppointmentType
  doctorId: string
  doctorName: string
  arrivalTime: string
  status: QueueStatus
  position: number
}

export type QueueStatus = 'waiting' | 'in-progress' | 'done'

export interface DashboardStats {
  todayPatients: number
  totalAppointments: number
  revenueThisMonth: number
  pendingApprovals: number
  patientsTrend: { date: string; count: number }[]
}

export interface BookingFormData {
  fullName: string
  phone: string
  doctorId: string
  date: string
  timeSlot: string
  reason: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  photoUrl: string
  date: string
}

export interface Report {
  id: string
  patientId: string
  title: string
  date: string
  type: 'lab' | 'imaging' | 'prescription' | 'discharge'
  pdfUrl: string
}
