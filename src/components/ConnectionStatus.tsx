import { Badge } from "react-bootstrap";
import { useConnectionStatus } from "@triplit/react";
import { triplit } from "../../triplit/client";

const ConnectionStatus = () => {
  const connectionStatus = useConnectionStatus(triplit);
  
  // Map the @triplit/react status to our component's expected interface
  const isOnline = connectionStatus === "OPEN";
  const isConnecting = connectionStatus === "CONNECTING";

  const getStatusText = () => {
    if (isConnecting) return "connecting";
    return isOnline ? "online" : "offline";
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
      <span className="me-2">Database Status:</span>
      <Badge bg={getStatusVariant()} className="d-flex align-items-center">
        <span className="me-1">{getStatusIcon()}</span>
        {getStatusText()}
      </Badge>
    </div>
  );
};

export default ConnectionStatus;