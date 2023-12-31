import styles from "./navbar.module.css";
import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom"
import StreamOutlinedIcon from "@mui/icons-material/StreamOutlined";
import LoginTwoToneIcon from "@mui/icons-material/LoginTwoTone";
import { useAside } from "../../context/aside-context";
import { useAuth } from "../../context/auth-context";
import { UserIcon } from "../../Assets/icons";
import { Link } from "react-router-dom";
import { useVideo } from "../../context/video-context";
import { debounce } from "../../functions/debounce";
export const Navbar = () => {
  const [searchText, setSearchText] = useState("");
  const { setActiveAside } = useAside();
  const { videoDispatch } = useVideo();
  const clickHandler = () => {
    setActiveAside((status) => !status);
  };
  const {
    authState: { authToken },
  } = useAuth();

const navigate = useNavigate()
  const changeHandler = () =>{
    videoDispatch({type:"SEARCH",payload:searchText.toLowerCase()})
  }

  const getOptimisedVersion = debounce(changeHandler,1000);

  useEffect(()=>{
    getOptimisedVersion()
  },[searchText])
  
  
  return (
    <>
      <div className="navbar">
        <h1 className={styles.nav}>
          <span className={styles.logowrapper} onClick={clickHandler}>
            <StreamOutlinedIcon fontSize="large" />
          </span>
          <span className={styles.navheading}>Watchwave</span>
        </h1>
        <div className={styles.searchBoxWrapper}>
          <input
            className={styles.searchBox}
            placeholder="SEARCH......"
            value={searchText}
            onChange={(e) =>{ 
              setSearchText(e.target.value)
            navigate("/")
            }}
          />
          <i className="fa fa-search fa-lg" aria-hidden="true"></i>
        </div>
        {authToken === "" ? (
          <Link to="/login">
            <span className={styles.loginIcon}>
              <LoginTwoToneIcon fontSize="large" />
            </span>
          </Link>
        ) : (
          <Link to="/profile">
            <span className={styles.loginIcon}>
              <UserIcon />
            </span>
          </Link>
        )}
      </div>
    </>
  );
};
