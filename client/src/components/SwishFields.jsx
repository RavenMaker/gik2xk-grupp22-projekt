export default function SwishFields() {
    return (
        <div className="p-3 bg-light rounded mb-4 border shadow-sm">
            <label className="small fw-bold mb-1 text-uppercase">Swish-nummer</label>
            <input 
                className="form-control" 
                placeholder="07x-xxx xx xx" 
                type="tel" 
                required 
            />
            <small className="text-muted d-block mt-1">
                Öppna Swish-appen efter att du klickat på slutför.
            </small>
        </div>
    );
}