export default function ModalFooter({ isSubmitting = false }) {
    return (
        <div className="modal-footer">
            <button
                type="button"
                className="btn btn-secondary tw-bg-gray-300"
                data-dismiss="modal"
            >
                Close
            </button>
            <button
                type="submit"
                className="btn btn-primary tw-bg-blue-500"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Saving..." : "Save Data"}
            </button>
        </div>
    );
}
