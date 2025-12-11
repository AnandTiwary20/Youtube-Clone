 Github Link - https://github.com/AnandTiwary20/Youtube-Clone


Setup Backend - Run these in terminal
cd Backend
npm install
node server js

//        Your backend will not run unless MongoDB is installed and running locally.   
//         use this URL if mongodb connection fails     mongodb://127.0.0.1:27017/   else    mongodb://localhost:27017/
//  

Setup Frontend - Run these in terminal
cd Frontend
npm install
npm run dev

This will start both backend and frontend both must be in order 

YouTube Clone – MERN Stack (Full-Stack Capstone Project)

This project is a full-stack YouTube Clone built using the MERN stack (MongoDB, Express.js, React.js, Node.js).
It allows users to register, log in, create channels, upload videos, watch videos, like/dislike, comment, search, filter by category, and manage their own content.

This project is created as part of the Capstone Project: YouTube Clone (400 Marks).


Backend Features - (Node.js + Express + MongoDB)


Authentication APIs

POST	 http://localhost:5000/api/auth/register                        	{Register user}
POST      http://localhost:5000/api/auth/login                             	{Login & receive JWT}
GET	     http://localhost:5000/api/auth/user	                      {Get logged user details} 


 Video APIs-
 

POST	 http://localhost:5000/api/videos/upload	                                  Upload video (login required)
GET	      http://localhost:5000/api/videos	                                               Fetch all videos
GET	      http://localhost:5000/api/videos/:id	                                         Get single video
PUT  	 http://localhost:5000/api/videos/:id	                                   Update video (owner only)
DELETE	 http://localhost:5000/api/videos/:id	                                   Delete video (owner only)
PUT	     http://localhost:5000/api/videos/like/:id	                                  Like toggle
PUT	     http://localhost:5000/api/videos/dislike/:id	                            Dislike toggle
GET	  http://localhost:5000/api/videos/category/:type	                                Filter by category
GET  	http://localhost:5000/api/videos/search?q=	                                    Search by keyword


Channel APIs -



POST	    http://localhost:5000/api/channels	                                           Create or update channel
GET	       http://localhost:5000/api/channels/me	                                        Get logged-in user’s channel
GET	       http://localhost:5000/api/channels/:id	                                      Get public channel info
PUT	       http://localhost:5000/api/channels/subscribe/:id	                                 Subscribe/unsubscribe
DELETE	   http://localhost:5000/api/channels/video/:vid                              	Delete video from channel

 Comment APIs

POST	    http://localhost:5000/api/comments/:videoId
GET	        http://localhost:5000/api/comments/:videoId
PUT	          http://localhost:5000/api/comments/:id
DELETE	      http://localhost:5000/api/comments/:id


Backend files -

config - db.js contains     - MongoDB connection config
controllers - contains controller files to handle login register and comment video
middle ware - JWT verification middleware 
models -  contains schema of users , channels , comments , videos and CRUD .
routes -  Register/login routes , Channel CRUD + subscribe routes , Comment CRUD routes .

seed.js  -- seeding some videos so that if database is empty user can get some videos when the backend runs.
server.js -  API setup & DB connect 


