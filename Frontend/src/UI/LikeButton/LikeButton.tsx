import Like from '@mui/icons-material/Favorite';
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { authStore } from '../../Redux/AuthState';
import notifyService from '../../Services/NotifyService';

// connecting to the socket.io port:
const socket = io('http://localhost:4001');

function LikeButton(props: any): JSX.Element {

  // check if admin:
  const role = authStore.getState().user?.roleId;
  const admin = role === 1 ? true : false;

  const [likeActive, setLikeActive] = useState<boolean>(false);
  const btnClasses = `likeBtn ${likeActive && 'like'}`;
  setTimeout(() => {
    setLikeActive(false);
  }, 300);

  const [clicked, setClicked] = useState<boolean>(props.vacations.isFollowing ? true : false);

  async function handleLike() {
    setLikeActive(true);
    try {
      const userId = authStore.getState().user?.userId;
      const vacationId = props.vacations.vacationId;

      if (!clicked) {
        socket.emit("addLike", { userId, vacationId })
        setClicked(true)
      } else {
        socket.emit("removeLike", { userId, vacationId })
        setClicked(false)
      }

    } catch (err: any) {
      notifyService.error(err.message);
      console.error(err.message);
    }
  }

  const [followersCount, setFollowersCount] = useState<number>(props.vacations.followersCount);

  useEffect(() => {
    socket.on("updateFollowersCount", (data: { vacationId: number, followersCount: number }) => {
      if (data.vacationId === props.vacations.vacationId) {
        setFollowersCount(data.followersCount);
      }
    });
  }, [clicked]);

  return (
    <div className="LikeButton">
      <div className={btnClasses} onClick={() => handleLike()} style={{ display: admin ? "none" : "", color: clicked ? "red" : "lightblue" }}><Like /> <div>{followersCount}</div></div>
    </div >
  );
}

export default LikeButton;