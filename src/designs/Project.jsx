import { useParams } from "react-router-dom";
import products from "./products";

function Project() {
    const { id } = useParams();

    const product = products.find(p => p.id === Number(id));

    if (!product) {
        return <p>Չկա տվյալ 😢</p>;
    }

    return (
       <div style={{ padding: "40px" }}>
  
  <h1 style={{ fontSize: "28px", marginBottom: "20px", textAlign: "center" }}>
    {product.name}
  </h1>

  <div style={{
    display: "flex",
    gap: "40px",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap"
  }}>
    <div>
      <img 
        src={product.img} 
        alt="" 
        style={{
          width: "600px",
          height: "450px",
          objectFit: "contain",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
        }} 
      />
    </div>
    <div style={{ maxWidth: "400px", textAlign: "left" }}>
      <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.6" }}>
        {product.desc}
      </p>

      <h2 style={{ marginTop: "20px", color: "green" }}>
        {product.price}
      </h2>
        <h2 style={{
            marginTop: "20px",
            display: "block",
            marginRight: "10px"
            }}>
  {product.size}
</h2>
      <button style={{
        marginTop: "20px",
        padding: "10px 20px",
        background: "green",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
      }}>
        {product.btn || "Գնել հիմա"}
      </button>
    </div>

  </div>
</div>
    );
}

export default Project;