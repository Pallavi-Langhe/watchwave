import axios from "axios";
import { useContext, createContext, useState } from "react";
import { useReducer } from "react";
import { playlistReducer } from "../reducer/playlist-reducer";
import { POST_PLAYLIST_API } from "../utils/apis";
import { useToast } from "./toast-context";

const PlaylistContext = createContext();

const PlaylistProvider = ({ children }) => {
  const [playlistState, playlistDispatch] = useReducer(playlistReducer, {
    playlistList: [],
  });
  const [isPlaylistBtnDisabled,setBtnDisabled] = useState(false)
  const { setToastVal } = useToast();

  const getPlaylistVideos = async ()=>{
    const encodedToken = localStorage.getItem("token");
    try {
      const response = await axios.get("/api/user/playlists",{headers: {
        authorization: encodedToken,
      }})
      playlistDispatch({
        type: "SET_PLAYLIST",
        payload: response.data.playlists,
      });

    }
    catch(err) {
      console.log(err)
    }
  }

  const addPlaylistHandler = async (title) => {
    const encodedToken = localStorage.getItem("token");
    try {
      setBtnDisabled(true)
      const response = await axios.post(
        POST_PLAYLIST_API,
        {
          playlist: { title },
        },
        {
          headers: {
            authorization: encodedToken,
          },
        }
      );
      setToastVal((prevVal) => ({
        ...prevVal,
        msg: "Playlist Created",
        isOpen: "true",
        bg: "green",
      }));

      const { playlists } = response.data;
      playlistDispatch({ type: "CREATE_PLAYLIST", payload: playlists });
    } catch (err) {
      const {status} = err.response;

      if(status === 500){
        setToastVal((prevVal) => ({
          ...prevVal,
          msg: "Please login first",
          isOpen: "true",
          bg: "Red",
        }));
      }
    }
    setBtnDisabled(false)
  };

  const deletePlaylistHandler = async (_id) => {
    const encodedToken = localStorage.getItem("token");
    try {
      setBtnDisabled(true)
      const response = await axios.delete(`${POST_PLAYLIST_API}/${_id}`, {
        headers: {
          authorization: encodedToken,
        },
      });
      const { playlists } = response.data;
      playlistDispatch({ type: "DELETE_PLAYLIST", payload: playlists });
      setToastVal((prevVal) => ({
        ...prevVal,
        msg: "Playlist Deleted",
        isOpen: "true",
        bg: "red",
      }));
    } catch (err) {
      console.log(err);
    }
    setBtnDisabled(false)
  };
  const addToPlaylistHandler = async (video, _id, title) => {
    const encodedToken = localStorage.getItem("token");
    try {
      setBtnDisabled(true)
      const response = await axios.post(
        `${POST_PLAYLIST_API}/${_id}`,
        {
          video,
        },
        {
          headers: {
            authorization: encodedToken,
          },
        }
      );
      setToastVal((prevVal) => ({
        ...prevVal,
        msg: `Added in ${title} playlist`,
        isOpen: "true",
        bg: "green",
      }));
      const { playlist } = response.data;
      playlistDispatch({
        type: "ADDED_VIDEO_TO_PLAYLIST",
        payload: playlist,
      });
    } catch (err) {
      console.log(err);
    }
    setBtnDisabled(false)
  };

  const deleteFromPlaylistHandler = async (playlistId, videoId, title) => {
    const encodedToken = localStorage.getItem("token");
    try {
      setBtnDisabled(true)
      const response = await axios.delete(
        `${POST_PLAYLIST_API}/${playlistId}/${videoId}`,
        {
          headers: {
            authorization: encodedToken,
          },
        }
      );
      setToastVal((prevVal) => ({
        ...prevVal,
        msg: `Removed from ${title} playlist`,
        isOpen: "true",
        bg: "red",
      }));
      const { playlist } = response.data;
      playlistDispatch({
        type: "REMOVE_VIDEO_FROM_PLAYLIST",
        payload: playlist,
      });
    } catch (err) {
      console.log(err);
    }
    setBtnDisabled(false)
  };

  const playlistLogoutHandler = () => {
    playlistDispatch({ type: "LOGOUT" });
  };

  const value = {
    playlistState,
    addPlaylistHandler,
    deletePlaylistHandler,
    addToPlaylistHandler,
    deleteFromPlaylistHandler,
    playlistLogoutHandler,
    getPlaylistVideos,
    isPlaylistBtnDisabled
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};

const usePlaylist = () => useContext(PlaylistContext);

export { usePlaylist, PlaylistProvider };
