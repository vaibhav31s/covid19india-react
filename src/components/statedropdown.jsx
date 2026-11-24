import {STATE_NAMES} from '../constants';

import React, {useState, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTransition, animated} from 'react-spring';
import {useClickAway} from 'react-use';

const StateDropdown = ({stateCode}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useClickAway(dropdownRef, () => {
    setShowDropdown(false);
  });

  const transitions = useTransition(showDropdown, {
    from: {
      opacity: 0,
      transform: 'translate3d(0, 2px, 0)',
      zIndex: 999,
    },
    enter: {
      opacity: 1,
      transform: 'translate3d(0, 0px, 0)',
      zIndex: 999,
    },
    leave: {
      opacity: 0,
      transform: 'translate3d(0, 2px, 0)',
      zIndex: 999,
    },
    config: {
      mass: 1,
      tension: 210,
      friction: 20,
    },
  });

  return (
    <div className="StateDropdown">
      <h1
        className="state-name"
        onClick={() => {
          setShowDropdown((prevData) => !prevData);
        }}
      >
        {STATE_NAMES[stateCode]}
      </h1>

      {transitions((style, item) =>
        item ? (
          <animated.div className="dropdown" style={style} ref={dropdownRef}>
            {Object.keys(STATE_NAMES)
              .filter((stateCode) => stateCode !== 'UN' && stateCode !== 'TT')
              .map((stateCode) => (
                <h1
                  key={stateCode}
                  className="item"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate(`/state/${stateCode}`);
                  }}
                >
                  {STATE_NAMES[stateCode]}
                </h1>
              ))}
          </animated.div>
        ) : (
          <animated.div style={style}></animated.div>
        )
      )}

      {showDropdown && <div className="backdrop"></div>}
    </div>
  );
};

export default StateDropdown;
