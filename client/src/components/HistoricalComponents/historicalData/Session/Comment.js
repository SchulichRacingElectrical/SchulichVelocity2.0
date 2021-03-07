import React from 'react';
import classes from './styles/comment.module.css';

export default function Comment({ content, commenter, date }) {
  return (
    <div className={classes.container}>
      <div className={classes.commenter}>{commenter}</div>
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
      <div className={classes.bottomContainer}>
        <div className={classes.date}>{date}</div>
        <div className={classes.delete}>DELETE</div>
      </div>
    </div>
  );
}
