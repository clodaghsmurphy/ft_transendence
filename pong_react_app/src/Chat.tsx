import React from 'react'
import NavBar from './NavBar'
import './Dashboard.css'
import './Chat.css'
import {useState} from 'react'
import adam from './media/adben-mc.jpg'
import pierre from './media/ple-lez.jpg'
import clodagh from './media/clmurphy.jpg'
import nathan from './media/nguiard.jpg'
import group_img from './media/group.png'

function Chat()
{
	return (		
		<div className="dashboard">
        <NavBar /> 
        <main className="page-wrapper">
            <div className="channels">
				<h1>Messages</h1>

				<input placeholder='search'
					className='search_bar'>
					{/* <button type='submit'>
						<img src="./media/search-icon.jpg"></img>
					</button> */}
				</input>

				<div className='bar'></div>

				<div className='lists'>
					<h1>Group chats</h1>

					<div className='chat-button'>
						<img src={group_img}></img>
						<div>
						{ /* mettre le dernier message du DM */ }
							<h2>Transcendence</h2>
							<div>Salut la team comment ca va?</div>
						</div>
					</div>
					<div className='chat-button'>
						<img src={group_img}></img>
						<div>
							<h2>Groupe 2</h2>
							<div>kljsadlkjsldkjaksjdasjdjk</div>
						</div>
					</div>
					<div className='chat-button'>
						<img src={group_img}></img>
						<div>
							<h2>mec pas drole</h2>
							<div>feur</div>
						</div>
					</div>
					<div className='chat-button-empty'>
					</div>
				</div>

				<div className='lists'>
					<h1>User messages</h1>

					<div className='chat-button'>
						<img src={clodagh}></img>
						<div>
							<h2>clmurphy</h2>
							{ /* mettre le dernier message du DM */ }
							<div>webserv &gt; irc</div>
						</div>
					</div>
					<div className='chat-button'>
						<img src={pierre}></img>
						<div>
							<h2>ple-lez</h2>
							<div>je speedrun le TC</div>
						</div>
					</div>
					<div className='chat-button'>
						<img src={adam}></img>
						<div>
							<h2>adben-mc</h2>
							<div>18h == matin</div>
						</div>
					</div>
					<div className='chat-button'>
						<img src={nathan}></img>
						<div>
							<h2>nguiard</h2>
							<div>jsp quoi dire</div>
						</div>
					</div>
				</div>
			</div>
            <div className="chatbox"></div>
            <div className="group-members"></div>
        </main>
        </div>
    );
}

export default Chat;