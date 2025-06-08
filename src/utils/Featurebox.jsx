import React from "react";

function Featurebox({features}) {    
  return (
    <>
    {features.map((feature,index) => (        

        <div className="flex items-center p-4 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition">
        <div className="bg-indigo-100 rounded-full p-3 mr-4">
          <i className={`${feature.icon} ${feature.iconColor} text-xl`}></i>
        </div>
        <div>
          <h3 className="font-medium">{feature.title}</h3>
          <p className="text-sm text-gray-500">{feature.description}</p>
        </div>
      </div>

    ))}
      
    </>
  );
}

export default Featurebox;
