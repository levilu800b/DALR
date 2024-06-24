import React, { useEffect, useState } from "react";
import "../../assets/css/general.css";
import Massage from "../massages/Massage.js";
import { Card, Input } from "antd";
import "./ListUsers.css";

const { Meta } = Card;

function importAllImages(requiredImages) {
  const images = {};
  requiredImages.keys().map((item) => {
    images[item.replace("./", "")] = requiredImages(item);
  });
  return images;
}

const allImages = importAllImages(
  require.context(
    "../../../../server/public/images",
    false,
    /\.(png|jpe?g|svg)$/
  )
);

function UserList() {
  const [data, setData] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchInterest, setSearchInterest] = useState("");

  const getProfile = async () => {
    try {
      const res = await fetch("api/dashboard/all/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseData = await res.json();
      setData(parseData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleCardClick = (user) => {
    setShowWelcome(true);
    setSelectedUser(user);
  };

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleSearchInterestChange = (e) => {
    setSearchInterest(e.target.value);
  };

  return (
    <div className="list_user_con">
      {showWelcome ? (
        <Massage data={data} selectedUser={selectedUser} />
      ) : (
        <>
          <div style={{ display: 'flex', marginBottom: '1em' }}>
            <Input
              placeholder="Search by name"
              value={searchName}
              onChange={handleSearchNameChange}
              style={{ width: 400, marginRight: '1cm' }}
            />
            <Input
              placeholder="Search by interested language"
              value={searchInterest}
              onChange={handleSearchInterestChange}
              style={{ width: 400 }}
            />
          </div>
          {Array.isArray(data) && data.length > 0 ? (
            data
              .filter((user) =>
                user.user_firstname
                  .toLowerCase()
                  .includes(searchName.toLowerCase())
              )
              .filter((user) =>
                user.user_language_interest
                  .toLowerCase()
                  .includes(searchInterest.toLowerCase())
              )
              .map((user) => (
                <Card
                  key={user.user_id}
                  hoverable 
                  className="card_st"
                  style={{
                    // width: 200,
                    // height: 200,
                    display: "inline-block",
                    margin: "3em",
                  }}
                  onClick={() => handleCardClick(user)}
                >
                  <img
                      alt={`${user.user_firstname} `}
                      src={allImages["faceImoje.png"]?.default}
                    />
                  <Meta
                    Link
                    to={"/profile"}
                    title={`${user.user_firstname} `}
                    description={`Languages spoken: ${user.user_language_speak}`}
                  />
                  <Meta
                    description={`Languages interested: ${user.user_language_interest}`}
                  />
                </Card>
              ))
          ) : (
            <div>No users found</div>
          )}
        </>
      )}
    </div>
  );
}


export default UserList;
