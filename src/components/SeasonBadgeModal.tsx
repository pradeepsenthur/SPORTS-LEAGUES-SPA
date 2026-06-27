import { memo, useEffect, useRef } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import BadgeFallback from "./BadgeFallback";
import type { League, SeasonBadgeData } from "../types";

interface SeasonBadgeModalProps {
  isOpen: boolean;
  league: League | null;
  loading: boolean;
  error: string;
  badgeData: SeasonBadgeData | null;
  onClose: () => void;
}

function SeasonBadgeModal({
  isOpen,
  league,
  loading,
  error,
  badgeData,
  onClose,
}: SeasonBadgeModalProps) {
  const modalCardRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);
  const badgeUrl = badgeData?.badgeUrl ?? undefined;
  const hasBadgeImage = Boolean(badgeUrl);
  const seasonCaption = hasBadgeImage
    ? `Season: ${badgeData?.season || "Unknown"}`
    : "\u00A0";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeButtonRef.current?.focus();
    return () => {
      previousFocusedElementRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") {
      return;
    }

    const focusableElements =
      modalCardRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

    if (!focusableElements || focusableElements.length === 0) {
      event.preventDefault();
      modalCardRef.current?.focus();
      return;
    }

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  }

  if (!isOpen || !league) {
    return null;
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        ref={modalCardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="badge-title"
        tabIndex={-1}
        onKeyDown={handleDialogKeyDown}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <h2 id="badge-title">{league.strLeague}</h2>
          <button
            type="button"
            className="close-btn"
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <p className="modal-meta">
          <strong>Sport:</strong> {league.strSport || "N/A"}
        </p>

        {error ? (
          <p className="error-text" role="alert" aria-live="assertive">
            {error}
          </p>
        ) : null}

        {!error ? (
          <div className="badge-container">
            <div className="badge-placeholder">
              {loading ? (
                <div
                  className="badge-skeleton"
                  aria-busy="true"
                  aria-label="Loading season badge..."
                ></div>
              ) : null}
              {hasBadgeImage ? (
                <img src={badgeUrl} alt={`${league.strLeague} season badge`} />
              ) : !loading ? (
                <BadgeFallback sportName={league.strSport} />
              ) : null}
            </div>
            <figcaption
              className={`badge-caption${hasBadgeImage ? "" : " badge-caption--placeholder"}`}
            >
              {seasonCaption}
            </figcaption>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default memo(SeasonBadgeModal);
