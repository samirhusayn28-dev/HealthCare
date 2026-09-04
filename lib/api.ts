/**
 * lib/api.ts
 * Placeholder API functions. All return mock data with simulated network delay.
 * Replace the internals (not the signatures) with real API calls when backend is ready.
 */

import type {
  Doctor,
  Appointment,
  Patient,
  Invoice,
  Staff,
  DashboardStats,
  QueueEntry,
  Report,
  BookingFormData,
} from '@/types'

import {
  DOCTORS,
  MOCK_APPOINTMENTS,
  MOCK_PATIENTS,
  MOCK_INVOICES,
  MOCK_STAFF,
  MOCK_DASHBOARD_STATS,
  MOCK_QUEUE,
  MOCK_REPORTS,
} from './constants'

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export async function fetchDoctors(): Promise<Doctor[]> {
  await delay(300)
  return DOCTORS
}

export async function fetchDoctor(id: string): Promise<Doctor | null> {
  await delay(200)
  return DOCTORS.find((d) => d.id === id) ?? null
}

export async function fetchAppointments(patientId?: string): Promise<Appointment[]> {
  await delay(400)
  if (patientId) {
    return MOCK_APPOINTMENTS.filter((a) => a.patientId === patientId)
  }
  return MOCK_APPOINTMENTS
}

export async function submitBooking(
  data: BookingFormData
): Promise<{ success: boolean; appointmentId: string }> {
  await delay(800)
  console.log('[API] Booking submitted:', data)
  return { success: true, appointmentId: `apt-${Date.now()}` }
}

export async function fetchPatients(): Promise<Patient[]> {
  await delay(400)
  return MOCK_PATIENTS
}

export async function fetchPatient(id: string): Promise<Patient | null> {
  await delay(200)
  return MOCK_PATIENTS.find((p) => p.id === id) ?? null
}

export async function fetchInvoices(patientId?: string): Promise<Invoice[]> {
  await delay(400)
  if (patientId) {
    return MOCK_INVOICES.filter((i) => i.patientId === patientId)
  }
  return MOCK_INVOICES
}

export async function fetchStaff(): Promise<Staff[]> {
  await delay(300)
  return MOCK_STAFF
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay(500)
  return MOCK_DASHBOARD_STATS
}

export async function fetchQueue(): Promise<QueueEntry[]> {
  await delay(300)
  return MOCK_QUEUE
}

export async function fetchReports(patientId?: string): Promise<Report[]> {
  await delay(300)
  if (patientId) {
    return MOCK_REPORTS.filter((r) => r.patientId === patientId)
  }
  return MOCK_REPORTS
}

export async function createInvoice(
  data: Omit<Invoice, 'id'>
): Promise<{ success: boolean; invoiceId: string }> {
  await delay(600)
  console.log('[API] Invoice created:', data)
  return { success: true, invoiceId: `inv-${Date.now()}` }
}

export async function updateQueueStatus(
  entryId: string,
  status: string
): Promise<{ success: boolean }> {
  await delay(200)
  console.log('[API] Queue status updated:', entryId, status)
  return { success: true }
}
