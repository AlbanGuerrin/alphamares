import React from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
export default function ConfirmDialog({ message, child, open, yesFunction, onClose }) {

    return (
        <Dialog onClose={onClose} open={open} className="confirm-dialog">
            <p className="message">Êtes-vous sûr de vouloir</p>
            <p className="message">{message} ?</p>
            <>
                {child}
            </>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={yesFunction}>Oui</button>
                <button onClick={onClose}>Non</button>
            </DialogActions>
        </Dialog>
    );
}