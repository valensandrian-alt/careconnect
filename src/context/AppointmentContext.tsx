/**
 * @file src/context/AppointmentContext.tsx
 * State management for consultations and reminders
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appointment, ConsultationType } from '../types';
import { loadStoredAppointments, saveStoredAppointments } from '../data/appointments';
import { generateBookingCode, generateQueueNumber } from '../lib/utils';

export interface BookingPayload {
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  hospital: string;
  patientName: string;
  patientPhone: string;
  date: string;
  dayName: string;
  time: string;
  consultationType: ConsultationType;
  symptoms: string;
  fee: number;
}

interface AppointmentContextType {
  appointments: Appointment[];
  isLoading: boolean;
  bookAppointment: (payload: BookingPayload) => Promise<Appointment>;
  cancelAppointment: (id: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
  rescheduleAppointment: (id: string, date: string, dayName: string, time: string) => Promise<{ success: boolean }>;
  upcomingAppointments: Appointment[];
  historyAppointments: Appointment[];
  nextAppointment: Appointment | null;
  refreshAppointments: () => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = () => {
    setIsLoading(true);
    const data = loadStoredAppointments();
    setAppointments(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const bookAppointment = async (payload: BookingPayload): Promise<Appointment> => {
    const bookingCode = generateBookingCode();
    const queueNumber = generateQueueNumber();

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      bookingCode,
      doctorId: payload.doctorId,
      doctorName: payload.doctorName,
      doctorSpecialty: payload.doctorSpecialty,
      doctorAvatar: payload.doctorAvatar,
      hospital: payload.hospital,
      patientName: payload.patientName,
      patientPhone: payload.patientPhone,
      date: payload.date,
      dayName: payload.dayName,
      time: payload.time,
      consultationType: payload.consultationType,
      symptoms: payload.symptoms || 'Konsultasi keluhan umum.',
      fee: payload.fee,
      status: 'upcoming',
      queueNumber,
      meetLink: payload.consultationType === 'video' ? `https://careconnect.id/room/${bookingCode.toLowerCase()}` : undefined,
      notes: 'Silakan siapkan catatan keluhan Anda sebelum sesi dimulai.',
      createdAt: new Date().toISOString(),
    };

    const updated = [newAppointment, ...appointments];
    setAppointments(updated);
    saveStoredAppointments(updated);

    return newAppointment;
  };

  const cancelAppointment = async (id: string, reason?: string): Promise<{ success: boolean; error?: string }> => {
    const updated = appointments.map((apt) => {
      if (apt.id === id) {
        return {
          ...apt,
          status: 'cancelled' as const,
          cancelReason: reason || 'Dibatalkan oleh pasien.',
        };
      }
      return apt;
    });

    setAppointments(updated);
    saveStoredAppointments(updated);
    return { success: true };
  };

  const rescheduleAppointment = async (
    id: string,
    date: string,
    dayName: string,
    time: string
  ): Promise<{ success: boolean }> => {
    const updated = appointments.map((apt) => {
      if (apt.id === id) {
        return {
          ...apt,
          date,
          dayName,
          time,
        };
      }
      return apt;
    });

    setAppointments(updated);
    saveStoredAppointments(updated);
    return { success: true };
  };

  const upcomingAppointments = appointments
    .filter((a) => a.status === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date));

  const historyAppointments = appointments
    .filter((a) => a.status === 'completed' || a.status === 'cancelled')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        isLoading,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        upcomingAppointments,
        historyAppointments,
        nextAppointment,
        refreshAppointments: loadData,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = (): AppointmentContextType => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};
