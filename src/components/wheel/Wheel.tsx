import React, { FC, useState, CSSProperties, useEffect } from 'react';
import randomColor from 'randomcolor';
import ITwitterUser from '../../interfaces/ITwitterUser';
import './styles.css';

interface IProps {
  twitterUsers: ITwitterUser[];
  onSelectUser: (index: number) => void;
  hide?: boolean;
}

let colors: string[];

const Wheel: FC<IProps> = (props) => {
  const [spinning, setSpinning] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number>();
  const [visibleWheel, setVisibleWheel] = useState(0);

  useEffect(() => {
    if (selectedUser) {
      const i = setInterval(() => {
        const newVisibleWheel = Math.floor(Math.random() * chunks.length);
        setVisibleWheel(newVisibleWheel);
      }, 1500);

      setTimeout(() => {
        clearInterval(i);
        const lastChunk = Math.floor(selectedUser / 10);
        setVisibleWheel(lastChunk);
      }, 18000);
    }
  }, [selectedUser]);

  const chunkArray = (arr: ITwitterUser[], n: number): ITwitterUser[][] =>
    arr.length ? [arr.slice(0, n), ...chunkArray(arr.slice(n), n)] : [];

  const chunks = chunkArray(props.twitterUsers, 10);

  if (!colors) {
    colors = randomColor({ luminosity: 'dark', count: chunks.length });
  }

  const selectUser = () => {
    if (selectedUser) {
      return;
    }

    const newSelectedUser = Math.floor(Math.random() * props.twitterUsers.length);
    props.onSelectUser(newSelectedUser);
    setSelectedUser(newSelectedUser);
    setSpinning(true);
  };

  const wheelVars = {
    '--nb-item': 10,
    '--selected-item': selectedUser,
  } as CSSProperties;

  const renderWheels = () => {
    return chunks.map((chunk, i) => (
      <div
        key={i}
        className='wheel-container'
        style={{
          opacity: !props.hide && i === visibleWheel ? 1 : 0,
          border: `3px solid ${colors[i]}`,
        }}
      >
        <div
          className={`wheel ${spinning ? 'spinning' : ''}`}
          style={{ ...wheelVars, backgroundColor: colors[i], border: `5px solid ${colors[i]}` }}
        >
          {chunk.map((item, index) => (
            <div className='wheel-item' key={index} style={{ '--item-nb': index } as CSSProperties}>
              <div className='wheel-item-container'>
                <div className='wheel-item-text'>
                  <div>
                    <b>{item.username}</b>
                  </div>
                  <div>@{item.handle}</div>
                </div>
                <div
                  className='wheel-item-image'
                  style={{ backgroundImage: `url(${item.profileImage})` }}
                ></div>
              </div>
            </div>
          ))}
          <div
            className='wheel-middle'
            style={{ border: `10px solid ${colors[i]}` }}
            onClick={selectUser}
          />
        </div>
      </div>
    ));
  };

  return <>{renderWheels()}</>;
};

export default Wheel;
