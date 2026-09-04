'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Calendar,
  FileText,
  CreditCard,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  User,
  Search,
  LogOut,
  ShieldCheck,
  Phone,
  Mail,
  Plus,
  ArrowRight,
  Eye,
  FileCheck,
  Printer,
  X,
} from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Card } from '@/components/ui/Card'
import { Badge, AppointmentBadge, InvoiceBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  MOCK_APPOINTMENTS,
  MOCK_REPORTS,
  MOCK_INVOICES,
  MOCK_PATIENTS,
  CLINIC_NAME,
  CLINIC_PHONE,
  CLINIC_PHONE_TEL,
  CLINIC_PHONE_DISPLAY,
} from '@/lib/constants'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Appointment, Report, Invoice, Patient } from '@/types'

export default function PatientPortalPage() {
  // Authentication & Session State
  const [isMounted, setIsMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<Patient | null>(null)
  const [loginInput, setLoginInput] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isLoadingPortal, setIsLoadingPortal] = useState(true)

  // Portal View Tabs
  const [activeTab, setActiveTab] = useState<'appointments' | 'reports' | 'billing'>('appointments')

  // Data State for Authenticated User
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])

  // Interactive Modals
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [actionSuccessMessage, setActionSuccessMessage] = useState('')

  // Check existing session in localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    try {
      const savedPatientId = localStorage.getItem('medica_portal_patient_id')
      if (savedPatientId) {
        const found = MOCK_PATIENTS.find((p) => p.id === savedPatientId)
        if (found) {
          authenticateUser(found)
          return
        }
      }
    } catch (e) {
      console.warn('Session check failed', e)
    } finally {
      setIsLoadingPortal(false)
    }
  }, [])

  // Helper to load user records
  const authenticateUser = (patient: Patient) => {
    setCurrentUser(patient)
    setIsLoggedIn(true)
    setLoginError('')

    // Load user's domain records
    const userAppointments = MOCK_APPOINTMENTS.filter((a) => a.patientId === patient.id)
    const userReports = MOCK_REPORTS.filter((r) => r.patientId === patient.id)
    const userInvoices = MOCK_INVOICES.filter((i) => i.patientId === patient.id)

    setAppointments(userAppointments)
    setReports(userReports)
    setInvoices(userInvoices)

    try {
      localStorage.setItem('medica_portal_patient_id', patient.id)
    } catch (e) {
      console.warn('LocalStorage error', e)
    }
  }

  // Handle Login Form Submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    const clean = loginInput.trim().toLowerCase()

    if (!clean) {
      setLoginError('Please enter your email or registered phone number.')
      return
    }

    setIsAuthenticating(true)

    setTimeout(() => {
      // Find matching patient by email, phone, name, or patient ID
      const matched = MOCK_PATIENTS.find(
        (p) =>
          p.email.toLowerCase() === clean ||
          p.phone.replace(/\D/g, '').includes(clean.replace(/\D/g, '')) ||
          p.id.toLowerCase() === clean ||
          p.name.toLowerCase().includes(clean)
      )

      if (matched) {
        authenticateUser(matched)
      } else {
        setLoginError('No patient record found matching those credentials. Try one of the quick demo profiles below.')
      }
      setIsAuthenticating(false)
    }, 600)
  }

  // Handle Quick Demo Account Selection
  const handleDemoLogin = (patient: Patient) => {
    setIsAuthenticating(true)
    setTimeout(() => {
      authenticateUser(patient)
      setIsAuthenticating(false)
    }, 400)
  }

  // Logout Handler
  const handleLogout = () => {
    try {
      localStorage.removeItem('medica_portal_patient_id')
    } catch (e) {}
    setIsLoggedIn(false)
    setCurrentUser(null)
    setAppointments([])
    setReports([])
    setInvoices([])
    setLoginInput('')
    setLoginPassword('')
  }

  // Cancel Appointment Action
  const handleCancelAppointment = (appointmentId: string) => {
    if (!confirm('Are you sure you wish to cancel this scheduled consultation?')) return

    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt))
    )
    setActionSuccessMessage('Appointment cancelled successfully.')
    setTimeout(() => setActionSuccessMessage(''), 4000)
  }

  // -------------------------------------------------------------
  // VIEW: INITIAL MOUNT SHIELD (Avoids hydration & extension unmount clash)
  // -------------------------------------------------------------
  if (!isMounted) {
    return <div className="min-h-screen pt-32 pb-24 bg-surface-50" />
  }

  // -------------------------------------------------------------
  // VIEW: AUTHENTICATION / LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-surface-50" translate="no">
        <Container>
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-base mx-auto mb-4 shadow-sm">
                MW
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-primary block mb-2">
                Patient Portal
              </span>
              <h1 className="font-heading text-3xl font-bold text-foreground tracking-tight">
                Access Medical Records
              </h1>
              <p className="text-xs text-foreground-secondary mt-2">
                Secure access to your test results, prescriptions, and appointment schedule.
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-white p-8 rounded-2xl border border-border shadow-soft">
              {loginError && (
                <div className="mb-6 p-3.5 rounded-xl bg-danger-50 border border-danger-100 text-danger text-xs flex items-start gap-2.5">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Email or Mobile Number
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
                    <input
                      type="text"
                      autoComplete="username"
                      placeholder="e.g. eleanor.vance@example.com"
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                      className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-border bg-surface-50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between mb-1.5">
                    <span>Access Code or Password</span>
                    <span className="text-[10px] text-foreground-muted font-normal">Optional in demo</span>
                  </label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full text-xs px-4 py-3 rounded-xl border border-border bg-surface-50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isAuthenticating}
                  className="w-full text-xs font-semibold py-3.5 mt-2"
                >
                  Log In to Portal
                </Button>
              </form>

              {/* Demo Accounts Quick-Select */}
              <div className="mt-8 pt-6 border-t border-border">
                <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider block mb-3 text-center">
                  Quick Demo Accounts (1-Click Login)
                </span>
                <div className="space-y-2">
                  {MOCK_PATIENTS.slice(0, 3).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleDemoLogin(p)}
                      disabled={isAuthenticating}
                      className="w-full text-left p-2.5 rounded-xl border border-border/80 hover:border-primary/50 hover:bg-surface-50 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-foreground-muted">
                          {p.email} &bull; Blood {p.bloodGroup}
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                        Enter &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-center text-foreground-muted mt-6">
              Need assistance? Call reception at{' '}
              <a href={`tel:${CLINIC_PHONE_TEL}`} className="text-primary font-medium hover:underline">
                {CLINIC_PHONE_DISPLAY}
              </a>
            </p>
          </div>
        </Container>
      </div>
    )
  }

  // -------------------------------------------------------------
  // VIEW: AUTHENTICATED PATIENT PORTAL
  // -------------------------------------------------------------
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  )
  const pastAppointments = appointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled'
  )

  return (
    <div className="min-h-screen pt-28 pb-20 bg-surface-50" translate="no">
      <Container>
        {/* Toast Alert */}
        {actionSuccessMessage && (
          <div className="mb-6 p-4 rounded-xl bg-success-50 border border-success-200 text-success-700 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* Patient Profile Card */}
        {currentUser && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-soft mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-bold text-xl flex-shrink-0">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-1">
                  <h1 className="font-heading font-bold text-2xl text-foreground">
                    {currentUser.name}
                  </h1>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-success-50 text-success-700 font-semibold border border-success-200">
                    Active Patient &bull; #{currentUser.id.toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground-muted">
                  <span>DOB: {formatDate(currentUser.dateOfBirth)}</span>
                  <span>&bull;</span>
                  <span>Blood Group: <strong className="text-foreground">{currentUser.bloodGroup}</strong></span>
                  <span>&bull;</span>
                  <span>Phone: {currentUser.phone}</span>
                </div>

                {currentUser.allergies.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-danger-700 font-medium">
                    <AlertCircle size={13} />
                    <span>Known Allergies: {currentUser.allergies.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Logout and Quick Switch */}
            <div className="flex items-center gap-3">
              <Link href="/booking">
                <Button variant="primary" size="sm" className="text-xs font-semibold" leftIcon={<Plus size={14} />}>
                  Book Visit
                </Button>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-medium text-foreground-secondary hover:bg-surface-50 transition-colors"
                title="End portal session"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-border mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`pb-3.5 px-5 text-xs font-semibold tracking-wide border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'appointments'
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            <Calendar size={15} />
            <span>Consultations ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3.5 px-5 text-xs font-semibold tracking-wide border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'reports'
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            <FileText size={15} />
            <span>Reports & Prescriptions ({reports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`pb-3.5 px-5 text-xs font-semibold tracking-wide border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'billing'
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            <CreditCard size={15} />
            <span>Billing & Invoices ({invoices.length})</span>
          </button>
        </div>

        {/* TAB 1: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="space-y-8">
            {/* Upcoming Consultations */}
            <div>
              <h3 className="font-heading font-semibold text-base text-foreground mb-4">
                Upcoming Appointments
              </h3>

              {upcomingAppointments.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white border border-border text-center">
                  <p className="text-xs text-foreground-muted mb-4">No upcoming appointments on schedule.</p>
                  <Link href="/booking">
                    <Button variant="primary" size="sm" className="text-xs">
                      Schedule a Consultation
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {upcomingAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-6 rounded-2xl bg-white border border-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <h4 className="font-heading font-semibold text-base text-foreground">
                            {apt.doctorName}
                          </h4>
                          <AppointmentBadge status={apt.status} />
                        </div>
                        <p className="text-xs text-foreground-secondary mb-3">
                          Reason: {apt.reason}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-foreground-muted">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} className="text-primary" /> {formatDate(apt.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} className="text-primary" /> {apt.timeSlot}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelAppointment(apt.id)}
                          className="text-xs text-danger-700 hover:bg-danger-50"
                        >
                          Cancel
                        </Button>
                        <Link href="/booking">
                          <Button variant="primary" size="sm" className="text-xs">
                            Reschedule
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Consultations */}
            <div>
              <h3 className="font-heading font-semibold text-base text-foreground mb-4">
                Past Consultation History
              </h3>

              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-surface-50 border-b border-border text-foreground-muted">
                    <tr>
                      <th className="px-5 py-3.5 font-semibold">Date</th>
                      <th className="px-5 py-3.5 font-semibold">Attending Doctor</th>
                      <th className="px-5 py-3.5 font-semibold">Clinical Reason</th>
                      <th className="px-5 py-3.5 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pastAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-surface-50/50">
                        <td className="px-5 py-3.5 font-medium text-foreground">{formatDate(apt.date)}</td>
                        <td className="px-5 py-3.5 text-foreground-secondary">{apt.doctorName}</td>
                        <td className="px-5 py-3.5 text-foreground-secondary">{apt.reason}</td>
                        <td className="px-5 py-3.5">
                          <AppointmentBadge status={apt.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REPORTS & PRESCRIPTIONS */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.length === 0 ? (
              <div className="col-span-2 p-12 text-center bg-white rounded-2xl border border-border text-xs text-foreground-muted">
                No laboratory reports or prescriptions filed yet.
              </div>
            ) : (
              reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-6 rounded-2xl bg-white border border-border shadow-soft flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-sm text-foreground">
                        {rep.title}
                      </h4>
                      <p className="text-[11px] text-foreground-muted mt-0.5">
                        Issued: {formatDate(rep.date)} &bull; Type: <span className="uppercase font-medium">{rep.type}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedReport(rep)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-surface-50 transition-colors"
                    >
                      <Eye size={13} />
                      <span>Inspect</span>
                    </button>
                    <button
                      onClick={() => {
                        setActionSuccessMessage(`Downloading PDF for ${rep.title}...`)
                        setTimeout(() => setActionSuccessMessage(''), 3000)
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-800 transition-colors"
                    >
                      <Download size={13} />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: BILLING & INVOICES */}
        {activeTab === 'billing' && (
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-50 border-b border-border text-foreground-muted">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Invoice #</th>
                  <th className="px-5 py-3.5 font-semibold">Issue Date</th>
                  <th className="px-5 py-3.5 font-semibold">Due Date</th>
                  <th className="px-5 py-3.5 font-semibold">Total Amount</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-foreground-muted">
                      No invoices on record for your account.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-surface-50/50">
                      <td className="px-5 py-3.5 font-mono font-semibold text-foreground">
                        {inv.id.toUpperCase()}
                      </td>
                      <td className="px-5 py-3.5 text-foreground-secondary">{formatDate(inv.date)}</td>
                      <td className="px-5 py-3.5 text-foreground-secondary">{formatDate(inv.dueDate)}</td>
                      <td className="px-5 py-3.5 font-bold text-foreground">{formatCurrency(inv.total)}</td>
                      <td className="px-5 py-3.5">
                        <InvoiceBadge status={inv.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT INSPECTION MODAL */}
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={selectedReport?.title || 'Medical Report'}
          size="lg"
        >
          {selectedReport && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <span className="text-[11px] font-mono text-foreground-muted block">
                    Report Reference: {selectedReport.id.toUpperCase()}
                  </span>
                  <p className="text-xs text-foreground mt-0.5">
                    Patient: <strong>{currentUser?.name}</strong> &bull; DOB: {currentUser?.dateOfBirth}
                  </p>
                </div>
                <div className="text-right text-xs">
                  <span className="text-foreground-muted block">Date Issued:</span>
                  <span className="font-semibold text-foreground">{formatDate(selectedReport.date)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-foreground">
                  Diagnostic Findings & Clinical Notes:
                </h4>
                <div className="p-4 rounded-xl bg-surface-50 border border-border text-xs text-foreground-secondary leading-relaxed space-y-2">
                  <p>
                    <strong>Procedure/Test:</strong> {selectedReport.title}
                  </p>
                  <p>
                    <strong>Clinical Evaluation:</strong> Anatomical parameters within normal physiological limits. No acute inflammatory focus or ischemic alterations detected. Follow routine 6-month checkup protocol.
                  </p>
                  <p>
                    <strong>Attending Sign-off:</strong> Dr. Sarah Jenkins, MD &bull; Board Certified in Cardiology & Internal Medicine.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="text-xs"
                  leftIcon={<Printer size={13} />}
                >
                  Print Report
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedReport(null)
                    setActionSuccessMessage(`Report ${selectedReport.title} downloaded.`)
                    setTimeout(() => setActionSuccessMessage(''), 3000)
                  }}
                  className="text-xs"
                  leftIcon={<Download size={13} />}
                >
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* INVOICE RECEIPT MODAL */}
        <Modal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          title={`Receipt #${selectedInvoice?.id.toUpperCase()}`}
          size="md"
        >
          {selectedInvoice && (
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start pb-4 border-b border-border">
                <div>
                  <h4 className="font-heading font-bold text-sm text-foreground">{CLINIC_NAME}</h4>
                  <p className="text-[11px] text-foreground-muted">123 Wellness Blvd, San Francisco, CA</p>
                </div>
                <InvoiceBadge status={selectedInvoice.status} />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider block">
                  Itemized Services:
                </span>
                <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
                  {selectedInvoice.items.map((item, i) => (
                    <div key={i} className="p-3 flex justify-between text-xs bg-surface-50">
                      <span>{item.description}</span>
                      <span className="font-semibold">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                  <div className="p-3 flex justify-between text-xs bg-white font-bold border-t border-border">
                    <span>Total Amount</span>
                    <span className="text-primary">{formatCurrency(selectedInvoice.total)}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-foreground-muted pt-2">
                Payment processed via in-network insurer co-pay and FSA/HSA allocation. Zero outstanding balance due.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedInvoice(null)}
                  className="text-xs"
                >
                  Close Receipt
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </Container>
    </div>
  )
}
