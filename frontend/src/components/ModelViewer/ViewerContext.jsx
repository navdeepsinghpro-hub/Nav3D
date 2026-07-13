import { createContext, useContext, useState } from "react";

const ViewerContext = createContext();

export function ViewerProvider({ children }) {
  const [mode, setMode] = useState("translate");

  return (
    <ViewerContext.Provider value={{ mode, setMode }}>
      {children}
    </ViewerContext.Provider>
  );
}

export function useViewer() {
  return useContext(ViewerContext);
}