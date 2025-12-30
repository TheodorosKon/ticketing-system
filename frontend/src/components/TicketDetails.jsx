import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTicketById } from '../services/api';

function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);

  const [newComment, setNewComment] = useState('');

    const submitComment = async () => {
    await fetch(`http://localhost:3000/tickets/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        body: newComment,
        user_id: 1 // temp demo user
        })
    });

    setNewComment('');
    const refreshed = await fetch(`http://localhost:3000/tickets/${id}/comments`);
    setComments(await refreshed.json());
    };

  useEffect(() => {
    getTicketById(id).then(setTicket);
    fetch(`http://localhost:3000/tickets/${id}/comments`)
      .then(res => res.json())
      .then(setComments);
  }, [id]);

  if (!ticket) return <p>Loading...</p>;

  return (
    <>
        <h2>{ticket.title}</h2>
        <p>{ticket.description}</p>

        <hr />
        <h3>Comments</h3>

        {comments.map(c => (
        <div key={c.comment_id}>
            <small>{c.created_at}</small>
            <p>{c.body}</p>
        </div>
        ))}
        <textarea
        value={newComment}
        onChange={e => setNewComment(e.target.value)}
        placeholder="Add a comment..."
        />
        <br />
        <button onClick={submitComment}>Post Comment</button>
    </>
  );
}

export default TicketDetails;
