import { memo } from "react";
import "./User.css";

function User({ user }) {
  console.log(user);
  return (
    <div className="row user-content">
      <div className="col-2">user:</div>
      <div className="col-10">{user?.id || ""}</div>
      <div className="col-2">created:</div>
      <div className="col-10">{user?.created || ""}</div>
      <div className="col-2">karma:</div>
      <div className="col-10">{user?.karma || ""}</div>
      <div className="col-2">about:</div>
      <div className="col-10">{user?.about || ""}</div>
    </div>
  );
}

export default memo(User);
