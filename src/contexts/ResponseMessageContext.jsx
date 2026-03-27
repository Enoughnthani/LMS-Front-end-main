import { X } from "lucide-react";
import { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-bootstrap";

const ResponseContext = createContext();

export function ResponseProvider({ children }) {
  const [response, setResponse] = useState(null);
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  function showMessage(newResponse) {
    if (visible) {
      setVisible(false);

      setTimeout(() => {
        setResponse(newResponse);
        setShouldRender(true);
        setVisible(true);
      }, 300); 
    } else {
      setResponse(newResponse);
      setShouldRender(true);
      setVisible(true);
    }
  }

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleAnimationEnd = () => {
    if (!visible) {
      setShouldRender(false);
    }
  };

  return (
    <ResponseContext.Provider value={{ showMessage }}>
      {children}

      {shouldRender && (
        <Alert
          variant={response?.success ? "success" : "danger"}
          onAnimationEnd={handleAnimationEnd}
          className={`fixed py-2.5 gap-3 flex items-center top-[13%] right-4 z-[9999] font-bold
          ${visible ? "animate-pop-in" : "animate-pop-out"}`}
        >
          {response?.message || "Error"}
          <X onClick={()=>setVisible(false)} className="cursor-pointer ms-auto"/>
        </Alert>
      )}
    </ResponseContext.Provider>
  );
}

export const useResponse = () => useContext(ResponseContext);