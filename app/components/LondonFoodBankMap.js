import React, { useState } from 'react';

const foodBankData = {
  'Camden': [
    { name: 'Camden Food Bank', address: '123 Camden High St', phone: '020 1234 5678' },
    { name: 'North London Food Bank', address: '45 Camden Road', phone: '020 8765 4321' }
  ],
  'Hackney': [
    { name: 'Hackney Food Bank', address: '789 Mare Street', phone: '020 2468 1357' }
  ],
  'Tower Hamlets': [
    { name: 'First Love Foundation', address: '8 Copperfield Road, E3 4RL', phone: '020 3069 9877' },
    { name: 'Bow Food Bank', address: '230 Grove Road, E3 5TG', phone: '020 8983 7274' },
    { name: 'Bethnal Green Food Bank', address: '27 Old Ford Road, E2 9PJ', phone: '020 7739 7287' }
  ],
  'Greenwich': [
    { name: 'Greenwich Food Bank', address: '78-79 Trafalgar Road, SE10 9TS', phone: '020 8853 7434' },
    { name: 'Woolwich Common Community Centre', address: '16 Leslie Smith Square, SE18 4DW', phone: '020 8854 5993' }
  ],
  'Lewisham': [
    { name: 'Lewisham Food Bank', address: '131 Deptford High Street, SE8 4NS', phone: '020 8692 5592' },
    { name: 'Hope Centre Lewisham', address: '118 Bromley Road, SE6 2UR', phone: '020 7635 0500' },
    { name: 'We Care Food Bank', address: '322 Brownhill Road, SE6 1AU', phone: '020 8698 9403' }
  ]
};

const LondonFoodBankMap = () => {
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });

  const handleBoroughClick = (e, borough) => {
    const foodBanks = foodBankData[borough] || [];
    const content =
      foodBanks.length > 0
        ? foodBanks
            .map(
              (fb) =>
                `${fb.name}\nAddress: ${fb.address}\nPhone: ${fb.phone}`
            )
            .join('\n\n')
        : 'No food banks listed in this borough';

    setTooltip({
      visible: true,
      content,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMapClick = (e) => {
    
    if (e.target.nodeName !== 'path') {
      setTooltip({ visible: false, content: '', x: 0, y: 0 });
    }
  };

  return (
    <div className="relative mx-auto max-w-4xl">
      <svg
        viewBox="0 0 800 600"
        className="w-full h-auto"
        onClick={handleMapClick}
      >
        {/* Example SVG path for Camden borough. Replace this with actual SVG paths for all boroughs */}
        <path
          d="M200 200 L250 200 L250 250 L200 250 Z"
          fill="#f4f4f4"
          stroke="#fff"
          strokeWidth="1"
          className="transition duration-300 hover:fill-gray-300 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleBoroughClick(e, 'Camden');
          }}
        />
        {/* Repeat similar <path> elements for other boroughs */}
      </svg>
      {tooltip.visible && (
        <div
          className="absolute bg-white p-2 rounded shadow-lg text-sm whitespace-pre"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default LondonFoodBankMap;