let currentUsername = "";
const userPosts = JSON.parse(localStorage.getItem('userPosts')) || {};
const userFollowers = JSON.parse(localStorage.getItem('userFollowers')) || {};

document.getElementById('loginBtn').addEventListener('click', function () {
    const usernameInput = document.getElementById('username');
    currentUsername = usernameInput.value.trim();

    if (currentUsername === "") {
        alert("Please enter a valid username.");
        return;
    }

    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('postSection').style.display = 'block';
    usernameInput.value = '';

    loadPosts();
    loadFollowers();
});

document.getElementById('postBtn').addEventListener('click', function () {
    const postInput = document.getElementById('postInput');
    const postText = postInput.value;
    const imageInput = document.getElementById('imageInput');
    const feed = document.getElementById('feed');

    if (postText.trim() === "" && imageInput.files.length === 0) {
        alert("Please enter text or upload an image.");
        return;
    }

    const post = {
        username: currentUsername,
        text: postText,
        image: imageInput.files.length > 0 ? URL.createObjectURL(imageInput.files[0]) : null,
        comments: [],
        likeCount: 0,
        shareCount: 0,
        timestamp: new Date().toLocaleString(),
    };

    if (!userPosts[currentUsername]) {
        userPosts[currentUsername] = [];
    }
    userPosts[currentUsername].push(post);
    
    localStorage.setItem('userPosts', JSON.stringify(userPosts));

    displayPost(post, feed);
    postInput.value = '';
    imageInput.value = '';
});

// Load posts
function loadPosts() {
    const feed = document.getElementById('feed');
    feed.innerHTML = '';

    for (const user in userPosts) {
        userPosts[user].forEach(post => {
            displayPost(post, feed);
        });
    }
}

// Load followers
function loadFollowers() {
    const followersList = document.getElementById('followersList');
    followersList.innerHTML = '';

    const followers = userFollowers[currentUsername] || [];
    followers.forEach(follower => {
        const followerItem = document.createElement('li');
        followerItem.textContent = follower;
        followersList.appendChild(followerItem);
    });
}

// Function to display a post
function displayPost(post, feed) {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    const usernameElement = document.createElement('p');
    usernameElement.style.fontWeight = 'bold';
    usernameElement.textContent = post.username;
    postDiv.appendChild(usernameElement);

    const timestampElement = document.createElement('p');
    timestampElement.style.fontStyle = 'italic';
    timestampElement.textContent = `Posted on ${post.timestamp}`;
    postDiv.appendChild(timestampElement);

    if (post.text) {
        const postTextElement = document.createElement('p');
        postTextElement.textContent = post.text;
        postDiv.appendChild(postTextElement);
    }

    if (post.image) {
        const image = document.createElement('img');
        image.src = post.image;
        postDiv.appendChild(image);
    }

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('actions');

    // Like button
    const likeBtn = document.createElement('button');
    likeBtn.innerHTML = `👍 Like (${post.likeCount})`;
    likeBtn.addEventListener('click', function () {
        post.likeCount++;
        likeBtn.innerHTML = `👍 Liked (${post.likeCount})`;
        updateLocalStorage();
    });

    // Comment section
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment-box');
    const commentInput = document.createElement('input');
    commentInput.placeholder = "Add a comment";
    const commentBtn = document.createElement('button');
    commentBtn.textContent = "Comment";

    commentBtn.addEventListener('click', function () {
        if (commentInput.value.trim()) {
            const commentText = `${currentUsername}: ${commentInput.value}`;
            post.comments.push(commentText);
            const comment = document.createElement('p');
            comment.textContent = commentText;
            postDiv.appendChild(comment);
            commentInput.value = '';
            updateCommentCount(post, postDiv);
            updateLocalStorage();
        }
    });

    commentDiv.appendChild(commentInput);
    commentDiv.appendChild(commentBtn);

    // Function to update comment count
    function updateCommentCount(post, postDiv) {
        const commentCountElement = postDiv.querySelector('.comment-count');
        if (commentCountElement) {
            commentCountElement.textContent = `Comments: ${post.comments.length}`;
        } else {
            const newCommentCountElement = document.createElement('p');
            newCommentCountElement.classList.add('comment-count');
            newCommentCountElement.textContent = `Comments: ${post.comments.length}`;
            postDiv.appendChild(newCommentCountElement);
        }
    }

    // Share button
    const shareBtn = document.createElement('button');
    shareBtn.innerHTML = `🔗 Share (${post.shareCount})`;
    shareBtn.addEventListener('click', function () {
        post.shareCount++;
        shareBtn.innerHTML = `🔗 Shared (${post.shareCount})`;
        alert("Post shared!");
        updateLocalStorage();
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = "🗑️ Delete";
    deleteBtn.addEventListener('click', function () {
        postDiv.remove();
        removePostFromStorage(post);
    });

    // Follow/Unfollow button
    const followBtn = document.createElement('button');
    followBtn.innerHTML = "👤 Follow";
    let isFollowing = false;

    followBtn.addEventListener('click', function () {
        if (isFollowing) {
            unfollowUser(currentUsername, post.username);
            followBtn.innerHTML = "👤 Follow";
        } else {
            followUser(currentUsername, post.username);
            followBtn.innerHTML = "✔️ Following";
        }
        isFollowing = !isFollowing;
    });

    actionsDiv.appendChild(likeBtn);
    actionsDiv.appendChild(shareBtn);
    actionsDiv.appendChild(deleteBtn);
    actionsDiv.appendChild(followBtn);
    postDiv.appendChild(actionsDiv);
    postDiv.appendChild(commentDiv);
    feed.prepend(postDiv);
}

// Function to follow a user
function followUser(follower, followee) {
    if (!userFollowers[follower]) {
        userFollowers[follower] = [];
    }
    if (!userFollowers[follower].includes(followee)) {
        userFollowers[follower].push(followee);
        localStorage.setItem('userFollowers', JSON.stringify(userFollowers));
        loadFollowers();
    }
}

// Function to unfollow a user
function unfollowUser(follower, followee) {
    if (userFollowers[follower]) {
        userFollowers[follower] = userFollowers[follower].filter(user => user !== followee);
        localStorage.setItem('userFollowers', JSON.stringify(userFollowers));
        loadFollowers();
    }
}

// Update localStorage after any change
function updateLocalStorage() {
    localStorage.setItem('userPosts', JSON.stringify(userPosts));
}

// Remove post from localStorage
function removePostFromStorage(post) {
    const posts = userPosts[post.username];
    const index = posts.indexOf(post);
    if (index > -1) {
        posts.splice(index, 1);
        if (posts.length === 0) {
            delete userPosts[post.username];
        }
        updateLocalStorage();
    }
}