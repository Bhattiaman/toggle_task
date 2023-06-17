import React, { useState } from 'react';

const DigitalWall = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  // Create a new board
  const createBoard = () => {
    const newBoard = {
      title: newBoardTitle,
      posts: [],
    };
    setBoards([...boards, newBoard]);
    setNewBoardTitle('');
  };

  // Delete a board
  const deleteBoard = (boardIndex) => {
    const updatedBoards = [...boards];
    updatedBoards.splice(boardIndex, 1);
    setBoards(updatedBoards);
    setSelectedBoard(null);
  };

  // Create a new post on the selected board
  const createPost = () => {
    const newPost = {
      title: newPostTitle,
      content: newPostContent,
      likes: 0,
      bookmarked: false,
    };
    const updatedBoards = [...boards];
    updatedBoards[selectedBoard].posts.push(newPost);
    setBoards(updatedBoards);
    setNewPostTitle('');
    setNewPostContent('');
  };

  // Delete a post from the selected board
  const deletePost = (postIndex) => {
    const updatedBoards = [...boards];
    updatedBoards[selectedBoard].posts.splice(postIndex, 1);
    setBoards(updatedBoards);
  };

  // Update the likes count for a post
  const likePost = (postIndex) => {
    const updatedBoards = [...boards];
    updatedBoards[selectedBoard].posts[postIndex].likes += 1;
    setBoards(updatedBoards);
  };

  // Toggle bookmark status for a post
  const toggleBookmark = (postIndex) => {
    const updatedBoards = [...boards];
    updatedBoards[selectedBoard].posts[postIndex].bookmarked = !updatedBoards[selectedBoard].posts[postIndex].bookmarked;
    setBoards(updatedBoards);
  };

  // Search boards by title
  const searchBoards = (query) => {
    const filteredBoards = boards.filter((board) =>
      board.title.toLowerCase().includes(query.toLowerCase())
    );
    setBoards(filteredBoards);
  };

  // Search posts by title on the selected board
  const searchPosts = (query) => {
    const filteredPosts = boards[selectedBoard].posts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    );
    const updatedBoards = [...boards];
    updatedBoards[selectedBoard].posts = filteredPosts;
    setBoards(updatedBoards);
  };

  // Rearrange posts by drag and drop inside the board
  const rearrangePosts = (newPosts) => {
    const updatedBoards = [...boards];
    updatedBoards[selectedBoard].posts = newPosts;
    setBoards(updatedBoards);
  };

  return (
    <div>
      {/* Wall */}
      <div>
        {/* Create new board */}
        <input
          type="text"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          placeholder="Enter board title"
        />
        <button onClick={createBoard}>Create Board</button>
      </div>

      {/* List of boards */}
      <ul>
        {boards.map((board, index) => (
          <li key={index}>
            <h3>{board.title}</h3>
            {/* Delete board */}
            <button onClick={() => deleteBoard(index)}>Delete Board</button>
            {/* Select board */}
            <button onClick={() => setSelectedBoard(index)}>Open Board</button>
          </li>
        ))}
      </ul>

      {/* Selected board */}
      {selectedBoard !== null && (
        <div>
          <h2>{boards[selectedBoard].title}</h2>

          {/* Create new post */}
          <input
            type="text"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            placeholder="Enter post title"
          />
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Enter post content"
          ></textarea>
          <button onClick={createPost}>Create Post</button>

          {/* List of posts */}
          <ul>
            {boards[selectedBoard].posts.map((post, index) => (
              <li key={index}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                {/* Delete post */}
                <button onClick={() => deletePost(index)}>Delete Post</button>
                {/* Like post */}
                <button onClick={() => likePost(index)}>Like</button>
                <span>{post.likes} likes</span>
                {/* Bookmark post */}
                <button onClick={() => toggleBookmark(index)}>
                  {post.bookmarked ? 'Unbookmark' : 'Bookmark'}
                </button>
              </li>
            ))}
          </ul>

          {/* Search posts */}
          <input
            type="text"
            onChange={(e) => searchPosts(e.target.value)}
            placeholder="Search posts by title"
          />

          {/* Rearrange posts */}
          <ul>
            {boards[selectedBoard].posts.map((post, index) => (
              <li
                key={index}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const sourceIndex = e.dataTransfer.getData('text/plain');
                  const targetIndex = index;
                  const newPosts = [...boards[selectedBoard].posts];
                  const [removed] = newPosts.splice(sourceIndex, 1);
                  newPosts.splice(targetIndex, 0, removed);
                  rearrangePosts(newPosts);
                }}
              >
                <h3>{post.title}</h3>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Search boards */}
      <input
        type="text"
        onChange={(e) => searchBoards(e.target.value)}
        placeholder="Search boards by title"
      />
    </div>
  );
};

export default DigitalWall;
