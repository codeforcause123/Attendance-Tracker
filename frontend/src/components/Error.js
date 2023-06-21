import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Error() {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [navigate]);
  return <div>404 Not Found</div>;
}
