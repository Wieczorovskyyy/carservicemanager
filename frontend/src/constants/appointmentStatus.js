export const APPOINTMENT_STATUS = {
  new: {
    label: "Nowe / Oczekujące",
    badgeClass: "bg-warning-subtle text-warning border border-warning-subtle"
  },
  accepted: {
    label: "Zaakceptowane",
    badgeClass: "bg-info-subtle text-info border border-info-subtle"
  },
  in_progress: {
    label: "W serwisie",
    badgeClass: "bg-primary-subtle text-primary border border-primary-subtle"
  },
  done: {
    label: "Zakończone",
    badgeClass: "bg-success-subtle text-primary border border-success-subtle"
  },
  error: {
    label: "Błąd / Problem",
    badgeClass: "bg-danger-subtle text-danger border border-danger-subtle"
  },
  rejected: {
    label: "Odrzucone",
    badgeClass: "bg-secondary-subtle text-secondary border border-secondary-subtle"
  },
  cancelled: {
    label: "Anulowane",
    badgeClass: "bg-secondary-subtle text-secondary border border-secondary-subtle"
  },
  change_requested: {
    label: "Prośba o zmianę",
    badgeClass: "bg-dark-subtle text-dark border border-dark-subtle"
  }
};

export function appointmentStatusLabel(status) {
  return APPOINTMENT_STATUS[status]?.label || APPOINTMENT_STATUS.new.label;
}

export function appointmentStatusBadgeClass(status) {
  return APPOINTMENT_STATUS[status]?.badgeClass || APPOINTMENT_STATUS.new.badgeClass;
}
