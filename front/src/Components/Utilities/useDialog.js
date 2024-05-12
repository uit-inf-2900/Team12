// src/hooks/useDialog.js
import { useState } from 'react';

/**
 * Hook for managing a dialog state.
 */
const useDialog = (initialOpen = false) => {
    const [isOpen, setOpen] = useState(initialOpen);
    const openDialog = () => setOpen(true);
    const closeDialog = () => setOpen(false);

    return { isOpen, openDialog, closeDialog };
};

export default useDialog;
