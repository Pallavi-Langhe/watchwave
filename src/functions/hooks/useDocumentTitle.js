import { useEffect } from "react";

export const useDocumentTitle = (titleText) => {
  useEffect(() => {
    document.title = `Watchwave | ${titleText}`;
  }, [titleText]);
};
