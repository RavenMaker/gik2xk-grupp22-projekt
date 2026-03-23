export default function CartNavbar({ cart, onRemove }) {
    const total = cart.reduce((sum, item) => sum + (item.price * item.amount), 0);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
            <div className="container">
                <div className="dropdown ms-auto">
                    <button className="btn btn-warning dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        Varukorg ({cart.reduce((sum, item) => sum + item.amount, 0)})
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow p-2" style={{ minWidth: '280px' }}>
                        {cart.length === 0 ? (
                            <li className="text-center p-2 text-muted">Tom</li>
                        ) : (
                            <>
                                {cart.map((item) => (
                                    <li key={item.key} className="d-flex justify-content-between align-items-center border-bottom py-1 small">
                                        <span>{item.name} {item.amount > 1 && `x${item.amount}`}</span>
                                        <div>
                                            <span className="me-2">{item.price * item.amount}:-</span>
                                            {onRemove && (
                                                <button className="btn btn-sm text-danger p-0" onClick={() => onRemove(item.key)}>✖</button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                                <li className="fw-bold pt-2 text-end">Totalt: {total}:-</li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
