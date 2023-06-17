
import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import "./DigitalWall.css";

const DigitalWall = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedPost, setDraggedPost] = useState(null);

  useEffect(() => {
    const savedBoards = localStorage.getItem("boards");
    if (savedBoards) {
      setBoards(JSON.parse(savedBoards));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);

  const createBoard = () => {
    const newBoard = {
      id: uuid(),
      title: "New Board",
      posts: [],
    };
    setBoards([...boards, newBoard]);
  };

  // Rest of the code...

  const updateBoardTitle = (boardId, newTitle) => {
    const updatedBoards = boards.map((board) => {
      if (board.id === boardId) {
        return { ...board, title: newTitle };
      }
      return board;
    });
    setBoards(updatedBoards);
  };

  const deleteBoard = (boardId) => {
    const updatedBoards = boards.filter((board) => board.id !== boardId);
    setBoards(updatedBoards);
    setSelectedBoard(null);
  };

  const createPost = (boardId) => {
    const newPost = {
      id: uuid(),
      title: "New Post",
      likes: 0,
      bookmarked: false,
    };
    const updatedBoards = boards.map((board) => {
      if (board.id === boardId) {
        return { ...board, posts: [...board.posts, newPost] };
      }
      return board;
    });
    setBoards(updatedBoards);
  };

  const updatePostTitle = (boardId, postId, newTitle) => {
    const updatedBoards = boards.map((board) => {
      if (board.id === boardId) {
        const updatedPosts = board.posts.map((post) => {
          if (post.id === postId) {
            return { ...post, title: newTitle };
          }
          return post;
        });
        return { ...board, posts: updatedPosts };
      }
      return board;
    });
    setBoards(updatedBoards);
  };

  const deletePost = (boardId, postId) => {
    const updatedBoards = boards.map((board) => {
      if (board.id === boardId) {
        const updatedPosts = board.posts.filter((post) => post.id !== postId);
        return { ...board, posts: updatedPosts };
      }
      return board;
    });
    setBoards(updatedBoards);
  };

  const likePost = (boardId, postId) => {
    const updatedBoards = boards.map((board) => {
      if (board.id === boardId) {
        const updatedPosts = board.posts.map((post) => {
          if (post.id === postId) {
            return { ...post, likes: post.likes + 1 };
          }
          return post;
        });
        return { ...board, posts: updatedPosts };
      }
      return board;
    });
    setBoards(updatedBoards);
  };

  const toggleBookmark = (boardId, postId) => {
    const updatedBoards = boards.map((board) => {
      if (board.id === boardId) {
        const updatedPosts = board.posts.map((post) => {
          if (post.id === postId) {
            return { ...post, bookmarked: !post.bookmarked };
          }
          return post;
        });
        return { ...board, posts: updatedPosts };
      }
      return board;
    });
    setBoards(updatedBoards);
  };


  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterBoards = (board) => {
    return board.title.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const filterPosts = (post) => {
    return post.title.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const handleDragStart = (e, post) => {
    setDraggedPost(post);
  };

  const handleDragOver = (e, boardId) => {
    e.preventDefault();
  };

  const handleDrop = (e, boardId) => {
    e.preventDefault();
    const updatedBoards = boards.map((board) => {
      if (board.id === boardId) {
        const updatedPosts = board.posts.filter(
          (post) => post.id !== draggedPost.id
        );
        return { ...board, posts: [...updatedPosts, draggedPost] };
      }
      return board;
    });
    setBoards(updatedBoards);
  };


  return (
    <div className="container">
    <h1 className="title">Digital Wall</h1>

    <button className="button" onClick={createBoard}>
      Create Board
    </button>

    <input
      type="text"
      value={searchQuery}
      onChange={handleSearchQueryChange}
      placeholder="Search boards..."
      className="search-input"
    />

    {boards.filter(filterBoards).map((board) => (
      <div key={board.id} className="board">
        <div className="board-header">
          <h2 className="board-title">{board.title}</h2>
          <input
            type="text"
            value={board.title}
            onChange={(e) => updateBoardTitle(board.id, e.target.value)}
            className="board-input"
          />
          <button
            className="board-delete-button"
            onClick={() => deleteBoard(board.id)}
          >
            Delete Board
          </button>
        </div>

        <div className="post-container">
          <div className="add-post">
            <button
              className="add-post-button"
              onClick={() => createPost(board.id)}
            >
              +
            </button>
          </div>

          {board.posts.filter(filterPosts).map((post) => (
            <div
              key={post.id}
              draggable
              onDragStart={(e) => handleDragStart(e, post)}
              onDragOver={(e) => handleDragOver(e, board.id)}
              onDrop={(e) => handleDrop(e, board.id)}
              className="post"
            >
              <input
                type="text"
                value={post.title}
                onChange={(e) =>
                  updatePostTitle(board.id, post.id, e.target.value)
                }
                className="post-input"
              />

              <div className="post-actions">
                <button
                  className="like-button"
                  onClick={() => likePost(board.id, post.id)}
                >
                  <span role="img" aria-label="Like">
                    ❤️
                  </span>{" "}
                  {post.likes}
                </button>

                <button
                  className={`bookmark-button ${
                    post.bookmarked ? "bookmarked" : ""
                  }`}
                  onClick={() => toggleBookmark(board.id, post.id)}
                >
                  <span role="img" aria-label="Bookmark">
                    {post.bookmarked ? "🔖" : "📌"}
                  </span>
                </button>

                <button
                  className="delete-button"
                  onClick={() => deletePost(board.id, post.id)}
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
  );
};

export default DigitalWall;

