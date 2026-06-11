import React from 'react';

/**
 * SDG Badges — Displays UN Sustainable Development Goal badges.
 * Official SDG colors sourced from the UN SDG brand guidelines.
 * https://www.un.org/sustainabledevelopment/news/communications-material/
 */

interface SDGItem {
  number: number;
  name: string;
  color: string;
}

// Official UN SDG colors — verified from UN communications materials
const sdgItems: SDGItem[] = [
  { number: 13, name: 'Climate Action', color: '#3F7E44' },
  { number: 11, name: 'Sustainable Cities and Communities', color: '#FD9D24' },
  { number: 12, name: 'Responsible Consumption and Production', color: '#BF8B2E' },
  { number: 3, name: 'Good Health and Well-being', color: '#4C9F38' },
  { number: 15, name: 'Life on Land', color: '#56C02B' },
];

const SDGBadges: React.FC = () => {
  return (
    <div className="sdg-strip">
      <span className="sdg-label">This app supports:</span>
      <div className="sdg-badges">
        {sdgItems.map((sdg) => (
          <div
            key={sdg.number}
            className="sdg-badge"
            style={{ 
              backgroundColor: sdg.color,
              borderColor: `${sdg.color}66` // 66 is 40% opacity in hex
            }}
            title={`SDG ${sdg.number}: ${sdg.name}`}
            role="img"
            aria-label={`SDG ${sdg.number}: ${sdg.name}`}
          >
            {sdg.number}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SDGBadges;
