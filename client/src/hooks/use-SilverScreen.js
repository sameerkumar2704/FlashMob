import { useNavigate } from "react-router-dom";
import { useLoader } from "../context/LoaderContext";

export const useSilverScreen = () => {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();

  const navigateWithLoader = path => {
    showLoader();
    setTimeout(() => {
      navigate(path);
      hideLoader();
    }, 1000);
  };

  return navigateWithLoader;
};
