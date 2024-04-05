import { useAppDispatch } from '$store';
import type { AlertType } from '$store/alertStore';
import { addAlert, removeAlert } from '$store/alertStore';

const DELAY = 5000;

export function useAlerts() {
  const dispatch = useAppDispatch();

  const alert = (message: string, type: AlertType) => {
    const alert = dispatch(addAlert(message, type));
    setTimeout(() => {
      dispatch(removeAlert(alert.payload.id));
    }, DELAY);
  };

  return alert;
}
