import axios from "axios";
import { useContext, createContext, useReducer } from "react";
import { POST_HISTORY_API, CLEAR_ALL_HISTORY_API } from "../utils/apis";
import { historyReducer } from "../reducer/history-reducer";
import { useAuth } from "./auth-context";
const HistoryContext = createContext(null);

const HistoryProvider = ({ children }) => {
  const [historyState, historyDispatch] = useReducer(historyReducer, {
    historyList: [],
  });
  const { setLoading } = useAuth();


  const getHistoryVideos = async ()=>{
    const encodedToken = localStorage.getItem("token");
    try {
      const response = await axios.get("/api/user/history",{headers: {
        authorization: encodedToken,
      }})
      historyDispatch({
        type: "ADD_IN_HISTORY",
        payload: response.data.history,
      });

    }
    catch(err) {
      console.log(err)
    }
  }
  const addToHistoryHandler = async (video) => {
    const encodedToken = localStorage.getItem("token");
    try {
      const response = await axios.post(
        POST_HISTORY_API,
        {
          video,
        },
        {
          headers: {
            authorization: encodedToken,
          },
        }
      );
      const { history } = response.data;

      historyDispatch({ type: "ADD_IN_HISTORY", payload: history });
    } catch (err) {
      console.log(err);
    }
  };

  const removeFromHistoryHandler = async (_id) => {
    const encodedToken = localStorage.getItem("token");
    try {
      const response = await axios.delete(`${POST_HISTORY_API}/${_id}`, {
        headers: {
          authorization: encodedToken,
        },
      });
      const { history } = response.data;

      historyDispatch({ type: "REMOVE_FROM_HISTORY", payload: history });
    } catch (err) {
      console.log(err);
    }
  };
  const clearHistoryHandler = async () => {
    const encodedToken = localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await axios.delete(CLEAR_ALL_HISTORY_API, {
        headers: {
          authorization: encodedToken,
        },
      });
      const { history } = response.data;
      historyDispatch({ type: "CLEAR_ALL_HISTORY", payload: history });
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  const historyLogoutHandler = () => {
    historyDispatch({ type: "LOGOUT" });
  };

  const value = {
    historyState,
    addToHistoryHandler,
    removeFromHistoryHandler,
    clearHistoryHandler,
    historyLogoutHandler,
    getHistoryVideos
  };
  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
};

const useHistory = () => useContext(HistoryContext);

export { HistoryProvider, useHistory };
