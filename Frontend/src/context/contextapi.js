import { createContext, useState, useEffect, useContext } from "react";
import { socket } from "../services/socket";
import validator from "validator";
import axiosapi from "../services/api";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/loader";
import mockdata from "../mockdata/data.json";

export let ContextApi = createContext();

let ContextApiProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(mockdata);
  const [search, setSearch] = useState("");
  const [load, setLoad] = useState(true);
  const [callMode, setCallMode] = useState({
    mode: "",
    data: {},
  });

  useEffect(() => {
    let id;
    id = setTimeout(() => {
      setLoad(false);
    }, 9000);
    return () => clearTimeout(id);
  }, [load]);

  const formValidation = (key, value) => {
    let result = false;
    switch (key) {
      case "fullname":
        const regex = /[\s-]/;
        result = regex.test(value);
        break;
      case "email":
        result = validator.isEmail(value);
        break;
      case "password":
        result =
          validator.isLength(value, { min: 8 }) && // Minimum length of 8 characters
          validator.matches(value, /[a-z]/) && // At least one lowercase letter
          validator.matches(value, /[A-Z]/) && // At least one uppercase letter
          validator.matches(value, /[0-9]/);
        break;
      default:
        break;
    }
    return result;
  };

  const authorization = async () => {
    const result = await axiosapi.get({ url: "/authentication-user" });
    return result.data;
  };

  const authQuery = useQuery({
    enabled: load === false ? true : false,
    queryKey: ["auth"],
    queryFn: authorization,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (authQuery.isLoading) {
      setLoading(true);
    }
    if (authQuery.isError) {
      setAuth(null);
      setUsers(mockdata);
      setLoading(false);
      axiosapi.error("Please login!", "toastError", 2);
    } else if (authQuery.data) {
      socket.connect();
      setAuth(authQuery.data);
      setLoading(false);
    }
  }, [authQuery]);

  useEffect(() => {
    if (socket.connected && !auth) {
      socket.disconnect();
    }

    function updateList(list) {
      let index = list.findIndex((v) => v.email === auth?.email);
      if (index !== -1) {
        list.splice(index, 1);
      }
      setUsers(list);
      setLoading(false);
    }

    function errorMessage(message) {
      axiosapi.error(message);
    }
    const handleConnect = ({ reciever }) => {
      setCallMode({
        mode: "hold",
        data: reciever,
      });
    };

    socket.on("onlineUsers", updateList);
    socket.on("error", errorMessage);
    socket.on("connection-request", handleConnect);
    return () => {
      socket.off("connection-request", handleConnect);
      socket.off("onlineUsers", updateList);
      socket.off("error", errorMessage);
    };
  }, [auth]);

  const filteredList = users.filter((val) => {
    if (val.fullname.toLowerCase().startsWith(search.toLowerCase()))
      return true;
    if (!search) return true;
    return false;
  });

  let globalObject = {
    formValidation,
    setLoading,
    auth,
    users,
    filteredList,
    setSearch,
    load,
    callMode,
    setCallMode,
  };

  return (
    <ContextApi.Provider value={globalObject}>
      {children}
      <Loader loading={loading} />
    </ContextApi.Provider>
  );
};

const useContenctHook = () => {
  return useContext(ContextApi);
};

export { useContenctHook, ContextApiProvider };
