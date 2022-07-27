import React from "react";
import "./CSS/Sidebar.css";
import discordImg from "../assets/discord.svg";
import facebookImg from "../assets/face.svg";
import instaImg from "../assets/insta.svg";
import linkedinImg from "../assets/linkedin.svg";
import redditImg from "../assets/plebbit.png";
import telegramImg from "../assets/tg.png";
import twitterImg from "../assets/twitt.svg";
import youtubeImg from "../assets/youtube.png";

const Sidebar = () => {

  return (
    <div className="sidebar">
      <div className="social-sidebar-icons">
        <a href="" target="_blank" className="sidebar-icon">
          <img src={linkedinImg} /></a>
        <a href="" target="_blank" className="sidebar-icon">
          <img src={redditImg} /></a>
        <a href="" target="_blank" className="sidebar-icon">
          <img src={telegramImg}/></a>
        <a href="=" target="_blank" className="sidebar-icon">
          <img src={discordImg} /></a>
        <a href="/" target="_blank" className="sidebar-icon">
          <img src={instaImg} /></a>
        <a href="" target="_blank" className="sidebar-icon">
          <img src={facebookImg} /></a>
        <a href="" target="_blank" className="sidebar-icon">
          <img src={twitterImg} /></a>
        <a href="" target="_blank" className="sidebar-icon" >
          <img src={youtubeImg} /></a>
      </div>
    </div>
  );
};

export default Sidebar;
