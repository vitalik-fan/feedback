import Link from "next/link";
import React, { useEffect } from "react";
import { PropsWithChildren } from "react";
import logo from "./../assets/logo.svg";
import { motion } from "framer-motion";
import { FadeInMotionOpacity, FadeInMotion } from "./../motions/FadeMotion";
import BackSvg from "./../components/svg/BackSvg";
import useTypedSelector from "../hooks/useTypedSelector";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setLoading } from "./../redux/slices/AppSlice";
import Loader from "./../components/Lk/Loader";
import { clearUser, setUser } from "./../redux/slices/UserSlice";
import axios from "axios";
import { back_url } from "../vars";
import { AnimatePresence } from "framer-motion";

interface HeaderI {
  children?: React.ReactNode;
  isAnonim?: boolean;
}

const Header: React.FC<PropsWithChildren<HeaderI>> = ({
  children,
  isAnonim = false
}) => {
  const router = useRouter();
  const isAuth = useTypedSelector((state) => state.user.isAuth);
  const isLoading = useTypedSelector((state) => state.app.isLoading);
  const isFetch = useTypedSelector((state) => state.app.isFetch);
  const dispatch = useDispatch();

  useEffect(() => {
    async function entering() {
      try {
        dispatch(setLoading(true));
        const token = localStorage.getItem("token");
        if (isAuth == false && !token && router.asPath == "/lk") {
          router.push("/");
        }
        if (token) {
          const { data } = await axios.get(`${back_url}/auth/check`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!data.isAuth) {
            dispatch(clearUser(null));
            router.push("/");
          } else {
            dispatch(setUser(token));
          }
          setTimeout(() => {
            dispatch(setLoading(false));
          }, 400);
        }
      } catch (e) {
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 400);
        console.log(e);
      }
    }
    entering();
  }, [isAuth]);

  useEffect(() => {
    if (isFetch) {
      dispatch(setLoading(true));
    } else {
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 400);
    }
  }, [isFetch]);

  const clickExitHandler = () => {
    dispatch(clearUser(null));
    router.push("/");
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <AnimatePresence>
      {!isLoading && (
        <>
          {isAuth ? (
            <motion.header
              variants={FadeInMotionOpacity(0)}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="Header"
            >
              <Link href="/lk">
                <div className="data">
                  <img src={logo.src} alt="logo" />
                </div>
              </Link>
              <div className="ExitWrapper">
                <div onClick={clickExitHandler}>
                  <BackSvg />
                  <span>Exit</span>
                </div>
              </div>
            </motion.header>
          ) : null}
          <motion.div
            variants={FadeInMotion(1)}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Header;
