What is your project proposal?: I am planning to build a creative writing app (I’m creating it with 5th-8th graders in mind although anyone can use it). After creating an account, users will be able to post responses to writing prompts or post their own prompt. Users will have a profile that will aggregate all of their submissions (prompts and responses). 

MVP criteria:
Users can be created —> authentication 
Users can post prompts
Users can respond to a submitted prompt (/promps/:prompt_id)
Users can edit or delete their own responses (/prompts/:prompt_id). I am not sure if users should be able to delete their submitted prompts because they will delete other user’s responses. They will definitely be unable to edit a submitted response.
Users have a profile (/users/:user_id) where all their submissions (prompts and responses) are accessible. Users can edit or delete submitted responses from their profile as well as their entire account (I realize this will also delete their submitted prompts. I have not come up with a solution for this yet. For MVP requirements, I think that I will allow this).
HTML/CSS styling



- Users
	- can only do full crud on their stuff
- When user creates a post, it has to also create it into topic.posts
etc.etc


MODELS
- User
	- email
	- username
	- pw
	- [PostSchema]

- Posts
	- body (string)
	- time (use date / time / datetime object); 

- Topic
	- Title
	- [PostSchema]

----------------------------------------------
Working logic needs
----------------------------------------------
grabbing id from params.

/user/:id/post/:post_id

user = req.params.id
post = req.params.post_id

look inside topic and find where their post has the same post id

post
topic.posts
user.post
----------------------------------------------


- User flow
	- Wireframe
		- index for which model? 
			- Topics

	- What am i seeing if im logged in/ logged out
		- access to links/buttons or no?

-

[bonus]: timestamps

Add-on features:
Edit/update form is on the show page and does not link to a separate edit.ejs (off the top of my head, I do not know how I would do this)
“Random” link in the header, which will link to a random prompt’s show page.
Point system: (A) users receive one point per response to a writing prompt (B— super stretch) users can give points (max one point per response) to other users. Users can unlock stuff with points (profile features like background-color? Or maybe their username will display as a certain color around the site? Or maybe, in the far out future (not in the scope of this project) they can be used to unlock “items” that can do more stuff (like fight a dragon or something? I don’t know…)
User bio that displays on profile. This will be editable to the user. 
Stretch: icons/avatar— users can set an icon on their profile that will display with each of their responses around the app.

Models/Data Relationships:
— 3 models: users, prompts, and responses (I’ll show you my outline during our one-on-one)

What aspects of your approach/attitude can you enhance having experienced and learned from project 1?: I need the most feedback/advice with this! In project one, I broke down functions into small parts that I could test in isolation in a separate file… but it started to get really messy and confusing as I was adding these functions onto each other. I also was very afraid to break the whole project as I built more of it, and it made me scared to refine the code even though I had access to older versions via git and also my own backup files that I created. I think I need to be less afraid of ruining my work.

Next steps: I could also use advice on the best order to accomplish these tasks. For example, should I get the barebones of the application functional (like the maps homework) or should I add passport from the start? Would I be wasting a ton of time if I wrote the rough HTML/CSS now? Or should I be focusing on the data relationships and making sure that a response gets pushed to the associated prompt object and user object? My instinct is to create the pages, verify the routes, and get the data relationships working before I style the pages and add passport to the application.