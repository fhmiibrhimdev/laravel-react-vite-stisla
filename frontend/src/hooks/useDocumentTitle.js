import { useEffect } from "react";

/**
 * Sets the document title.
 *
 * @param {string} title - Page title
 */
export function useDocumentTitle(title) {
    useEffect(() => {
        document.title = title;
    }, [title]);
}
