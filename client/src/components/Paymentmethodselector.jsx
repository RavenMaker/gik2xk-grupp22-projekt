const methods = [
    {
        id: 'card',
        label: 'Kort',
        img: 'https://media.istockphoto.com/id/1248729906/sv/vektor/kredit-betalkort-betalning-svart-ikon.jpg?s=612x612&w=0&k=20&c=LmZ6H1U9vetvLcw9j2uvdCZZITqYfCN5PjZoijqf3d0='
    },
    {
        id: 'swish',
        label: 'Swish',
        img: 'https://play-lh.googleusercontent.com/NiU9oukn_XtdpjyODVezYIxeZ3Obs04bH9VZa0MAhZN4s9x5mG9O1lO_ZF37CDKck_8K'
    },
    {
        id: 'cash',
        label: 'Kontant',
        img: 'https://media.istockphoto.com/id/1284882634/sv/vektor/ge-pengar-disposition-ikon-betalning-med-pengar-hand-som-h%C3%A5ller-l%C3%B6necheck-ikon.jpg?s=612x612&w=0&k=20&c=oR7HTuZohoV7An0t1_KKHWx8dFGuA3wrep0LH-G52UY='
    }
];
 
export default function PaymentMethodSelector({ selected, onSelect }) {
    return (
        <div className="payment-selector">
            <h4 className="mb-3">2. Betalningsmetod</h4>
            <div className="d-flex gap-2 mb-4">
                {methods.map(method => (
                    <button
                        key={method.id}
                        type="button"
                        // Lade till 'bg-white' som default så de inte blir genomskinliga
                        className={`p-3 border rounded text-center flex-fill ${
                            selected === method.id ? 'border-primary bg-light shadow-sm' : 'bg-white'
                        }`}
                        style={{ 
                            cursor: 'pointer', 
                            transition: 'all 0.2s ease',
                            outline: 'none' // Tar bort ful default-ram vid klick
                        }}
                        onClick={() => onSelect(method.id)}
                    >
                        <img 
                            src={method.img} 
                            alt={method.label} 
                            height="40" 
                            className="mb-2" 
                            style={{ objectFit: 'contain' }} 
                        />
                        <div className="small fw-bold d-block">{method.label}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}