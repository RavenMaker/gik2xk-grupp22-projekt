export default function CardFields() {
    return (
        <div className="p-3 bg-light rounded mb-4 border">
            <input className="form-control mb-2" placeholder="Kortnummer" required />
            <div className="d-flex gap-2">
                <input className="form-control" placeholder="MM/ÅÅ" required />
                <input className="form-control" placeholder="CVC" required />
            </div>
        </div>
    );
}