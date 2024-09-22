import axios, { AxiosInstance } from "axios";
import {
  Context,
  FunctionComponent,
  PropsWithChildren,
  createContext,
  useContext,
  useRef,
} from "react";

const AxiosContext: Context<AxiosInstance> = createContext(axios.create());

export const AxiosProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const axiosInstance = useRef(
    axios.create({
      baseURL: import.meta.env.VITE_REST_API_URL,
      timeout: 1000000,
      headers: { "Content-Type": "application/json" }
    })
  );

  return (
    <AxiosContext.Provider value={axiosInstance.current}>
      {children}
    </AxiosContext.Provider>
  );
};

export const useAxios = () => useContext(AxiosContext);