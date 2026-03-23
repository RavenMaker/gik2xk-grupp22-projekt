export default function PriceModal({ activeProduct, onAdd, onClose }) {
    if (!activeProduct) return null;

    return (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Välj storlek: {activeProduct.name}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="d-grid gap-2">
                            {activeProduct.prices.p1 > 0 && (
                                <button className="btn btn-outline-dark" onClick={() => onAdd(activeProduct.name, "Avh.", activeProduct.prices.p1)}>
                                    Avhämtning ({activeProduct.prices.p1}:-)
                                </button>
                            )}
                            {activeProduct.prices.p2 > 0 && (
                                <button className="btn btn-outline-dark" onClick={() => onAdd(activeProduct.name, "Serv.", activeProduct.prices.p2)}>
                                    Servering ({activeProduct.prices.p2}:-)
                                </button>
                            )}
                            {activeProduct.prices.p3 > 0 && (
                                <button className="btn btn-outline-dark" onClick={() => onAdd(activeProduct.name, "Familj", activeProduct.prices.p3)}>
                                    Familjepizza ({activeProduct.prices.p3}:-)
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
