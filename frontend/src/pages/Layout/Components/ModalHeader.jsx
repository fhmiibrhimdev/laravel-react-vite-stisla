import React, { Component } from "react";

export default function ModalHeader({ isEditing }) {
    return (
        <div className="modal-header">
            <h5 className="modal-title" id="formDataModalLabel">
                {isEditing ? "Edit Data" : "Add Data"}
            </h5>
            <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
            >
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    );
}
