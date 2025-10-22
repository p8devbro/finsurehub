import React, { useEffect, useState } from "react";

export default function StockSlider() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetch("https://finnhub.io/api/v1/stock/symbol?exchange=US&token=YOUR_API_KEY")
      .then((res) => res.json())
      .then((data) => {
        setStocks(data.slice(0, 10)); // Top 10
      });
  }, []);

  return (
    <div className="stock-ticker">
      {stocks.map((s) => (
        <span key={s.symbol}>
          {s.symbol} {s.description}
        </span>
      ))}
    </div>
  );
}
