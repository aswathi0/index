let currentUsername = "";

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

    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    // Display the username with the post
    const usernameElement = document.createElement('p');
    usernameElement.style.fontWeight = 'bold';
    usernameElement.textContent = currentUsername;
    postDiv.appendChild(usernameElement);

    if (postText) {
        const postTextElement = document.createElement('p');
        postTextElement.textContent = postText;
        postDiv.appendChild(postTextElement);
    }

    if (imageInput.files.length > 0) {
        const image = document.createElement('img');
        const reader = new FileReader();
        reader.onload = function (e) {
            image.src = e.target.result;
        };
        reader.readAsDataURL(imageInput.files[0]);
        postDiv.appendChild(image);
    }

    // Action buttons (Like, Comment, Share, Delete, Follow)
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('actions');

    // Like button
    const likeBtn = document.createElement('button');
    let likeCount = 0;
    likeBtn.innerHTML = `👍 Like (${likeCount})`;
    likeBtn.addEventListener('click', function () {
        likeCount++;
        likeBtn.innerHTML = `👍 Liked (${likeCount})`;
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
            const comment = document.createElement('p');
            comment.textContent = `${currentUsername}: ${commentInput.value}`;
            postDiv.appendChild(comment);
            commentInput.value = '';
        }
    });

    commentDiv.appendChild(commentInput);
    commentDiv.appendChild(commentBtn);

    // Share button
    const shareBtn = document.createElement('button');
    let shareCount = 0;
    shareBtn.innerHTML = `🔗 Share (${shareCount})`;
    shareBtn.addEventListener('click', function () {
        shareCount++;
        shareBtn.innerHTML = `🔗 Shared (${shareCount})`;
        alert("Post shared!");
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = "🗑️ Delete";
    deleteBtn.addEventListener('click', function () {
        postDiv.remove();
    });

    // Follow/Unfollow button
    const followBtn = document.createElement('button');
    followBtn.innerHTML = "👤 Follow";
    let isFollowing = false;
    const followersList = document.createElement('ul');

    followBtn.addEventListener('click', function () {
        if (isFollowing) {
            isFollowing = false;
            followBtn.innerHTML = "👤 Follow";
            removeFollower(postDiv, currentUsername);
        } else {
            isFollowing = true;
            followBtn.innerHTML = "✔️ Following";
            addFollower(postDiv, currentUsername);
        }
    });

    actionsDiv.appendChild(likeBtn);
    actionsDiv.appendChild(shareBtn);
    actionsDiv.appendChild(deleteBtn);
    actionsDiv.appendChild(followBtn);
    postDiv.appendChild(actionsDiv);
    postDiv.appendChild(commentDiv);

    // Follower list section
    const followersDiv = document.createElement('div');
    followersDiv.classList.add('followers');
    const followersLabel = document.createElement('p');
    followersLabel.textContent = "Followers:";
    followersDiv.appendChild(followersLabel);
    followersDiv.appendChild(followersList);
    postDiv.appendChild(followersDiv);

    feed.prepend(postDiv);

    // Clear the input fields after posting
    postInput.value = '';
    imageInput.value = '';
});

// Function to add followers to the post
function addFollower(postDiv, username) {
    const followersList = postDiv.querySelector('.followers ul');
    const follower = document.createElement('li');
    follower.textContent = username;
    followersList.appendChild(follower);
}

// Function to remove followers from the post
function removeFollower(postDiv, username) {
    const followersList = postDiv.querySelector('.followers ul');
    Array.from(followersList.children).forEach(function (follower) {
        if (follower.textContent === username) {
            follower.remove();
        }
    });
}
