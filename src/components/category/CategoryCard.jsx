import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

function CategoryCard({ CategoryCardinfo }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel);
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex overflow-x-auto space-x-4 p-4 scrollbar-hide scroll-smooth"
    >
      {CategoryCardinfo.map((data, index) => {
        if (index === 0) return null;

        return (
          <Link
            key={index}
            to={`category/${data.url_key}`}
            className="category-card bg-gray-100 rounded-lg p-4 text-center hover:shadow-md transition flex-shrink-0 w-40"
          >
            <div
              className={`${data.bgColor} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3`}
            >
              <i className="fas fa-shop text-xl"></i>
            </div>
            <h3 className="font-medium">{data.name}</h3>
          </Link>
        );
      })}
    </div>
  );
}

export default React.memo(CategoryCard);
