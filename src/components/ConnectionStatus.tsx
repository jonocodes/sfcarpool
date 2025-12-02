import { useState, useEffect } from "react";
import { Badge } from "react-bootstrap";
import { useConnectionStatus } from "@triplit/react";
import { triplit } from "../../triplit/client";
import { useConnectionStatusStore } from "../stores/connectionStatusStore";
import { formatRelativeTime } from "../utils/timeFormatting";

const ConnectionStatus = () => {
  const connectionStatus = useConnectionStatus(triplit);
  const lastConnectionTime = useConnectionStatusStore((state) => state.lastConnectionTime);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Map the @triplit/react status to our component's expected interface
  const isOnline = connectionStatus === "OPEN";
  const isConnecting = connectionStatus === "CONNECTING";

  // Auto-update effect: re-render at appropriate intervals when offline/connecting
  useEffect(() => {
    // Only run when offline/connecting and timestamp exists
    if (isOnline || !lastConnectionTime) return;

    const { updateIntervalMs } = formatRelativeTime(lastConnectionTime);

    const timer = setTimeout(() => {
      setUpdateTrigger((prev) => prev + 1);
    }, updateIntervalMs);

    return () => clearTimeout(timer);
  }, [isOnline, lastConnectionTime, updateTrigger]);

  const getStatusText = () => {
    if (isConnecting) {
      if (lastConnectionTime) {
        const { text } = formatRelativeTime(lastConnectionTime);
        return `connecting (last seen ${text})`;
      }
      return "connecting";
    }

    if (isOnline) return "online";

    if (lastConnectionTime) {
      const { text } = formatRelativeTime(lastConnectionTime);
      return `offline (${text})`;
    }

    return "offline";
  };

  const getStatusVariant = () => {
    if (isConnecting) return "warning";
    return isOnline ? "success" : "danger";
  };

  const getStatusIcon = () => {
    if (isConnecting) return "🔄";
    return isOnline ? "🟢" : "🔴";
  };

  return (
    <div className="mb-3 d-flex align-items-center">
      <span className="me-2">Connection:</span>
      <Badge bg={getStatusVariant()} className="d-flex align-items-center">
        <span className="me-1">{getStatusIcon()}</span>
        {getStatusText()}
      </Badge>
    </div>
  );
};

export default ConnectionStatus;
